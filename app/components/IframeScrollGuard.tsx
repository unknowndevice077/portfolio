"use client";

import { useEffect, useRef } from "react";

/**
 * Reverts any page scroll that isn't attributable to real user input.
 *
 * Backstory: clicking into a demo iframe was observed to sometimes trigger a
 * large (~600-800px), unrequested scroll of the OUTER page, seconds after
 * the click, with zero wheel/touch/keydown event ever reaching the parent
 * document in between. Live instrumentation ruled out several suspects —
 * this page's own code (no scrollIntoView/scrollTo calls anywhere), the
 * embedded app's own code (no window.top/parent/postMessage reaching across
 * the frame boundary), scroll-snap (removed from every iframe-bearing
 * section already), and overscroll-behavior (set on both the iframe and its
 * wrapper, still didn't stop it). What the trace DID show: document.
 * activeElement genuinely becomes the <iframe> on click, confirming focus
 * really moves there — but the corresponding focusin/focusout *events*
 * never fire in this environment even though the state change is real, so
 * an earlier fix built on those events silently never activated. The jump's
 * own deceleration curve (fast, then easing out over ~300-400ms) matches a
 * single native smooth-scroll call, not chained wheel input — almost
 * certainly the browser's own "keep the focused/active nested frame's
 * content visible" behavior, triggered by something inside the iframe
 * (invisible to this document — cross-origin) well after the initial click.
 *
 * Rather than chase that exact internal trigger further, this guards the
 * one property that has held in every test so far: a real, user-caused
 * scroll always has a wheel/touch/key/mousedown event on THIS document
 * within the same moment. One that doesn't gets treated as unrequested and
 * is reverted immediately, before smooth-scroll has time to render more
 * than a frame or two of it.
 */
export default function IframeScrollGuard() {
  const lastInputAt = useRef(0);
  const safeY = useRef(0);
  const reverting = useRef(false);

  useEffect(() => {
    safeY.current = window.scrollY;

    const markInput = () => {
      lastInputAt.current = performance.now();
    };
    // Anything that could legitimately move the page: wheel, touch, drag on
    // a scrollbar (mousedown), or any keypress (Tab/PageDown/etc. can all
    // trigger a legitimate native scroll-into-view).
    window.addEventListener("wheel", markInput, { passive: true });
    window.addEventListener("touchmove", markInput, { passive: true });
    window.addEventListener("mousedown", markInput, { passive: true });
    window.addEventListener("keydown", markInput, { passive: true });

    const onScroll = () => {
      if (reverting.current) {
        // This is our own corrective jump landing — accept it as the new
        // baseline and stop treating it specially.
        reverting.current = false;
        safeY.current = window.scrollY;
        return;
      }
      const sinceInput = performance.now() - lastInputAt.current;
      if (sinceInput < 400) {
        // Recent real input explains this movement — let it through and
        // track it as the last known-good position.
        safeY.current = window.scrollY;
        return;
      }
      // No recent input explains this scroll — revert it. behavior:
      // "instant" explicitly overrides the page's CSS scroll-behavior:
      // smooth, so this doesn't itself animate into view.
      reverting.current = true;
      window.scrollTo({ top: safeY.current, behavior: "instant" });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", markInput);
      window.removeEventListener("touchmove", markInput);
      window.removeEventListener("mousedown", markInput);
      window.removeEventListener("keydown", markInput);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}

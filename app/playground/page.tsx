import type { Metadata } from "next";
import SiteShell, { PageHeading } from "../components/SiteShell";
import Playground from "../components/playground/Playground";

export const metadata: Metadata = { title: "Play — Fritz Dela Cruz" };

export default function PlaygroundPage() {
  return (
    <SiteShell>
      <PageHeading title="Play" note="Nine small games I wrote from scratch in React and canvas. Set a score and put your name on the board." />
      <Playground />
    </SiteShell>
  );
}

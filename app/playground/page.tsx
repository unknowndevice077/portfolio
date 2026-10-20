import type { Metadata } from "next";
import SiteShell, { PageHeading } from "../components/SiteShell";
import Playground from "../components/playground/Playground";

export const metadata: Metadata = { title: "Playground — Fritz Dela Cruz" };

export default function PlaygroundPage() {
  return (
    <SiteShell>
      <PageHeading
        title="Playground"
        note="Things you can actually poke at: games written from scratch, a theme switcher that restyles this whole site, one component in six design languages, a working terminal, and real code from my repos."
      />
      <Playground />
    </SiteShell>
  );
}

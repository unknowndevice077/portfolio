import SiteShell, { PageHeading } from "./components/SiteShell";
import WorkIndex from "./components/WorkIndex";

export default function Home() {
  return (
    <SiteShell>
      <PageHeading
        title="Selected work"
        note="Pick one to see how it works."
      />
      <WorkIndex />
    </SiteShell>
  );
}

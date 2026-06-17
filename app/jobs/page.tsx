import { JobsSplitView } from "@/components/jobs/jobs-split-view";
import { SiteHeader } from "@/components/site-header";

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <JobsSplitView />
    </div>
  );
}

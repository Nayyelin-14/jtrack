import { BrowseJobs } from "@/components/jobs/browse-jobs";
import { SiteHeader } from "@/components/site-header";

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground">
          Active Jobs
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Browse available positions and find your next opportunity.
        </p>
        <BrowseJobs />
      </main>
    </div>
  );
}

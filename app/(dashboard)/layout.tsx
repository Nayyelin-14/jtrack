import { AuthGuard } from "@/components/auth-guard";
import { SiteHeader } from "@/components/site-header";
import { DashboardNav } from "@/components/dashboard-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="flex">
          <DashboardNav />
          <main className="flex-1 min-w-0 p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost/api";

const recruiterRoutes = [
  "/dashboard/companies",
  "/dashboard/jobs",
  "/dashboard/recruiter",
];

const jobseekerRoutes = [
  "/dashboard/applications",
  "/dashboard/resume",
  "/dashboard/jobseeker",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/reset-password"];
  const isPublic = publicRoutes.some((r) => pathname === r) || pathname.startsWith("/reset-password/");
  const isStatic = pathname.startsWith("/_next") || pathname.startsWith("/favicon") || pathname.startsWith("/hero-");
  const isApi = pathname.startsWith("/api");

  if (isPublic || isStatic || isApi) {
    return NextResponse.next();
  }

  try {
    const res = await fetch(`${BASE}/auth/me`, {
      credentials: "include",
      headers: { cookie: request.headers.get("cookie") || "" },
    });

    if (!res.ok) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const data = await res.json();
    const role = data?.user?.role;

    if (recruiterRoutes.some((r) => pathname.startsWith(r)) && role !== "recruiter") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (jobseekerRoutes.some((r) => pathname.startsWith(r)) && role !== "jobseeker") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

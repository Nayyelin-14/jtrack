"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  CheckCircle2,
  Quote,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { useAuthStore } from "@/store/auth-store";

const features = [
  {
    icon: Target,
    title: "For jobseekers",
    description:
      "Track every application, get AI match scores, and surface gaps before interviews.",
    bullets: [
      "AI resume analysis",
      "Per-job match insights",
      "Career guidance streams",
    ],
  },
  {
    icon: Users,
    title: "For recruiters",
    description:
      "Post roles, manage pipelines, and prioritize subscribed applicants automatically.",
    bullets: [
      "Multi-company management",
      "Smart applicant sorting",
      "Status notifications",
    ],
  },
  {
    icon: BarChart3,
    title: "Built on data",
    description:
      "90-day analytics on every job. Conversion rates, daily views, applicant trends.",
    bullets: [
      "Daily view tracking",
      "Conversion metrics",
      "Exportable insights",
    ],
  },
];

const stats = [
  { value: "10k+", label: "Active jobs" },
  { value: "94%", label: "ATS accuracy" },
  { value: "2.3x", label: "Faster hires" },
];

export default function Landing() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />

      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-18">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-primary" />
              AI-powered job tracking
            </span>
            <h1
              className="mt-6 text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Track jobs.
              <br />
              <span className="gradient-text">Land roles.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              The premium platform that connects ambitious jobseekers with the
              recruiters hiring them — backed by AI match scoring and pipeline
              analytics.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {user ? (
                <Button
                  size="lg"
                  asChild
                  className="shadow-elegant text-primary-foreground"
                  style={{ background: "var(--gradient-cta)" }}
                >
                  <Link href="/dashboard">
                    Go to dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    asChild
                    className="shadow-elegant text-primary-foreground"
                    style={{ background: "var(--gradient-cta)" }}
                  >
                    <Link href="/register">
                      Start tracking <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/login">I already have an account</Link>
                  </Button>
                </>
              )}
            </div>
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border/60 pt-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold tracking-tight">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative hidden lg:block"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="glass relative rounded-3xl p-6 shadow-glow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="grid h-10 w-10 place-items-center rounded-xl text-primary-foreground"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Senior Frontend Engineer</p>
                    <p className="text-xs text-muted-foreground">
                      Stripe · Remote
                    </p>
                  </div>
                </div>
                <span
                  className="rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold"
                  style={{ color: "var(--color-success)" }}
                >
                  92% match
                </span>
              </div>
              <div className="mt-5 space-y-2">
                {[
                  "React 19 expertise",
                  "TypeScript strict mode",
                  "Design system ownership",
                ].map((s) => (
                  <div key={s} className="flex items-center gap-2 text-sm">
                    <CheckCircle2
                      className="h-4 w-4"
                      style={{ color: "var(--color-success)" }}
                    />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-xl border border-border/60 bg-background/50 p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Recommendation
                </p>
                <p className="mt-1 text-sm font-semibold">
                  Strong Match — Apply with confidence
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/60 bg-muted/30 py-16 lg:px-14">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold tracking-tight">
              Built for both sides of the table
            </h2>
            <p className="mt-4 text-muted-foreground">
              Whether you're searching or hiring, J-Track gives you the signal
              you need.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group rounded-2xl border border-border/60 bg-card p-6 shadow-card transition-shadow hover:shadow-elegant"
              >
                <div
                  className="grid h-12 w-12 place-items-center rounded-xl text-primary-foreground transition group-hover:scale-110"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {f.description}
                </p>
                <ul className="mt-4 space-y-2">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm">
                      <CheckCircle2
                        className="h-4 w-4 shrink-0"
                        style={{ color: "var(--color-success)" }}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center sm:px-8">
          <Quote className="mx-auto h-10 w-10 text-primary/40" />
          <blockquote className="mt-6 text-2xl font-medium leading-relaxed tracking-tight sm:text-3xl">
            &ldquo;J-Track turned a frantic job search into a structured
            pipeline. The AI match scores told me exactly where I was strong —
            and where to invest before applying.&rdquo;
          </blockquote>
          <div className="mt-6">
            <p className="font-semibold">Maya Chen</p>
            <p className="text-sm text-muted-foreground">
              Senior Product Engineer · hired in 5 weeks
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20 sm:px-8">
        <div
          className="mx-auto max-w-5xl overflow-hidden rounded-3xl p-12 text-center shadow-glow sm:p-16"
          style={{ background: "var(--gradient-cta)" }}
        >
          <h2 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
            Create your free account
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Join thousands tracking their next opportunity. No credit card
            required.
          </p>
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="mt-8 shadow-elegant"
          >
            <Link href={user ? "/dashboard" : "/register"}>
              {user ? "Open dashboard" : "Get started free"}{" "}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border/60 px-6 py-8 text-center text-xs text-muted-foreground sm:px-8">
        &copy; {new Date().getFullYear()} J-Track &mdash; made for jobseekers
        and recruiters.
      </footer>
    </div>
  );
}

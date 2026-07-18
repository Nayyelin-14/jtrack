"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Target,
  FileText,
  Users,
  BarChart3,
  UserPlus,
  Sparkles,
  Send,
  CheckCircle2,
  Play,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useAuthStore } from "@/store/auth-store";

const features = [
  {
    icon: Target,
    title: "AI match scoring",
    description: "See exactly how well you fit before you apply.",
    image: "https://images.unsplash.com/photo-1534665482403-a909d0d97c67?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: FileText,
    title: "Application tracking",
    description: "Every application, status, and follow-up in one place.",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: Users,
    title: "Candidate pipelines",
    description: "Recruiters sort and prioritize applicants automatically.",
    image: "https://images.unsplash.com/photo-1573167507387-6b4b98cb7c13?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: BarChart3,
    title: "Hiring analytics",
    description: "90-day view and conversion data on every listing.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  },
];

const checklist = [
  "AI-verified skill matching",
  "Real-time application tracking",
  "Recruiter-grade analytics",
];

const steps = [
  { icon: UserPlus, title: "Create your profile", description: "Sign up as a jobseeker or recruiter in under a minute." },
  { icon: Sparkles, title: "Get matched", description: "Our AI scores your fit against real openings." },
  { icon: Send, title: "Apply or review", description: "Apply with confidence, or review ranked applicants." },
  { icon: CheckCircle2, title: "Get hired", description: "Track status through offer, all in one dashboard." },
];

const stats = [
  { icon: Target, value: "10k+", label: "Active jobs" },
  { icon: Users, value: "50k+", label: "Jobseekers" },
  { icon: BarChart3, value: "94%", label: "ATS accuracy" },
  { icon: Rocket, value: "2.3x", label: "Faster hires" },
];

const categories = [
  { title: "Engineering & Tech", image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=800&q=80" },
  { title: "Design & Product", image: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=800&q=80" },
  { title: "Sales & Marketing", image: "https://images.unsplash.com/photo-1690378820474-b468b8ee64d3?auto=format&fit=crop&w=800&q=80" },
];

const marqueeItems = ["Full-time", "Part-time", "Remote", "Contract", "Internship"];

const testimonials = [
  {
    quote: "J-Track turned a frantic job search into a structured pipeline. The AI match scores told me exactly where I was strong — and where to invest before applying.",
    name: "Maya Chen",
    role: "Senior Product Engineer · hired in 5 weeks",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    quote: "We cut our time-to-hire almost in half. The applicant ranking means I only spend real time on candidates who are actually a fit.",
    name: "James Okafor",
    role: "Technical Recruiter · Series B startup",
    image: "https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?auto=format&fit=crop&w=200&q=80",
  },
];

export default function Landing() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-brand">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute left-[8%] top-16 h-16 w-16 rounded-full border-2 border-white" />
          <div className="absolute right-[15%] top-40 h-4 w-4 rounded-full bg-white" />
          <div className="absolute left-[35%] bottom-24 h-3 w-3 rounded-full bg-white" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pt-14 pb-28 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-16 lg:pb-36">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              AI-powered job tracking
            </p>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">
              Track jobs.
              <br />
              Land roles.
            </h1>
            <p className="mt-6 max-w-md text-lg text-white/85">
              The platform that connects ambitious jobseekers with the
              recruiters hiring them — backed by AI match scoring and pipeline
              analytics.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              {user ? (
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/dashboard">
                    Go to dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/register">
                      Start tracking <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
                  >
                    <Link href="/jobs">Browse jobs</Link>
                  </Button>
                </>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src="https://images.unsplash.com/photo-1573497701240-345a300b8d36?auto=format&fit=crop&w=1200&q=80"
                alt="A small team reviewing candidates together around a table"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -left-5 -top-5 grid h-14 w-14 place-items-center rounded-full bg-white shadow-sm">
              <Play className="h-5 w-5 text-primary" fill="currentColor" />
            </div>
          </motion.div>
        </div>

        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 h-16 w-full text-background"
        >
          <path d="M0,32 C360,80 1080,0 1440,48 L1440,80 L0,80 Z" fill="currentColor" />
        </svg>
      </section>

      {/* About */}
      <section className="px-6 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-brand opacity-10" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
              <Image
                src="https://images.unsplash.com/photo-1606579541129-4ca86a4eed1c?auto=format&fit=crop&w=900&q=80"
                alt="Someone working focused at their laptop"
                fill
                sizes="(min-width: 1024px) 35vw, 90vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 flex items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-sm sm:-right-8">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-gradient-brand text-white">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-xl font-semibold tracking-tight">10,000+</p>
                <p className="text-xs text-muted-foreground">applications tracked</p>
              </div>
            </div>
          </div>

          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">About J-Track</p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Built to make hiring feel human again
            </h2>
            <p className="mt-4 text-muted-foreground">
              We built J-Track because job search and hiring shouldn&apos;t feel
              like shouting into the void. Every application has a status.
              Every match has a reason.
            </p>
            <ul className="mt-6 space-y-3">
              {checklist.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm font-medium">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <Button size="lg" asChild className="mt-8">
              <Link href={user ? "/dashboard" : "/register"}>
                See how it works <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="bg-muted/30 px-6 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">What we do</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Everything you need, whichever side you&apos;re on
              </h2>
            </div>
            <Link href="/register" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="overflow-hidden rounded-lg border border-border bg-card">
                <div className="relative aspect-[4/3]">
                  <Image src={f.image} alt="" fill sizes="(min-width: 1024px) 25vw, 45vw" className="object-cover" />
                  <div className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-card shadow-sm">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-base font-semibold tracking-tight">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.description}</p>
                  <Link href="/register" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                    Learn more <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="px-6 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 rounded-lg bg-gradient-brand px-8 py-8 text-white sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white/15">
              <Rocket className="h-6 w-6" />
            </div>
            <p className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
              Ready to find your next role?
            </p>
          </div>
          <Button variant="secondary" size="lg" asChild className="shrink-0">
            <Link href="/jobs">
              Browse jobs <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Process steps */}
      <section className="px-6 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-xl text-center">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">How it works</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Standard work process</h2>
          </div>
          <div className="relative mt-16 grid gap-10 sm:grid-cols-4">
            <div className="absolute left-0 right-0 top-6 hidden border-t border-dashed border-border sm:block" />
            {steps.map((s, i) => (
              <div key={s.title} className={`relative text-center ${i % 2 === 1 ? "sm:mt-10" : ""}`}>
                <div className="relative z-10 mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-brand font-display text-sm font-semibold text-white">
                  0{i + 1}
                </div>
                <s.icon className="mx-auto mt-4 h-5 w-5 text-primary" />
                <h3 className="mt-3 font-display text-base font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark stats + categories band */}
      <section style={{ background: "oklch(0.2 0.05 265)" }} className="px-6 pt-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              We are increasing hiring success
            </h2>
            <p className="mt-3 text-sm" style={{ color: "oklch(0.72 0.02 265)" }}>
              Real signal, not just applications sent into the void.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <s.icon className="mx-auto h-6 w-6 text-white/70" />
                <p className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-xs sm:text-sm" style={{ color: "oklch(0.72 0.02 265)" }}>{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 pb-16">
            <p className="text-center text-sm font-semibold uppercase tracking-widest" style={{ color: "oklch(0.72 0.02 265)" }}>
              Explore opportunities by category
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {categories.map((c) => (
                <Link key={c.title} href="/jobs" className="group relative aspect-[4/5] overflow-hidden rounded-lg">
                  <Image src={c.image} alt="" fill sizes="(min-width: 1024px) 30vw, 90vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <p className="absolute bottom-4 left-4 font-display text-lg font-semibold text-white">{c.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-hidden border-t" style={{ borderColor: "oklch(1 0 0 / 10%)" }}>
          <div className="flex w-max animate-marquee py-4">
            {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="mx-6 flex items-center gap-6 whitespace-nowrap font-display text-sm font-semibold uppercase tracking-widest text-white/50">
                {item} <span className="text-primary">&bull;</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">People who already trust us</h2>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-2">
          {testimonials.map((t) => (
            <div key={t.name} className="relative rounded-lg border border-border bg-card p-7">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-brand font-display text-lg text-white">
                &ldquo;
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-foreground">{t.quote}</blockquote>
              <div className="mt-5 flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image src={t.image} alt={t.name} fill sizes="40px" className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 pb-20 sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-8 rounded-lg bg-gradient-brand p-12 text-white sm:flex-row sm:items-center sm:p-16">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Create your free account
            </h2>
            <p className="mt-3 max-w-md text-white/80">
              Join thousands tracking their next opportunity. No credit card
              required.
            </p>
          </div>
          <Button size="lg" variant="secondary" asChild className="shrink-0">
            <Link href={user ? "/dashboard" : "/register"}>
              {user ? "Open dashboard" : "Get started free"}
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

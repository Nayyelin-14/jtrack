"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Sparkles,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuthStore } from "@/stores/auth-store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const heroCandidate = "/hero-candidate.jpg";
const heroRecruiter = "/hero-recruiter.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Landing() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);

  const initials = user
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(55% 40% at 12% -5%, oklch(0.88 0.07 256 / 0.55), transparent 60%), radial-gradient(40% 40% at 100% 15%, oklch(0.92 0.06 60 / 0.45), transparent 60%)",
        }}
      />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Briefcase className="h-4 w-4" />
          </span>
          <span className="text-lg">J-Track</span>
        </Link>
        <nav className="flex items-center gap-2">
          <ThemeToggle />
          {isLoading && (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          )}
          {user && !isLoading && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <Avatar>
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-medium text-foreground">{user.name}</div>
                <div className="px-2 pb-1.5 text-xs text-muted-foreground">{user.email}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={user.role === "jobseeker" ? "/jobs" : "/dashboard"} className="cursor-pointer">
                    <Briefcase className="h-4 w-4" /> Dashboard
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {!user && !isLoading && (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Get started</Link>
              </Button>
            </>
          )}
        </nav>
      </header>

      {/* HERO */}
      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 pb-20 pt-10 md:grid-cols-[1.05fr_1fr] md:pt-6">
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Built by people who&apos;ve been on both sides of the table
          </span>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-[3.5rem]">
            Job hunting is messy.{" "}
            <span
              className="italic text-primary"
              style={{ fontFamily: "'Fraunces', ui-serif, Georgia, serif" }}
            >
              Tracking it shouldn&apos;t be.
            </span>
          </h1>
          <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
            J-Track is a quiet little workspace that remembers every role you
            applied to, every recruiter who replied, and the follow-up you keep
            meaning to send.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="group">
              <Link href="/register">
                Start tracking &mdash; it&apos;s free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="/login">I already have an account</Link>
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex -space-x-2">
              {["#fca5a5", "#fcd34d", "#86efac", "#93c5fd"].map((c) => (
                <span
                  key={c}
                  className="h-7 w-7 rounded-full border-2 border-background"
                  style={{ background: c }}
                />
              ))}
            </div>
            <span>Joined by 2,400+ job seekers and recruiters this month</span>
          </div>
        </motion.div>

        {/* photo collage */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative mx-auto aspect-5/6 w-full max-w-md"
        >
          <motion.div
            initial={{ rotate: -3 }}
            animate={{ rotate: [-3, -2, -3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-0 top-6 h-[78%] w-[70%] overflow-hidden rounded-2xl border border-border/60 shadow-2xl shadow-primary/10"
          >
            <img
              src={heroCandidate}
              alt="Job seeker working on her applications"
              className="h-full w-full object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ rotate: 4 }}
            animate={{ rotate: [4, 3, 4] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4,
            }}
            className="absolute bottom-0 right-0 h-[62%] w-[62%] overflow-hidden rounded-2xl border border-border/60 shadow-2xl shadow-primary/10"
          >
            <img
              src={heroRecruiter}
              alt="Recruiter interviewing a candidate"
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* floating note */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute -left-3 bottom-10 hidden rounded-xl border border-border bg-card/95 p-3 text-xs shadow-xl backdrop-blur sm:block"
          >
            <div className="flex items-center gap-2 font-medium text-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Follow-up with Acme
            </div>
            <p className="mt-1 text-muted-foreground">
              Reminder &middot; tomorrow, 9:00am
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              kicker: "For job seekers",
              title: "Remember where you applied.",
              body: "No more spreadsheets that you&apos;ll abandon in three weeks. Drop in a role, add a note, move it along.",
            },
            {
              kicker: "For recruiters",
              title: "Keep candidates warm.",
              body: "See who&apos;s waiting, who&apos;s interviewed, and who you owe a reply to &mdash; without a CRM that hates you back.",
            },
            {
              kicker: "For both",
              title: "Less anxiety, more momentum.",
              body: "Gentle reminders, a calm interface, and a sense that you&apos;re actually getting somewhere.",
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur transition hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-primary">
                {f.kicker}
              </p>
              <h3
                className="mt-3 text-xl text-foreground"
                style={{
                  fontFamily: "'Fraunces', ui-serif, Georgia, serif",
                  fontStyle: "italic",
                }}
              >
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.body}
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-primary opacity-0 transition group-hover:opacity-100">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="mx-auto w-full max-w-4xl px-6 pb-24">
        <motion.figure
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-border/60 bg-card/70 p-8 text-center backdrop-blur sm:p-12"
        >
          <Quote className="mx-auto h-8 w-8 text-primary/60" />
          <blockquote
            className="mt-4 text-xl leading-snug text-foreground sm:text-2xl"
            style={{
              fontFamily: "'Fraunces', ui-serif, Georgia, serif",
              fontStyle: "italic",
            }}
          >
            &ldquo;I stopped dreading Sunday-night job-hunt sessions. J-Track
            turned them into twenty calm minutes with a cup of coffee.&rdquo;
          </blockquote>
          <figcaption className="mt-5 flex items-center justify-center gap-3 text-sm">
            <span
              className="h-10 w-10 rounded-full bg-cover bg-center"
              style={{ backgroundImage: `url(${heroCandidate})` }}
            />
            <span className="text-left">
              <span className="block font-medium text-foreground">Maya R.</span>
              <span className="block text-muted-foreground">
                Product designer, recently hired
              </span>
            </span>
          </figcaption>
        </motion.figure>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-3xl border border-border/60 bg-linear-to-br from-primary to-primary/70 p-10 text-primary-foreground sm:p-14"
        >
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Bring some order to the chaos.
              </h2>
              <p className="mt-2 max-w-md text-primary-foreground/80">
                Two minutes to sign up. No credit card, no nonsense.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary" className="group">
              <Link href="/register">
                Create your free account
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
          <ul className="mt-8 grid gap-3 text-sm text-primary-foreground/90 sm:grid-cols-3">
            {[
              "Free forever for solo use",
              "Your data, exportable any time",
              "Works for both sides",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> {t}
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} J-Track &mdash; made with too much
        coffee.
      </footer>
    </div>
  );
}

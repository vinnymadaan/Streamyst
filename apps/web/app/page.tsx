'use client';

import { api } from '~/trpc/server';

import { ThemeToggle } from '@/components/theme-toggle';

import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fafaf9] text-zinc-950 dark:bg-[#09090b] dark:text-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200/50 bg-[#fafaf9]/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-[#09090b]/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <img src="/logo-icon-1.png" alt="Streamyst" className="h-8 w-8" />

            <h1 className="font-space-grotesk text-xl font-bold">Streamyst</h1>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/dashboard"
              className="rounded-full px-5 py-2 text-sm font-medium transition hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              Dashboard
            </a>

            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
              className="rounded-full bg-zinc-950 px-5 py-2 text-sm font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-black"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <motion.section
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
        }}
        className="relative"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid min-h-[90vh] max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              <div className="h-2 w-2 rounded-full bg-orange-500" />
              Modern Form Infrastructure
            </div>

            <h1 className="mt-8 max-w-2xl font-space-grotesk text-6xl font-bold leading-[1.05] tracking-tight lg:text-7xl">
              Forms that feel beautifully simple.
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              Build elegant forms, collect responses instantly, and manage
              everything from one clean, modern dashboard.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
                className="rounded-2xl bg-zinc-950 px-7 py-4 text-sm font-semibold text-white transition hover:scale-[1.02] hover:opacity-90 dark:bg-white dark:text-black"
              >
                Start Building
              </a>

              <a
                href="/dashboard"
                className="rounded-2xl border border-zinc-200 bg-white px-7 py-4 text-sm font-semibold transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                Open Dashboard
              </a>
            </div>

            <div className="mt-14 flex items-center gap-10">
              <div>
                <p className="font-space-grotesk text-3xl font-bold">10k+</p>

                <p className="mt-1 text-sm text-zinc-500">Forms created</p>
              </div>

              <div>
                <p className="font-space-grotesk text-3xl font-bold">99.9%</p>

                <p className="mt-1 text-sm text-zinc-500">Reliable uptime</p>
              </div>

              <div>
                <p className="font-space-grotesk text-3xl font-bold">4.9/5</p>

                <p className="mt-1 text-sm text-zinc-500">User satisfaction</p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-tr from-orange-500/20 to-transparent blur-2xl" />

            <div className="relative rounded-[32px] border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
                <div>
                  <p className="font-medium">Customer Feedback</p>

                  <p className="mt-1 text-sm text-zinc-500">Published form</p>
                </div>

                <div className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600">
                  Live
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Your Name
                  </label>

                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
                    Alex Johnson
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Email Address
                  </label>

                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
                    alex@email.com
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Feedback
                  </label>

                  <div className="min-h-[120px] rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
                    Your platform feels incredibly smooth and intuitive.
                  </div>
                </div>

                <button className="w-full rounded-2xl bg-zinc-950 py-4 text-sm font-semibold text-white dark:bg-white dark:text-black">
                  Submit Response
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
}

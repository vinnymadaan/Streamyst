'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';

import { ArrowUpRight, FileText, Plus, Sparkles } from 'lucide-react';

import { ThemeToggle } from '@/components/theme-toggle';

import { trpc } from '~/trpc/client';

import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { data: forms = [], isLoading } = trpc.forms.getMine.useQuery();

  const publishedForms = forms.filter(
    (form: any) => form.status === 'published'
  );

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafaf9] dark:bg-[#09090b]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-zinc-300 border-t-black dark:border-zinc-700 dark:border-t-white" />

          <p className="mt-4 text-sm text-zinc-500">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafaf9] text-zinc-950 dark:bg-[#09090b] dark:text-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200/50 bg-[#fafaf9]/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-[#09090b]/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-orange-500" />

            <h1 className="font-space-grotesk text-xl font-bold">Streamyst</h1>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link
              href="/dashboard/create"
              className="inline-flex items-center gap-2 rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-black"
            >
              <Plus className="h-4 w-4" />
              Create Form
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* HEADER */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              <Sparkles className="h-4 w-4 text-orange-500" />
              Dashboard Overview
            </div>

            <h1 className="mt-6 font-space-grotesk text-5xl font-bold tracking-tight lg:text-6xl">
              Your forms,
              <br />
              beautifully managed.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              Create, publish, and manage forms with a modern workflow built for
              speed and simplicity.
            </p>
          </div>

          <Link
            href="/dashboard/create"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 font-medium text-white transition hover:scale-[1.02]"
          >
            <Plus className="h-5 w-5" />
            New Form
          </Link>
        </div>

        {/* STATS */}
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">Total Forms</p>

            <h2 className="mt-4 font-space-grotesk text-5xl font-bold">
              {forms.length}
            </h2>
          </div>

          <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">Published Forms</p>

            <h2 className="mt-4 font-space-grotesk text-5xl font-bold">
              {publishedForms.length}
            </h2>
          </div>

          <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">Total Responses</p>

            <h2 className="mt-4 font-space-grotesk text-5xl font-bold">
              {forms.reduce(
                (total: number, form: any) =>
                  total + (form.responses?.length || 0),
                0
              )}
            </h2>
          </div>
        </div>

        {/* FORMS */}
        <div className="mt-16">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-space-grotesk text-3xl font-bold">
                Your Forms
              </h2>

              <p className="mt-2 text-zinc-500">
                Manage and monitor all your active forms.
              </p>
            </div>
          </div>

          {forms.length === 0 ? (
            <div className="mt-10 rounded-[32px] border border-dashed border-zinc-300 bg-white p-20 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/10">
                <FileText className="h-10 w-10 text-orange-500" />
              </div>

              <h3 className="mt-8 font-space-grotesk text-3xl font-bold">
                Create your first form
              </h3>

              <p className="mx-auto mt-4 max-w-md text-zinc-500">
                Start building beautiful forms and collecting responses in
                minutes.
              </p>

              <Link
                href="/dashboard/create"
                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-zinc-950 px-6 py-4 font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-black"
              >
                <Plus className="h-4 w-4" />
                Create Form
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {(forms as any[]).map((form) => (
                <motion.div
                  key={form.id}
                  whileHover={{
                    y: -4,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="group rounded-[32px] border border-zinc-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        form.status === 'published'
                          ? 'bg-green-500/10 text-green-600'
                          : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      {form.status}
                    </div>

                    <div className="text-sm text-zinc-500">
                      {form.responses?.length} responses
                    </div>
                  </div>

                  <h3 className="mt-6 line-clamp-2 font-space-grotesk text-3xl font-bold tracking-tight">
                    {form.title}
                  </h3>

                  <p className="mt-4 line-clamp-3 text-sm leading-7 text-zinc-500 dark:text-zinc-400">
                    {form.description || 'No description added yet.'}
                  </p>

                  <div className="mt-10 flex items-center gap-3">
                    <Link
                      href={`/dashboard/forms/${form.id}`}
                      className="inline-flex items-center gap-2 rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-black"
                    >
                      Open Form
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>

                    <Link
                      href={`/f/${form.slug}`}
                      target="_blank"
                      className="rounded-2xl border border-zinc-200 px-5 py-3 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800"
                    >
                      Preview
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

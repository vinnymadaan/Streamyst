"use client";

import Link from "next/link";

import { trpc } from "~/trpc/client";

export default function DashboardPage() {
  const { data: forms, isLoading } =
    trpc.forms.list.useQuery();

  return (
    <main className="min-h-screen p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Dashboard
          </h1>

          <p className="mt-2 text-zinc-500">
            Create and manage your forms
          </p>
        </div>

        <Link
          href="/dashboard/create"
          className="rounded-xl bg-black px-5 py-3 text-white"
        >
          Create Form
        </Link>
      </div>

      <div className="mt-10 space-y-4">
        {isLoading ? (
          <p>Loading forms...</p>
        ) : forms?.length === 0 ? (
          <div className="rounded-2xl border p-10">
            <p>No forms created yet.</p>
          </div>
        ) : (
          forms?.map((form) => (
            <div
              key={form.id}
              className="rounded-2xl border p-6"
            >
              <h2 className="text-2xl font-semibold">
                {form.title}
              </h2>

              <p className="mt-2 text-zinc-500">
                {form.description}
              </p>

              <div className="mt-4 flex gap-3">
                <Link
                  href={`/f/${form.slug}`}
                  className="rounded-lg border px-4 py-2"
                >
                  Open
                </Link>

                <Link
                  href={`/dashboard/forms/${form.id}`}
                  className="rounded-lg bg-black px-4 py-2 text-white"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

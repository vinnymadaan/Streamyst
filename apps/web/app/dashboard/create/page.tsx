'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { trpc } from '@/trpc/client';

import { toast } from 'sonner';

function createSlug(title: string) {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${base || 'form'}-${Date.now().toString(36)}`;
}

export default function CreateFormPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');

  const [description, setDescription] = useState('');

  const createFormMutation = trpc.forms.create.useMutation({
    onSuccess: (response) => {
      router.push(`/dashboard/forms/${response.id}`);
    },

    onError: (error) => {
      console.error('CREATE FORM ERROR:', error);

      toast.error(error.message || 'Failed to create form');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Title is required');

      return;
    }

    createFormMutation.mutate({
      title: title.trim(),

      description: description.trim(),

      slug: createSlug(title),

      fields: [
        {
          type: 'short_text',

          label: 'Untitled Question',

          required: false,

          fieldOrder: 0,
        },
      ],
    });
  };

  return (
    <main className="min-h-screen bg-white p-8 text-black dark:bg-zinc-950 dark:text-white">
      <div className="mx-auto max-w-2xl">
        <div>
          <p className="text-sm text-zinc-500">Dashboard</p>

          <h1 className="mt-2 font-space-grotesk text-5xl font-bold">
            Create New Form
          </h1>

          <p className="mt-4 text-zinc-500">
            Build forms and collect responses beautifully.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Form Title</label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Customer Feedback Form"
              className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 outline-none transition focus:border-black dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your form..."
              className="min-h-[160px] w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 outline-none transition focus:border-black dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-white"
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={createFormMutation.isPending}
              className="rounded-2xl bg-black px-6 py-4 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
            >
              {createFormMutation.isPending
                ? 'Creating Form...'
                : 'Create Form'}
            </button>

            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="rounded-2xl border border-zinc-200 px-6 py-4 transition hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

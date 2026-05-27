'use client';

export const dynamic = 'force-dynamic';

import { use } from 'react';

import { CheckCircle2, Copy, Eye, Plus, Trash2 } from 'lucide-react';

import { ThemeToggle } from '@/components/theme-toggle';

import { trpc } from '~/trpc/client';

import { toast } from 'sonner';

interface FormEditorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function FormEditorPage({ params }: FormEditorPageProps) {
  const { id } = use(params);

  const utils = trpc.useUtils();

  const { data: form, isLoading } = trpc.forms.getById.useQuery({
    id,
  });

  const { data: responses = [] } = trpc.forms.getResponses.useQuery({
    formId: id,
  });

  const createFieldMutation = trpc.forms.createField.useMutation({
    onSuccess: async () => {
      await utils.forms.getById.invalidate();
      toast.success('Question added successfully!');
    },
    onError: (error) => {
      console.error('CREATE FIELD ERROR:', error);
      toast.error(error.message || 'Failed to add question');
    },
  });

  const updateFieldMutation = trpc.forms.updateField.useMutation({
    onSuccess: async () => {
      await utils.forms.getById.invalidate();
    },
    onError: (error) => {
      console.error('UPDATE FIELD ERROR:', error);
      toast.error(error.message || 'Failed to update question');
    },
  });

  const deleteFieldMutation = trpc.forms.deleteField.useMutation({
    onSuccess: async () => {
      await utils.forms.getById.invalidate();
      toast.success('Question deleted successfully!');
    },
    onError: (error) => {
      console.error('DELETE FIELD ERROR:', error);
      toast.error(error.message || 'Failed to delete question');
    },
  });

  const togglePublishMutation = trpc.forms.togglePublish.useMutation({
    onSuccess: async (data) => {
      await utils.forms.getById.invalidate();
      toast.success(
        data?.status === 'published'
          ? 'Form published successfully!'
          : 'Form unpublished successfully!'
      );
    },
    onError: (error) => {
      console.error('TOGGLE PUBLISH ERROR:', error);
      toast.error(error.message || 'Failed to update publish status');
    },
  });

  const updateFormMutation = trpc.forms.update.useMutation({
    onSuccess: async () => {
      await utils.forms.getById.invalidate();
      toast.success('Form updated successfully!');
    },
    onError: (error) => {
      console.error('UPDATE FORM ERROR:', error);
      toast.error(error.message || 'Failed to update form');
    },
  });

  const deleteFormMutation = trpc.forms.delete.useMutation({
    onSuccess: async () => {
      window.location.href = '/dashboard';
    },
    onError: (error) => {
      console.error('DELETE FORM ERROR:', error);
      toast.error(error.message || 'Failed to delete form');
    },
  });

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafaf9] dark:bg-[#09090b]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-zinc-300 border-t-black dark:border-zinc-700 dark:border-t-white" />

          <p className="mt-4 text-sm text-zinc-500">Loading editor...</p>
        </div>
      </main>
    );
  }

  if (!form) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafaf9] dark:bg-[#09090b]">
        <p className="text-zinc-500">Form not found</p>
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

          <ThemeToggle />
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* HEADER */}
        <div className="rounded-[32px] border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                <div
                  className={`h-2 w-2 rounded-full ${
                    form.status === 'published'
                      ? 'bg-green-500'
                      : 'bg-orange-500'
                  }`}
                />

                {form.status === 'published' ? 'Published Form' : 'Draft Form'}
              </div>

              <input
                defaultValue={form.title}
                onBlur={(e) => {
                  updateFormMutation.mutateAsync({
                    formId: form.id,

                    title: e.target.value,
                  });
                }}
                className="mt-6 w-full bg-transparent font-space-grotesk text-5xl font-bold tracking-tight outline-none lg:text-6xl"
              />

              <textarea
                defaultValue={form.description ?? ''}
                onBlur={(e) => {
                  updateFormMutation.mutateAsync({
                    formId: form.id,

                    description: e.target.value,
                  });
                }}
                placeholder="Describe your form..."
                className="mt-5 w-full resize-none bg-transparent text-lg leading-8 text-zinc-500 outline-none dark:text-zinc-400"
              />
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  togglePublishMutation.mutateAsync({
                    formId: form.id,
                  });
                }}
                className={`rounded-2xl px-5 py-3 text-sm font-medium transition ${
                  form.status === 'published'
                    ? 'bg-zinc-950 text-white hover:opacity-90 dark:bg-white dark:text-black'
                    : 'bg-orange-500 text-white hover:scale-[1.02]'
                }`}
              >
                {form.status === 'published' ? 'Unpublish' : 'Publish'}
              </button>

              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    `${window.location.origin}/f/${form.slug}`
                  );

                  toast.success('Form URL copied!');
                }}
                className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <Copy className="h-4 w-4" />
                Copy URL
              </button>

              <a
                href={`/f/${form.slug}`}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <Eye className="h-4 w-4" />
                Preview
              </a>

              <button
                onClick={() => {
                  createFieldMutation.mutateAsync({
                    formId: form.id,

                    type: 'short_text',

                    label: 'Untitled Question',

                    fieldOrder: form.fields.length,
                  });
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-black"
              >
                <Plus className="h-4 w-4" />
                Add Field
              </button>

              <button
                onClick={() => {
                  const confirmed = confirm(
                    'Are you sure you want to delete this form?'
                  );

                  if (!confirmed) return;

                  deleteFormMutation.mutateAsync({
                    formId: form.id,
                  });
                }}
                className="inline-flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/5 px-5 py-3 text-sm font-medium text-red-500 transition hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* FIELDS */}
        <div className="mt-10 space-y-5">
          {form.fields.length === 0 ? (
            <div className="rounded-[32px] border border-dashed border-zinc-300 bg-white p-20 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-zinc-500">No fields added yet.</p>
            </div>
          ) : (
            form.fields.map((field) => (
              <div
                key={field.id}
                className="rounded-[32px] border border-zinc-200 bg-white p-7 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-8">
                  <div className="flex-1">
                    <input
                      defaultValue={field.label}
                      onBlur={(e) => {
                        updateFieldMutation.mutateAsync({
                          fieldId: field.id,

                          label: e.target.value,
                        });
                      }}
                      className="w-full bg-transparent font-space-grotesk text-3xl font-bold tracking-tight outline-none"
                    />

                    <div className="mt-5 flex flex-wrap items-center gap-4">
                      <select
                        value={field.type}
                        onChange={(e) => {
                          updateFieldMutation.mutateAsync({
                            fieldId: field.id,

                            type: e.target.value as
                              | 'short_text'
                              | 'long_text'
                              | 'email'
                              | 'number',
                          });
                        }}
                        className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-950"
                      >
                        <option value="short_text">Short Text</option>

                        <option value="long_text">Long Text</option>

                        <option value="email">Email</option>

                        <option value="number">Number</option>
                      </select>

                      <label className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => {
                            updateFieldMutation.mutateAsync({
                              fieldId: field.id,

                              required: e.target.checked,
                            });
                          }}
                        />
                        Required
                      </label>
                    </div>

                    <div className="mt-7">
                      {field.type === 'short_text' && (
                        <input
                          disabled
                          placeholder="Short text answer"
                          className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-950"
                        />
                      )}

                      {field.type === 'long_text' && (
                        <textarea
                          disabled
                          placeholder="Long text answer"
                          className="min-h-[140px] w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-950"
                        />
                      )}

                      {field.type === 'email' && (
                        <input
                          disabled
                          type="email"
                          placeholder="Email answer"
                          className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-950"
                        />
                      )}

                      {field.type === 'number' && (
                        <input
                          disabled
                          type="number"
                          placeholder="Number answer"
                          className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-950"
                        />
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      deleteFieldMutation.mutateAsync({
                        fieldId: field.id,
                      });
                    }}
                    className="rounded-2xl border border-red-500/30 bg-red-500/5 p-3 text-red-500 transition hover:bg-red-500/10"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RESPONSES */}
        <div className="mt-12 rounded-[32px] border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-space-grotesk text-4xl font-bold">
                Responses
              </h2>

              <p className="mt-3 text-zinc-500 dark:text-zinc-400">
                View submitted form responses.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              {responses.length} responses
            </div>
          </div>

          {responses.length === 0 ? (
            <div className="mt-10 rounded-[28px] border border-dashed border-zinc-300 p-16 text-center dark:border-zinc-800">
              <p className="text-zinc-500">No responses yet.</p>
            </div>
          ) : (
            <div className="mt-10 space-y-5">
              {(responses as any[]).map((response) => (
                <div
                  key={response.id}
                  className="rounded-[28px] border border-zinc-200 p-6 dark:border-zinc-800"
                >
                  <div className="mb-8 flex items-center justify-between">
                    <p className="font-medium">Response</p>

                    <p className="text-sm text-zinc-500">
                      {new Date(response.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-6">
                    {response.answers?.map((answer: any) => (
                      <div key={answer.id}>
                        <p className="text-sm text-zinc-500">
                          {answer.field?.label}
                        </p>

                        <p className="mt-2 text-lg font-medium">
                          {answer.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

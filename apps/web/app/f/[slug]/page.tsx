'use client';

export const dynamic = 'force-dynamic';

import { use } from 'react';

import { useState } from 'react';

import { ArrowRight, CheckCircle2 } from 'lucide-react';

import { ThemeToggle } from '@/components/theme-toggle';

import { trpc } from '~/trpc/client';

import { motion } from 'framer-motion';

import { toast } from 'sonner';

interface PublicFormPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function PublicFormPage({ params }: PublicFormPageProps) {
  const { slug } = use(params);

  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [submitted, setSubmitted] = useState(false);

  const { data: form, isLoading } = trpc.forms.getBySlug.useQuery(
    {
      slug,
    },
    {
      enabled: !!slug,
    }
  );

  const submitResponseMutation = trpc.forms.submitResponse.useMutation();

  const handleChange = (fieldId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emptyRequiredField = form!.fields.find(
      (field) => field.required && !answers[field.id]?.trim()
    );

    if (emptyRequiredField) {
      toast.error(`${emptyRequiredField.label} is required`);

      return;
    }

    try {
      await submitResponseMutation.mutateAsync({
        formId: form!.id,

        answers,
      });

      setSubmitted(true);

      setAnswers({});
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong'
      );
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafaf9] dark:bg-[#09090b]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-zinc-300 border-t-black dark:border-zinc-700 dark:border-t-white" />

          <p className="mt-4 text-sm text-zinc-500">Loading form...</p>
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

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafaf9] px-6 dark:bg-[#09090b]">
        <div className="w-full max-w-xl rounded-[32px] border border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>

          <h1 className="mt-8 font-space-grotesk text-5xl font-bold tracking-tight">
            Response submitted
          </h1>

          <p className="mt-5 text-lg leading-8 text-zinc-500 dark:text-zinc-400">
            Thank you for taking the time to fill out this form.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafaf9] text-zinc-950 dark:bg-[#09090b] dark:text-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200/50 bg-[#fafaf9]/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-[#09090b]/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-orange-500" />

            <h1 className="font-space-grotesk text-xl font-bold">Streamyst</h1>
          </div>

          <ThemeToggle />
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-6 py-20">
        {/* HERO */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            Public Form
          </div>

          <h1 className="mt-8 font-space-grotesk text-6xl font-bold tracking-tight lg:text-7xl">
            {form.title}
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {form.description}
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-16 space-y-8">
          {(form.fields as any[]).map((field, index) => (
            <motion.div
              key={field.id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
              }}
              className="rounded-[32px] border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-start gap-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10 text-sm font-semibold text-orange-500">
                  {index + 1}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <label className="font-space-grotesk text-3xl font-bold tracking-tight">
                      {field.label}
                    </label>

                    {field.required && <span className="text-red-500">*</span>}
                  </div>

                  {field.helperText && (
                    <p className="mt-3 text-zinc-500 dark:text-zinc-400">
                      {field.helperText}
                    </p>
                  )}

                  <div className="mt-6">
                    {field.type === 'short_text' && (
                      <input
                        value={answers[field.id ?? ''] ?? ''}
                        onChange={(e) => handleChange(field.id ?? '', e.target.value)}
                        type="text"
                        placeholder={field.placeholder ?? 'Type your answer...'}
                        className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-lg outline-none transition focus:border-orange-500 dark:border-zinc-800 dark:bg-zinc-950"
                      />
                    )}

                    {field.type === 'email' && (
                      <input
                        value={answers[field.id ?? ''] ?? ''}
                        onChange={(e) => handleChange(field.id ?? '', e.target.value)}
                        type="email"
                        placeholder={field.placeholder ?? 'Enter your email...'}
                        className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-lg outline-none transition focus:border-orange-500 dark:border-zinc-800 dark:bg-zinc-950"
                      />
                    )}

                    {field.type === 'long_text' && (
                      <textarea
                        value={answers[field.id ?? ''] ?? ''}
                        onChange={(e) => handleChange(field.id ?? '', e.target.value)}
                        placeholder={
                          field.placeholder ?? 'Write your response...'
                        }
                        className="min-h-[180px] w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-lg outline-none transition focus:border-orange-500 dark:border-zinc-800 dark:bg-zinc-950"
                      />
                    )}

                    {field.type === 'number' && (
                      <input
                        value={answers[field.id ?? ''] ?? ''}
                        onChange={(e) => handleChange(field.id ?? '', e.target.value)}
                        type="number"
                        placeholder="0"
                        className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-lg outline-none transition focus:border-orange-500 dark:border-zinc-800 dark:bg-zinc-950"
                      />
                    )}

                    {field.type === 'single_select' && (
                      <div className="flex flex-col gap-3">
                        {((field.options as string[] | undefined) ?? ['Option 1', 'Option 2']).map((option, oIdx) => {
                          const isSelected = answers[field.id ?? ''] === option;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() => handleChange(field.id ?? '', option)}
                              className={`flex items-center justify-between w-full rounded-2xl border px-6 py-4 text-left transition select-none cursor-pointer ${
                                isSelected
                                  ? 'border-orange-500 bg-orange-500/5 text-orange-600 dark:text-orange-400'
                                  : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900'
                              }`}
                            >
                              <span className="text-lg font-medium">{option}</span>
                              <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                                isSelected ? 'border-orange-500 bg-orange-500' : 'border-zinc-300 dark:border-zinc-700'
                              }`}>
                                {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {field.type === 'multi_select' && (
                      <div className="flex flex-col gap-3">
                        {((field.options as string[] | undefined) ?? ['Option 1', 'Option 2']).map((option, oIdx) => {
                          const fieldId = field.id ?? '';
                          const currentAnswers = answers[fieldId] ? answers[fieldId].split(', ') : [];
                          const isSelected = currentAnswers.includes(option);
                          
                          const handleToggle = () => {
                            let newAnswers: string[];
                            if (isSelected) {
                              newAnswers = currentAnswers.filter(item => item !== option);
                            } else {
                              newAnswers = [...currentAnswers, option];
                            }
                            handleChange(fieldId, newAnswers.join(', '));
                          };

                          return (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={handleToggle}
                              className={`flex items-center justify-between w-full rounded-2xl border px-6 py-4 text-left transition select-none cursor-pointer ${
                                isSelected
                                  ? 'border-orange-500 bg-orange-500/5 text-orange-600 dark:text-orange-400'
                                  : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900'
                              }`}
                            >
                              <span className="text-lg font-medium">{option}</span>
                              <div className={`h-6 w-6 rounded-md border-2 flex items-center justify-center transition ${
                                isSelected ? 'border-orange-500 bg-orange-500 text-white' : 'border-zinc-300 dark:border-zinc-700'
                              }`}>
                                {isSelected && (
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                  </svg>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {field.type === 'rating' && (
                      <div className="flex items-center gap-3 py-2">
                        {[1, 2, 3, 4, 5].map((stars) => {
                          const currentRating = parseInt(answers[field.id ?? ''] ?? '0');
                          const isHighlighted = stars <= currentRating;
                          return (
                            <button
                              key={stars}
                              type="button"
                              onClick={() => handleChange(field.id ?? '', stars.toString())}
                              className="text-5xl focus:outline-none transition-all hover:scale-125 select-none cursor-pointer"
                            >
                              <span className={isHighlighted ? 'text-orange-500' : 'text-zinc-300 dark:text-zinc-700'}>
                                ★
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {field.type === 'date' && (
                      <input
                        value={answers[field.id ?? ''] ?? ''}
                        onChange={(e) => handleChange(field.id ?? '', e.target.value)}
                        type="date"
                        className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-lg outline-none transition focus:border-orange-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                      />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          <button
            type="submit"
            disabled={submitResponseMutation.isPending}
            className="inline-flex items-center gap-3 rounded-2xl bg-zinc-950 px-8 py-5 text-lg font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {submitResponseMutation.isPending
              ? 'Submitting...'
              : 'Submit Response'}

            <ArrowRight className="h-5 w-5" />
          </button>
        </form>
      </div>
    </main>
  );
}

"use client";

import { use } from "react";
import { useState } from 'react';
import { trpc } from "~/trpc/client";

interface PublicFormPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function PublicFormPage({
  params,
}: PublicFormPageProps) {
  const { slug } = use(params);

  console.log("SLUG:", slug);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const {
    data: form,
    isLoading,
    error,
  } = trpc.forms.getBySlug.useQuery(
    {
      slug,
    },
    {
      enabled: !!slug,
    },
  );

  const handleChange = (fieldId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(answers);
  };

  console.log("FORM:", form);
  console.log("ERROR:", error);

  if (isLoading) {
    return (
      <main className="p-8">
        Loading...
      </main>
    );
  }

  if (!form) {
    return (
      <main className="p-8">
        Form not found
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">{form.title}</h1>

        <p className="mt-2 text-zinc-500">{form.description}</p>
      </div>

      <form 
        onSubmit={handleSubmit}
        className="space-y-6">
        {(form.fields as any[]).map((field) => (
          <div key={field.id}>
            <label className="mb-2 block font-medium">{field.label}</label>

            {field.type === 'short_text' && (
              <input
                value={answers[field.id] ?? ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                type="text"
                placeholder={field.placeholder ?? ''}
                className="w-full rounded-xl border p-3"
              />
            )}

            {field.type === 'email' && (
              <input
                value={answers[field.id] ?? ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                type="email"
                placeholder={field.placeholder ?? ''}
                className="w-full rounded-xl border p-3"
              />
            )}

            {field.type === 'long_text' && (
              <textarea
                placeholder={field.placeholder ?? ''}
                className="min-h-[120px] w-full rounded-xl border p-3"
              />
            )}

            {field.type === 'number' && (
              <input
                value={answers[field.id] ?? ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                type="number"
                className="w-full rounded-xl border p-3"
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          className="rounded-xl bg-black px-6 py-3 text-white"
        >
          Submit Response
        </button>
      </form>
    </main>
  );
}
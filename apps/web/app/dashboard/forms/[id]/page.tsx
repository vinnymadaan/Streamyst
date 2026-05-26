"use client";

import { use } from "react";

import { trpc } from "~/trpc/client";

interface FormEditorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function FormEditorPage({
  params,
}: FormEditorPageProps) {
  const { id } = use(params);

  const { data: form, isLoading } =
    trpc.forms.getById.useQuery({
      id,
    });

  const utils = trpc.useUtils();

  const createFieldMutation =
  trpc.forms.createField.useMutation({
    onSuccess: async () => {
      await utils.forms.getById.invalidate();
    },
  });
  const updateFieldMutation =
  trpc.forms.updateField.useMutation({
    onSuccess: async () => {
      await utils.forms.getById.invalidate();
    },
  });
  const deleteFieldMutation =
  trpc.forms.deleteField.useMutation({
    onSuccess: async () => {
      await utils.forms.getById.invalidate();
    },
  });

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
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-500">
              Form Editor
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              {form.title}
            </h1>

            <p className="mt-3 text-zinc-500">
              {form.description}
            </p>
          </div>

          <button
            onClick={() => {
              createFieldMutation.mutate({
                formId: form.id,

                type: "short_text",

                label: "Untitled Question",

                fieldOrder: 0,
              });
            }}
            className="rounded-xl bg-black px-5 py-3 text-white"
          >
            Add Field
          </button>
        </div>

        <div className="mt-10 space-y-4">
  {(form as any).fields.length === 0 ? (
    <div className="rounded-2xl border p-10">
      <p>No fields added yet.</p>
    </div>
  ) : (
    (form as any).fields.map((field: any) => (
      <div
        key={field.id}
        className="rounded-2xl border p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <input
  defaultValue={field.label}
  onBlur={(e) => {
    updateFieldMutation.mutate({
      fieldId: field.id,

      label: e.target.value,
    });
  }}
  className="w-full bg-transparent text-xl font-semibold outline-none"
/>

<select
  value={field.type}
  onChange={(e) => {
    updateFieldMutation.mutate({
      fieldId: field.id,

      type: e.target.value as
        | "short_text"
        | "long_text"
        | "email"
        | "number",
    });
  }}
  className="mt-3 rounded-lg border px-3 py-2 text-sm"
>
  <option value="short_text">
    Short Text
  </option>

  <option value="long_text">
    Long Text
  </option>

  <option value="email">
    Email
  </option>

  <option value="number">
    Number
  </option>
</select>

            <div className="mt-4">
  {field.type === "short_text" && (
    <input
      disabled
      placeholder="Short text answer"
      className="w-full rounded-xl border px-4 py-3"
    />
  )}

  {field.type === "long_text" && (
    <textarea
      disabled
      placeholder="Long text answer"
      className="min-h-[120px] w-full rounded-xl border px-4 py-3"
    />
  )}

  {field.type === "email" && (
    <input
      disabled
      type="email"
      placeholder="Email answer"
      className="w-full rounded-xl border px-4 py-3"
    />
  )}

  {field.type === "number" && (
    <input
      disabled
      type="number"
      placeholder="Number answer"
      className="w-full rounded-xl border px-4 py-3"
    />
  )}
</div>
          </div>

          <button
            onClick={() => {
              deleteFieldMutation.mutate({
                fieldId: field.id,
              });
            }}
            className="rounded-lg border border-red-500 px-3 py-1 text-sm text-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    ))
  )}
</div>
      </div>
    </main>
  );
}
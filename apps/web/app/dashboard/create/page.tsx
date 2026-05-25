"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { trpc } from "@/trpc/client";

export default function CreateFormPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const createForm = trpc.forms.create.useMutation({
    onSuccess: (data:any) => {
      console.log(data);

      router.push("/dashboard");
    },
  });

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    createForm.mutate({
      title,
      description,
    });
  };

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold">
          Create Form
        </h1>

        <p className="mt-2 text-zinc-500">
          Start building your form
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Title
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full rounded-xl border px-4 py-3"
              placeholder="Enter form title"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="min-h-[120px] w-full rounded-xl border px-4 py-3"
              placeholder="Enter form description"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-black px-6 py-3 text-white"
          >
            {createForm.isPending
              ? "Creating..."
              : "Create Form"}
          </button>
        </form>
      </div>
    </main>
  );
}
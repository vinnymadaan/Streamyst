'use client';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;

  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold">Something went wrong</h1>

        <p className="mt-4 text-zinc-500">{error.message}</p>

        <button
          onClick={() => reset()}
          className="mt-6 rounded-xl bg-black px-5 py-3 text-white"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}

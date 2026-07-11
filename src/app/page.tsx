export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Paycon
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          AI-powered group savings on Celo.
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Ajo · Goal Pools · Emergency Funds
        </p>
        <div className="mt-8 flex gap-4">
          <span className="rounded-xl border border-gray-700 px-4 py-2 text-sm text-gray-400">
            🚧 Building in progress
          </span>
        </div>
      </div>
    </main>
  );
}

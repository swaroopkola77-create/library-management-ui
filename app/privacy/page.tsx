export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
      <p className="text-xs uppercase tracking-[0.25em] text-accent">Legal</p>
      <h1 className="mt-4 font-display text-7xl leading-none sm:text-9xl">PRIVACY.</h1>
      <div className="mt-10 space-y-8 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
        <section>
          <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Data collected</h2>
          <p className="mt-2">This interface only sends book-management requests to the configured library API. Add your institution-specific privacy notice here before public launch.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Contact</h2>
          <p className="mt-2">Replace this section with the library administrator or institution contact details.</p>
        </section>
      </div>
    </div>
  );
}

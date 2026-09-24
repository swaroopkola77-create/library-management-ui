export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
      <p className="text-xs uppercase tracking-[0.25em] text-accent">Legal</p>
      <h1 className="mt-4 font-display text-7xl leading-none sm:text-9xl">TERMS.</h1>
      <div className="mt-10 space-y-8 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
        <section>
          <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Use of the catalog</h2>
          <p className="mt-2">Catalog availability is provided by the library backend. Institutional borrowing rules, fees, and account requirements remain authoritative.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Administration</h2>
          <p className="mt-2">Administrative write access should remain disabled until backend authentication and authorization are implemented.</p>
        </section>
      </div>
    </div>
  );
}

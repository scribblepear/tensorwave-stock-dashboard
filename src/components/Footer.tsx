export function Footer(): React.ReactElement {
  return (
    <footer className="relative z-10 border-t border-border bg-background">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row">
        <p>Powered by Alpha Vantage · Built with Next.js</p>
        <p>Market data may be delayed</p>
      </div>
    </footer>
  );
}

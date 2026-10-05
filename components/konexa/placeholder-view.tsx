export function PlaceholderView({ title, description }: { title: string; description: string }) {
  return (
    <section className="glass rounded-3xl p-10 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon-teal">Konexa Module</p>
      <h1 className="mt-3 font-heading text-3xl font-extrabold text-foreground">{title}</h1>
      <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">{description}</p>
      <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
        Coming in a later phase
      </p>
    </section>
  )
}

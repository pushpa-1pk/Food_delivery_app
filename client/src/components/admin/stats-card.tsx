type Props = {
  title: string;
  value: string;
  subtitle: string;
};

export function StatsCard({ title, value, subtitle }: Props) {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-soft">
      <p className="text-sm uppercase tracking-[0.2em] text-stone-500">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-stone-900">{value}</p>
      <p className="mt-2 text-sm leading-6 text-stone-600">{subtitle}</p>
    </div>
  );
}

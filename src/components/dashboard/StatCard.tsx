import type {
  LucideIcon,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconClassName: string;
  iconBackground: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  iconClassName,
  iconBackground,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_4px_12px_rgba(15,23,42,0.02)] transition hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
      <div className="mb-4">
        <div
          className={`inline-flex rounded-lg p-2 ${iconBackground} ${iconClassName}`}
        >
          <Icon size={22} />
        </div>
      </div>

      <h3 className="text-base text-[#64748b]">
        {title}
      </h3>

      <p className="font-heading mt-1 text-5xl font-bold tracking-tight text-[#0f172a]">
        {value}
      </p>
    </div>
  );
}
import type { ReactNode } from "react";

export function AdminField({
  label,
  hint,
  children,
  className = ""
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`space-y-2 ${className}`}>
      <div className="space-y-1">
        <span className="block text-sm font-semibold text-slate-900">{label}</span>
        {hint ? <span className="block text-xs leading-5 text-slate-500">{hint}</span> : null}
      </div>
      {children}
    </label>
  );
}

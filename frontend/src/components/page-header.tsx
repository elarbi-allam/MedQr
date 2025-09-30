import { ReactNode } from "react";

export default function PageHeader({
  icon,
  title,
  description,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-center gap-4">
      {/* Affiche l'icône seulement si elle est fournie */}
      {icon && (
        <span className="hidden sm:flex items-center justify-center rounded-lg bg-brand/10 p-3 text-brand">
          {icon}
        </span>
      )}
      <div className="flex flex-col gap-0.5">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {/* Affiche la description seulement si elle est fournie */}
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}

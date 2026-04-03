import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export function WorkspacePlaceholder({
  eyebrow,
  title,
  description,
  highlights,
}: {
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
}) {
  return (
    <div className="grid gap-6">
      <Card className="animate-fade-up p-6 lg:p-8">
        <Badge>{eyebrow}</Badge>
        <CardTitle className="mt-4 text-3xl">{title}</CardTitle>
        <CardDescription className="mt-3 max-w-2xl">{description}</CardDescription>
      </Card>

      <div className="grid gap-5 md:grid-cols-3">
        {highlights.map((highlight, index) => (
          <Card
            key={highlight}
            className="animate-fade-up p-6"
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
              Block {index + 1}
            </p>
            <CardDescription className="mt-4">{highlight}</CardDescription>
          </Card>
        ))}
      </div>
    </div>
  );
}

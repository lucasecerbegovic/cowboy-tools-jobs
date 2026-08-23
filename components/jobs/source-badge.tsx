import type { JobSource } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { sourceLabel } from "@/lib/format";

export function SourceBadge({ source }: { source: JobSource }) {
  const label = sourceLabel(source);
  const variant = source === "employer" ? "default" : "outline";
  return <Badge variant={variant}>{label}</Badge>;
}

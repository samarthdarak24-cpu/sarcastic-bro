import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("skeleton-shimmer rounded-md bg-neut-200/60 dark:bg-neut-800", className)}
      {...props}
    />
  )
}

export { Skeleton }

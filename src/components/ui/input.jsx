import { cn } from '../../lib/utils';
export function Input({ className, ...props }) {
  return (
    <input
      className={cn('flex h-9 w-full rounded-md border border-input bg-card px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', className)}
      {...props}
    />
  );
}

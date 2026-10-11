import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-4', {
  variants: {
    variant: {
      outline: 'border-border text-muted-foreground',
      freelance: 'border-freelance/30 bg-freelance/10 text-freelance',
      permanent: 'border-permanent/30 bg-permanent/10 text-permanent',
      new: 'border-primary/30 bg-primary/10 text-primary',
    },
  },
  defaultVariants: { variant: 'outline' },
});

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

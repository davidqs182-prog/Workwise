import { cn } from '../../lib/utils';

// Control segmentado al estilo shadcn Tabs/ToggleGroup.
export function Segmented({ value, onChange, options, label, className }) {
  return (
    <div role="radiogroup" aria-label={label} className={cn('inline-flex rounded-md border border-input bg-muted p-0.5', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'whitespace-nowrap rounded-[5px] px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            value === o.value ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {o.label}
          {o.count !== undefined && <span className="tabular ml-1.5 text-xs text-muted-foreground">{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export const Select = ({ onValueChange, children, defaultValue }: any) => {
  const [value, setValue] = React.useState(defaultValue || "");
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (val: string) => {
    setValue(val);
    onValueChange?.(val);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      {React.Children.map(children, (child: any) => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            value,
            onClick: () => setIsOpen(!isOpen),
          });
        }
        if (child.type === SelectContent && isOpen) {
          return React.cloneElement(child, {
            onSelect: handleSelect,
            onClose: () => setIsOpen(false),
          });
        }
        return null;
      })}
    </div>
  );
};

export const SelectTrigger = ({ className, children, value, onClick }: any) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "flex h-12 w-full items-center justify-between rounded-xl border border-[var(--border-strong)] bg-white px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--brand-300)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
  >
    {value || children}
    <ChevronDown className="h-4 w-4 opacity-50" />
  </button>
);

export const SelectValue = ({ placeholder, value }: any) => (
  <span>{value || placeholder}</span>
);

export const SelectContent = ({ children, onSelect, onClose }: any) => (
  <>
    <div className="fixed inset-0 z-50 overflow-hidden" onClick={onClose} />
    <div className="absolute top-full left-0 z-50 mt-2 min-w-[8rem] overflow-hidden rounded-xl border border-[var(--border-strong)] bg-white text-popover-foreground shadow-lg animate-in fade-in zoom-in-95 w-full">
      <div className="p-1">
        {React.Children.map(children, (child: any) =>
          React.cloneElement(child, {
            onClick: () => onSelect(child.props.value),
          })
        )}
      </div>
    </div>
  </>
);

export const SelectItem = ({ className, children, onClick }: any) => (
  <div
    onClick={onClick}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-[var(--card)] focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      {/* Selection indicator if needed */}
    </span>
    {children}
  </div>
);

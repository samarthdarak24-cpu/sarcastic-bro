import * as React from "react";
import { cn } from "@/lib/utils";

const Form = ({ children, ...props }: any) => <form {...props}>{children}</form>;

const FormField = ({ control, name, render }: any) => {
  const value = control._getWatch(name);
  const onChange = (val: any) => control._setValue(name, val);
  return render({ field: { name, value, onChange } });
};

const FormItem = ({ className, children, ...props }: any) => (
  <div className={cn("space-y-2", className)} {...props}>
    {children}
  </div>
);

const FormLabel = ({ className, ...props }: any) => (
  <label
    className={cn(
      "text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[var(--text-primary)]",
      className
    )}
    {...props}
  />
);

const FormControl = ({ children }: any) => (
  <div className="relative mt-2">{children}</div>
);

const FormDescription = ({ className, ...props }: any) => (
  <p
    className={cn("text-xs text-muted-foreground opacity-70", className)}
    {...props}
  />
);

const FormMessage = ({ className, children, ...props }: any) => {
  if (!children) return null;
  return (
    <p
      className={cn("text-xs font-medium text-red-500", className)}
      {...props}
    >
      {children}
    </p>
  );
};

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
};

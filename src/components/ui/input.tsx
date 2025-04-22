import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, disabled, className, ...props }, ref) => {
    const base = "flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    const errorCls = error ? "border-destructive focus-visible:ring-destructive" : "border-input"
    const disabledCls = disabled ? "cursor-not-allowed opacity-50" : ""

    return (
      <div className="w-full">
        <input
          ref={ref}
          disabled={disabled}
          className={cn(base, errorCls, disabledCls, className)}
          {...props}
        />
        {error && typeof error === "string" && (
          <p className="mt-1 text-xs text-destructive">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }

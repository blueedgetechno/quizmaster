import * as React from "react"

import { cn } from "@/lib/utils"
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

const NumInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    return (
      <span className="flex items-center gap-x-1">
        <button
          type="button"
          className="border rounded-md bg-muted h-5 px-0.5"
          onClick={() => inputRef.current && inputRef.current.stepDown()}>
          <MinusIcon width={16} />
        </button>
        <input
          type="number"
          className={cn(
            "flex h-9 w-full text-center rounded-md bg-transparent p-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={inputRef || ref}
          {...props}
        />
        <button
          type="button"
          className="border rounded-md bg-muted h-5 px-0.5"
          onClick={() => inputRef.current && inputRef.current.stepUp()}>
          <PlusIcon width={16} />
        </button>
      </span>
    )
  }
)
NumInput.displayName = "NumInput"

export { Input, NumInput }

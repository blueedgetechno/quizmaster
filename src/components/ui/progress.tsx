"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { indicatorClassName?: string }
>(({ className, indicatorClassName, value, ...props }, ref) => {
  const [pValue, setPValue] = React.useState(0)
  const [timeStarted,] = React.useState(Date.now())

  React.useEffect(() => {
    const interval = setInterval(() => {
      const timeNow = Date.now()
      const timeDiff = (timeNow - timeStarted) / 1000
      const value = 100 * (1 - (1 / (Math.pow(2, 0.4 * Math.sqrt(timeDiff)))))

      setPValue(Number(value.toFixed(2)))
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={
          cn(
            "h-full w-full flex-1 bg-primary transition-transform duration-500",
            indicatorClassName
          )
        }
        style={{ transform: `translateX(-${100 - (value || pValue || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}
)
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }

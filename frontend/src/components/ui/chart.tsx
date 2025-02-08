import { cn } from "@/lib/utils"
import { TooltipProps, ContentType } from "recharts"
import { ReactNode } from "react"

export type ChartConfig = {
  [key: string]: {
    label: string
    color: string
  }
}

export function ChartContainer({
  config,
  children,
  className,
}: {
  config: ChartConfig
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative h-[350px] w-full",
        className
      )}
    >
      <style>
        {Object.entries(config).map(([key, value]) => {
          return `
            :root {
              --color-${key}: ${value.color};
            }
          `
        })}
      </style>
      {children}
    </div>
  )
}

export function ChartTooltip({
  active,
  payload,
  label,
  content,
  ...props
}: TooltipProps<any, any>) {
  if (!active || !payload?.length) {
    return null
  }

  if (content) {
    return content as ReactNode
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col">
          <span className="text-[0.70rem] uppercase text-muted-foreground">
            {label}
          </span>
          <span className="font-bold text-muted-foreground">
            {payload[0].value}
          </span>
        </div>
      </div>
    </div>
  )
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel = false,
}: TooltipProps<any, any> & { hideLabel?: boolean }) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-lg bg-black/80 p-2 shadow-sm backdrop-blur-xl border border-white/10">
      <div className="grid gap-0.5">
        {!hideLabel && (
          <span className="text-[0.70rem] text-white/60">{label}</span>
        )}
        {payload.map((item: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: item.color || item.fill }}
            />
            <span className="text-sm font-medium text-white">
              {item.value} {item.name && `(${item.name})`}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
} 
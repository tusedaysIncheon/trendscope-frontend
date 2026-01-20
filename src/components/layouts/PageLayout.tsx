import { cn } from "@/lib/utils"

type PageLayoutVariant = "centered" | "top"
const variantClasses: Record<PageLayoutVariant, string> = {
  centered: "items-center justify-center",
  top: "items-stretch justify-start",
}

const predefinedWidthClasses = {
  full: "max-w-full",
  sm: "max-w-sm",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
} as const

type PredefinedWidth = keyof typeof predefinedWidthClasses
type PageLayoutWidth = PredefinedWidth | (string & {})

export interface PageLayoutProps extends React.ComponentProps<"section"> {
  variant?: PageLayoutVariant
  contentWidth?: PageLayoutWidth
  contentClassName?: string
  noContentWrapper?: boolean
}

export function PageLayout({
  children,
  variant = "centered",
  contentWidth = "full",
  contentClassName,
  className,
  noContentWrapper = false,
  ...sectionProps
}: PageLayoutProps) {
  const widthClass =
    predefinedWidthClasses[contentWidth as PredefinedWidth] ?? contentWidth

  const inner = noContentWrapper ? (
    children
  ) : (
    // [수정 완료] mx-auto 추가!
    // 태블릿에서 max-w-2xl 등으로 폭이 제한될 때, 자동으로 화면 중앙에 오게 만듭니다.
    <div className={cn("flex w-full flex-col gap-6 mx-auto", widthClass, contentClassName)}>
      {children}
    </div>
  )

  return (
    <section
      data-slot="page-layout"
      className={cn(
        "flex flex-1 flex-col px-6 py-12 transition-[padding] duration-300",
        variant === "centered" ? "min-h-[100dvh]" : "min-h-0",
        variantClasses[variant],
        className
      )}
      {...sectionProps}
    >
      {inner}
    </section>
  )
}
import { SidebarTrigger } from "@/components/ui/sidebar"

type PageHeaderProps = {
  title: string
  children?: React.ReactNode
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b lg:p-6 bg-card">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl font-headline">{title}</h1>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}

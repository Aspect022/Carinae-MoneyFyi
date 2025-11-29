import { DashboardLayout } from '@/components/dashboard-layout'

export default function HelpLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}

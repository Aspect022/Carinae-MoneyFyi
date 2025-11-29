import { DashboardLayout } from '@/components/dashboard-layout'

export default function TransactionsLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}

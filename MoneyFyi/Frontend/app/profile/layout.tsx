import { DashboardLayout } from '@/components/dashboard-layout'

export default function ProfileLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}

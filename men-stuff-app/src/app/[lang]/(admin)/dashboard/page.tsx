import { labels } from '@/lib/labels'
import DashboardDashboardClient from './_components/DashboardDashboardClient'

export default function AdminDashboardPage() {
  return <DashboardDashboardClient labels={labels.admin} />
}

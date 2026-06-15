import { Plus, CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { StatCards } from "@/components/dashboard/StatCards";
import { PatientRiskAnalytics } from "@/components/dashboard/PatientRiskAnalytics";
import { PatientStatistics } from "@/components/dashboard/PatientStatistics";
import { AppointmentOverview } from "@/components/dashboard/AppointmentOverview";
import { AppointmentCalendar } from "@/components/dashboard/AppointmentCalendar";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome back — here's what's happening across SafeMed today."
        actions={
          <>
            <Button variant="success">
              <Plus size={16} />
              Add New Appointment
            </Button>
            <div className="flex items-center gap-1.5 rounded-xl border border-border bg-bg-surface px-3 py-2 text-sm font-medium text-ink-muted">
              <CalendarDays size={15} />
              16 Feb, 2025
            </div>
          </>
        }
      />

      <div className="space-y-4 px-4 lg:px-6">
        <StatCards />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <PatientRiskAnalytics />
          <PatientStatistics />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AppointmentOverview />
          </div>
          <AppointmentCalendar />
        </div>
      </div>
    </>
  );
}

import WorkspaceButton from "./workspace-button"
import ScheduleButton from "./schedule-button"
import JobButton from "./job-button"
import PayrollButton from "./payroll-button"

export default function TopLeftTools() {
  return (
    <div className="flex flex-row items-center gap-x-2">
      <WorkspaceButton />
      <ScheduleButton />
      <JobButton />
      <PayrollButton />
    </div>
  )
}
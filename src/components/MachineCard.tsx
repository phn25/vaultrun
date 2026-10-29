import type { Machine, MachineStatus } from "@/data/machines";

const statusStyles: Record<MachineStatus, string> = {
  active: "bg-green-100 text-green-800",
  "needs-service": "bg-yellow-100 text-yellow-800",
  offline: "bg-red-100 text-red-800",
};

const statusLabels: Record<MachineStatus, string> = {
  active: "Active",
  "needs-service": "Needs service",
  offline: "Offline",
};

export function MachineCard({ machine }: { machine: Machine }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 text-gray-900 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{machine.name}</h2>
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyles[machine.status]}`}>
          {statusLabels[machine.status]}
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-600">
        {machine.area} · {machine.model}
      </p>
      <p className="mt-3 text-sm">
        Target float: <span className="font-medium">${machine.targetFloat.toLocaleString()}</span>
      </p>
    </div>
  );
}
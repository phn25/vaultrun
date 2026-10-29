import { MachineCard } from "@/components/MachineCard";
import { machines } from "@/data/machines";

export default function MachinesPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 text-gray-900 sm:p-8">
      <h1 className="text-2xl font-bold">Machines</h1>
      <p className="mt-1 text-sm text-gray-600">{machines.length} machines</p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {machines.map((m) => (
          <MachineCard key={m.id} machine={m} />
        ))}
      </div>
    </main>
  );
}
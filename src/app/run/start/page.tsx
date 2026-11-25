export default function StartTodayPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 text-gray-900 sm:p-8">
      <h1 className="text-2xl font-bold">Start today</h1>

      <form className="mt-6 flex max-w-sm flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Starting odometer</span>
          <input
            name="startOdometer"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            required
            className="rounded-lg border border-gray-300 bg-white p-3 text-lg"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Cash from home ($)</span>
          <input
            name="cashFromHome"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            required
            className="rounded-lg border border-gray-300 bg-white p-3 text-lg"
          />
        </label>

        <button
          type="submit"
          className="rounded-lg bg-amber-400 p-3 text-lg font-semibold text-gray-900 hover:bg-amber-500"
        >
          Start today
        </button>
      </form>
    </main>
  );
}

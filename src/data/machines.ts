export type MachineStatus = "active" | "needs-service" | "offline";

export type Machine = {
  id: string;
  name: string;
  area: "North" | "South";
  model: "Hyosung Halo II" | "Genmega G2500";
  status: MachineStatus;
  targetFloat: number; // dollars
};

// Fake data only. Real names and locations never go in this repo.
export const machines: Machine[] = [
  { id: "m01", name: "Machine 01", area: "North", model: "Hyosung Halo II", status: "active", targetFloat: 8000 },
  { id: "m02", name: "Machine 02", area: "North", model: "Genmega G2500", status: "active", targetFloat: 8000 },
  { id: "m03", name: "Machine 03", area: "North", model: "Hyosung Halo II", status: "needs-service", targetFloat: 8000 },
  { id: "m04", name: "Machine 04", area: "North", model: "Genmega G2500", status: "active", targetFloat: 6000 },
  { id: "m05", name: "Machine 05", area: "North", model: "Hyosung Halo II", status: "active", targetFloat: 8000 },
  { id: "m06", name: "Machine 06", area: "North", model: "Genmega G2500", status: "offline", targetFloat: 8000 },
  { id: "m07", name: "Machine 07", area: "North", model: "Hyosung Halo II", status: "active", targetFloat: 10000 },
  { id: "m08", name: "Machine 08", area: "South", model: "Genmega G2500", status: "active", targetFloat: 8000 },
  { id: "m09", name: "Machine 09", area: "South", model: "Hyosung Halo II", status: "active", targetFloat: 8000 },
  { id: "m10", name: "Machine 10", area: "South", model: "Genmega G2500", status: "needs-service", targetFloat: 6000 },
  { id: "m11", name: "Machine 11", area: "South", model: "Hyosung Halo II", status: "active", targetFloat: 8000 },
  { id: "m12", name: "Machine 12", area: "South", model: "Genmega G2500", status: "active", targetFloat: 8000 },
  { id: "m13", name: "Machine 13", area: "South", model: "Hyosung Halo II", status: "active", targetFloat: 8000 },
  { id: "m14", name: "Machine 14", area: "South", model: "Genmega G2500", status: "active", targetFloat: 8000 },
];
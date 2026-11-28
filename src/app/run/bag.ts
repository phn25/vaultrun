import type { CashMove } from "@/db/schema";

// Cash in the bag = money moved into the run − money moved out of it
export function cashInBag(moves: CashMove[]) {
  return moves.reduce((total, move) => {
    if (move.toPlace === "run") return total + move.amount;
    if (move.fromPlace === "run") return total - move.amount;
    return total;
  }, 0);
}

export function calculateFloorMAR(floorMAR: number, totalUsers: number): number {
  return Math.round(floorMAR / totalUsers);
}

export function calculateMaxMAR(totalValue: number, avgValue: number): number {
  return Math.round(totalValue / avgValue);
}

interface MARResult {
  currentMAR: number;
  remainingMAR: number;
  reachedLimit: boolean;
}

interface AdjustedMARResult {
  adjustedMarginMAR: number;
  reachedLimit: boolean;
}

export function calculateCurrentMAR(
  maxMAR: number,
  ceilingMAR: number,
  totalUsers: number,
  currentCredit: number,
  numofMAR: number
): MARResult {
  const floorMAR = calculateFloorMAR(ceilingMAR, totalUsers);
  const currentMAR = floorMAR + currentCredit * numofMAR;
  const remainingMAR = ceilingMAR - currentMAR;
  const reachedLimit = currentMAR > maxMAR;
  
  return {
    currentMAR: Number(currentMAR.toFixed(2)),
    remainingMAR: Number(remainingMAR.toFixed(2)),
    reachedLimit
  };
}

export function calculateAdjustedMarginMAR(
  maxMAR: number,
  currentTotalMAR: number,
  adjustedMAR: number
): AdjustedMARResult {
  const adjustedMarginMAR = maxMAR - currentTotalMAR;
  const reachedLimit = adjustedMarginMAR <= adjustedMAR;
  
  return {
    adjustedMarginMAR: Number(adjustedMarginMAR.toFixed(2)),
    reachedLimit
  };
}

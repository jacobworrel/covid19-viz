export function calcAvgGrowthRate (past, present, n) {
  if (past === 0) {
    return null;
  }

  return ((Math.pow(present / past, 1 / n) - 1) * 100).toFixed(2);
}

export function calcGrowthRate (past, present) {
  if (past === 0) {
    return null;
  }

  return (((present - past) / past) * 100).toFixed(2);
}
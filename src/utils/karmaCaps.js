export function getMaxKarmaCaps(luckScore = 0) {
  return luckScore >= 10 ? 2 : 1;
}

export function ensureKarmaCaps(entity = {}) {
  const max = getMaxKarmaCaps(entity.luc ?? entity.luck ?? 0);
  const flipped = Math.max(0, Math.min(entity.karmaCapsFlipped ?? 0, max));

  return {
    ...entity,
    karmaCapsMax: max,
    karmaCapsFlipped: flipped,
    karmaCapsAvailable: max - flipped
  };
}

export function flipKarmaCap(entity = {}) {
  const next = ensureKarmaCaps(entity);
  if (next.karmaCapsAvailable <= 0) return next;

  return ensureKarmaCaps({
    ...next,
    karmaCapsFlipped: next.karmaCapsFlipped + 1
  });
}

export function restoreKarmaCap(entity = {}) {
  const next = ensureKarmaCaps(entity);
  if (next.karmaCapsFlipped <= 0) return next;

  return ensureKarmaCaps({
    ...next,
    karmaCapsFlipped: next.karmaCapsFlipped - 1
  });
}

export function onNaturalOneWithFlippedCap(entity = {}) {
  return restoreKarmaCap(entity);
}

export function onEnemyCriticalAgainstFlippedCap(entity = {}) {
  return restoreKarmaCap(entity);
}

export function shouldAiFlipKarmaCap({
  availableCaps = 0,
  roll = 0,
  target = 0,
  incomingCritical = false
} = {}) {
  if (availableCaps <= 0) return false;
  if (incomingCritical) return true;
  return roll < target;
}
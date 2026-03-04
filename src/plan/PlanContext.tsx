import { useState, useCallback, type ReactNode } from 'react';
import { PLANS, type PlanTier } from './plans';
import { PlanCtx } from './context';

const LS_KEY = 'complianceos_plan';

function loadTier(): PlanTier {
  try {
    const stored = localStorage.getItem(LS_KEY);
    if (stored === 'pro') return 'pro';
  } catch {
    /* noop */
  }
  return 'free';
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const [tier, setTierState] = useState<PlanTier>(loadTier);

  const setPlan = useCallback((t: PlanTier) => {
    setTierState(t);
    try {
      localStorage.setItem(LS_KEY, t);
    } catch {
      /* noop */
    }
  }, []);

  const plan = PLANS[tier];

  const hasFeature = useCallback(
    (feature: keyof (typeof plan)['features']) => plan.features[feature],
    [plan],
  );

  const canAdd = useCallback(
    (current: number, limitKey: keyof (typeof plan)['limits']) => current < plan.limits[limitKey],
    [plan],
  );

  return <PlanCtx.Provider value={{ tier, plan, setPlan, hasFeature, canAdd }}>{children}</PlanCtx.Provider>;
}

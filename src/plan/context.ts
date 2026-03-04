import { createContext } from 'react';
import type { PlanTier, PlanDefinition } from './plans';

export interface PlanContextValue {
  tier: PlanTier;
  plan: PlanDefinition;
  setPlan: (tier: PlanTier) => void;
  /** Check if a feature is available on the current plan */
  hasFeature: (feature: keyof PlanDefinition['features']) => boolean;
  /** Check if adding one more would exceed the limit */
  canAdd: (current: number, limitKey: keyof PlanDefinition['limits']) => boolean;
}

export const PlanCtx = createContext<PlanContextValue | null>(null);

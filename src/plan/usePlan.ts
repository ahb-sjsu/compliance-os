import { useContext } from 'react';
import { PlanCtx } from './context';

export function usePlan() {
  const ctx = useContext(PlanCtx);
  if (!ctx) throw new Error('usePlan must be used within PlanProvider');
  return ctx;
}

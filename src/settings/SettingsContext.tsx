import { useState, useEffect, type ReactNode } from 'react';
import type { AppSettings } from '../types/settings';
import { DEFAULTS, SETTINGS_KEY } from './settingsDefaults';
import { SettingsCtx } from './context';

function loadSettings(): AppSettings {
  try {
    const s = localStorage.getItem(SETTINGS_KEY);
    return s ? { ...DEFAULTS, ...JSON.parse(s) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

function persistSettings(s: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {
    /* noop */
  }
}

function applySettingsToDOM(s: AppSettings): void {
  const root = document.documentElement;
  root.style.setProperty('--ink', s.accentColor);
  const fsMap: Record<string, string> = { compact: '11px', normal: '13px', comfortable: '15px' };
  document.body.style.fontSize = fsMap[s.fontSize] || '13px';
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  useEffect(() => {
    applySettingsToDOM(settings);
  }, [settings]);

  const update = (patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      persistSettings(next);
      return next;
    });
  };

  const reset = () => {
    persistSettings(DEFAULTS);
    setSettings({ ...DEFAULTS });
  };

  return <SettingsCtx.Provider value={{ settings, update, reset }}>{children}</SettingsCtx.Provider>;
}

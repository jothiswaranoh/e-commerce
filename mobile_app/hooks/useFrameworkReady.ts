import { useEffect } from 'react';

export function useFrameworkReady() {
  useEffect(() => {
    const g = globalThis as { frameworkReady?: () => void };
    if (g.frameworkReady) {
      g.frameworkReady();
    }
  });
}

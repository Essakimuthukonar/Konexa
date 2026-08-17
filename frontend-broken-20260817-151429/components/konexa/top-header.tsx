'use client';

import { useStore } from '@/lib/store';
import { Bell, Settings, Search } from 'lucide-react';

export function TopHeader() {
  const { setCommandPaletteOpen } = useStore();

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <div className="font-display font-bold text-2xl tracking-wider text-white">
          KONEXA COMMAND CENTER
        </div>
        <div className="text-xs text-gold-600 font-mono mt-1">
          Enterprise DevOps Operations Platform
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="glass-hover glass hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground"
        >
          <Search className="w-4 h-4" />
          <span className="text-xs">⌘K</span>
        </button>

        <button className="glass-hover glass p-2.5 rounded-lg relative">
          <Bell className="w-5 h-5" />
          <div className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full" />
        </button>

        <button className="glass-hover glass p-2.5 rounded-lg">
          <Settings className="w-5 h-5" />
        </button>

        <div className="glass rounded-full w-10 h-10 flex items-center justify-center text-sm font-semibold text-gold-400">
          EK
        </div>
      </div>
    </div>
  );
}

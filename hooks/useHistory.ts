import { useState, useCallback } from 'react';

export interface HistoryResult<T> {
  state: T;
  set: (newState: T) => void;
  push: (newState: T) => void; // Explicitly save a checkpoint
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  reset: (initialState: T) => void;
}

export function useHistory<T>(initialState: T): HistoryResult<T> {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [index, setIndex] = useState(0);

  // Derived state
  const state = history[index];

  const set = useCallback((newState: T) => {
    // Update the current state in place without pushing to history stack
    // This allows typing without creating 100 history entries
    setHistory(prev => {
      const newHistory = [...prev];
      newHistory[index] = newState;
      return newHistory;
    });
  }, [index]);

  const push = useCallback((newState: T) => {
    setHistory(prev => {
      // Slice history to current index (removes future if we are in middle of stack)
      const upToCurrent = prev.slice(0, index + 1);
      // Only push if different (simple shallow check or JSON check could go here)
      return [...upToCurrent, newState];
    });
    setIndex(prev => prev + 1);
  }, [index]);

  const undo = useCallback(() => {
    setIndex(prev => (prev > 0 ? prev - 1 : prev));
  }, []);

  const redo = useCallback(() => {
    setHistory(prev => {
      // Logic relies on index, but we need access to history length inside setter?
      // Actually setIndex is safer to verify bounds outside or via index state.
      // But we can't access `history` state inside `setIndex` callback easily without ref.
      // So we just check bounds in render or passed handlers.
      return prev;
    });
    setIndex(prev => (prev < history.length - 1 ? prev + 1 : prev));
  }, [history.length]);

  const reset = useCallback((initialState: T) => {
    setHistory([initialState]);
    setIndex(0);
  }, []);

  return {
    state,
    set,
    push,
    undo,
    redo,
    canUndo: index > 0,
    canRedo: index < history.length - 1,
    reset
  };
}
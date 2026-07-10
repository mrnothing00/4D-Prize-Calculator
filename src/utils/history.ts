import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BetType } from './calculator';

const STORAGE_KEY = '@my4dcalc_history';
const MAX_ENTRIES = 50;

export interface HistoryEntry {
  id: string;
  number: string;
  betType: BetType;
  bigAmount: number;
  smallAmount: number;
  timestamp: number;
}

export async function loadHistory(): Promise<HistoryEntry[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export async function addHistoryEntry(
  entry: Omit<HistoryEntry, 'id' | 'timestamp'>,
): Promise<HistoryEntry[]> {
  const history = await loadHistory();
  const newEntry: HistoryEntry = {
    ...entry,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    timestamp: Date.now(),
  };
  const updated = [newEntry, ...history].slice(0, MAX_ENTRIES);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

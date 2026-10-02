export type UserRole = 'owner' | 'tech' | 'admin';

export interface User {
  email: string;
  role: UserRole;
  name: string;
}

export interface Foundry {
  id: string;
  name: string;
  lat: number;
  lng: number;
  kWhPerTonneMelted: number;
  yieldPct: number;
  energyPerGoodTonne: number;
  tonnesMelted: number;
  totalKWh: number;
  issue: string;
  status: 'optimal' | 'warning' | 'critical';
}

export interface ActionItem {
  id: string;
  priority: number;
  title: string;
  description: string;
  category: string;
  savingPerMonth: number;
  effort: 'Low' | 'Medium' | 'High';
  risk: 'None' | 'Low' | 'Medium' | 'High';
  confidence: number;
  foundryId: string;
  icon: string;
}

export interface BatchEntry {
  id: string;
  timestamp: number;
  date: string;
  shift: string;
  furnaceId: string;
  tonnesMelted: number;
  acceptedTonnes: number;
  rejectedTonnes: number;
  kwhReading: number;
  downtimeReason: string;
  synced: boolean;
}

export interface VerificationPoint {
  week: number;
  label: string;
  energyPerGoodTonne: number;
  event?: string;
}

import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Navigation,
  PauseCircle,
  ShieldAlert,
  Truck,
  Wifi,
  WifiOff,
} from 'lucide-react';
import {
  IncidentSeverity,
  IncidentStatus,
  ShipmentStatus,
} from '../../data/aetherCatalog';
import { DeviceConnectionState } from '../../utils/aetherEngine';

type AetherBadgeType =
  | ShipmentStatus
  | IncidentStatus
  | IncidentSeverity
  | DeviceConnectionState
  | 'recovered';

const MAP: Record<
  AetherBadgeType,
  {
    label: string;
    cls: string;
    Icon: React.ComponentType<{ className?: string }>;
  }
> = {
  unassigned: {
    label: 'Unassigned',
    cls: 'bg-slate-100 text-slate-700 border-slate-300',
    Icon: PauseCircle,
  },
  assigned: {
    label: 'Assigned',
    cls: 'bg-sky-50 text-sky-800 border-sky-200',
    Icon: Clock,
  },
  in_transit: {
    label: 'In Transit',
    cls: 'bg-cyan-950/85 text-cyan-200 border-cyan-500/40',
    Icon: Navigation,
  },
  delayed: {
    label: 'Delayed',
    cls: 'bg-amber-50 text-amber-900 border-amber-300',
    Icon: AlertTriangle,
  },
  arrived: {
    label: 'Arrived (POD Pending)',
    cls: 'bg-indigo-50 text-indigo-900 border-indigo-200',
    Icon: Truck,
  },
  delivered: {
    label: 'Delivered',
    cls: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    Icon: CheckCircle2,
  },
  open: {
    label: 'Open',
    cls: 'bg-rose-50 text-rose-800 border-rose-300',
    Icon: ShieldAlert,
  },
  acknowledged: {
    label: 'Acknowledged',
    cls: 'bg-amber-50 text-amber-900 border-amber-300',
    Icon: AlertTriangle,
  },
  in_progress: {
    label: 'In Progress',
    cls: 'bg-sky-50 text-sky-900 border-sky-300',
    Icon: Clock,
  },
  resolved: {
    label: 'Resolved',
    cls: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    Icon: CheckCircle2,
  },
  critical: {
    label: 'Critical',
    cls: 'bg-rose-600 text-white border-rose-700',
    Icon: ShieldAlert,
  },
  warning: {
    label: 'Warning',
    cls: 'bg-amber-500 text-slate-950 border-amber-600',
    Icon: AlertTriangle,
  },
  online: {
    label: 'Online',
    cls: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    Icon: Wifi,
  },
  stale: {
    label: 'Stale (>2m)',
    cls: 'bg-amber-50 text-amber-900 border-amber-300',
    Icon: Clock,
  },
  offline: {
    label: 'Offline',
    cls: 'bg-rose-50 text-rose-800 border-rose-300',
    Icon: WifiOff,
  },
  recovered: {
    label: 'Sensor Recovered',
    cls: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    Icon: CheckCircle2,
  },
};

export const AetherStatusBadge: React.FC<{
  status: AetherBadgeType;
  className?: string;
}> = ({ status, className = '' }) => {
  const cfg = MAP[status] || MAP.unassigned;
  const Icon = cfg.Icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold border whitespace-nowrap shrink-0 ${cfg.cls} ${className}`}
    >
      <Icon className="w-3 h-3 shrink-0" />
      <span>{cfg.label}</span>
    </span>
  );
};

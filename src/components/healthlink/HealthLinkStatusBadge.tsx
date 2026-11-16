import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileEdit,
  PackageCheck,
  PackageMinus,
  Stethoscope,
  Video,
} from 'lucide-react';

export type AnyHealthLinkStatus =
  | 'waiting'
  | 'in_consultation'
  | 'telehealth_live'
  | 'completed'
  | 'draft'
  | 'pending_pharmacy'
  | 'partially_dispensed'
  | 'dispensed'
  | 'out_of_stock'
  | 'low_stock'
  | 'in_stock'
  | 'unbilled'
  | 'pending_payment'
  | 'paid'
  | 'scheduled'
  | 'checked_in'
  | 'waiting_room'
  | 'live';

const STATUS_CONFIG: Record<
  AnyHealthLinkStatus,
  { label: string; cls: string; Icon: React.FC<{ className?: string }> }
> = {
  waiting: {
    label: 'Waiting Queue',
    cls: 'bg-[#FFF7ED] text-[#9A3412] border-[#FDBA74]',
    Icon: Clock,
  },
  waiting_room: {
    label: 'Video Waiting Room',
    cls: 'bg-[#FFF7ED] text-[#9A3412] border-[#FDBA74]',
    Icon: Video,
  },
  scheduled: {
    label: 'Scheduled',
    cls: 'bg-[#F0F9FF] text-[#075985] border-[#BAE6FD]',
    Icon: Clock,
  },
  checked_in: {
    label: 'Checked In',
    cls: 'bg-[#EDF7F5] text-[#0F766E] border-[#99F6E4]',
    Icon: CheckCircle2,
  },
  in_consultation: {
    label: 'In Consultation',
    cls: 'bg-[#EEF2FF] text-[#3730A3] border-[#C7D2FE]',
    Icon: Stethoscope,
  },
  telehealth_live: {
    label: 'Telehealth Live',
    cls: 'bg-[#EEF2FF] text-[#3730A3] border-[#C7D2FE]',
    Icon: Video,
  },
  live: {
    label: 'Live Session',
    cls: 'bg-[#EEF2FF] text-[#3730A3] border-[#C7D2FE]',
    Icon: Video,
  },
  completed: {
    label: 'Visit Completed',
    cls: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]',
    Icon: CheckCircle2,
  },
  draft: {
    label: 'Draft RX',
    cls: 'bg-[#F8FAFC] text-[#475569] border-[#CBD5E1]',
    Icon: FileEdit,
  },
  pending_pharmacy: {
    label: 'Pending Pharmacy',
    cls: 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]',
    Icon: Clock,
  },
  partially_dispensed: {
    label: 'Partially Dispensed',
    cls: 'bg-[#FFF7ED] text-[#9A3412] border-[#FDBA74]',
    Icon: PackageMinus,
  },
  dispensed: {
    label: 'Fully Dispensed',
    cls: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]',
    Icon: PackageCheck,
  },
  out_of_stock: {
    label: 'Out of Stock (0)',
    cls: 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]',
    Icon: AlertTriangle,
  },
  low_stock: {
    label: 'Low Stock Alert',
    cls: 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]',
    Icon: AlertTriangle,
  },
  in_stock: {
    label: 'In Stock',
    cls: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]',
    Icon: CheckCircle2,
  },
  unbilled: {
    label: 'Unbilled',
    cls: 'bg-[#F8FAFC] text-[#475569] border-[#CBD5E1]',
    Icon: Clock,
  },
  pending_payment: {
    label: 'Pending Payment',
    cls: 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]',
    Icon: AlertTriangle,
  },
  paid: {
    label: 'Paid',
    cls: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]',
    Icon: CheckCircle2,
  },
};

export const HealthLinkStatusBadge: React.FC<{
  status: AnyHealthLinkStatus;
  className?: string;
}> = ({ status, className = '' }) => {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.Icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold border whitespace-nowrap ${cfg.cls} ${className}`}
    >
      <Icon className="w-3 h-3 shrink-0" />
      <span>{cfg.label}</span>
    </span>
  );
};

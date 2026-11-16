import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileCheck2,
  PauseCircle,
  Search,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { PrimusDealStage } from '../../data/primusCatalog';

type BadgeStatus =
  | PrimusDealStage
  | 'completed'
  | 'in_progress'
  | 'pending'
  | 'pending_review'
  | 'revision_requested';

const BADGE_MAP: Record<
  BadgeStatus,
  { label: string; bg: string; border: string; text: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  screening: {
    label: 'Screening',
    bg: 'bg-slate-100',
    border: 'border-slate-300',
    text: 'text-slate-700',
    Icon: Search,
  },
  underwriting: {
    label: 'Underwriting',
    bg: 'bg-[#EEF2F6]',
    border: 'border-[#CBD5E1]',
    text: 'text-[#0D1829]',
    Icon: Clock,
  },
  due_diligence: {
    label: 'Due Diligence',
    bg: 'bg-[#FBF6EA]',
    border: 'border-[#E6D4AD]',
    text: 'text-[#7C5D24]',
    Icon: FileCheck2,
  },
  committee: {
    label: 'Committee Review',
    bg: 'bg-[#FFF7ED]',
    border: 'border-[#FDBA74]',
    text: 'text-[#9A3412]',
    Icon: AlertCircle,
  },
  approved: {
    label: 'Approved',
    bg: 'bg-[#ECFDF5]',
    border: 'border-[#A7F3D0]',
    text: 'text-[#065F46]',
    Icon: CheckCircle2,
  },
  rejected: {
    label: 'Rejected',
    bg: 'bg-[#FEF2F2]',
    border: 'border-[#FECACA]',
    text: 'text-[#991B1B]',
    Icon: XCircle,
  },
  operating_holding: {
    label: 'Operating Holding',
    bg: 'bg-[#0D1829]',
    border: 'border-[#0D1829]',
    text: 'text-[#DFC285]',
    Icon: ShieldCheck,
  },
  completed: {
    label: 'Completed',
    bg: 'bg-[#ECFDF5]',
    border: 'border-[#A7F3D0]',
    text: 'text-[#065F46]',
    Icon: CheckCircle2,
  },
  in_progress: {
    label: 'In Progress',
    bg: 'bg-[#FBF6EA]',
    border: 'border-[#E6D4AD]',
    text: 'text-[#7C5D24]',
    Icon: Clock,
  },
  pending: {
    label: 'Pending',
    bg: 'bg-slate-100',
    border: 'border-slate-300',
    text: 'text-slate-700',
    Icon: PauseCircle,
  },
  pending_review: {
    label: 'Awaiting Decision',
    bg: 'bg-[#FFF7ED]',
    border: 'border-[#FDBA74]',
    text: 'text-[#9A3412]',
    Icon: Clock,
  },
  revision_requested: {
    label: 'Revisions Requested',
    bg: 'bg-[#FEF3C7]',
    border: 'border-[#FCD34D]',
    text: 'text-[#92400E]',
    Icon: AlertCircle,
  },
};

export const PrimusStatusBadge: React.FC<{ status: BadgeStatus; className?: string }> = ({
  status,
  className = '',
}) => {
  const cfg = BADGE_MAP[status] || BADGE_MAP.pending;
  const Icon = cfg.Icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold border whitespace-nowrap shrink-0 ${cfg.bg} ${cfg.border} ${cfg.text} ${className}`}
    >
      <Icon className="w-3 h-3 shrink-0" />
      <span>{cfg.label}</span>
    </span>
  );
};

export type DeviceConnectionState = 'online' | 'stale' | 'offline';

/**
 * Derives live IoT device health deterministically from age of last packet.
 * - <= 120s: online
 * - 121s..600s: stale
 * - > 600s: offline
 */
export function deriveDeviceState(lastSeenSecAgo: number): DeviceConnectionState {
  if (!Number.isFinite(lastSeenSecAgo) || lastSeenSecAgo < 0) return 'offline';
  if (lastSeenSecAgo <= 120) return 'online';
  if (lastSeenSecAgo <= 600) return 'stale';
  return 'offline';
}

export function formatLastSeen(secAgo: number): string {
  if (secAgo < 60) return `${Math.max(1, Math.round(secAgo))}s ago`;
  const mins = Math.floor(secAgo / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m ago`;
}

export interface TelemetryReadingInput {
  eventId: string;
  deviceId: string;
  vehicleId: string;
  shipmentId?: string;
  seqEpoch: number; // Monotonic simulation timestamp (ms)
  timeLabel: string;
  tempC?: number;
  doorOpen?: boolean;
  speedKmh?: number;
  progressPct?: number; // 0..100 along corridor
  geofenceEvent?: 'departed_depot' | 'arrived_destination';
}

export interface ColdChainEvaluation {
  inRange: boolean;
  excursionDirection: 'high' | 'low' | 'none';
  nextConsecutiveBreachMinutes: number;
  shouldTriggerOrUpdateIncident: boolean;
  recoveredNow: boolean;
}

/**
 * Evaluates a temperature reading against an individual shipment's configured cold-chain policy.
 * Distinguishes brief spikes vs sustained excursions before generating an incident alert.
 */
export function evaluateColdChainReading(params: {
  tempC: number;
  minC: number;
  maxC: number;
  previousBreachMinutes: number;
  minutesDelta: number;
  sustainedThresholdMinutes: number;
  previouslyInExcursion: boolean;
}): ColdChainEvaluation {
  const {
    tempC,
    minC,
    maxC,
    previousBreachMinutes,
    minutesDelta,
    sustainedThresholdMinutes,
    previouslyInExcursion,
  } = params;

  const isHigh = tempC > maxC;
  const isLow = tempC < minC;
  const inRange = !isHigh && !isLow;

  if (!inRange) {
    const nextMins = previousBreachMinutes + Math.max(1, minutesDelta);
    return {
      inRange: false,
      excursionDirection: isHigh ? 'high' : 'low',
      nextConsecutiveBreachMinutes: nextMins,
      shouldTriggerOrUpdateIncident: nextMins >= sustainedThresholdMinutes,
      recoveredNow: false,
    };
  }

  return {
    inRange: true,
    excursionDirection: 'none',
    nextConsecutiveBreachMinutes: 0,
    shouldTriggerOrUpdateIncident: false,
    recoveredNow: previouslyInExcursion,
  };
}

export function buildCsvDownload(filename: string, headers: string[], rows: (string | number)[][]) {
  const escape = (val: string | number) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const csv = [
    headers.map(escape).join(','),
    ...rows.map((r) => r.map(escape).join(',')),
  ].join('\n');

  try {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch {
    // Graceful no-op outside browser DOM
  }
}

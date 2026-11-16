import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  CommitteeSubmission,
  DiligenceTask,
  PrimusActivityEvent,
  PrimusDataset,
  PrimusDealStage,
  PrimusMarket,
  PrimusRole,
  createSeededPrimusDataset,
} from '../data/primusCatalog';
import {
  PrimusCurrency,
  ScenarioPresetId,
  UnderwritingAssumptions,
  runUnderwritingModel,
} from '../utils/primusFinance';

const STORAGE_KEY = 'primus_capital_demo_v1';

export interface PrimusActionResult<T = undefined> {
  ok: boolean;
  error?: string;
  data?: T;
}

interface PrimusContextValue {
  dataset: PrimusDataset;
  activeRole: PrimusRole;
  setActiveRole: (role: PrimusRole) => void;
  activeMarketScope: 'All' | PrimusMarket;
  setActiveMarketScope: (scope: 'All' | PrimusMarket) => void;
  consolidatedCurrency: PrimusCurrency;
  setConsolidatedCurrency: (currency: PrimusCurrency) => void;
  activeAssetId: string;
  setActiveAssetId: (assetId: string) => void;
  selectedScenarioId: ScenarioPresetId;
  setSelectedScenarioId: (scenarioId: ScenarioPresetId) => void;
  watchlistIds: string[];
  toggleWatchlist: (assetId: string) => void;
  compareIds: string[];
  toggleCompare: (assetId: string) => PrimusActionResult;
  activeInvestorId: string;
  setActiveInvestorId: (investorId: string) => void;
  guidedDemoActive: boolean;
  setGuidedDemoActive: (active: boolean) => void;

  // Underwriting & Pipeline Actions
  updateScenarioAssumptions: (
    assetId: string,
    scenarioId: ScenarioPresetId,
    patch: Partial<UnderwritingAssumptions>
  ) => void;
  toggleDiligenceTask: (taskId: string) => void;
  addDiligenceTask: (input: {
    assetId: string;
    category: DiligenceTask['category'];
    title: string;
    owner: string;
    dueDate: string;
    required: boolean;
  }) => PrimusActionResult<DiligenceTask>;
  addAssetComment: (assetId: string, text: string) => void;
  moveDealStage: (
    assetId: string,
    nextStage: Exclude<PrimusDealStage, 'operating_holding'>,
    note?: string
  ) => PrimusActionResult;
  submitToCommittee: (input: {
    assetId: string;
    scenarioId: ScenarioPresetId;
    submissionNote: string;
  }) => PrimusActionResult<CommitteeSubmission>;
  recordCommitteeDecision: (input: {
    submissionId: string;
    decision: 'approved' | 'rejected' | 'revision_requested';
    reason: string;
  }) => PrimusActionResult<CommitteeSubmission>;
  simulateCloseDeal: (assetId: string) => PrimusActionResult;
  resetDemoData: () => void;
}

const PrimusStoreContext = createContext<PrimusContextValue | undefined>(undefined);

function timeNowLabel(): string {
  return `Today · ${new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())}`;
}

interface PersistedPrimusState {
  dataset: PrimusDataset;
  watchlistIds: string[];
  compareIds: string[];
}

export const PrimusStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [persisted, setPersisted] = useState<PersistedPrimusState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.dataset?.version === 1 && Array.isArray(parsed.dataset.assets)) {
          return parsed as PersistedPrimusState;
        }
      }
    } catch {
      // Fallback to fresh seed
    }
    return {
      dataset: createSeededPrimusDataset(),
      watchlistIds: ['meridian-logistics-park', 'thames-gateway-hub'],
      compareIds: ['meridian-logistics-park', 'thames-gateway-hub'],
    };
  });

  const [activeRole, setActiveRole] = useState<PrimusRole>('acquisitions_analyst');
  const [activeMarketScope, setActiveMarketScope] = useState<'All' | PrimusMarket>('All');
  const [consolidatedCurrency, setConsolidatedCurrency] = useState<PrimusCurrency>('USD');
  const [activeAssetId, setActiveAssetId] = useState<string>('meridian-logistics-park');
  const [selectedScenarioId, setSelectedScenarioId] = useState<ScenarioPresetId>('base');
  const [activeInvestorId, setActiveInvestorId] = useState<string>('LP-01');
  const [guidedDemoActive, setGuidedDemoActive] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      // Ignore storage quota errors
    }
  }, [persisted]);

  const toggleWatchlist = useCallback((assetId: string) => {
    setPersisted((prev) => {
      const exists = prev.watchlistIds.includes(assetId);
      return {
        ...prev,
        watchlistIds: exists
          ? prev.watchlistIds.filter((id) => id !== assetId)
          : [...prev.watchlistIds, assetId],
      };
    });
  }, []);

  const toggleCompare = useCallback(
    (assetId: string): PrimusActionResult => {
      const exists = persisted.compareIds.includes(assetId);
      if (!exists && persisted.compareIds.length >= 3) {
        return {
          ok: false,
          error: 'Side-by-side comparison supports up to 3 commercial assets at once.',
        };
      }
      setPersisted((prev) => ({
        ...prev,
        compareIds: exists
          ? prev.compareIds.filter((id) => id !== assetId)
          : [...prev.compareIds, assetId],
      }));
      return { ok: true };
    },
    [persisted.compareIds]
  );

  const updateScenarioAssumptions = useCallback(
    (assetId: string, scenarioId: ScenarioPresetId, patch: Partial<UnderwritingAssumptions>) => {
      // Important invariant: Updates ONLY the working draft scenario on asset; NEVER mutates frozen CommitteeSubmissions!
      setPersisted((prev) => ({
        ...prev,
        dataset: {
          ...prev.dataset,
          assets: prev.dataset.assets.map((asset) => {
            if (asset.id !== assetId) return asset;
            return {
              ...asset,
              scenarios: {
                ...asset.scenarios,
                [scenarioId]: {
                  ...asset.scenarios[scenarioId],
                  ...patch,
                },
              },
            };
          }),
        },
      }));
    },
    []
  );

  const toggleDiligenceTask = useCallback(
    (taskId: string) => {
      setPersisted((prev) => {
        const task = prev.dataset.diligenceTasks.find((t) => t.id === taskId);
        if (!task) return prev;
        const nextStatus: DiligenceTask['status'] =
          task.status === 'completed' ? 'pending' : 'completed';

        const act: PrimusActivityEvent = {
          id: `ACT-PR-${Date.now()}`,
          timestampLabel: timeNowLabel(),
          actor:
            activeRole === 'committee_reviewer'
              ? 'Richard Vance (IC)'
              : 'Elena Lin (Acquisitions)',
          role: activeRole,
          assetId: task.assetId,
          title:
            nextStatus === 'completed'
              ? `Diligence cleared: ${task.title}`
              : `Diligence reopened: ${task.title}`,
          detail: `${task.category} checklist item marked ${nextStatus}.`,
        };

        return {
          ...prev,
          dataset: {
            ...prev.dataset,
            diligenceTasks: prev.dataset.diligenceTasks.map((t) =>
              t.id === taskId ? { ...t, status: nextStatus } : t
            ),
            activityLog: [act, ...prev.dataset.activityLog],
          },
        };
      });
    },
    [activeRole]
  );

  const addDiligenceTask = useCallback(
    (input: {
      assetId: string;
      category: DiligenceTask['category'];
      title: string;
      owner: string;
      dueDate: string;
      required: boolean;
    }): PrimusActionResult<DiligenceTask> => {
      const cleanTitle = input.title.trim();
      if (!cleanTitle) return { ok: false, error: 'Task title is required.' };
      const newTask: DiligenceTask = {
        id: `TSK-${Date.now()}`,
        assetId: input.assetId,
        category: input.category,
        title: cleanTitle,
        owner: input.owner.trim() || 'Acquisitions Team',
        dueDate: input.dueDate.trim() || 'Nov 28',
        required: input.required,
        status: 'pending',
      };
      setPersisted((prev) => ({
        ...prev,
        dataset: {
          ...prev.dataset,
          diligenceTasks: [...prev.dataset.diligenceTasks, newTask],
        },
      }));
      return { ok: true, data: newTask };
    },
    []
  );

  const addAssetComment = useCallback(
    (assetId: string, text: string) => {
      const clean = text.trim();
      if (!clean) return;
      const author =
        activeRole === 'committee_reviewer'
          ? 'Richard Vance (IC)'
          : activeRole === 'asset_manager'
          ? 'Claire Ashworth (AM)'
          : 'Elena Lin (Acquisitions)';
      setPersisted((prev) => ({
        ...prev,
        dataset: {
          ...prev.dataset,
          assets: prev.dataset.assets.map((a) =>
            a.id === assetId
              ? {
                  ...a,
                  comments: [
                    {
                      id: `cmt-${Date.now()}`,
                      author,
                      dateLabel: timeNowLabel(),
                      text: clean,
                    },
                    ...a.comments,
                  ],
                }
              : a
          ),
        },
      }));
    },
    [activeRole]
  );

  const moveDealStage = useCallback(
    (
      assetId: string,
      nextStage: Exclude<PrimusDealStage, 'operating_holding'>,
      note?: string
    ): PrimusActionResult => {
      const asset = persisted.dataset.assets.find((a) => a.id === assetId);
      if (!asset) return { ok: false, error: 'Asset not found.' };
      if (asset.stage === 'operating_holding') {
        return {
          ok: false,
          error: 'Operating holdings cannot be returned to pre-acquisition stages.',
        };
      }
      if (asset.stage === nextStage) return { ok: true };

      if (nextStage === 'committee') {
        const assetTasks = persisted.dataset.diligenceTasks.filter((t) => t.assetId === assetId);
        const openRequired = assetTasks.filter((t) => t.required && t.status !== 'completed');
        if (openRequired.length > 0) {
          return {
            ok: false,
            error: `Cannot move to Committee: ${openRequired.length} required diligence task(s) remain incomplete (${openRequired[0].title}).`,
          };
        }
      }

      const actor =
        activeRole === 'committee_reviewer'
          ? 'Richard Vance (IC)'
          : activeRole === 'asset_manager'
          ? 'Claire Ashworth (AM)'
          : 'Elena Lin (Acquisitions)';

      const act: PrimusActivityEvent = {
        id: `ACT-PR-${Date.now()}`,
        timestampLabel: timeNowLabel(),
        actor,
        role: activeRole,
        assetId,
        title: `${asset.name} moved to ${nextStage.replace('_', ' ')}`,
        detail: note?.trim() || `Stage updated from ${asset.stage.replace('_', ' ')}.`,
      };

      setPersisted((prev) => ({
        ...prev,
        dataset: {
          ...prev.dataset,
          assets: prev.dataset.assets.map((a) =>
            a.id === assetId
              ? {
                  ...a,
                  stage: nextStage,
                  stageHistory: [
                    ...a.stageHistory,
                    {
                      stage: nextStage,
                      dateLabel: timeNowLabel(),
                      actor,
                      note: note?.trim() || `Transitioned to ${nextStage.replace('_', ' ')}`,
                    },
                  ],
                }
              : a
          ),
          activityLog: [act, ...prev.dataset.activityLog],
        },
      }));

      return { ok: true };
    },
    [persisted.dataset, activeRole]
  );

  const submitToCommittee = useCallback(
    (input: {
      assetId: string;
      scenarioId: ScenarioPresetId;
      submissionNote: string;
    }): PrimusActionResult<CommitteeSubmission> => {
      const asset = persisted.dataset.assets.find((a) => a.id === input.assetId);
      if (!asset) return { ok: false, error: 'Selected property was not found.' };

      const assetTasks = persisted.dataset.diligenceTasks.filter(
        (t) => t.assetId === input.assetId
      );
      const requiredTasks = assetTasks.filter((t) => t.required);
      const incompleteRequired = requiredTasks.filter((t) => t.status !== 'completed');

      if (incompleteRequired.length > 0) {
        return {
          ok: false,
          error: `Submission blocked: ${incompleteRequired.length} required diligence item(s) still open (${incompleteRequired[0].title}).`,
        };
      }

      // Guard against accidental duplicate submissions while a review is already pending
      const existingPending = persisted.dataset.submissions.find(
        (s) => s.assetId === asset.id && s.status === 'pending_review'
      );
      if (existingPending) {
        return {
          ok: false,
          error: `Revision ${existingPending.revisionNumber} is already pending Committee decision.`,
        };
      }

      const workingScenario = asset.scenarios[input.scenarioId];
      const computedResult = runUnderwritingModel(workingScenario);
      if (!computedResult.valid || computedResult.leveredIrrPct === null) {
        return {
          ok: false,
          error:
            computedResult.statusMessage ||
            'Underwriting model must produce a valid solution before Committee submission.',
        };
      }

      const existingCount = persisted.dataset.submissions.filter(
        (s) => s.assetId === asset.id
      ).length;
      const revisionNumber = existingCount + 1;

      const frozenSubmission: CommitteeSubmission = {
        id: `SUB-${101 + persisted.dataset.submissions.length}`,
        revisionNumber,
        assetId: asset.id,
        submittedAtLabel: timeNowLabel(),
        submittedBy: 'Elena Lin (VP Acquisitions)',
        submissionNote:
          input.submissionNote.trim() ||
          `Submitted ${workingScenario.scenarioLabel} model (${computedResult.leveredIrrPct}% levered IRR, ${computedResult.equityMultiple}x EM).`,
        frozenScenarioId: input.scenarioId,
        frozenAssumptions: structuredClone(workingScenario),
        frozenResult: structuredClone(computedResult),
        diligenceSummary: `${requiredTasks.length} of ${requiredTasks.length} required diligence tasks verified complete`,
        status: 'pending_review',
      };

      const act: PrimusActivityEvent = {
        id: `ACT-PR-${Date.now()}`,
        timestampLabel: timeNowLabel(),
        actor: 'Elena Lin (VP Acquisitions)',
        role: 'acquisitions_analyst',
        assetId: asset.id,
        title: `Submitted ${asset.name} (Rev-${revisionNumber}) to Committee`,
        detail: `Snapshot locked at ${computedResult.leveredIrrPct}% projected levered IRR (${workingScenario.scenarioLabel}).`,
      };

      setPersisted((prev) => ({
        ...prev,
        dataset: {
          ...prev.dataset,
          assets: prev.dataset.assets.map((a) =>
            a.id === asset.id
              ? {
                  ...a,
                  stage: 'committee',
                  stageHistory: [
                    ...a.stageHistory,
                    {
                      stage: 'committee',
                      dateLabel: timeNowLabel(),
                      actor: 'Elena Lin',
                      note: `Locked Committee Submission Rev-${revisionNumber}.`,
                    },
                  ],
                }
              : a
          ),
          submissions: [frozenSubmission, ...prev.dataset.submissions],
          activityLog: [act, ...prev.dataset.activityLog],
        },
      }));

      return { ok: true, data: frozenSubmission };
    },
    [persisted.dataset]
  );

  const recordCommitteeDecision = useCallback(
    (input: {
      submissionId: string;
      decision: 'approved' | 'rejected' | 'revision_requested';
      reason: string;
    }): PrimusActionResult<CommitteeSubmission> => {
      if (activeRole !== 'committee_reviewer') {
        return {
          ok: false,
          error: 'Switch demo role to Committee Reviewer to record an approval or revision request.',
        };
      }
      const cleanReason = input.reason.trim();
      if (!cleanReason) {
        return {
          ok: false,
          error: 'Enter a committee decision note or revision rationale.',
        };
      }

      const sub = persisted.dataset.submissions.find((s) => s.id === input.submissionId);
      if (!sub) return { ok: false, error: 'Committee submission not found.' };
      if (sub.status !== 'pending_review') {
        return {
          ok: false,
          error: `Revision ${sub.revisionNumber} already has recorded decision: ${sub.status.replace('_', ' ')}.`,
        };
      }

      const asset = persisted.dataset.assets.find((a) => a.id === sub.assetId);
      const updatedSub: CommitteeSubmission = {
        ...sub,
        status: input.decision,
        decisionBy: 'Richard Vance (IC Chair)',
        decisionAtLabel: timeNowLabel(),
        decisionReason: cleanReason,
      };

      const nextStage: PrimusDealStage =
        input.decision === 'approved'
          ? 'approved'
          : input.decision === 'rejected'
          ? 'rejected'
          : 'underwriting';

      const act: PrimusActivityEvent = {
        id: `ACT-PR-${Date.now()}`,
        timestampLabel: timeNowLabel(),
        actor: 'Richard Vance (IC Chair)',
        role: 'committee_reviewer',
        assetId: sub.assetId,
        title: `Committee ${input.decision.replace('_', ' ')}: ${asset?.name || sub.assetId} (Rev-${sub.revisionNumber})`,
        detail: cleanReason,
      };

      setPersisted((prev) => ({
        ...prev,
        dataset: {
          ...prev.dataset,
          submissions: prev.dataset.submissions.map((s) =>
            s.id === sub.id ? updatedSub : s
          ),
          assets: prev.dataset.assets.map((a) =>
            a.id === sub.assetId
              ? {
                  ...a,
                  stage: nextStage,
                  stageHistory: [
                    ...a.stageHistory,
                    {
                      stage: nextStage,
                      dateLabel: timeNowLabel(),
                      actor: 'Richard Vance (IC Chair)',
                      note: `${input.decision.replace('_', ' ').toUpperCase()}: ${cleanReason}`,
                    },
                  ],
                }
              : a
          ),
          activityLog: [act, ...prev.dataset.activityLog],
        },
      }));

      return { ok: true, data: updatedSub };
    },
    [activeRole, persisted.dataset]
  );

  const simulateCloseDeal = useCallback(
    (assetId: string): PrimusActionResult => {
      const asset = persisted.dataset.assets.find((a) => a.id === assetId);
      if (!asset) return { ok: false, error: 'Asset not found.' };
      if (asset.stage !== 'approved') {
        return {
          ok: false,
          error: 'Only Committee-Approved deals can undergo simulated closing into Operating Holdings.',
        };
      }

      const act: PrimusActivityEvent = {
        id: `ACT-PR-${Date.now()}`,
        timestampLabel: timeNowLabel(),
        actor: 'Claire Ashworth (Asset Manager)',
        role: activeRole,
        assetId: asset.id,
        title: `Simulated Close completed: ${asset.name}`,
        detail: 'Transferred from Approved pipeline into Operating Portfolio Monitoring.',
      };

      setPersisted((prev) => ({
        ...prev,
        dataset: {
          ...prev.dataset,
          assets: prev.dataset.assets.map((a) =>
            a.id === asset.id
              ? {
                  ...a,
                  stage: 'operating_holding',
                  stageHistory: [
                    ...a.stageHistory,
                    {
                      stage: 'operating_holding',
                      dateLabel: timeNowLabel(),
                      actor: 'Claire Ashworth (Asset Manager)',
                      note: 'Explicit Simulated Close executed; asset now active in Operating Holdings.',
                    },
                  ],
                }
              : a
          ),
          activityLog: [act, ...prev.dataset.activityLog],
        },
      }));

      return { ok: true };
    },
    [persisted.dataset, activeRole]
  );

  const resetDemoData = useCallback(() => {
    const fresh: PersistedPrimusState = {
      dataset: createSeededPrimusDataset(),
      watchlistIds: ['meridian-logistics-park', 'thames-gateway-hub'],
      compareIds: ['meridian-logistics-park', 'thames-gateway-hub'],
    };
    setPersisted(fresh);
    setActiveRole('acquisitions_analyst');
    setActiveMarketScope('All');
    setActiveAssetId('meridian-logistics-park');
    setSelectedScenarioId('base');
    setActiveInvestorId('LP-01');
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch {
      // Ignore write failures
    }
  }, []);

  const value = useMemo<PrimusContextValue>(
    () => ({
      dataset: persisted.dataset,
      activeRole,
      setActiveRole,
      activeMarketScope,
      setActiveMarketScope,
      consolidatedCurrency,
      setConsolidatedCurrency,
      activeAssetId,
      setActiveAssetId,
      selectedScenarioId,
      setSelectedScenarioId,
      watchlistIds: persisted.watchlistIds,
      toggleWatchlist,
      compareIds: persisted.compareIds,
      toggleCompare,
      activeInvestorId,
      setActiveInvestorId,
      guidedDemoActive,
      setGuidedDemoActive,
      updateScenarioAssumptions,
      toggleDiligenceTask,
      addDiligenceTask,
      addAssetComment,
      moveDealStage,
      submitToCommittee,
      recordCommitteeDecision,
      simulateCloseDeal,
      resetDemoData,
    }),
    [
      persisted,
      activeRole,
      activeMarketScope,
      consolidatedCurrency,
      activeAssetId,
      selectedScenarioId,
      activeInvestorId,
      guidedDemoActive,
      toggleWatchlist,
      toggleCompare,
      updateScenarioAssumptions,
      toggleDiligenceTask,
      addDiligenceTask,
      addAssetComment,
      moveDealStage,
      submitToCommittee,
      recordCommitteeDecision,
      simulateCloseDeal,
      resetDemoData,
    ]
  );

  return (
    <PrimusStoreContext.Provider value={value}>
      {children}
    </PrimusStoreContext.Provider>
  );
};

export function usePrimusStore() {
  const ctx = useContext(PrimusStoreContext);
  if (!ctx) {
    throw new Error('usePrimusStore must be used inside PrimusStoreProvider');
  }
  return ctx;
}

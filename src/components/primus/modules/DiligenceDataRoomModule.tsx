import React, { useState } from 'react';
import {
  ArrowRight,
  CheckSquare,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Plus,
  ShieldCheck,
  Square,
} from 'lucide-react';
import { usePrimusStore } from '../../../context/PrimusStoreContext';
import { DataRoomDoc, DiligenceTask } from '../../../data/primusCatalog';
import { PrimusStatusBadge } from '../PrimusStatusBadge';

interface DiligenceDataRoomModuleProps {
  onOpenDoc: (doc: DataRoomDoc) => void;
  onNavigateCommittee: () => void;
}

export const DiligenceDataRoomModule: React.FC<DiligenceDataRoomModuleProps> = ({
  onOpenDoc,
  onNavigateCommittee,
}) => {
  const {
    dataset,
    activeAssetId,
    setActiveAssetId,
    toggleDiligenceTask,
    addDiligenceTask,
  } = usePrimusStore();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] =
    useState<DiligenceTask['category']>('Technical');
  const [newTaskRequired, setNewTaskRequired] = useState(false);

  const asset =
    dataset.assets.find((a) => a.id === activeAssetId) || dataset.assets[0];
  const tasks = dataset.diligenceTasks.filter((t) => t.assetId === asset.id);
  const docs = dataset.documents.filter((d) => d.assetId === asset.id);

  const requiredTasks = tasks.filter((t) => t.required);
  const completedRequired = requiredTasks.filter((t) => t.status === 'completed');
  const allRequiredDone =
    requiredTasks.length > 0 && completedRequired.length === requiredTasks.length;

  const pctComplete =
    requiredTasks.length > 0
      ? Math.round((completedRequired.length / requiredTasks.length) * 100)
      : 100;

  return (
    <div className="space-y-5">
      {/* Top Asset Selector & Readiness Banner */}
      <div className="bg-white border border-[#DDD7CB] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label
              htmlFor="dd-asset-select"
              className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1"
            >
              Active Data Room &amp; Diligence Property
            </label>
            <select
              id="dd-asset-select"
              value={asset.id}
              onChange={(e) => setActiveAssetId(e.target.value)}
              className="h-10 px-3 bg-[#F6F4EF] border border-[#DDD7CB] text-xs font-bold text-[#0D1829]"
            >
              {dataset.assets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.code} · {a.name}
                </option>
              ))}
            </select>
          </div>
          <div className="pt-4">
            <PrimusStatusBadge status={asset.stage} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right pr-tabular">
            <p className="text-xs font-bold text-[#0D1829]">
              Required Diligence: {completedRequired.length} / {requiredTasks.length} ({pctComplete}%)
            </p>
            <div className="w-44 h-2 bg-[#EFECE5] border border-[#DDD7CB] mt-1">
              <div
                className={`h-full transition-all ${
                  allRequiredDone ? 'bg-[#065F46]' : 'bg-[#9E7C3B]'
                }`}
                style={{ width: `${pctComplete}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateCommittee}
            className={`px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
              allRequiredDone
                ? 'bg-[#065F46] hover:bg-[#047857] text-white'
                : 'bg-[#0D1829] hover:bg-[#192D4D] text-white'
            }`}
          >
            <span>
              {allRequiredDone ? 'Proceed to Committee Submit' : 'Review Committee Status'}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D6B572]" />
          </button>
        </div>
      </div>

      {/* Main Split: Left Diligence Checklist / Right Data Room Files */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Diligence Checklist */}
        <div className="lg:col-span-7 bg-white border border-[#DDD7CB] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAE5DA] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#0D1829] pr-sans">
                Acquisition Due Diligence Checklist
              </h2>
              <p className="text-[11px] text-[#475569]">
                All required items must be marked complete before submitting to Investment Committee.
              </p>
            </div>
            <ShieldCheck className="w-4 h-4 text-[#9E7C3B]" />
          </div>

          {allRequiredDone && requiredTasks.length > 0 && (
            <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs flex items-center justify-between gap-2">
              <span>
                <strong>100% Required Diligence Verified:</strong> {asset.name} is eligible for Committee snapshot submission.
              </span>
            </div>
          )}

          <div className="divide-y divide-[#EAE5DA] border border-[#DDD7CB]">
            {tasks.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#64748B]">
                No diligence tasks logged yet for this screening-stage property. Add one below.
              </div>
            ) : (
              tasks.map((task) => {
                const isDone = task.status === 'completed';
                return (
                  <div
                    key={task.id}
                    className={`p-3.5 flex items-start justify-between gap-3 ${
                      isDone ? 'bg-[#F6F4EF]/60' : 'bg-white'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleDiligenceTask(task.id)}
                      className="flex items-start gap-3 text-left flex-1 cursor-pointer"
                    >
                      {isDone ? (
                        <CheckSquare className="w-4 h-4 text-[#065F46] shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-[#9E7C3B] shrink-0 mt-0.5" />
                      )}
                      <div className="text-xs">
                        <p
                          className={`font-bold ${
                            isDone ? 'line-through text-[#64748B]' : 'text-[#0D1829]'
                          }`}
                        >
                          {task.title}
                        </p>
                        <p className="text-[11px] text-[#475569] mt-0.5">
                          [{task.category}] · Owner: {task.owner} · Due {task.dueDate}{' '}
                          {task.required && (
                            <span className="text-[#9E7C3B] font-bold">· Required for IC</span>
                          )}
                        </p>
                      </div>
                    </button>
                    <PrimusStatusBadge status={task.status} />
                  </div>
                );
              })
            )}
          </div>

          {/* Add Custom Diligence Task */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const res = addDiligenceTask({
                assetId: asset.id,
                category: newTaskCategory,
                title: newTaskTitle,
                owner: 'Elena Lin',
                dueDate: 'Nov 28',
                required: newTaskRequired,
              });
              if (res.ok) setNewTaskTitle('');
            }}
            className="pt-2 flex flex-wrap items-center gap-2 text-xs"
          >
            <select
              value={newTaskCategory}
              onChange={(e) =>
                setNewTaskCategory(e.target.value as DiligenceTask['category'])
              }
              className="h-9 px-2 bg-[#F6F4EF] border border-[#DDD7CB] text-[#0D1829]"
            >
              <option value="Technical">Technical</option>
              <option value="Legal & Title">Legal &amp; Title</option>
              <option value="Financial & Tax">Financial &amp; Tax</option>
              <option value="Environmental">Environmental</option>
            </select>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add follow-up diligence requirement..."
              className="flex-1 min-w-[180px] h-9 px-3 bg-[#F6F4EF] border border-[#DDD7CB] text-[#0D1829]"
            />
            <label className="inline-flex items-center gap-1.5 text-[#475569] cursor-pointer px-2">
              <input
                type="checkbox"
                checked={newTaskRequired}
                onChange={(e) => setNewTaskRequired(e.target.checked)}
                className="accent-[#9E7C3B]"
              />
              <span>Required</span>
            </label>
            <button
              type="submit"
              className="h-9 px-3.5 bg-[#0D1829] text-white font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#D6B572]" />
              <span>Add Task</span>
            </button>
          </form>
        </div>

        {/* Right: Structured Data Room */}
        <div className="lg:col-span-5 bg-white border border-[#DDD7CB] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAE5DA] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#0D1829] pr-sans">
                Asset Data Room ({docs.length} Sample Packs)
              </h2>
              <p className="text-[11px] text-[#475569]">
                Preview or download structured sample CSV/TXT diligence packs.
              </p>
            </div>
            <FolderOpen className="w-4 h-4 text-[#9E7C3B]" />
          </div>

          <div className="space-y-3">
            {docs.length === 0 ? (
              <p className="text-xs text-[#64748B] py-4">
                Data room packs populate automatically once underwriting advances into formal diligence.
              </p>
            ) : (
              docs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 border border-[#DDD7CB] bg-[#F6F4EF]/70 hover:border-[#9E7C3B] transition-colors flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    {doc.fileType.includes('CSV') ? (
                      <FileSpreadsheet className="w-4 h-4 text-[#065F46] shrink-0 mt-0.5" />
                    ) : (
                      <FileText className="w-4 h-4 text-[#9E7C3B] shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#0D1829] truncate">{doc.title}</p>
                      <p className="text-[11px] text-[#475569] mt-0.5 line-clamp-2">
                        {doc.previewSummary}
                      </p>
                      <p className="text-[10px] font-mono text-[#64748B] mt-1">
                        {doc.id} · {doc.fileType} · {doc.sizeLabel} · {doc.updatedAt}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenDoc(doc)}
                    className="px-3 py-1.5 bg-[#0D1829] hover:bg-[#192D4D] text-white text-[11px] font-semibold shrink-0 cursor-pointer"
                  >
                    Preview
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';
import {
  ChevronRight, ChevronDown, Plus, MoreHorizontal, Edit2,
  Copy, Trash2, Clock, Settings, Save, X, RotateCcw, Check, RefreshCw, Play, Rocket, TrendingUp,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const SEGMENTS = [
  'VIP Users',
  'Churn Risk',
  'Beta Testers',
  'Internal Employees',
  'High Usage',
];

const SEGMENT_SIZES: Record<string, number> = {
  'All Users':           82000,
  'VIP Users':           5200,
  'Churn Risk':          11800,
  'Beta Testers':        2400,
  'Internal Employees':  480,
  'High Usage':          14600,
};



const INITIAL_GLOBAL_CONFIG: StageConfig[] = [
  { id: 1, percent: 5,   time: 6  },
  { id: 2, percent: 15,  time: 6  },
  { id: 3, percent: 40,  time: 12 },
  { id: 4, percent: 100, time: 0  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface StageConfig { id: number; percent: number; time: number; }

interface RolloutStageDisplay {
  id: number; target: string; users: number; time: string;
  status: 'completed' | 'active' | 'pending'; timeLeft?: string;
}

type RolloutStatus = 'not_started' | 'in_progress' | 'completed' | 'stopped';

interface RolloutHistory { segment: string; usersUpdated: number; completedAt: string; }

interface RolloutData {
  stages: RolloutStageDisplay[];
  stageConfig: StageConfig[];
  segment: string;
  startTime: string;
  currentPercent: number;
  currentUsers: number;
  totalTargetUsers: number;
  expanded: boolean;
  status: RolloutStatus;
}

interface VersionData {
  id: string; version: string; downloadLinks: string[];
  changelogZh: string; changelogEn: string;
  isLatest: boolean; isDefault: boolean; isMinVersion: boolean; isFaulty: boolean;
  updatedAt: string; rollout?: RolloutData; rolloutHistory: RolloutHistory[];
}

interface PlatformData {
  id: string; name: string; dotColor: string; expanded: boolean;
  versions: VersionData[];
}

// ─── Initial Mock Data ────────────────────────────────────────────────────────

const INITIAL_PLATFORMS: PlatformData[] = [
  {
    id: 'windows', name: 'WINDOWS', dotColor: 'bg-blue-500', expanded: false,
    versions: [
      {
        id: 'win-1.0.21', version: '1.0.21',
        downloadLinks: ['https://down.hznode.cc/hz-win-1.0.21.exe', '', '', ''],
        changelogZh: 'Performance optimization', changelogEn: 'Performance optimization',
        isLatest: true, isDefault: false, isMinVersion: false, isFaulty: false,
        updatedAt: '2025-09-29 15:44:36', rolloutHistory: [],
        rollout: {
          stages: [
            { id: 1, target: '5%',   users: 120,  time: '6 hours',  status: 'completed' },
            { id: 2, target: '15%',  users: 360,  time: '6 hours',  status: 'completed' },
            { id: 3, target: '40%',  users: 960,  time: '12 hours', status: 'completed' },
            { id: 4, target: '100%', users: 2400, time: '0 hours',  status: 'completed' },
          ],
          stageConfig: INITIAL_GLOBAL_CONFIG.map(s => ({ ...s })),
          segment: 'Beta Testers', startTime: '2025-09-20 10:00:00',
          currentPercent: 100, currentUsers: 2400, totalTargetUsers: 2400,
          expanded: false, status: 'completed',
        },
      },
      {
        id: 'win-1.0.20', version: '1.0.20',
        downloadLinks: ['https://down.hznode.cc/hz-win-1.0.20.exe', '', '', ''],
        changelogZh: '错误修复', changelogEn: 'Bug fixes',
        isLatest: false, isDefault: true, isMinVersion: false, isFaulty: false,
        updatedAt: '2025-08-10 14:00:00', rolloutHistory: [],
        rollout: {
          stages: [
            { id: 1, target: '5%',   users: 4100,  time: '6 hours',  status: 'completed' },
            { id: 2, target: '15%',  users: 12300, time: '6 hours',  status: 'completed' },
            { id: 3, target: '40%',  users: 32800, time: '12 hours', status: 'completed' },
            { id: 4, target: '100%', users: 82000, time: '0 hours',  status: 'completed' },
          ],
          stageConfig: INITIAL_GLOBAL_CONFIG.map(s => ({ ...s })),
          segment: 'All Users', startTime: '2025-08-01 10:00:00',
          currentPercent: 100, currentUsers: 82000, totalTargetUsers: 82000,
          expanded: false, status: 'completed',
        },
      },
      {
        id: 'win-1.0.19', version: '1.0.19',
        downloadLinks: ['https://down.hznode.cc/hz-win-1.0.19.exe', '', '', ''],
        changelogZh: '安全补丁', changelogEn: 'Security patch',
        isLatest: false, isDefault: false, isMinVersion: false, isFaulty: false,
        updatedAt: '2025-07-15 09:00:00', rolloutHistory: [], rollout: undefined,
      },
      {
        id: 'win-1.0.18', version: '1.0.18',
        downloadLinks: ['https://down.hznode.cc/hz-win-1.0.18.exe', '', '', ''],
        changelogZh: '功能更新', changelogEn: 'Feature update',
        isLatest: false, isDefault: false, isMinVersion: true, isFaulty: false,
        updatedAt: '2025-06-20 11:00:00', rolloutHistory: [], rollout: undefined,
      },
      {
        id: 'win-1.0.17', version: '1.0.17',
        downloadLinks: ['https://down.hznode.cc/hz-win-1.0.17.exe', '', '', ''],
        changelogZh: '初始版本', changelogEn: 'Initial release',
        isLatest: false, isDefault: false, isMinVersion: false, isFaulty: true,
        updatedAt: '2025-05-10 08:00:00', rolloutHistory: [], rollout: undefined,
      },
    ],
  },
  {
    id: 'ios', name: 'LINUX', dotColor: 'bg-blue-500', expanded: true,
    versions: [
      {
        id: 'ios-2.1.0', version: '2.1.0',
        downloadLinks: ['https://apps.apple.com/app/hz/id123456789', '', '', ''],
        changelogZh: '新功能：改进的用户界面和性能优化', changelogEn: 'New features: improved UI and performance optimizations',
        isLatest: true, isDefault: true, isMinVersion: false, isFaulty: false,
        updatedAt: '2025-10-15 09:30:00', rolloutHistory: [],
        rollout: {
          stages: [
            { id: 1, target: '5%',   users: 4100,  time: '6 hours',  status: 'completed' },
            { id: 2, target: '15%',  users: 12300, time: '6 hours',  status: 'completed' },
            { id: 3, target: '40%',  users: 32800, time: '12 hours', status: 'completed' },
            { id: 4, target: '100%', users: 82000, time: '0 hours',  status: 'completed' },
          ],
          stageConfig: INITIAL_GLOBAL_CONFIG.map(s => ({ ...s })),
          segment: 'All Users', startTime: '2025-10-05 10:00:00',
          currentPercent: 100, currentUsers: 82000, totalTargetUsers: 82000,
          expanded: false, status: 'completed',
        },
      },
      {
        id: 'ios-2.0.5', version: '2.0.5',
        downloadLinks: ['https://apps.apple.com/app/hz/id123456789', '', '', ''],
        changelogZh: '错误修复和稳定性改进', changelogEn: 'Bug fixes and stability improvements',
        isLatest: false, isDefault: false, isMinVersion: false, isFaulty: false,
        updatedAt: '2025-09-01 14:20:00', rolloutHistory: [],
        rollout: {
          stages: [
            { id: 1, target: '5%',   users: 4100,  time: '6 hours',  status: 'completed' },
            { id: 2, target: '15%',  users: 12300, time: '6 hours',  status: 'completed' },
            { id: 3, target: '40%',  users: 32800, time: '12 hours', status: 'completed' },
            { id: 4, target: '100%', users: 82000, time: '0 hours',  status: 'completed' },
          ],
          stageConfig: INITIAL_GLOBAL_CONFIG.map(s => ({ ...s })),
          segment: 'All Users', startTime: '2025-08-22 08:00:00',
          currentPercent: 100, currentUsers: 82000, totalTargetUsers: 82000,
          expanded: false, status: 'completed',
        },
      },
      {
        id: 'ios-2.0.3', version: '2.0.3',
        downloadLinks: ['https://apps.apple.com/app/hz/id123456789', '', '', ''],
        changelogZh: '性能改进', changelogEn: 'Performance improvements',
        isLatest: false, isDefault: false, isMinVersion: true, isFaulty: false,
        updatedAt: '2025-07-05 10:00:00', rolloutHistory: [], rollout: undefined,
      },
      {
        id: 'ios-2.0.1', version: '2.0.1',
        downloadLinks: ['https://apps.apple.com/app/hz/id123456789', '', '', ''],
        changelogZh: '严重错误修复', changelogEn: 'Critical bug fix',
        isLatest: false, isDefault: false, isMinVersion: false, isFaulty: true,
        updatedAt: '2025-06-10 12:00:00', rolloutHistory: [], rollout: undefined,
      },
      {
        id: 'ios-2.0.0', version: '2.0.0',
        downloadLinks: ['https://apps.apple.com/app/hz/id123456789', '', '', ''],
        changelogZh: '主要版本发布', changelogEn: 'Major version release',
        isLatest: false, isDefault: false, isMinVersion: false, isFaulty: true,
        updatedAt: '2025-05-01 09:00:00', rolloutHistory: [], rollout: undefined,
      },
    ],
  },
  {
    id: 'android', name: 'ANDROID', dotColor: 'bg-green-500', expanded: true,
    versions: [
      {
        id: 'android-1.0.22', version: '1.0.22',
        downloadLinks: ['https://down.hznode.cc/hz1.0.22.apk', '', '', ''],
        changelogZh: 'Performance optimization', changelogEn: 'Performance optimization',
        isLatest: true, isDefault: false, isMinVersion: false, isFaulty: false,
        updatedAt: '2025-10-30 10:20:15', rolloutHistory: [],
        rollout: {
          stages: [
            { id: 1, target: '5%',   users: 4100,  time: '6 hours',  status: 'completed' },
            { id: 2, target: '15%',  users: 12300, time: '6 hours',  status: 'active', timeLeft: '4h 37m left' },
            { id: 3, target: '40%',  users: 32800, time: '12 hours', status: 'pending' },
            { id: 4, target: '100%', users: 82000, time: '0 hours',  status: 'pending' },
          ],
          stageConfig: INITIAL_GLOBAL_CONFIG.map(s => ({ ...s })),
          segment: 'All Users', startTime: '2025-10-29 15:44:36',
          currentPercent: 9.6, currentUsers: 1077, totalTargetUsers: 82000,
          expanded: true, status: 'in_progress',
        },
      },
      {
        id: 'android-1.0.21', version: '1.0.21',
        downloadLinks: ['https://down.hznode.cc/hz1.0.21.apk', '', '', ''],
        changelogZh: 'Bug fixes', changelogEn: 'Bug fixes',
        isLatest: false, isDefault: true, isMinVersion: false, isFaulty: false,
        updatedAt: '2025-09-29 15:44:36', rolloutHistory: [],
        rollout: {
          stages: [
            { id: 1, target: '5%',   users: 260,  time: '6 hours',  status: 'completed' },
            { id: 2, target: '15%',  users: 780,  time: '6 hours',  status: 'completed' },
            { id: 3, target: '40%',  users: 2080, time: '12 hours', status: 'completed' },
            { id: 4, target: '100%', users: 5200, time: '0 hours',  status: 'completed' },
          ],
          stageConfig: INITIAL_GLOBAL_CONFIG.map(s => ({ ...s })),
          segment: 'VIP Users', startTime: '2025-09-20 10:00:00',
          currentPercent: 100, currentUsers: 5200, totalTargetUsers: 5200,
          expanded: false, status: 'completed',
        },
      },
      {
        id: 'android-1.0.20', version: '1.0.20',
        downloadLinks: ['https://down.hznode.cc/hz1.0.20.apk', '', '', ''],
        changelogZh: '界面更新', changelogEn: 'UI updates',
        isLatest: false, isDefault: false, isMinVersion: false, isFaulty: false,
        updatedAt: '2025-08-15 10:00:00', rolloutHistory: [], rollout: undefined,
      },
      {
        id: 'android-1.0.19', version: '1.0.19',
        downloadLinks: ['https://down.hznode.cc/hz1.0.19.apk', '', '', ''],
        changelogZh: '崩溃修复', changelogEn: 'Crash fix',
        isLatest: false, isDefault: false, isMinVersion: true, isFaulty: false,
        updatedAt: '2025-07-20 08:30:00', rolloutHistory: [], rollout: undefined,
      },
      {
        id: 'android-1.0.18', version: '1.0.18',
        downloadLinks: ['https://down.hznode.cc/hz1.0.18.apk', '', '', ''],
        changelogZh: '已知严重错误', changelogEn: 'Known critical bugs',
        isLatest: false, isDefault: false, isMinVersion: false, isFaulty: true,
        updatedAt: '2025-06-30 09:00:00', rolloutHistory: [], rollout: undefined,
      },
    ],
  },
];

// ─── Pure Helpers ─────────────────────────────────────────────────────────────

function segmentSize(segment: string): number {
  return SEGMENT_SIZES[segment] ?? 82000;
}




function buildRolloutFromConfig(stageConfig: StageConfig[], segment: string, prevExpanded = true): RolloutData {
  const total = segmentSize(segment);
  const last  = stageConfig[stageConfig.length - 1];
  const totalTargetUsers = Math.round(total * (last?.percent ?? 100) / 100);
  return {
    stages: stageConfig.map((s, i) => ({ id: i + 1, target: `${s.percent}%`, users: Math.round(total * s.percent / 100), time: `${s.time} hours`, status: 'pending', timeLeft: undefined })),
    stageConfig: stageConfig.map(s => ({ ...s })), segment, startTime: '',
    currentPercent: 0, currentUsers: 0, totalTargetUsers, expanded: prevExpanded, status: 'not_started',
  };
}

function getActiveStageBadge(rollout: RolloutData): string {
  if (rollout.status === 'not_started') return 'Not Started';
  if (rollout.status === 'completed')   return 'Completed';
  if (rollout.status === 'stopped')     return 'Stopped';
  const active = rollout.stages.find(s => s.status === 'active');
  if (active) return `Stage ${active.id} – ${active.target}`;
  return 'Starting…';
}

const LINK_META = [
  { label: 'Download Link 1', sub: '* Primary for In-App Free User',  optional: false },
  { label: 'Download Link 2', sub: '* Primary for In-App Paid User',  optional: true  },
  { label: 'Download Link 3', sub: '* Primary for Website',            optional: false },
  { label: 'Download Link 4', sub: '* Alternative for Website',        optional: true  },
];

// ─── SegmentDropdown ──────────────────────────────────────────────────────────

function SegmentDropdownImpl({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => {
        const el = document.querySelector<HTMLInputElement>('[data-segment-search]');
        el?.focus();
      }, 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!(e.target as Element).closest('[data-segment-dropdown]')) {
        setOpen(false); setSearch('');
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const filtered = SEGMENTS.filter(s => s.toLowerCase().includes(search.toLowerCase()));

  return (
    <div data-segment-dropdown className="relative">
      <button type="button" onClick={() => { setOpen(v => !v); setSearch(''); }}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-left flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white hover:border-gray-400 transition-colors">
        <span className={value ? 'text-slate-800' : 'text-gray-400'}>{value || 'All Users (default)'}</span>
        <div className="flex items-center gap-1 shrink-0">
          {value && (
            <span role="button" onClick={e => { e.stopPropagation(); onChange(''); }}
              className="text-gray-400 hover:text-gray-600 rounded p-0.5 hover:bg-gray-100 transition-colors">
              <X size={13} />
            </span>
          )}
          <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {open && (
        <div className="absolute z-[60] top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-2 border-b border-gray-100">
            <input data-segment-search type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search segments…"
              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div className="max-h-44 overflow-y-auto py-1">
            {filtered.length === 0
              ? <div className="px-3 py-2 text-sm text-gray-400">No results</div>
              : filtered.map(seg => (
                <button key={seg} type="button" onClick={() => { onChange(seg); setOpen(false); setSearch(''); }}
                  className={`w-full px-3 py-2 text-sm text-left flex items-center justify-between hover:bg-blue-50 transition-colors ${value === seg ? 'text-blue-700 font-medium' : 'text-slate-700'}`}>
                  <span>{seg}</span>
                  <span className="text-xs text-gray-400 ml-2">{(SEGMENT_SIZES[seg] ?? 0).toLocaleString()} users</span>
                  {value === seg && <Check size={13} className="text-blue-600 shrink-0 ml-1" />}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── StagesEditor ─────────────────────────────────────────────────────────────

function StagesEditor({ stages, onChange, onAdd, onDelete }: {
  stages: StageConfig[];
  onChange: (id: number, field: 'percent' | 'time', value: number) => void;
  onAdd: () => void; onDelete: (id: number) => void;
}) {
  return (
    <div className="space-y-2">
      {stages.map((stage, index) => (
        <div key={stage.id} className="border border-gray-200 rounded-lg p-3 bg-white flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100 shrink-0">{index + 1}</div>
          <div className="flex-1 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-gray-500 mb-1">Target %</label>
              <div className="relative">
                <input type="number" value={stage.percent} onChange={e => onChange(stage.id, 'percent', Number(e.target.value))}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm pr-7 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                <span className="absolute right-2 top-1.5 text-gray-400 text-xs">%</span>
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 mb-1">Wait (hours)</label>
              <input type="number" value={stage.time} onChange={e => onChange(stage.id, 'time', Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
          </div>
          <button type="button" onClick={() => onDelete(stage.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button type="button" onClick={onAdd}
        className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400 transition-all flex items-center justify-center gap-1.5 text-sm font-medium">
        <Plus size={14} /> Add Stage
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AppVersionConfig() {
  const [platforms, setPlatforms] = useState<PlatformData[]>(INITIAL_PLATFORMS);
  const [globalStages, setGlobalStages] = useState<StageConfig[]>(INITIAL_GLOBAL_CONFIG);
  const [showGlobalConfigModal, setShowGlobalConfigModal] = useState(false);

  // Stop Release
  const [stopReleaseTarget, setStopReleaseTarget] = useState<{ platformId: string; versionId: string } | null>(null);

  // More menu
  const [openMoreMenu, setOpenMoreMenu] = useState<string | null>(null);

  // Add modal
  const [addModal, setAddModal] = useState<{ platformId: string } | null>(null);
  const [addForm, setAddForm] = useState({
    version: '', downloadLinks: ['', '', '', ''], changelogZh: '', changelogEn: '', autoTranslate: false,
  });

  // Start Rollout dialog
  const [startRolloutTarget, setStartRolloutTarget] = useState<{ platformId: string; versionId: string } | null>(null);
  const [startRolloutForm, setStartRolloutForm] = useState({
    segment: '', useGlobal: true, stages: [] as StageConfig[],
  });
  const [showStartConfirm, setShowStartConfirm] = useState(false);

  // Edit modal
  const [editModal, setEditModal] = useState<{ platformId: string; versionId: string } | null>(null);
  const [editForm, setEditForm] = useState({
    version: '', downloadLinks: ['', '', '', ''], changelogZh: '', changelogEn: '',
    autoTranslate: false, setAsDefault: false, setAsMin: false,
    rolloutStages: [] as StageConfig[], rolloutSegment: '', rolloutModified: false, editUseGlobal: false,
  });

  // Close more menu on outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!(e.target as Element).closest('[data-more-menu]')) setOpenMoreMenu(null);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  // ── Derived ──
  const addingPlatform  = addModal  ? platforms.find(p => p.id === addModal.platformId)  : null;
  const editingPlatform = editModal ? platforms.find(p => p.id === editModal.platformId) : null;
  const editingVersion  = editModal ? editingPlatform?.versions.find(v => v.id === editModal.versionId) : null;

  // ── Platform/rollout toggles ──
  const togglePlatform = (id: string) =>
    setPlatforms(prev => prev.map(p => p.id === id ? { ...p, expanded: !p.expanded } : p));


  // ── Stop release ──
  const handleStopRelease = (platformId: string, versionId: string) => {
    setPlatforms(prev => prev.map(p => {
      if (p.id !== platformId) return p;
      const defaultVer = p.versions.find(v => v.isDefault && v.id !== versionId);
      return {
        ...p, versions: p.versions.map(v => {
          if (v.id === versionId) return { ...v, isLatest: false, rollout: v.rollout ? { ...v.rollout, status: 'stopped' as RolloutStatus } : v.rollout };
          if (defaultVer && v.id === defaultVer.id) return { ...v, isLatest: true };
          return v;
        }),
      };
    }));
    setStopReleaseTarget(null);
  };

  // ── More menu tag actions ──
  const handleSetDefault = (platformId: string, versionId: string) => {
    setPlatforms(prev => prev.map(p =>
      p.id !== platformId ? p : { ...p, versions: p.versions.map(v => ({ ...v, isDefault: v.id === versionId })) }
    ));
    setOpenMoreMenu(null);
  };
  const handleSetMinVersion = (platformId: string, versionId: string) => {
    setPlatforms(prev => prev.map(p =>
      p.id !== platformId ? p : { ...p, versions: p.versions.map(v => ({ ...v, isMinVersion: v.id === versionId })) }
    ));
    setOpenMoreMenu(null);
  };
  const handleToggleFaulty = (platformId: string, versionId: string) => {
    setPlatforms(prev => prev.map(p =>
      p.id !== platformId ? p : { ...p, versions: p.versions.map(v => v.id !== versionId ? v : { ...v, isFaulty: !v.isFaulty }) }
    ));
    setOpenMoreMenu(null);
  };

  // ── Open modals ──
  const openAddModal = (platformId: string) => {
    setAddModal({ platformId });
    setAddForm({ version: '', downloadLinks: ['', '', '', ''], changelogZh: '', changelogEn: '', autoTranslate: false });
  };

  const openStartRolloutDialog = (platformId: string, versionId: string) => {
    const version = platforms.find(p => p.id === platformId)?.versions.find(v => v.id === versionId);
    setStartRolloutTarget({ platformId, versionId });
    setStartRolloutForm({
      segment: '',
      useGlobal: true,
      stages: version?.rollout?.stageConfig.map(s => ({ ...s })) ?? globalStages.map(s => ({ ...s })),
    });
  };

  const openEditModal = (platformId: string, versionId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    const version  = platform?.versions.find(v => v.id === versionId);
    if (!version) return;
    setEditModal({ platformId, versionId });
    setEditForm({
      version: version.version, downloadLinks: [...version.downloadLinks],
      changelogZh: version.changelogZh, changelogEn: version.changelogEn,
      autoTranslate: false, setAsDefault: version.isDefault, setAsMin: version.isMinVersion,
      rolloutStages: version.rollout?.stageConfig.map(s => ({ ...s })) ?? globalStages.map(s => ({ ...s })),
      rolloutSegment: version.rollout?.segment === 'All Users' ? '' : (version.rollout?.segment ?? ''),
      rolloutModified: false, editUseGlobal: false,
    });
  };

  // ── Start Rollout form helpers ──
  const updateStartStage = (id: number, f: 'percent' | 'time', v: number) => setStartRolloutForm(a => ({ ...a, stages: a.stages.map(s => s.id === id ? { ...s, [f]: v } : s) }));
  const addStartStage    = () => setStartRolloutForm(a => ({ ...a, stages: [...a.stages, { id: Date.now(), percent: 0, time: 6 }] }));
  const deleteStartStage = (id: number) => setStartRolloutForm(a => ({ ...a, stages: a.stages.filter(s => s.id !== id) }));

  // ── Global config helpers ──
  const updateGlobalStage = (id: number, f: 'percent' | 'time', v: string) => setGlobalStages(prev => prev.map(s => s.id === id ? { ...s, [f]: Number(v) } : s));
  const addGlobalStage    = () => setGlobalStages(prev => [...prev, { id: Date.now(), percent: 0, time: 6 }]);
  const deleteGlobalStage = (id: number) => setGlobalStages(prev => prev.filter(s => s.id !== id));

  // ── Save handlers ──
  const handleSaveAdd = () => {
    if (!addModal) return;
    const newVersion: VersionData = {
      id: `${addModal.platformId}-${addForm.version}-${Date.now()}`,
      version: addForm.version, downloadLinks: [...addForm.downloadLinks],
      changelogZh: addForm.changelogZh, changelogEn: addForm.changelogEn,
      isLatest: true, isDefault: false, isMinVersion: false, isFaulty: false,
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      rolloutHistory: [], rollout: buildRolloutFromConfig(globalStages, 'All Users'),
    };
    setPlatforms(prev => prev.map(p =>
      p.id !== addModal.platformId ? p : { ...p, dotColor: 'bg-green-500', versions: [newVersion, ...p.versions.map(v => ({ ...v, isLatest: false }))] }
    ));
    setAddModal(null);
  };

  const handleConfirmStartRollout = () => {
    if (!startRolloutTarget) return;
    const { platformId, versionId } = startRolloutTarget;
    const cfg = startRolloutForm.useGlobal ? globalStages : startRolloutForm.stages;
    const seg = startRolloutForm.segment || 'All Users';
    setPlatforms(prev => prev.map(p =>
      p.id !== platformId ? p : {
        ...p, versions: p.versions.map(v => {
          if (v.id !== versionId || !v.rollout) return v;
          const total = segmentSize(seg);
          const last  = cfg[cfg.length - 1];
          const totalTargetUsers = Math.round(total * (last?.percent ?? 100) / 100);
          const newStages: RolloutStageDisplay[] = cfg.map((s, i) => ({
            id: i + 1, target: `${s.percent}%`, users: Math.round(total * s.percent / 100),
            time: `${s.time} hours`,
            status: i === 0 ? 'active' : 'pending',
            timeLeft: i === 0 ? `${s.time}h 0m left` : undefined,
          }));
          return {
            ...v, rollout: {
              ...v.rollout, stages: newStages, stageConfig: cfg.map(s => ({ ...s })),
              segment: seg, totalTargetUsers,
              status: 'in_progress' as RolloutStatus,
              startTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
              expanded: true,
            },
          };
        }),
      }
    ));
    setStartRolloutTarget(null);
  };

  const handleSaveEdit = () => {
    if (!editModal) return;
    setPlatforms(prev => prev.map(p =>
      p.id !== editModal.platformId ? p : {
        ...p, versions: p.versions.map(v =>
          v.id !== editModal.versionId ? v : {
            ...v, version: editForm.version, downloadLinks: [...editForm.downloadLinks],
            changelogZh: editForm.changelogZh, changelogEn: editForm.changelogEn,
            isDefault: editForm.setAsDefault, isMinVersion: editForm.setAsMin,
          }
        ),
      }
    ));
    setEditModal(null);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Render helpers
  // ─────────────────────────────────────────────────────────────────────────────

  function renderRolloutBox(platformId: string, version: VersionData) {
    const r = version.rollout;
    if (!r) return null;

    // ── STOPPED ──
    if (r.status === 'stopped') {
      return (
        <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
          <div className="p-3 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <div className="text-gray-400"><Settings size={15} /></div>
                <span>Gradual Rollout Progress</span>
              </div>
              <span className="text-xs text-gray-400">(Note: Release data retained for 1 month)</span>
            </div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700">Current Update Status</span>
              <span className="text-slate-700">{r.currentPercent}%</span>
            </div>
            <p className="text-xs text-gray-400 mb-2">{r.currentUsers.toLocaleString()} of {r.totalTargetUsers.toLocaleString()} target users have updated</p>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-3">
              <div className="bg-gray-400 h-full transition-all" style={{ width: `${r.currentPercent}%` }} />
            </div>
            <div className="flex items-center justify-between py-2 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Target Segment</p>
                  <p className="text-xs font-semibold text-slate-700">{r.segment || 'All Users'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{r.currentPercent}% of users have updated</p>
                <p className="text-xs text-red-500 font-medium">Rollout stopped</p>
              </div>
            </div>
          </div>
          <div className="px-3 pb-3 bg-gray-50">
            <button onClick={e => { e.stopPropagation(); openStartRolloutDialog(platformId, version.id); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 transition-colors">
              <Rocket size={15} /> Rerun Rollout
            </button>
          </div>
        </div>
      );
    }

    // ── COMPLETED ──
    if (r.status === 'completed') {
      return (
        <div className="border border-green-200 rounded-lg bg-white overflow-hidden">
          <div className="p-3 bg-green-50/60">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                <div className="text-green-600"><Check size={16} /></div>
                <span>Gradual Rollout Progress</span>
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">Completed</span>
              </div>
              <span className="text-xs text-gray-400">(Note: Release data retained for 1 month)</span>
            </div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700">Current Update Status</span>
              <span className="text-green-700">100%</span>
            </div>
            <p className="text-xs text-gray-500 mb-2">{r.currentUsers.toLocaleString()} of {r.totalTargetUsers.toLocaleString()} target users have updated</p>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-3">
              <div className="bg-green-500 h-full w-full" />
            </div>
            <div className="flex items-center justify-between py-2 border-t border-green-200">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Target Segment</p>
                  <p className="text-xs font-semibold text-slate-700">{r.segment || 'All Users'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">100% of users have updated</p>
                <p className="text-xs text-green-600 font-medium">Rollout completed</p>
              </div>
            </div>
          </div>
          <div className="px-3 pb-3 bg-green-50/60">
            <button onClick={e => { e.stopPropagation(); openStartRolloutDialog(platformId, version.id); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 transition-colors">
              <Rocket size={15} /> Rerun Rollout
            </button>
          </div>
        </div>
      );
    }

    // ── NOT STARTED ──
    if (r.status === 'not_started') {
      return (
        <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
          <div className="p-3 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                <div className="text-slate-400"><Settings size={16} /></div>
                <span>Gradual Rollout Progress</span>
              </div>
              <span className="text-xs text-gray-400">(Note: Release data retained for 1 month)</span>
            </div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-600 font-semibold">Current Update Status</span>
              <span className="text-slate-600">0.0%</span>
            </div>
            <p className="text-xs text-gray-400 mb-2">0 of {r.totalTargetUsers.toLocaleString()} target users have updated</p>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-3">
              <div className="bg-gray-300 h-full w-0" />
            </div>
          </div>
          <div className="px-3 pb-3 bg-gray-50">
            <button onClick={e => { e.stopPropagation(); openStartRolloutDialog(platformId, version.id); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 transition-colors">
              <Rocket size={15} /> Start Rollout
            </button>
          </div>
        </div>
      );
    }

    // ── IN PROGRESS ──
    return (
      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <div className="p-3 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-800 flex-wrap">
              <div className="text-blue-600"><Settings size={16} /></div>
              <span>Gradual Rollout Progress</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">{getActiveStageBadge(r)}</span>
              <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">{r.segment || 'All Users'}</span>
            </div>
            <span className="text-xs text-gray-400 shrink-0">(Note: Release data retained for 1 month)</span>
          </div>
          <div className="flex justify-between text-xs font-medium mb-1">
            <span className="text-slate-700">Current Update Status</span>
            <span className="text-slate-700">{r.currentPercent}%</span>
          </div>
          <p className="text-xs text-gray-500 mb-2">{r.currentUsers.toLocaleString()} of {r.totalTargetUsers.toLocaleString()} target users have updated</p>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div className="bg-slate-500 h-full transition-all" style={{ width: `${r.currentPercent}%` }} />
          </div>
        </div>
        <div className="px-3 pb-3 bg-white">
          {r.stages.map(stage => {
            const isActive    = stage.status === 'active';
            const isCompleted = stage.status === 'completed';
            return (
              <div key={stage.id} className={`flex items-center py-2 px-2 mt-2 rounded-lg transition-all ${isActive ? 'bg-gray-100 border border-gray-300 shadow-sm' : 'border border-transparent hover:bg-gray-50'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mr-3 shrink-0 ${isCompleted ? 'bg-green-100 text-green-700' : isActive ? 'bg-slate-800 text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>{stage.id}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-sm font-bold ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>Stage {stage.id}</span>
                    {isActive && <span className="bg-white border border-gray-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Current Stage</span>}
                  </div>
                  <div className="text-xs text-gray-500">Target: <span className="font-medium text-slate-700">{stage.target}</span><span className="opacity-70"> · approx. {stage.users.toLocaleString()} users</span></div>
                </div>
                <div className="text-right shrink-0">
                  {isActive ? <span className="text-xs font-bold text-slate-700 flex items-center gap-1"><Clock size={12} /> {stage.timeLeft}</span>
                    : isCompleted ? <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Completed</span>
                    : <span className="text-[10px] text-gray-400">Pending</span>}
                </div>
              </div>
            );
          })}
          <div className="mt-3 flex justify-between items-center">
            <span className="text-xs text-gray-400">Start time: {r.startTime}</span>
            <button onClick={e => { e.stopPropagation(); setStopReleaseTarget({ platformId, versionId: version.id }); }}
              className="text-xs text-red-500 flex items-center gap-1 hover:underline"><Trash2 size={12} /> Stop Release</button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Main render
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-slate-800 overflow-y-auto">

      {/* Page Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">App Version Configuration</h1>
        <button onClick={() => setShowGlobalConfigModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 text-slate-600 shadow-sm transition-all">
          <Settings size={16} /> Global Rollout Config
        </button>
      </div>

      {/* Platform list */}
      <div className="space-y-4">
        {platforms.map(platform => {
          const defaultVer = platform.versions.find(v => v.isDefault);
          const latestVer  = platform.versions.find(v => v.isLatest);
          const displayVer = defaultVer ?? latestVer;

          return (
            <div key={platform.id} className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors" onClick={() => togglePlatform(platform.id)}>
                <div className="flex items-center gap-4">
                  {platform.expanded ? <ChevronDown className="text-gray-600" size={20} /> : <ChevronRight className="text-gray-400" size={20} />}
                  <div className={`w-2.5 h-2.5 rounded-full ${platform.dotColor}`} />
                  <span className="font-bold text-lg">{platform.name}</span>
                  <span className="text-gray-400 text-sm">{platform.versions.length === 0 ? 'No default version' : `v${displayVer?.version ?? ''}`}</span>
                </div>
                <button onClick={e => { e.stopPropagation(); openAddModal(platform.id); }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                  <Plus size={16} /> Add Version
                </button>
              </div>

              {platform.expanded && (
                <div className="px-4 md:px-6 pb-4 md:pb-6 pt-2 border-t border-gray-50 space-y-3">
                  {platform.versions.length === 0 ? (
                    <p className="text-sm text-gray-400 py-6 text-center">No versions yet. Click "Add Version" to get started.</p>
                  ) : (
                    platform.versions.map(version => (
                      <div key={version.id}
                        className={`border rounded-lg p-3 md:p-5 bg-white ${
                          version.isFaulty ? 'border-red-200'
                            : version.isLatest ? 'border-blue-200'
                            : 'border-gray-200'
                        }`}>
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-lg text-slate-800">v{version.version}</span>
                            {version.isLatest && <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">Latest</span>}
                            {version.isDefault && <span className="bg-black text-white text-xs px-2 py-0.5 rounded">Default</span>}
                            {version.isMinVersion && <span className="bg-gray-400 text-white text-xs px-2 py-0.5 rounded">Min</span>}
                            {version.isFaulty && <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded font-semibold">Faulty</span>}
                          </div>
                          {/* Action icons */}
                          <div className="flex gap-1 text-gray-400 shrink-0 items-center">
                            {/* More menu */}
                            <div className="relative" data-more-menu>
                              <button onClick={e => { e.stopPropagation(); setOpenMoreMenu(openMoreMenu === version.id ? null : version.id); }}
                                className="hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100">
                                <MoreHorizontal size={18} />
                              </button>
                              {openMoreMenu === version.id && (
                                <div className="absolute right-0 top-8 z-50 bg-white border border-gray-200 rounded-lg shadow-xl w-48 py-1">
                                  <button onClick={() => handleSetDefault(platform.id, version.id)}
                                    className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 text-slate-700 flex items-center gap-2">
                                    Set as Default
                                  </button>
                                  <button onClick={() => handleSetMinVersion(platform.id, version.id)}
                                    className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 text-slate-700 flex items-center gap-2">
                                    Set as Minimum
                                  </button>
                                  <div className="border-t border-gray-100 my-1" />
                                  <button onClick={() => handleToggleFaulty(platform.id, version.id)}
                                    className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2 ${version.isFaulty ? 'text-gray-600' : 'text-red-600'}`}>
                                    {version.isFaulty ? 'Remove Faulty Tag' : 'Mark as Faulty'}
                                  </button>
                                </div>
                              )}
                            </div>
                            <button onClick={() => openEditModal(platform.id, version.id)} className="hover:text-blue-600 transition-colors p-1 rounded hover:bg-gray-100">
                              <Edit2 size={17} />
                            </button>
                            <button className="hover:text-red-500 transition-colors p-1 rounded hover:bg-gray-100">
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-gray-400 mb-3">Updated on: {version.updatedAt}</p>

                        {/* Changelog row */}
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                          <span>Changelog:</span>
                          <button className="text-gray-400 hover:text-gray-600 transition-colors"><RefreshCw size={15} /></button>
                        </div>

                        {/* Download links — two columns */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-2">In-App Download Links:</p>
                            <div className="space-y-1.5">
                              {[version.downloadLinks[0], version.downloadLinks[1]].some(Boolean)
                                ? [version.downloadLinks[0], version.downloadLinks[1]].map((link, i) => link ? (
                                  <div key={i} className="flex items-center gap-1.5 border border-gray-200 rounded px-2 py-1.5 bg-white">
                                    <Copy size={12} className="shrink-0 text-gray-400" />
                                    <span className="truncate text-xs text-gray-600">{link}</span>
                                  </div>
                                ) : null)
                                : <p className="text-xs text-gray-400">No links</p>}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Website Download Links:</p>
                            <div className="space-y-1.5">
                              {[version.downloadLinks[2], version.downloadLinks[3]].some(Boolean)
                                ? [version.downloadLinks[2], version.downloadLinks[3]].map((link, i) => link ? (
                                  <div key={i} className="flex items-center gap-1.5 border border-gray-200 rounded px-2 py-1.5 bg-white">
                                    <Copy size={12} className="shrink-0 text-gray-400" />
                                    <span className="truncate text-xs text-gray-600">{link}</span>
                                  </div>
                                ) : null)
                                : <p className="text-xs text-gray-400">No links</p>}
                            </div>
                          </div>
                        </div>

                        {renderRolloutBox(platform.id, version)}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          ADD VERSION MODAL
      ═══════════════════════════════════════════════════════════════════════ */}
      {addModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-2xl my-8 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 flex justify-between items-center rounded-t-lg">
              <h2 className="text-lg font-bold text-slate-800">Add New {addingPlatform?.name} App Version</h2>
              <button onClick={() => setAddModal(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">App Version</label>
                <input type="text" value={addForm.version} onChange={e => setAddForm(f => ({ ...f, version: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 1.0.0" />
              </div>
              {LINK_META.map(({ label, sub, optional }, i) => (
                <div key={i} className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700">{label}{optional && <span className="font-normal text-gray-400"> (optional)</span>}</label>
                  <input type="text" value={addForm.downloadLinks[i]} onChange={e => setAddForm(f => { const links = [...f.downloadLinks]; links[i] = e.target.value; return { ...f, downloadLinks: links }; })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
              ))}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">Chinese Changelog</label>
                <textarea value={addForm.changelogZh} onChange={e => setAddForm(f => ({ ...f, changelogZh: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-24 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">English Changelog</label>
                <textarea value={addForm.changelogEn} onChange={e => setAddForm(f => ({ ...f, changelogEn: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-24 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="add_translate" checked={addForm.autoTranslate} onChange={e => setAddForm(f => ({ ...f, autoTranslate: e.target.checked }))} className="rounded border-gray-300 text-blue-600" />
                <label htmlFor="add_translate" className="text-sm text-gray-600">Auto translate Chinese changelog</label>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
              <button onClick={() => setAddModal(null)} className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSaveAdd} className="px-4 py-2 bg-black text-white rounded text-sm font-medium hover:bg-slate-800 flex items-center gap-2"><Save size={16} /> Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          EDIT VERSION MODAL
      ═══════════════════════════════════════════════════════════════════════ */}
      {editModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-2xl my-8 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 flex justify-between items-center rounded-t-lg">
              <h2 className="text-lg font-bold text-slate-800">Edit {editingPlatform?.name} v{editingVersion?.version} Configuration</h2>
              <button onClick={() => setEditModal(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">App Version</label>
                <input type="text" value={editForm.version} onChange={e => setEditForm(f => ({ ...f, version: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              {LINK_META.map(({ label, sub, optional }, i) => (
                <div key={i} className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700">{label}{optional && <span className="font-normal text-gray-400"> (optional)</span>}</label>
                  <input type="text" value={editForm.downloadLinks[i] ?? ''} onChange={e => setEditForm(f => { const links = [...f.downloadLinks]; links[i] = e.target.value; return { ...f, downloadLinks: links }; })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
              ))}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">Chinese Changelog</label>
                <textarea value={editForm.changelogZh} onChange={e => setEditForm(f => ({ ...f, changelogZh: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-24 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">English Changelog</label>
                <textarea value={editForm.changelogEn} onChange={e => setEditForm(f => ({ ...f, changelogEn: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-24 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="edit_translate" checked={editForm.autoTranslate} onChange={e => setEditForm(f => ({ ...f, autoTranslate: e.target.checked }))} className="rounded border-gray-300 text-blue-600" />
                <label htmlFor="edit_translate" className="text-sm text-gray-600">Auto-translate Chinese changelog</label>
              </div>
              <div className="space-y-2 pt-1">
                <label className="block text-sm font-semibold text-slate-700">Version Settings</label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="set_default" checked={editForm.setAsDefault} onChange={e => setEditForm(f => ({ ...f, setAsDefault: e.target.checked }))} className="rounded border-gray-300 text-blue-600" />
                    <label htmlFor="set_default" className="text-sm text-slate-700">Set as default version</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="set_min" checked={editForm.setAsMin} onChange={e => setEditForm(f => ({ ...f, setAsMin: e.target.checked }))} className="rounded border-gray-300 text-blue-600" />
                    <label htmlFor="set_min" className="text-sm text-slate-700">Set as minimum version</label>
                  </div>
                </div>
              </div>

            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
              <button onClick={() => setEditModal(null)} className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSaveEdit} className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 flex items-center gap-2"><Save size={16} /> Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          GLOBAL CONFIG MODAL
      ═══════════════════════════════════════════════════════════════════════ */}
      {showGlobalConfigModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-2xl my-8 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 flex justify-between items-start rounded-t-lg">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Global Gradual Rollout Stage Configuration</h2>
                <p className="text-xs text-gray-500 mt-1">Applied to new version releases when not using a custom per-version config</p>
              </div>
              <button onClick={() => setShowGlobalConfigModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="bg-blue-50 border border-blue-100 rounded-md p-3 flex items-start gap-2">
                <span className="text-sm shrink-0">💡</span>
                <p className="text-xs text-blue-800 leading-relaxed">Configure the default stages for gradual rollout across all platforms. Individual versions can override this with a custom config.</p>
              </div>
              <div className="space-y-3">
                {globalStages.map((stage, index) => (
                  <div key={stage.id} className="border border-gray-200 rounded-lg p-3 bg-white flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100 shrink-0">{index + 1}</div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-gray-500 mb-1">Target Percentage</label>
                        <div className="relative">
                          <input type="number" value={stage.percent} onChange={e => updateGlobalStage(stage.id, 'percent', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                          <span className="absolute right-3 top-1.5 text-gray-400 text-sm">%</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 mb-1">Wait Duration</label>
                        <div className="relative">
                          <input type="number" value={stage.time} onChange={e => updateGlobalStage(stage.id, 'time', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm pr-14 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                          <span className="absolute right-3 top-1.5 text-gray-400 text-sm">hours</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => deleteGlobalStage(stage.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded transition-colors"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
              <button onClick={addGlobalStage} className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400 transition-all flex items-center justify-center gap-2 text-sm font-medium">
                <Plus size={16} /> Add Stage
              </button>
              <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4">
                <h4 className="flex items-center gap-2 text-xs font-bold text-yellow-700 mb-2"><span>⚠️</span> Configuration Recommendations</h4>
                <ul className="list-disc list-inside text-[11px] text-yellow-800 space-y-1 ml-1">
                  <li>The first stage should have a small percentage (e.g., 5%) to detect issues early</li>
                  <li>The last stage should be set to 100% to ensure full release</li>
                  <li>Each stage's wait duration should be sufficient to observe issues (recommend at least 6 hours)</li>
                  <li>Target percentages should increase progressively to gradually expand release scope</li>
                </ul>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center rounded-b-lg">
              <button onClick={() => setGlobalStages(INITIAL_GLOBAL_CONFIG)} className="text-gray-500 text-sm hover:text-gray-700 flex items-center gap-1">
                <RotateCcw size={14} /> Restore Default Config
              </button>
              <div className="flex gap-3">
                <button onClick={() => setShowGlobalConfigModal(false)} className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button onClick={() => setShowGlobalConfigModal(false)} className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 flex items-center gap-2"><Save size={16} /> Save Config</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          START ROLLOUT DIALOG
      ═══════════════════════════════════════════════════════════════════════ */}
      {startRolloutTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-lg my-8 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 flex justify-between items-center rounded-t-lg">
              <div>
                <h2 className="text-base font-bold text-slate-800">Start Rollout</h2>
                <p className="text-xs text-gray-500 mt-0.5">Configure segment and stages before launching</p>
              </div>
              <button onClick={() => { setStartRolloutTarget(null); setShowStartConfirm(false); }} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Segment */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">Target Segment</label>
                <SegmentDropdownImpl value={startRolloutForm.segment} onChange={v => setStartRolloutForm(f => ({ ...f, segment: v }))} />
                <p className="text-xs text-gray-400">Leave blank to target all users.</p>
              </div>
              {/* Stages */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-semibold text-slate-700">Rollout Stages</label>
                  <button type="button"
                    onClick={() => setStartRolloutForm(f => ({ ...f, useGlobal: !f.useGlobal, stages: f.useGlobal ? globalStages.map(s => ({ ...s })) : f.stages }))}
                    className={`text-xs px-3 py-1 rounded-full border font-medium transition-all ${startRolloutForm.useGlobal ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'}`}>
                    {startRolloutForm.useGlobal ? 'Using Global Config — Switch to Custom' : 'Using Custom Config — Switch to Global'}
                  </button>
                </div>
                {startRolloutForm.useGlobal ? (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 space-y-2 border border-blue-200">
                    {globalStages.map((item, index) => (
                      <div key={item.id} className="bg-white rounded-lg p-3 border border-blue-100 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100 shrink-0">{index + 1}</div>
                        <div className="flex-1 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-800">Target {item.percent}%</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-xs text-gray-600">~{Math.round(segmentSize(startRolloutForm.segment || 'All Users') * item.percent / 100).toLocaleString()} users</span>
                          </div>
                          <span className="text-sm font-semibold text-slate-700">Wait {item.time}h</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <StagesEditor stages={startRolloutForm.stages} onChange={updateStartStage} onAdd={addStartStage} onDelete={deleteStartStage} />
                )}
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
              <button onClick={() => { setStartRolloutTarget(null); setShowStartConfirm(false); }} className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={() => setShowStartConfirm(true)} className="px-4 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 flex items-center gap-2">
                <Play size={14} /> Start Rollout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          START ROLLOUT CONFIRM
      ═══════════════════════════════════════════════════════════════════════ */}
      {showStartConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-lg w-full max-w-sm shadow-2xl">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Play size={18} className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Confirm Start Rollout</h3>
                  <p className="text-xs text-gray-500">Please review your configuration</p>
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-xs text-slate-700 space-y-1.5 mb-4">
                <p>• Segment: <strong>{startRolloutForm.segment || 'All Users'}</strong></p>
                <p>• Stages: <strong>{startRolloutForm.useGlobal ? 'Global config' : 'Custom config'}</strong> ({(startRolloutForm.useGlobal ? globalStages : startRolloutForm.stages).length} stages)</p>
                <p>• Stage 1 will begin <strong>immediately</strong></p>
              </div>
              <p className="text-xs text-gray-500">Do you want to apply these settings and start the rollout?</p>
            </div>
            <div className="px-5 pb-5 flex justify-end gap-3">
              <button onClick={() => setShowStartConfirm(false)} className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
                Go Back
              </button>
              <button
                onClick={() => { setShowStartConfirm(false); handleConfirmStartRollout(); }}
                className="px-4 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 flex items-center gap-2"
              >
                <Play size={14} /> Confirm & Start
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          STOP RELEASE CONFIRMATION
      ═══════════════════════════════════════════════════════════════════════ */}
      {stopReleaseTarget && (() => {
        const plat = platforms.find(p => p.id === stopReleaseTarget.platformId);
        const ver  = plat?.versions.find(v => v.id === stopReleaseTarget.versionId);
        const defaultVer = plat?.versions.find(v => v.isDefault && v.id !== stopReleaseTarget.versionId);
        return (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg w-full max-w-sm shadow-2xl">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0"><Trash2 size={18} className="text-red-600" /></div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Stop Release</h3>
                    <p className="text-xs text-gray-500">The rollout will be halted and the Latest tag removed</p>
                  </div>
                </div>
                <p className="text-sm text-slate-700 mb-3">Stop the release of <strong>v{ver?.version}</strong> on {plat?.name}?</p>
                <div className="bg-red-50 border border-red-100 rounded-md p-3 text-xs text-red-800 space-y-1.5">
                  <p>• The gradual rollout will be stopped immediately</p>
                  <p>• <strong>v{ver?.version}</strong> will lose its Latest Version tag</p>
                  {defaultVer
                    ? <p>• <strong>v{defaultVer.version}</strong> (Default) will become the new Latest</p>
                    : <p>• No Default version found — no version will receive the Latest tag</p>}
                  <p>• The version will remain visible in the list</p>
                </div>
              </div>
              <div className="px-5 pb-5 flex justify-end gap-3">
                <button onClick={() => setStopReleaseTarget(null)} className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button onClick={() => handleStopRelease(stopReleaseTarget.platformId, stopReleaseTarget.versionId)}
                  className="px-4 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 flex items-center gap-2">
                  <Trash2 size={14} /> Confirm Stop
                </button>
              </div>
            </div>
          </div>
        );
      })()}


    </div>
  );
}

import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  MoreHorizontal, 
  Edit2, 
  Copy, 
  Trash2, 
  Clock, 
  Settings, 
  Save, 
  X,
  RotateCcw
} from 'lucide-react';

// --- Mock Data ---
const STAGES_MOCK = [
  { id: 1, target: '5%', users: 562, time: '6 hours', status: 'completed' },
  { id: 2, target: '15%', users: 1685, time: '6 hours', status: 'active', timeLeft: '4h 37m left' },
  { id: 3, target: '40%', users: 4494, time: '12 hours', status: 'pending' },
  { id: 4, target: '100%', users: 11234, time: '0 hours', status: 'pending' },
];

const INITIAL_GLOBAL_CONFIG = [
  { id: 1, percent: 5, time: 6 },
  { id: 2, percent: 15, time: 6 },
  { id: 3, percent: 40, time: 12 },
  { id: 4, percent: 100, time: 0 },
];

export default function AppVersionConfig() {
  const [androidExpanded, setAndroidExpanded] = useState(true);
  const [rolloutExpanded, setRolloutExpanded] = useState(true);
  const [previousVersionRolloutExpanded, setPreviousVersionRolloutExpanded] = useState(false);
  
  // Modal Visibility States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showGlobalConfigModal, setShowGlobalConfigModal] = useState(false);

  // Global Config Data State
  const [globalStages, setGlobalStages] = useState(INITIAL_GLOBAL_CONFIG);

  // --- Handlers for Global Config ---
  const handleStageChange = (id, field, value) => {
    setGlobalStages(stages => stages.map(stage => 
      stage.id === id ? { ...stage, [field]: value } : stage
    ));
  };

  const handleAddStage = () => {
    const newStage = {
      id: Date.now(),
      percent: 0,
      time: 6
    };
    setGlobalStages([...globalStages, newStage]);
  };

  const handleDeleteStage = (id) => {
    setGlobalStages(stages => stages.filter(stage => stage.id !== id));
  };

  const handleRestoreDefaults = () => {
    setGlobalStages(INITIAL_GLOBAL_CONFIG);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-slate-800 overflow-y-auto">
      
      {/* --- Page Header --- */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">App Version Configuration</h1>
        
        <button 
          onClick={() => setShowGlobalConfigModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 text-slate-600 shadow-sm transition-all"
        >
          <Settings size={16} />
          Global Rollout Config
        </button>
      </div>

      <div className="space-y-4">
        
        {/* --- Windows Section (Collapsed Mock) --- */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ChevronRight className="text-gray-400" size={20} />
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
            <span className="font-bold text-lg">WINDOWS</span>
            <span className="text-gray-400 text-sm">v1.0.21</span>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
            <Plus size={16} /> Add Version
          </button>
        </div>

        {/* --- iOS Section (Collapsed Mock) --- */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ChevronRight className="text-gray-400" size={20} />
            <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
            <span className="font-bold text-lg">IOS</span>
            <span className="text-gray-400 text-sm">No default version</span>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
            <Plus size={16} /> Add Version
          </button>
        </div>

        {/* --- Android Section (Expanded) --- */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setAndroidExpanded(!androidExpanded)}>
            <div className="flex items-center gap-4">
              {androidExpanded ? <ChevronDown className="text-gray-600" size={20} /> : <ChevronRight className="text-gray-400" size={20} />}
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              <span className="font-bold text-lg">ANDROID</span>
              <span className="text-gray-400 text-sm">v1.0.22</span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowAddModal(true); }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={16} /> Add Version
            </button>
          </div>

          {/* Expanded Content */}
          {androidExpanded && (
            <div className="px-4 md:px-6 pb-4 md:pb-6 pt-2 border-t border-gray-50">
              
              {/* Active Version Card */}
              <div className="border border-blue-200 rounded-lg p-3 md:p-5 mb-3 md:mb-4 bg-blue-50/10">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-slate-800">v1.0.22</span>
                    <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">Latest Version</span>
                  </div>
                  <div className="flex gap-2 text-gray-400">
                    <MoreHorizontal size={20} className="cursor-pointer hover:text-gray-600" />
                    <button onClick={() => setShowEditModal(true)} className="hover:text-blue-600 transition-colors">
                      <Edit2 size={18} />
                    </button>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mb-3">Updated: 2025-10-30 10:20:15</p>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                  <Copy size={14} />
                  <span>https://down.hznode.cc/hz1.0.22.apk</span>
                  <Copy size={14} className="cursor-pointer hover:text-blue-500" />
                </div>

                {/* Rollout Progress Box */}
                <div className="border border-gray-200 rounded-lg bg-white overflow-hidden transition-all duration-300">
                  <div 
                    className="bg-gray-50 p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setRolloutExpanded(!rolloutExpanded)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                        <div className="text-blue-600"><Settings size={16} /></div>
                        <span>Gradual Rollout Progress</span>
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">Stage 2 - 15%</span>
                      </div>
                      
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        {rolloutExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                    </div>

                    {rolloutExpanded && (
                      <>
                        <div className="mt-4 mb-2 flex justify-between text-xs font-medium">
                          <span className="text-slate-700">Current Update Status</span>
                          <span className="text-slate-700">9.6%</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">1,077 of 11,234 target users have updated</p>
                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-slate-500 h-full w-[9.6%]"></div>
                        </div>
                      </>
                    )}
                  </div>

                  {rolloutExpanded && (
                    <>
                      <div className="p-3 bg-white">
                        {STAGES_MOCK.map((stage) => {
                          const isActive = stage.status === 'active';
                          const isCompleted = stage.status === 'completed';
                          
                          return (
                            <div 
                              key={stage.id} 
                              className={`flex items-center py-2 px-2 mb-2 rounded-lg transition-all ${
                                isActive 
                                  ? 'bg-gray-100 border border-gray-300 shadow-sm' 
                                  : 'border border-transparent hover:bg-gray-50'
                              }`}
                            >
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mr-3 shrink-0
                                ${isCompleted ? 'bg-green-100 text-green-700' : 
                                  isActive ? 'bg-slate-800 text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                                {stage.id}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className={`text-sm font-bold ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                                    Stage {stage.id}
                                  </span>
                                  {isActive && (
                                    <span className="bg-white border border-gray-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                                      Current Stage
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Target: <span className="font-medium text-slate-700">{stage.target}</span> 
                                  <span className="opacity-70"> (approx. {stage.users.toLocaleString()} users)</span>
                                </div>
                              </div>
                              <div className="text-right">
                                {isActive ? (
                                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                    <Clock size={12} /> {stage.timeLeft}
                                  </span>
                                ) : isCompleted ? (
                                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Completed</span>
                                ) : (
                                  <div className="flex flex-col items-end text-gray-400">
                                    <span className="text-[10px]">Pending</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="p-3 bg-white border-t border-gray-100 flex justify-between items-center">
                        <span className="text-xs text-gray-400">Start time: 2025-10-29 15:44:36</span>
                        <button className="text-xs text-red-500 flex items-center gap-1 hover:underline"><Trash2 size={12}/> Delete Release</button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Previous Version */}
              <div className="border border-gray-200 rounded-lg p-3 bg-green-50/30">
                 <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-800">v1.0.21</span>
                      <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full">Default Version</span>
                    </div>
                    <div className="flex gap-2 text-gray-400">
                      <MoreHorizontal size={20} />
                      <Edit2 size={18} />
                    </div>
                 </div>
                 <p className="text-xs text-gray-400 mb-1">Updated: 2025-09-29 15:44:36</p>
                 <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Copy size={14} /> <span>https://down.hznode.cc/hz1.0.21.apk</span>
                 </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* --- ADD VERSION MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-2xl my-8 shadow-2xl flex flex-col">
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-100 sticky top-0 bg-white z-10 flex justify-between items-center">
              <h2 className="text-base md:text-lg font-bold text-slate-800">Add New ANDROID App Version</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            <div className="p-4 md:p-6 space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">App Version</label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 1.0.0" />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">Download Link 1</label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                <p className="text-xs text-gray-500 mt-1">* Primary for In-App Free User</p>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">Download Link 2 <span className="font-normal text-gray-400">(optional)</span></label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                <p className="text-xs text-gray-500 mt-1">* Primary for In-App Paid User</p>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">Download Link 3</label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                <p className="text-xs text-gray-500 mt-1">* Primary for Website</p>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">Download Link 4 <span className="font-normal text-gray-400">(optional)</span></label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                <p className="text-xs text-gray-500 mt-1">* Alternative for Website</p>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">Chinese Changelog</label>
                <textarea className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-24 resize-none"></textarea>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">English Changelog</label>
                <textarea className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-24 resize-none"></textarea>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="translate" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="translate" className="text-sm text-gray-600">Auto translate Chinese changelog</label>
              </div>
              <hr className="border-gray-100" />
              <div>
                <div className="flex justify-between items-end mb-3">
                  <h3 className="text-sm font-semibold text-slate-700">Gradual Rollout Stages</h3>
                  <span className="text-xs text-gray-400">(Using global configuration)</span>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 space-y-2 border border-blue-200">
                   {globalStages.map((item, index) => {
                     // Calculate estimated users based on 82,000 total platform users
                     const estimatedUsers = Math.round(82000 * (item.percent / 100));
                     return (
                       <div key={item.id} className="bg-white rounded-lg p-3 border border-blue-100 flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100 shrink-0">
                           {index + 1}
                         </div>
                         <div className="flex-1 flex items-center justify-between">
                           <div className="flex items-center gap-2">
                             <span className="text-sm font-bold text-slate-800">Target {item.percent}%</span>
                             <span className="text-gray-400">•</span>
                             <span className="text-xs text-gray-600">~{estimatedUsers.toLocaleString()} users</span>
                           </div>
                           <span className="text-sm font-semibold text-slate-700">Wait {item.time} {item.time === 1 ? 'hour' : 'hours'}</span>
                         </div>
                       </div>
                     );
                   })}
                </div>
                <div className="mt-3 flex gap-2 items-start text-xs bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  <span className="text-lg">💡</span>
                  <div>
                    <p className="text-blue-900 font-medium mb-1">Automatic Staged Rollout</p>
                    <p className="text-blue-700 leading-relaxed">This version will be released progressively using the global configuration. The system will automatically advance to each stage after the wait period.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button className="px-4 py-2 bg-black text-white rounded text-sm font-medium hover:bg-slate-800 flex items-center gap-2"><Save size={16} /> Save</button>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT CONFIGURATION MODAL --- */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-2xl my-8 shadow-2xl flex flex-col">
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-100 sticky top-0 bg-white z-10 flex justify-between items-center">
              <h2 className="text-base md:text-lg font-bold text-slate-800">Edit ANDROID v1.0.22 Configuration</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            <div className="p-4 md:p-6 space-y-4">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700">App Version</label>
                  <input type="text" defaultValue="1.0.22" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700">Download Link 1</label>
                  <input type="text" defaultValue="https://down.hznode.cc/hz1.0.22.apk" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                  <p className="text-xs text-gray-500 mt-1">* Primary for In-App Free User</p>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700">Download Link 2 <span className="font-normal text-gray-400">(optional)</span></label>
                  <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                  <p className="text-xs text-gray-500 mt-1">* Primary for In-App Paid User</p>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700">Download Link 3</label>
                  <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                  <p className="text-xs text-gray-500 mt-1">* Primary for Website</p>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700">Download Link 4 <span className="font-normal text-gray-400">(optional)</span></label>
                  <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                  <p className="text-xs text-gray-500 mt-1">* Alternative for Website</p>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700">Chinese Changelog</label>
                  <textarea defaultValue="Performance optimization" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-24 resize-none"></textarea>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700">English Changelog</label>
                  <textarea defaultValue="Performance optimization" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-24 resize-none"></textarea>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="translate_edit" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <label htmlFor="translate_edit" className="text-sm text-gray-600">Auto-translate Chinese changelog</label>
                </div>
                <div className="space-y-2 pt-2">
                   <label className="block text-sm font-semibold text-slate-700">Version Settings</label>
                   <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                         <input type="checkbox" defaultChecked id="set_default" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                         <label htmlFor="set_default" className="text-sm text-slate-700">Set as default version</label>
                      </div>
                      <div className="flex items-center gap-2">
                         <input type="checkbox" id="set_min" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                         <label htmlFor="set_min" className="text-sm text-slate-700">Set as minimum version</label>
                      </div>
                   </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 flex items-center gap-2"><Save size={16} /> Save</button>
            </div>
          </div>
        </div>
      )}

      {/* --- GLOBAL CONFIG MODAL --- */}
      {showGlobalConfigModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-2xl my-8 shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-100 sticky top-0 bg-white z-10 flex justify-between items-start">
              <div>
                <h2 className="text-base md:text-lg font-bold text-slate-800">Global Gradual Rollout Stage Configuration</h2>
                <p className="text-xs text-gray-500 mt-1">This configuration will be applied to new version releases on all platforms</p>
              </div>
              <button onClick={() => setShowGlobalConfigModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>

            {/* Modal Body */}
            <div className="p-4 md:p-6 space-y-4">
              
              {/* Blue Info Box */}
              <div className="bg-blue-50 border border-blue-100 rounded-md p-3 flex items-start gap-2">
                 <span className="text-sm">💡</span>
                 <p className="text-xs text-blue-800 leading-relaxed">
                   Configure the stages for gradual rollout. This configuration will be applied to all platforms (Windows, iOS, Android), and releases will automatically roll out according to the configured stages.
                 </p>
              </div>

              {/* Stage Inputs List */}
              <div className="space-y-3">
                {globalStages.map((stage, index) => (
                  <div key={stage.id} className="border border-gray-200 rounded-lg p-3 bg-white flex items-center gap-4">
                    {/* Stage Number Circle (Uses Index + 1) */}
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100 shrink-0">
                      {index + 1}
                    </div>

                    {/* Inputs */}
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      {/* Target % */}
                      <div>
                        <label className="block text-[10px] text-gray-500 mb-1">Target Percentage</label>
                        <div className="relative">
                          <input 
                            type="number" 
                            value={stage.percent}
                            onChange={(e) => handleStageChange(stage.id, 'percent', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                          />
                          <span className="absolute right-3 top-1.5 text-gray-400 text-sm">%</span>
                        </div>
                      </div>
                      
                      {/* Wait Duration */}
                      <div>
                        <label className="block text-[10px] text-gray-500 mb-1">Wait Duration</label>
                        <div className="relative">
                          <input 
                            type="number" 
                            value={stage.time}
                            onChange={(e) => handleStageChange(stage.id, 'time', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm pr-12 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                          />
                          <span className="absolute right-3 top-1.5 text-gray-400 text-sm">hours</span>
                        </div>
                      </div>
                    </div>

                    {/* Delete Icon - Triggers Deletion */}
                    <button 
                      onClick={() => handleDeleteStage(stage.id)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Stage Button - Triggers Addition */}
              <button 
                onClick={handleAddStage}
                className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400 transition-all flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Plus size={16} /> Add Stage
              </button>

              {/* Yellow Warning/Info Box */}
              <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4">
                <h4 className="flex items-center gap-2 text-xs font-bold text-yellow-700 mb-2">
                  <span className="text-yellow-600">⚠️</span> Configuration Recommendations
                </h4>
                <ul className="list-disc list-inside text-[11px] text-yellow-800 space-y-1 ml-1">
                  <li>The first stage should have a small percentage (e.g., 5%) to detect issues early</li>
                  <li>The last stage should be set to 100% to ensure full release</li>
                  <li>Each stage's wait duration should be sufficient to observe issues (recommend at least 6 hours)</li>
                  <li>Target percentages should increase progressively to gradually expand release scope</li>
                </ul>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center rounded-b-lg">
              <button 
                onClick={handleRestoreDefaults}
                className="text-gray-500 text-sm hover:text-gray-700 flex items-center gap-1"
              >
                 <RotateCcw size={14} /> Restore Default Config
              </button>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowGlobalConfigModal(false)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                   onClick={() => setShowGlobalConfigModal(false)}
                   className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save size={16} /> Save Config
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
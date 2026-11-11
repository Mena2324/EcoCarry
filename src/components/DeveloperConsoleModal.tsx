import React, { useState, useEffect } from 'react';
import { useGreenBag } from '../context/GreenBagContext';
import {
  X,
  Database,
  Users,
  ShoppingBag,
  Download,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  PlusCircle,
  FileSpreadsheet,
  FileCode,
  Sparkles,
  HelpCircle,
  ArrowRight,
  UserCheck,
  RefreshCw,
  Sliders,
  Check,
  Calendar,
  Megaphone,
  Radio,
  FileText,
  BarChart3,
  Printer,
  Trash2,
  Play,
  AlertCircle,
  Eye,
  Send,
  Zap,
} from 'lucide-react';
import { DevAccount } from '../data/mockData';
import { CampusEcoEvent } from '../types/greenbag';

export const DeveloperConsoleModal: React.FC = () => {
  const {
    isDevConsoleOpen,
    setIsDevConsoleOpen,
    isCurrentUserAdmin,
    devAccounts,
    adminAwardPoints,
    adminResolveBag,
    exportAllData,
    exportComprehensiveUserReport,
    fetchAllUsersForReport,
    events,
    createCampusEvent,
    publishEventNow,
    toggleEventStatus,
    deleteCampusEvent,
    firebaseProjectId,
    firebaseConnected,
    activeBags,
    globalBags,
    seedAll200BagsToFirestore,
    stations,
    resetData,
  } = useGreenBag();

  const [activeTab, setActiveTab] = useState<'events' | 'report' | 'accounts' | 'loans' | 'export' | 'testing'>('events');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacultyFilter, setSelectedFacultyFilter] = useState('ALL');
  const [selectedAccountForInspection, setSelectedAccountForInspection] = useState<DevAccount | null>(null);

  // 200 Bags Inventory state
  const [bagSearchQuery, setBagSearchQuery] = useState('');
  const [bagStatusFilter, setBagStatusFilter] = useState<'all' | 'available' | 'borrowed' | 'missing'>('all');

  // Live reporting state
  const [liveReportAccounts, setLiveReportAccounts] = useState<DevAccount[]>(devAccounts);
  const [isRefreshingUsers, setIsRefreshingUsers] = useState(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);

  // New Event Form State
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventBadge, setNewEventBadge] = useState('2X ECO POINTS');
  const [newEventLocation, setNewEventLocation] = useState('All Campus Kiosks');
  const [newEventBonus, setNewEventBonus] = useState(100);
  const [newEventMultiplier, setNewEventMultiplier] = useState(2);
  const [newEventStart, setNewEventStart] = useState(() => new Date().toISOString().slice(0, 16));
  const [newEventEnd, setNewEventEnd] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 16);
  });
  const [newPublishImmediate, setNewPublishImmediate] = useState(true);

  // Load live user data on mount and when tab changes to report
  useEffect(() => {
    if (activeTab === 'report' || activeTab === 'accounts') {
      refreshLiveUsers();
    }
  }, [activeTab]);

  const refreshLiveUsers = async () => {
    setIsRefreshingUsers(true);
    try {
      const data = await fetchAllUsersForReport();
      setLiveReportAccounts(data);
    } catch {
      // ignore
    } finally {
      setIsRefreshingUsers(false);
    }
  };

  // Strictly restrict rendering to developer account
  if (!isDevConsoleOpen || !isCurrentUserAdmin) return null;

  // Filter accounts
  const filteredAccounts = liveReportAccounts.filter((acc) => {
    const matchesSearch =
      acc.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFaculty =
      selectedFacultyFilter === 'ALL' || acc.faculty === selectedFacultyFilter;

    return matchesSearch && matchesFaculty;
  });

  // Calculate aggregated metrics for reports
  const totalStudents = liveReportAccounts.length;
  const totalPointsDistributed = liveReportAccounts.reduce((sum, a) => sum + a.points, 0);
  const totalBagsDiverted = liveReportAccounts.reduce((sum, a) => sum + a.bagsSavedTotal, 0);
  const totalCo2Offset = Number(liveReportAccounts.reduce((sum, a) => sum + a.co2SavedKg, 0).toFixed(2));
  const treesSavedEquivalent = Math.floor(totalCo2Offset / 21);
  const avgBagsPerUser = totalStudents > 0 ? (totalBagsDiverted / totalStudents).toFixed(1) : '0';

  // Faculty breakdown aggregation
  const facultyStats: Record<string, { count: number; bags: number; co2: number }> = {};
  liveReportAccounts.forEach((acc) => {
    if (!facultyStats[acc.faculty]) {
      facultyStats[acc.faculty] = { count: 0, bags: 0, co2: 0 };
    }
    facultyStats[acc.faculty].count += 1;
    facultyStats[acc.faculty].bags += acc.bagsSavedTotal;
    facultyStats[acc.faculty].co2 = Number((facultyStats[acc.faculty].co2 + acc.co2SavedKg).toFixed(2));
  });

  const handleInspectUser = (acc: DevAccount) => {
    setSelectedAccountForInspection(acc);
  };

  const handleCreateNewEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDescription.trim()) return;

    const success = await createCampusEvent({
      title: newEventTitle.trim(),
      description: newEventDescription.trim(),
      badgeText: newEventBadge.trim() || 'CAMPUS EVENT',
      location: newEventLocation.trim() || 'All Kiosks',
      bonusPoints: Number(newEventBonus) || 50,
      multiplier: Number(newEventMultiplier) || 1,
      status: newPublishImmediate ? 'active' : 'scheduled',
      isPublished: newPublishImmediate,
      scheduledStart: new Date(newEventStart).toISOString(),
      scheduledEnd: new Date(newEventEnd).toISOString(),
    });

    if (success) {
      setNewEventTitle('');
      setNewEventDescription('');
      setIsAddEventOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-2 sm:p-4 text-[#14261C]">
      <div className="w-full max-w-3xl max-h-[94vh] flex flex-col rounded-[28px] bg-[#FAF9F5] border border-[#E2DEC2] shadow-tactile-fab overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E2DEC2] bg-[#def3e3]/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#186049] text-white flex items-center justify-center shadow-sm">
              <Database className="w-5 h-5 text-[#93d8bb]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-[#14261C] tracking-tight">
                  EcoCarry Developer Command Hub
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#186049] text-white">
                  Developer Mode
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#2D3E35] mt-0.5">
                <span className="flex items-center gap-1 font-semibold text-[#186049]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A943E] animate-pulse" />
                  Firebase: {firebaseProjectId}
                </span>
                <span>•</span>
                <span>Admin: menazaki012@gmail.com</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsDevConsoleOpen(false)}
            className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#2D3E35] flex items-center justify-center transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Console Navigation Tabs */}
        <div className="px-4 pt-3 pb-2 border-b border-[#E2DEC2] flex items-center gap-1 sm:gap-2 overflow-x-auto bg-[#FAF9F5]">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'events'
                ? 'bg-[#186049] text-white shadow-sm'
                : 'text-[#2D3E35] hover:bg-[#def3e3]'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5 text-[#D98327]" />
            Events & Campaigns ({events.length})
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'report'
                ? 'bg-[#186049] text-white shadow-sm'
                : 'text-[#2D3E35] hover:bg-[#def3e3]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#4A943E]" />
            User Data & ESG Report
          </button>

          <button
            onClick={() => setActiveTab('accounts')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'accounts'
                ? 'bg-[#186049] text-white shadow-sm'
                : 'text-[#2D3E35] hover:bg-[#def3e3]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            All Accounts ({totalStudents})
          </button>

          <button
            onClick={() => setActiveTab('loans')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'loans'
                ? 'bg-[#186049] text-white shadow-sm'
                : 'text-[#2D3E35] hover:bg-[#def3e3]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Bag Loans ({activeBags.length})
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'export'
                ? 'bg-[#186049] text-white shadow-sm'
                : 'text-[#2D3E35] hover:bg-[#def3e3]'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Raw Data
          </button>

          <button
            onClick={() => setActiveTab('testing')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'testing'
                ? 'bg-[#D98327] text-white shadow-sm'
                : 'text-[#D98327] hover:bg-[#ECE8AF]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Playbook
          </button>
        </div>

        {/* Tab Body Contents */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAF9F5]/50">
          {/* TAB 1: EVENTS & CAMPAIGNS (BUILT-IN + CUSTOM + SCHEDULING + INSTANT ACTIVATE) */}
          {activeTab === 'events' && (
            <div className="space-y-5">
              {/* Top Banner & Add Button */}
              <div className="p-4 rounded-2xl bg-[#def3e3] border border-[#4A943E]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-extrabold text-[#186049] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#D98327]" />
                    <span>Campus Eco Campaigns & Events Hub</span>
                  </h3>
                  <p className="text-xs text-[#2D3E35] mt-1 max-w-lg">
                    Manage built-in campus campaigns or add custom events. Events automatically activate
                    at your scheduled time, or click <strong>Publish Now</strong> to trigger instantly for all students.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddEventOpen(!isAddEventOpen)}
                  className="px-4 py-2 rounded-full bg-[#186049] hover:bg-[#004734] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-tactile-sm shrink-0"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isAddEventOpen ? 'Cancel' : 'Create New Event'}</span>
                </button>
              </div>

              {/* Add New Event Form Modal / Inline Box */}
              {isAddEventOpen && (
                <form
                  onSubmit={handleCreateNewEvent}
                  className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#186049]/40 shadow-tactile-md space-y-4 animate-fade-in"
                >
                  <div className="flex items-center justify-between border-b border-[#E2DEC2] pb-2">
                    <h4 className="text-sm font-extrabold text-[#14261C] flex items-center gap-2">
                      <Megaphone className="w-4 h-4 text-[#186049]" />
                      <span>Create New Campus Eco Event</span>
                    </h4>
                    <span className="text-[11px] font-bold text-[#186049] bg-[#def3e3] px-2 py-0.5 rounded-full">
                      Developer Broadcast
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#2D3E35] uppercase mb-1">
                        Event Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Earth Hour Zero-Plastic Blitz"
                        value={newEventTitle}
                        onChange={(e) => setNewEventTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E2DEC2] text-xs font-medium focus:outline-none focus:border-[#186049]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#2D3E35] uppercase mb-1">
                        Promo Badge Tag
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2X ECO POINTS or +100 BONUS"
                        value={newEventBadge}
                        onChange={(e) => setNewEventBadge(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E2DEC2] text-xs font-medium focus:outline-none focus:border-[#186049]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#2D3E35] uppercase mb-1">
                      Event Description & Student Incentive *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Explain what bags students need to return or stations to visit to receive the incentive..."
                      value={newEventDescription}
                      onChange={(e) => setNewEventDescription(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E2DEC2] text-xs font-medium focus:outline-none focus:border-[#186049]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#2D3E35] uppercase mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={newEventLocation}
                        onChange={(e) => setNewEventLocation(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E2DEC2] text-xs font-medium focus:outline-none focus:border-[#186049]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#2D3E35] uppercase mb-1">
                        Bonus Points
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="25"
                        value={newEventBonus}
                        onChange={(e) => setNewEventBonus(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E2DEC2] text-xs font-medium focus:outline-none focus:border-[#186049]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#2D3E35] uppercase mb-1">
                        Point Multiplier
                      </label>
                      <select
                        value={newEventMultiplier}
                        onChange={(e) => setNewEventMultiplier(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E2DEC2] text-xs font-medium focus:outline-none focus:border-[#186049]"
                      >
                        <option value={1}>1x Normal</option>
                        <option value={2}>2x Double Points</option>
                        <option value={3}>3x Triple Points</option>
                        <option value={5}>5x Mega Eco Week</option>
                      </select>
                    </div>
                  </div>

                  {/* Scheduling window */}
                  <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E2DEC2] space-y-2">
                    <span className="text-[11px] font-bold text-[#14261C] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#186049]" />
                      <span>Campaign Schedule Window</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-[#707974] mb-1">Start Time</label>
                        <input
                          type="datetime-local"
                          value={newEventStart}
                          onChange={(e) => setNewEventStart(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E2DEC2] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#707974] mb-1">End Time</label>
                        <input
                          type="datetime-local"
                          value={newEventEnd}
                          onChange={(e) => setNewEventEnd(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E2DEC2] text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Immediate publish toggle */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#14261C]">
                      <input
                        type="checkbox"
                        checked={newPublishImmediate}
                        onChange={(e) => setNewPublishImmediate(e.target.checked)}
                        className="rounded border-[#E2DEC2] text-[#186049] focus:ring-[#186049] w-4 h-4"
                      />
                      <span>Publish live immediately to all student dashboards</span>
                    </label>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-full bg-[#186049] hover:bg-[#004734] text-white text-xs font-bold shadow-tactile-sm transition-colors"
                    >
                      {newPublishImmediate ? 'Publish Now' : 'Save Schedule'}
                    </button>
                  </div>
                </form>
              )}

              {/* List of Campus Events */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#2D3E35] uppercase tracking-wider">
                    All Configured Campaigns ({events.length})
                  </h4>
                  <span className="text-[11px] text-[#707974]">
                    Syncs in real-time with Firestore /events
                  </span>
                </div>

                {events.map((ev) => {
                  const isLive =
                    ev.status === 'active' ||
                    (ev.isPublished && ev.status !== 'ended') ||
                    (ev.status === 'scheduled' &&
                      new Date(ev.scheduledStart) <= new Date() &&
                      new Date(ev.scheduledEnd) >= new Date());

                  const isScheduledFuture =
                    ev.status === 'scheduled' && new Date(ev.scheduledStart) > new Date();

                  return (
                    <div
                      key={ev.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isLive
                          ? 'bg-white border-[#4A943E] shadow-tactile-sm'
                          : 'bg-white/80 border-[#E2DEC2]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            {isLive ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#def3e3] text-[#186049] border border-[#4A943E]/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4A943E] animate-pulse" />
                                LIVE ACTIVE
                              </span>
                            ) : isScheduledFuture ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#e8f1fa] text-[#1e5d88] border border-[#bcd2e8]">
                                <Clock className="w-3 h-3" />
                                SCHEDULED
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#FAF9F5] text-[#707974] border border-[#E2DEC2]">
                                {ev.status.toUpperCase()}
                              </span>
                            )}

                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ECE8AF] text-[#186049] border border-[#E2DEC2]">
                              {ev.badgeText}
                            </span>

                            {ev.multiplier > 1 && (
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#D98327] text-white">
                                {ev.multiplier}X MULTIPLIER
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-extrabold text-[#14261C]">{ev.title}</h4>
                          <p className="text-xs text-[#2D3E35] mt-1 leading-relaxed">{ev.description}</p>

                          <div className="flex items-center gap-4 text-[11px] text-[#707974] mt-2.5 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-[#186049]" />
                              {new Date(ev.scheduledStart).toLocaleDateString()} – {new Date(ev.scheduledEnd).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span>Location: {ev.location}</span>
                            <span>•</span>
                            <span>Bonus: +{ev.bonusPoints} pts</span>
                          </div>
                        </div>

                        {/* Developer Action Buttons */}
                        <div className="flex sm:flex-col items-center gap-2 shrink-0 pt-2 sm:pt-0">
                          {!isLive ? (
                            <button
                              onClick={() => publishEventNow(ev.id)}
                              className="px-3.5 py-1.5 rounded-full bg-[#186049] hover:bg-[#004734] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                            >
                              <Play className="w-3.5 h-3.5" />
                              <span>Publish Now</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => toggleEventStatus(ev.id, 'ended', false)}
                              className="px-3 py-1.5 rounded-full bg-[#FAF9F5] hover:bg-[#def3e3] text-[#707974] hover:text-[#14261C] border border-[#E2DEC2] text-xs font-bold transition-colors"
                            >
                              <span>Deactivate</span>
                            </button>
                          )}

                          <button
                            onClick={() => deleteCampusEvent(ev.id)}
                            className="p-1.5 rounded-full text-[#707974] hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: USER DATA COLLECTION & ESG RESEARCH REPORT */}
          {activeTab === 'report' && (
            <div className="space-y-5">
              {/* Report Header Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#def3e3] border border-[#4A943E]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#186049] text-white">
                      Academic & ESG Research Hub
                    </span>
                    <span className="text-[11px] text-[#2D3E35]">Live Multi-User Dataset</span>
                  </div>
                  <h3 className="text-base font-extrabold text-[#14261C] mt-1">
                    APU Campus Circularity & Plastic Diversion Report
                  </h3>
                  <p className="text-xs text-[#2D3E35] mt-1 max-w-xl">
                    Collected across all enrolled student accounts in Firebase Firestore. Use this data to write
                    academic research reports, thesis audits, and APU ESG compliance metrics.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={refreshLiveUsers}
                    disabled={isRefreshingUsers}
                    className="px-3 py-2 rounded-full bg-white hover:bg-[#FAF9F5] text-[#186049] border border-[#4A943E]/40 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingUsers ? 'animate-spin' : ''}`} />
                    <span>Sync Live Data</span>
                  </button>
                  <button
                    onClick={() => setIsPrintPreviewOpen(true)}
                    className="px-4 py-2 rounded-full bg-[#186049] hover:bg-[#004734] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-tactile-sm"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View / Print Report</span>
                  </button>
                </div>
              </div>

              {/* Research Metrics Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-[#E2DEC2] shadow-tactile-sm">
                  <span className="text-[10px] font-bold text-[#707974] uppercase block">
                    Total Enrolled Users
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-extrabold text-[#186049]">{totalStudents}</span>
                    <span className="text-[11px] font-bold text-[#2D3E35]">Students</span>
                  </div>
                  <span className="text-[10px] text-[#4A943E] mt-0.5 block">100% Verified Auth</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#E2DEC2] shadow-tactile-sm">
                  <span className="text-[10px] font-bold text-[#707974] uppercase block">
                    Bags Diverted
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-extrabold text-[#186049]">{totalBagsDiverted}</span>
                    <span className="text-[11px] font-bold text-[#2D3E35]">units</span>
                  </div>
                  <span className="text-[10px] text-[#707974] mt-0.5 block">Avg {avgBagsPerUser} / student</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#E2DEC2] shadow-tactile-sm">
                  <span className="text-[10px] font-bold text-[#707974] uppercase block">
                    CO₂ Prevented
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-extrabold text-[#186049]">{totalCo2Offset}</span>
                    <span className="text-[11px] font-bold text-[#2D3E35]">kg CO₂</span>
                  </div>
                  <span className="text-[10px] text-[#4A943E] mt-0.5 block">≈ {treesSavedEquivalent} Trees</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#E2DEC2] shadow-tactile-sm">
                  <span className="text-[10px] font-bold text-[#707974] uppercase block">
                    Points Circulated
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-extrabold text-[#D98327]">{totalPointsDistributed}</span>
                    <span className="text-[11px] font-bold text-[#2D3E35]">pts</span>
                  </div>
                  <span className="text-[10px] text-[#707974] mt-0.5 block">Circulating Eco Karma</span>
                </div>
              </div>

              {/* Faculty Breakdown Table */}
              <div className="p-4 rounded-2xl bg-white border border-[#E2DEC2] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#14261C] uppercase tracking-wider flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-[#186049]" />
                    <span>Faculty ESG Contribution Analysis</span>
                  </h4>
                  <span className="text-[11px] text-[#707974]">Categorized for Institutional Reporting</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E2DEC2] text-[#707974] text-[11px]">
                        <th className="pb-2 font-bold">Faculty Name</th>
                        <th className="pb-2 font-bold text-center">Enrolled Cohort</th>
                        <th className="pb-2 font-bold text-center">Bags Diverted</th>
                        <th className="pb-2 font-bold text-center">CO₂ Saved (kg)</th>
                        <th className="pb-2 font-bold text-right">% Campus Share</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2DEC2]/60">
                      {Object.entries(facultyStats).map(([faculty, stats]) => {
                        const share =
                          totalBagsDiverted > 0
                            ? Math.round((stats.bags / totalBagsDiverted) * 100)
                            : 0;
                        return (
                          <tr key={faculty} className="hover:bg-[#FAF9F5] transition-colors">
                            <td className="py-2.5 font-semibold text-[#14261C]">{faculty}</td>
                            <td className="py-2.5 text-center">{stats.count} students</td>
                            <td className="py-2.5 text-center font-bold text-[#186049]">{stats.bags}</td>
                            <td className="py-2.5 text-center font-bold text-[#4A943E]">{stats.co2} kg</td>
                            <td className="py-2.5 text-right font-bold text-[#D98327]">{share}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Data Export Action Bar for Reports */}
              <div className="p-4 rounded-2xl bg-[#ECE8AF]/60 border border-[#E2DEC2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-extrabold text-[#186049] block">
                    Ready to Write Your Report?
                  </span>
                  <span className="text-[11px] text-[#2D3E35]">
                    Export all participant rows, timestamps, and campus totals directly into Excel, R, SPSS, or Python.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportComprehensiveUserReport('csv')}
                    className="px-3.5 py-2 rounded-full bg-white hover:bg-[#FAF9F5] border border-[#186049]/40 text-[#186049] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#4A943E]" />
                    <span>Download CSV Roster</span>
                  </button>
                  <button
                    onClick={() => exportComprehensiveUserReport('json')}
                    className="px-3.5 py-2 rounded-full bg-[#186049] hover:bg-[#004734] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-tactile-sm"
                  >
                    <FileCode className="w-3.5 h-3.5 text-[#93d8bb]" />
                    <span>Download Full JSON</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ALL ACCOUNTS & INDIVIDUAL INSPECTION */}
          {activeTab === 'accounts' && (
            <div className="space-y-4">
              {/* Search & Faculty Filter */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#707974] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by student name, ID or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-full bg-white border border-[#E2DEC2] text-xs font-medium focus:outline-none focus:border-[#186049]"
                  />
                </div>

                <select
                  value={selectedFacultyFilter}
                  onChange={(e) => setSelectedFacultyFilter(e.target.value)}
                  className="px-3 py-2 rounded-full bg-white border border-[#E2DEC2] text-xs font-semibold text-[#14261C] focus:outline-none"
                >
                  <option value="ALL">All Faculties ({liveReportAccounts.length})</option>
                  <option value="School of Technology & AI">School of Technology & AI</option>
                  <option value="Faculty of Business & Management">Faculty of Business & Management</option>
                  <option value="School of Design & Creative Arts">School of Design & Creative Arts</option>
                  <option value="Faculty of Engineering">Faculty of Engineering</option>
                  <option value="School of Computing">School of Computing</option>
                </select>
              </div>

              {/* Accounts Roster Table */}
              <div className="rounded-2xl border border-[#E2DEC2] overflow-hidden bg-white shadow-tactile-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#def3e3]/50 border-b border-[#E2DEC2] text-[#2D3E35] font-bold">
                      <tr>
                        <th className="p-3">Student</th>
                        <th className="p-3">Faculty & Tier</th>
                        <th className="p-3 text-center">Points</th>
                        <th className="p-3 text-center">Bags Saved</th>
                        <th className="p-3 text-center">CO₂ Saved</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2DEC2]/60">
                      {filteredAccounts.map((acc) => (
                        <tr key={acc.id} className="hover:bg-[#FAF9F5] transition-colors">
                          <td className="p-3">
                            <div className="font-extrabold text-[#14261C]">{acc.studentName}</div>
                            <div className="text-[10px] text-[#707974]">{acc.email}</div>
                          </td>
                          <td className="p-3">
                            <div className="text-[11px] font-semibold text-[#2D3E35]">{acc.faculty}</div>
                            <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#ECE8AF] text-[#186049]">
                              {acc.tier}
                            </span>
                          </td>
                          <td className="p-3 text-center font-extrabold text-[#186049]">{acc.points}</td>
                          <td className="p-3 text-center font-bold text-[#14261C]">{acc.bagsSavedTotal}</td>
                          <td className="p-3 text-center font-bold text-[#4A943E]">{acc.co2SavedKg} kg</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleInspectUser(acc)}
                              className="px-2.5 py-1 rounded-full bg-[#186049] hover:bg-[#004734] text-white text-[11px] font-bold transition-colors shadow-sm"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Inspected User Quick Drawer */}
              {selectedAccountForInspection && (
                <div className="p-4 rounded-2xl bg-white border-2 border-[#186049] shadow-tactile-md space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E2DEC2] pb-2">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-[#186049]" />
                      <h4 className="text-xs font-extrabold text-[#14261C]">
                        Inspecting: {selectedAccountForInspection.studentName} ({selectedAccountForInspection.studentId})
                      </h4>
                    </div>
                    <button
                      onClick={() => setSelectedAccountForInspection(null)}
                      className="text-xs text-[#707974] hover:text-[#14261C]"
                    >
                      Close
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-[#FAF9F5] border border-[#E2DEC2]">
                      <span className="text-[10px] text-[#707974] block">Eco Karma</span>
                      <span className="font-extrabold text-[#186049]">{selectedAccountForInspection.points} pts</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#FAF9F5] border border-[#E2DEC2]">
                      <span className="text-[10px] text-[#707974] block">Bags Diverted</span>
                      <span className="font-extrabold text-[#14261C]">{selectedAccountForInspection.bagsSavedTotal}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#FAF9F5] border border-[#E2DEC2]">
                      <span className="text-[10px] text-[#707974] block">Active Streak</span>
                      <span className="font-extrabold text-[#D98327]">{selectedAccountForInspection.activeStreak} days</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#FAF9F5] border border-[#E2DEC2]">
                      <span className="text-[10px] text-[#707974] block">Last Active</span>
                      <span className="font-semibold text-[#2D3E35]">{selectedAccountForInspection.lastActive}</span>
                    </div>
                  </div>

                  {/* Admin Award Points Tool */}
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[11px] text-[#707974]">Admin Intervention:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => adminAwardPoints(selectedAccountForInspection.studentId, 50)}
                        className="px-2.5 py-1 rounded-full bg-[#FAF9F5] hover:bg-[#def3e3] border border-[#E2DEC2] text-xs font-bold text-[#186049]"
                      >
                        +50 Points
                      </button>
                      <button
                        onClick={() => adminAwardPoints(selectedAccountForInspection.studentId, 100)}
                        className="px-2.5 py-1 rounded-full bg-[#186049] hover:bg-[#004734] text-white text-xs font-bold"
                      >
                        +100 Points
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CAMPUS BAG LOANS & 200 QR INVENTORY */}
          {activeTab === 'loans' && (
            <div className="space-y-4">
              {/* Top Banner with 200 QR Actions */}
              <div className="p-4 rounded-2xl bg-[#def3e3] border border-[#4A943E]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#186049] text-white">
                      Official Inventory
                    </span>
                    <span className="text-[11px] font-bold text-[#186049]">
                      200 Accepted Physical QR Codes
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-[#14261C] mt-1">
                    APU EcoCarry Authorized QR Codes Registry (#GB-0001 – #GB-0200)
                  </h3>
                  <p className="text-xs text-[#2D3E35] mt-0.5">
                    Only these 200 QR codes are accepted by campus scanners. Once activated or linked to an account,
                    a QR code is strictly locked until returned or reported as missing.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={seedAll200BagsToFirestore}
                    className="px-3 py-1.5 rounded-full bg-white hover:bg-[#FAF9F5] border border-[#186049]/40 text-[#186049] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync 200 to Firestore</span>
                  </button>
                  <a
                    href="/assets/ecocarry_200_qr_codes.txt"
                    download="APU_EcoCarry_200_QR_Codes.txt"
                    className="px-3 py-1.5 rounded-full bg-[#186049] hover:bg-[#004734] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download TXT List</span>
                  </a>
                </div>
              </div>

              {/* Inventory Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-white border border-[#E2DEC2]">
                  <span className="text-[10px] text-[#707974] block uppercase font-bold">Total Approved</span>
                  <span className="text-lg font-black text-[#14261C]">200 QR Codes</span>
                  <span className="text-[10px] text-[#4A943E] block">GB-0001 to GB-0200</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E2DEC2]">
                  <span className="text-[10px] text-[#707974] block uppercase font-bold">Available in Kiosks</span>
                  <span className="text-lg font-black text-[#186049]">
                    {globalBags.filter((b) => b.status === 'available').length} Available
                  </span>
                  <span className="text-[10px] text-[#707974] block">Ready to scan</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E2DEC2]">
                  <span className="text-[10px] text-[#707974] block uppercase font-bold">Active / Linked</span>
                  <span className="text-lg font-black text-[#D98327]">
                    {globalBags.filter((b) => b.status === 'borrowed').length} In Use
                  </span>
                  <span className="text-[10px] text-[#D98327] block">Locked to student</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E2DEC2]">
                  <span className="text-[10px] text-[#707974] block uppercase font-bold">Reported Missing</span>
                  <span className="text-lg font-black text-red-600">
                    {globalBags.filter((b) => b.status === 'missing').length} Missing
                  </span>
                  <span className="text-[10px] text-red-500 block">Needs recovery</span>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#707974] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search bag number (e.g. GB-0042, GB-0150)..."
                    value={bagSearchQuery}
                    onChange={(e) => setBagSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-full bg-white border border-[#E2DEC2] text-xs font-medium focus:outline-none focus:border-[#186049]"
                  />
                </div>

                <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-[#E2DEC2] overflow-x-auto">
                  {(['all', 'available', 'borrowed', 'missing'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setBagStatusFilter(filter)}
                      className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-colors ${
                        bagStatusFilter === filter
                          ? 'bg-[#186049] text-white shadow-sm'
                          : 'text-[#707974] hover:text-[#14261C]'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bags Directory List */}
              <div className="rounded-2xl border border-[#E2DEC2] bg-white overflow-hidden shadow-tactile-sm">
                <div className="p-3 border-b border-[#E2DEC2] bg-[#FAF9F5] flex items-center justify-between text-xs">
                  <span className="font-extrabold text-[#14261C]">
                    Inventory Catalog (Showing {
                      globalBags.filter((b) => {
                        const matchesSearch =
                          !bagSearchQuery.trim() ||
                          b.bagNumber.toLowerCase().includes(bagSearchQuery.toLowerCase()) ||
                          b.id.toLowerCase().includes(bagSearchQuery.toLowerCase());
                        const matchesFilter =
                          bagStatusFilter === 'all' || b.status === bagStatusFilter;
                        return matchesSearch && matchesFilter;
                      }).length
                    } of 200)
                  </span>
                  <span className="text-[11px] text-[#707974]">Live Firestore Synced</span>
                </div>

                <div className="max-h-[380px] overflow-y-auto divide-y divide-[#E2DEC2]/60">
                  {globalBags
                    .filter((b) => {
                      const matchesSearch =
                        !bagSearchQuery.trim() ||
                        b.bagNumber.toLowerCase().includes(bagSearchQuery.toLowerCase()) ||
                        b.id.toLowerCase().includes(bagSearchQuery.toLowerCase());
                      const matchesFilter =
                        bagStatusFilter === 'all' || b.status === bagStatusFilter;
                      return matchesSearch && matchesFilter;
                    })
                    .slice(0, 100)
                    .map((bag) => {
                      return (
                        <div
                          key={bag.id}
                          className="p-3 flex items-center justify-between hover:bg-[#FAF9F5] transition-colors text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-[#14261C]">{bag.bagNumber}</span>
                              {bag.status === 'available' ? (
                                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#def3e3] text-[#186049] border border-[#4A943E]/30">
                                  AVAILABLE
                                </span>
                              ) : bag.status === 'borrowed' ? (
                                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#fff3e0] text-[#D98327] border border-[#D98327]/40">
                                  LOCKED / BORROWED
                                </span>
                              ) : (
                                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-300">
                                  MISSING
                                </span>
                              )}
                              <span className="text-[10px] text-[#707974]">{bag.type}</span>
                            </div>
                            <div className="text-[11px] text-[#707974] mt-0.5">
                              Station: {bag.borrowedStationName || 'Campus Inventory'} • QR Token: {bag.qrToken}
                              {bag.currentBorrowerName && (
                                <span className="text-[#D98327] font-semibold ml-2">
                                  • Borrower: {bag.currentBorrowerName}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {bag.status !== 'available' && (
                              <button
                                onClick={() => adminResolveBag(bag.id)}
                                className="px-2.5 py-1 rounded-full bg-[#FAF9F5] hover:bg-[#def3e3] border border-[#E2DEC2] text-[#186049] text-[11px] font-bold transition-colors"
                              >
                                Restore to Available
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RAW DATA & DIRECT CLOUD CONSOLE */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-[#E2DEC2] space-y-3">
                <h4 className="text-xs font-bold text-[#14261C] uppercase tracking-wider">
                  Raw Data Export
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => exportAllData('json')}
                    className="p-3.5 rounded-xl border border-[#E2DEC2] hover:border-[#186049] bg-[#FAF9F5] flex items-center justify-between group transition-colors"
                  >
                    <div className="text-left">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-[#14261C]">
                        <FileCode className="w-4 h-4 text-[#186049]" />
                        <span>All Collections JSON</span>
                      </div>
                      <span className="text-[10px] text-[#707974] block mt-0.5">
                        Complete raw database tree
                      </span>
                    </div>
                    <Download className="w-4 h-4 text-[#186049] group-hover:translate-y-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => exportAllData('csv')}
                    className="p-3.5 rounded-xl border border-[#E2DEC2] hover:border-[#4A943E] bg-[#FAF9F5] flex items-center justify-between group transition-colors"
                  >
                    <div className="text-left">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-[#14261C]">
                        <FileSpreadsheet className="w-4 h-4 text-[#4A943E]" />
                        <span>Audit Log CSV</span>
                      </div>
                      <span className="text-[10px] text-[#707974] block mt-0.5">
                        Tabular transaction log
                      </span>
                    </div>
                    <Download className="w-4 h-4 text-[#4A943E] group-hover:translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Direct Firebase link */}
              <div className="p-4 rounded-2xl bg-white border border-[#E2DEC2] flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-[#14261C]">
                    Direct Google Firebase Firestore Console
                  </span>
                  <span className="text-[11px] text-[#707974]">
                    Inspect live documents at project {firebaseProjectId}
                  </span>
                </div>
                <a
                  href={`https://console.firebase.google.com/project/${firebaseProjectId}/firestore`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-[#186049] hover:bg-[#004734] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Open Console</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 6: HOW TO TEST THE APP PLAYBOOK */}
          {activeTab === 'testing' && (
            <div className="space-y-4">
              <div className="bg-[#def3e3] p-4 rounded-2xl border border-[#4A943E]/30">
                <h3 className="text-sm font-extrabold text-[#186049] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#D98327]" />
                  <span>Developer Testing Playbook</span>
                </h3>
                <p className="text-xs text-[#2D3E35] mt-1">
                  Step-by-step instructions to verify borrowing, returning, real camera scanning,
                  live Firestore writes, and campaign event triggers.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-white border border-[#E2DEC2]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-[#186049] text-white text-[11px] font-bold flex items-center justify-center">
                      1
                    </span>
                    <h4 className="text-xs font-bold text-[#14261C]">
                      Test QR Borrow Flow (Hardware or Simulator)
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#2D3E35] ml-7">
                    Tap the center <strong>SCAN QR</strong> button in bottom navigation. Tap any bag chip
                    or scan a real QR code with your webcam. Complete the loan and see it instantly appear in
                    Active Bags.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#E2DEC2]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-[#186049] text-white text-[11px] font-bold flex items-center justify-center">
                      2
                    </span>
                    <h4 className="text-xs font-bold text-[#14261C]">
                      Test Bag Return & Stamp Progression
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#2D3E35] ml-7">
                    On the Home screen, tap <strong>Return Bag</strong>. Choose any return bin station,
                    confirm return, and watch confetti trigger. A new stamp is added to your passport card!
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#E2DEC2]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-[#186049] text-white text-[11px] font-bold flex items-center justify-center">
                      3
                    </span>
                    <h4 className="text-xs font-bold text-[#14261C]">
                      Test Campaign Event Publishing
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#2D3E35] ml-7">
                    In the <strong>Events & Campaigns</strong> tab above, click <strong>Publish Now</strong> on
                    &quot;Exam Season Eco-Refill Blitz&quot;. Close this console: the event banner immediately appears on
                    the student Home dashboard with active bonus points!
                  </p>
                </div>
              </div>

              {/* Reset Data Button */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-[#707974]">Reset local caches?</span>
                <button
                  onClick={resetData}
                  className="px-4 py-2 rounded-full bg-[#FAF9F5] border border-[#E2DEC2] text-[#14261C] hover:bg-[#def3e3] text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Test State</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* PRINTABLE EXECUTIVE ESG REPORT MODAL */}
        {isPrintPreviewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-6 text-[#14261C]">
            <div className="w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-white border border-[#E2DEC2] shadow-2xl overflow-hidden">
              {/* Report Modal Header */}
              <div className="p-4 border-b border-[#E2DEC2] bg-[#FAF9F5] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#186049]" />
                  <span className="font-extrabold text-sm text-[#14261C]">
                    Academic Research & ESG Circularity Audit Document
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 rounded-full bg-[#186049] hover:bg-[#004734] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / Save as PDF</span>
                  </button>
                  <button
                    onClick={() => setIsPrintPreviewOpen(false)}
                    className="w-8 h-8 rounded-full bg-[#FAF9F5] hover:bg-[#def3e3] flex items-center justify-center text-[#2D3E35]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Report Document Body */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-[#14261C] bg-white print:p-0">
                <div className="border-b-2 border-[#186049] pb-4 flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#186049]">
                      Asia Pacific University • Institutional ESG Sustainability Report
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black text-[#14261C] mt-1 tracking-tight">
                      EcoCarry Campus Circularity & Plastic Elimination Audit
                    </h1>
                    <p className="text-xs text-[#707974] mt-1">
                      Author: Sustainability Office / Developer (menazaki012@gmail.com) • Generated: {new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#186049] text-white flex items-center justify-center font-black text-sm">
                    APU
                  </div>
                </div>

                {/* Executive Summary Table */}
                <div>
                  <h2 className="text-xs font-extrabold uppercase text-[#186049] tracking-wider mb-2">
                    1. Executive Summary & Core KPIs
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E2DEC2]">
                      <span className="text-[10px] text-[#707974] block">Participating Students</span>
                      <span className="text-xl font-black text-[#14261C]">{totalStudents}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E2DEC2]">
                      <span className="text-[10px] text-[#707974] block">Single-Use Bags Eliminated</span>
                      <span className="text-xl font-black text-[#186049]">{totalBagsDiverted.toLocaleString()}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E2DEC2]">
                      <span className="text-[10px] text-[#707974] block">Greenhouse Gas Avoidance</span>
                      <span className="text-xl font-black text-[#4A943E]">{totalCo2Offset} kg CO₂</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E2DEC2]">
                      <span className="text-[10px] text-[#707974] block">Mature Trees Equivalent</span>
                      <span className="text-xl font-black text-[#D98327]">{treesSavedEquivalent}</span>
                    </div>
                  </div>
                </div>

                {/* Faculty Analysis Table */}
                <div>
                  <h2 className="text-xs font-extrabold uppercase text-[#186049] tracking-wider mb-2">
                    2. Faculty Diversion Breakdown
                  </h2>
                  <table className="w-full text-left text-xs border border-[#E2DEC2]">
                    <thead className="bg-[#FAF9F5] border-b border-[#E2DEC2]">
                      <tr>
                        <th className="p-2.5 font-bold">Faculty</th>
                        <th className="p-2.5 text-center font-bold">Students</th>
                        <th className="p-2.5 text-center font-bold">Bags Diverted</th>
                        <th className="p-2.5 text-center font-bold">CO₂ Avoided</th>
                        <th className="p-2.5 text-right font-bold">Campus Share</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2DEC2]">
                      {Object.entries(facultyStats).map(([faculty, stats]) => {
                        const share =
                          totalBagsDiverted > 0
                            ? Math.round((stats.bags / totalBagsDiverted) * 100)
                            : 0;
                        return (
                          <tr key={faculty}>
                            <td className="p-2.5 font-medium">{faculty}</td>
                            <td className="p-2.5 text-center">{stats.count}</td>
                            <td className="p-2.5 text-center font-bold text-[#186049]">{stats.bags}</td>
                            <td className="p-2.5 text-center font-bold">{stats.co2} kg</td>
                            <td className="p-2.5 text-right font-bold text-[#D98327]">{share}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Methodology notes for report writing */}
                <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E2DEC2] text-xs text-[#2D3E35] space-y-1.5">
                  <span className="font-extrabold text-[#186049] block">
                    3. Methodology & Environmental Calculation Standard:
                  </span>
                  <p>
                    • <strong>Carbon Offset Formula:</strong> 1 single-use HDPE/LDPE bag avoided saves an average of 36 grams of CO₂ equivalent lifecycle emissions (GHG Protocol Scope 3).
                  </p>
                  <p>
                    • <strong>Biological Absorption:</strong> 1 mature tree absorbs approximately 21 kg of CO₂ per year (USDA Forest Service standard).
                  </p>
                  <p>
                    • <strong>Database Authorization:</strong> Collected via live Google Cloud Firestore transactions authenticated with student enterprise identities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Console Footer */}
        <div className="p-3.5 border-t border-[#E2DEC2] bg-[#FAF9F5] flex items-center justify-between text-xs text-[#707974]">
          <span>EcoCarry Dev Hub • Admin menazaki012@gmail.com</span>
          <button
            onClick={() => setIsDevConsoleOpen(false)}
            className="px-4 py-1.5 rounded-full bg-[#186049] text-white font-bold hover:bg-[#004734] transition-colors"
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
};

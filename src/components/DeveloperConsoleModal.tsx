import React, { useState } from 'react';
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
} from 'lucide-react';
import { DevAccount } from '../data/mockData';

export const DeveloperConsoleModal: React.FC = () => {
  const {
    isDevConsoleOpen,
    setIsDevConsoleOpen,
    isCurrentUserAdmin,
    devAccounts,
    adminAwardPoints,
    adminResolveBag,
    exportAllData,
    firebaseProjectId,
    firebaseConnected,
    activeBags,
    stations,
    resetData,
  } = useGreenBag();

  const [activeTab, setActiveTab] = useState<'accounts' | 'loans' | 'export' | 'testing'>('accounts');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacultyFilter, setSelectedFacultyFilter] = useState('ALL');
  const [selectedAccountForInspection, setSelectedAccountForInspection] = useState<DevAccount | null>(null);

  // Strictly restrict rendering to developer account
  if (!isDevConsoleOpen || !isCurrentUserAdmin) return null;

  // Filter accounts
  const filteredAccounts = devAccounts.filter((acc) => {
    const matchesSearch =
      acc.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFaculty =
      selectedFacultyFilter === 'ALL' || acc.faculty === selectedFacultyFilter;

    return matchesSearch && matchesFaculty;
  });

  // Calculate aggregated metrics
  const totalPointsDistributed = devAccounts.reduce((sum, a) => sum + a.points, 0);
  const totalBagsDiverted = devAccounts.reduce((sum, a) => sum + a.bagsSavedTotal, 0);
  const totalCo2Offset = devAccounts.reduce((sum, a) => sum + a.co2SavedKg, 0);

  const handleInspectUser = (acc: DevAccount) => {
    setSelectedAccountForInspection(acc);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-2 sm:p-4 text-[#14261C]">
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-[28px] bg-[#FAF9F5] border border-[#E2DEC2] shadow-tactile-fab overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E2DEC2] bg-[#def3e3]/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#186049] text-white flex items-center justify-center shadow-sm">
              <Database className="w-5 h-5 text-[#93d8bb]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-[#14261C] tracking-tight">
                  EcoCarry Developer & Admin Console
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#186049] text-white">
                  Live DB
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
            onClick={() => setActiveTab('accounts')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'accounts'
                ? 'bg-[#186049] text-white shadow-sm'
                : 'text-[#2D3E35] hover:bg-[#def3e3]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            All Accounts ({devAccounts.length})
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
            Campus Bag Loans ({activeBags.length})
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
            Data Export & Metrics
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
            How to Test App
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {/* TAB 1: ALL ACCOUNTS & USER DATA */}
          {activeTab === 'accounts' && (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#707974] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search by student name, ID, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 rounded-xl bg-white border border-[#E2DEC2] pl-10 pr-3 text-xs outline-none focus:border-[#186049]"
                  />
                </div>

                <select
                  value={selectedFacultyFilter}
                  onChange={(e) => setSelectedFacultyFilter(e.target.value)}
                  className="h-10 px-3 rounded-xl bg-white border border-[#E2DEC2] text-xs font-semibold text-[#14261C] outline-none"
                >
                  <option value="ALL">All Faculties</option>
                  <option value="School of Technology & AI">Technology & AI</option>
                  <option value="School of Design & Creative Arts">Design & Creative Arts</option>
                  <option value="Faculty of Business & Management">Business & Management</option>
                  <option value="Faculty of Engineering">Engineering</option>
                  <option value="APU Sustainability Office">Sustainability Office</option>
                </select>
              </div>

              {/* Accounts Roster Table / List */}
              <div className="divide-y divide-[#E2DEC2] rounded-2xl bg-white border border-[#E2DEC2] shadow-sm overflow-hidden">
                {filteredAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="p-3.5 hover:bg-[#def3e3]/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[#14261C]">
                          {account.studentName}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF9F5] border border-[#E2DEC2] text-[#2D3E35]">
                          {account.studentId}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#186049]/10 text-[#186049]">
                          {account.tier}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#2D3E35] mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>{account.email}</span>
                        <span>•</span>
                        <span>{account.faculty}</span>
                        <span>•</span>
                        <span className="font-semibold text-[#186049]">
                          {account.points} pts
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-[#D98327]">
                          {account.activeStreak}d streak
                        </span>
                      </div>
                      {account.activeBagNumbers.length > 0 && (
                        <div className="mt-1.5 flex items-center gap-1.5 text-[10px]">
                          <span className="font-semibold text-[#707974]">Active Bags:</span>
                          {account.activeBagNumbers.map((bagNum) => (
                            <span
                              key={bagNum}
                              className="px-1.5 py-0.5 rounded bg-[#ECE8AF] text-[#186049] font-bold"
                            >
                              {bagNum}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Admin Actions for this Account */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => adminAwardPoints(account.studentId, 50)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#def3e3] hover:bg-[#cbeed4] text-[#186049] text-[11px] font-bold transition-colors"
                        title="Add +50 eco points"
                      >
                        +50 Pts
                      </button>

                      <button
                        onClick={() => handleInspectUser(account)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#186049] hover:bg-[#004734] text-white text-[11px] font-bold transition-colors flex items-center gap-1"
                        title="Inspect student details"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CAMPUS BAG LOANS */}
          {activeTab === 'loans' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#14261C]">
                  All Active Bag Loans on Campus ({activeBags.length} active)
                </span>
                <span className="text-[11px] text-[#707974]">
                  Sanitization tracking & auto-return
                </span>
              </div>

              {activeBags.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-[#E2DEC2]">
                  <ShoppingBag className="w-10 h-10 text-[#bfc9c2] mx-auto mb-2" />
                  <p className="text-xs font-bold text-[#14261C]">No active bags checked out</p>
                  <p className="text-[11px] text-[#707974] mt-1">
                    Use the QR scanner or Testing tab to simulate a bag borrowing event.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {activeBags.map((bag) => (
                    <div
                      key={bag.id}
                      className="p-3.5 rounded-2xl bg-white border border-[#E2DEC2] flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-[#14261C]">
                            {bag.bagNumber}
                          </span>
                          <span className="text-xs font-semibold text-[#2D3E35]">
                            {bag.type}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#def3e3] text-[#186049]">
                            {bag.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#707974] mt-1 flex items-center gap-3">
                          <span>Origin: {bag.borrowedStationName}</span>
                          <span>•</span>
                          <span className="font-semibold text-[#D98327]">
                            Due: {bag.dueDate}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => adminResolveBag(bag.bagNumber)}
                        className="px-3 py-1.5 rounded-full bg-[#ECE8AF] hover:bg-[#e4df9c] text-[#186049] border border-[#E2DEC2] text-xs font-bold transition-all"
                        title="Mark bag returned and restock station"
                      >
                        Admin Return & Restock
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DATA EXPORT & AGGREGATE METRICS */}
          {activeTab === 'export' && (
            <div className="space-y-5">
              {/* Aggregated Campus Sustainability Metrics Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-[#E2DEC2] text-center">
                  <span className="block text-2xl font-extrabold text-[#186049]">
                    {devAccounts.length}
                  </span>
                  <span className="text-[11px] font-semibold text-[#2D3E35]">
                    Total Accounts
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-[#E2DEC2] text-center">
                  <span className="block text-2xl font-extrabold text-[#4A943E]">
                    {totalBagsDiverted}
                  </span>
                  <span className="text-[11px] font-semibold text-[#2D3E35]">
                    Bags Diverted
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-[#E2DEC2] text-center">
                  <span className="block text-2xl font-extrabold text-[#14261C]">
                    {totalCo2Offset.toFixed(1)} kg
                  </span>
                  <span className="text-[11px] font-semibold text-[#2D3E35]">
                    CO₂ Avoided
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-[#E2DEC2] text-center">
                  <span className="block text-2xl font-extrabold text-[#D98327]">
                    {totalPointsDistributed.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-semibold text-[#2D3E35]">
                    Eco Points Pool
                  </span>
                </div>
              </div>

              {/* Data Export Options */}
              <div className="rounded-2xl bg-[#ECE8AF] border border-[#E2DEC2] p-4 space-y-3">
                <div>
                  <h3 className="text-sm font-extrabold text-[#14261C]">
                    Export Data Collection Snapshot
                  </h3>
                  <p className="text-xs text-[#2D3E35] mt-0.5">
                    Download full campus dataset including registered accounts, active loans,
                    and audit activity logs for sustainability reporting.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => exportAllData('json')}
                    className="p-3 rounded-xl bg-white hover:bg-[#def3e3] border border-[#E2DEC2] text-left transition-all flex items-center justify-between shadow-sm group"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-xs text-[#14261C]">
                        <FileCode className="w-4 h-4 text-[#186049]" />
                        <span>Export All Data (.JSON)</span>
                      </div>
                      <span className="text-[10px] text-[#707974] block mt-0.5">
                        Complete raw database backup
                      </span>
                    </div>
                    <Download className="w-4 h-4 text-[#186049] group-hover:translate-y-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => exportAllData('csv')}
                    className="p-3 rounded-xl bg-white hover:bg-[#def3e3] border border-[#E2DEC2] text-left transition-all flex items-center justify-between shadow-sm group"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-xs text-[#14261C]">
                        <FileSpreadsheet className="w-4 h-4 text-[#4A943E]" />
                        <span>Export Accounts Roster (.CSV)</span>
                      </div>
                      <span className="text-[10px] text-[#707974] block mt-0.5">
                        Spreadsheet of all students & metrics
                      </span>
                    </div>
                    <Download className="w-4 h-4 text-[#4A943E] group-hover:translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Live Firebase Console Link */}
              <div className="p-4 rounded-2xl bg-white border border-[#E2DEC2] flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-[#14261C]">
                    Direct Firebase Firestore Console
                  </span>
                  <span className="text-[11px] text-[#707974]">
                    Inspect live Firestore documents at project {firebaseProjectId}
                  </span>
                </div>
                <a
                  href={`https://console.firebase.google.com/project/${firebaseProjectId}/firestore`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-[#186049] hover:bg-[#004734] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Open Console</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 4: HOW TO TEST THE APP */}
          {activeTab === 'testing' && (
            <div className="space-y-4">
              <div className="bg-[#def3e3] p-4 rounded-2xl border border-[#4A943E]/30">
                <h3 className="text-sm font-extrabold text-[#186049] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#D98327]" />
                  <span>Developer Testing Playbook</span>
                </h3>
                <p className="text-xs text-[#2D3E35] mt-1">
                  Follow these step-by-step test paths to verify all borrowing, returning,
                  cross-account sync, and scanner flows.
                </p>
              </div>

              {/* Testing Steps List */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-white border border-[#E2DEC2]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-[#186049] text-white text-[11px] font-bold flex items-center justify-center">
                      1
                    </span>
                    <h4 className="text-xs font-bold text-[#14261C]">
                      Test QR Borrow Flow (Zero Hardware Needed)
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#2D3E35] ml-7">
                    Tap the center <strong>SCAN QR</strong> button in the bottom navigation. In the
                    simulator section, tap <strong>#GB-2041 (Heavy Canvas Tote)</strong>. Check the
                    eco-pledge checkbox and tap <strong>Confirm & Unlock Bag</strong>. You will see
                    the bag appear in your Active Bags on the Home dashboard!
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
                    First borrow a bag in step 1, then on the Home screen click <strong>Return Bag</strong>.
                    Select the return bin station, confirm return, and watch the celebratory confetti trigger!
                    Visit the <strong>Perks</strong> tab to see a new gold seal stamp stamped on your passport.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#E2DEC2]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-[#186049] text-white text-[11px] font-bold flex items-center justify-center">
                      3
                    </span>
                    <h4 className="text-xs font-bold text-[#14261C]">
                      Test Real-Time Multi-Account Sync (Cross-Browser)
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#2D3E35] ml-7">
                    1. Open this app in normal browser tab and sign in as <strong>Mena Zaki</strong>.<br />
                    2. Open an Incognito/Private window and sign in with Google or as <strong>Kenji Sato</strong>.<br />
                    3. Perform a borrow or return action. The changes persist to Firebase Firestore and are visible in this Developer Console!
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#E2DEC2]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-[#186049] text-white text-[11px] font-bold flex items-center justify-center">
                      4
                    </span>
                    <h4 className="text-xs font-bold text-[#14261C]">
                      Test Real Camera QR Scanning
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#2D3E35] ml-7">
                    Open the Scanner and tap <strong>Switch to Live Webcam Scanner</strong> at the
                    bottom. The browser will request camera permission to render live video inside
                    the 260px reticle with animated green brackets!
                  </p>
                </div>
              </div>

              {/* Reset Data Button */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-[#707974]">
                  Need a clean slate?
                </span>
                <button
                  onClick={resetData}
                  className="px-4 py-2 rounded-full bg-[#FAF9F5] border border-[#E2DEC2] text-[#14261C] hover:bg-[#def3e3] text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset All Test Data to Default</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[#E2DEC2] bg-[#FAF9F5] flex items-center justify-between text-xs text-[#707974]">
          <span>EcoCarry v1.2 • Firestore Enterprise SDK</span>
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

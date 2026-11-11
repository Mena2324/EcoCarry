import React from 'react';
import { useGreenBag } from '../context/GreenBagContext';
import {
  Leaf,
  Clock,
  RotateCcw,
  PlusCircle,
  MapPin,
  ChevronRight,
  Flame,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Megaphone,
  Zap,
  AlertTriangle,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    user,
    campusMetrics,
    activeBags,
    stampSlots,
    activities,
    activeEvents,
    setIsScannerOpen,
    setScannerMode,
    setPreselectedBagIdForReturn,
    setSelectedBagDetails,
    setActiveTab,
  } = useGreenBag();

  const stampedCount = stampSlots.filter((s) => s.isStamped).length;

  const handleReturnDirect = (bagId: string) => {
    setPreselectedBagIdForReturn(bagId);
    setScannerMode('return');
    setIsScannerOpen(true);
  };

  const handleBorrowDirect = () => {
    setPreselectedBagIdForReturn(null);
    setScannerMode('borrow');
    setIsScannerOpen(true);
  };

  return (
    <div className="space-y-6 pb-28 pt-2">
      {/* Greeting Banner */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[#2D3E35] uppercase tracking-wider">
            Campus Eco Network
          </span>
          <h1 className="text-2xl font-extrabold text-[#14261C] tracking-tight">
            Hi, {user.studentName.split(' ')[0]} 👋
          </h1>
        </div>
        <div className="flex items-center gap-1.5 bg-[#def3e3] border border-[#4A943E]/30 text-[#186049] px-3 py-1.5 rounded-full text-xs font-bold shadow-tactile-sm">
          <Flame className="w-3.5 h-3.5 text-[#D98327] fill-[#D98327]" />
          <span>{user.activeStreak} Day Streak</span>
        </div>
      </div>

      {/* Active Campus Event / Campaign Banner (shown when event is live or scheduled now) */}
      {activeEvents.length > 0 && (
        <div className="p-4 rounded-[22px] bg-gradient-to-r from-[#186049] to-[#004734] text-white shadow-tactile-md relative overflow-hidden border border-[#4A943E]/40 animate-fade-in">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-[#4A943E]/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#def3e3] text-[#186049]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A943E] animate-pulse" />
                  CAMPUS EVENT ACTIVE
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#D98327] text-white shadow-sm">
                  {activeEvents[0].badgeText}
                </span>
                {activeEvents[0].multiplier > 1 && (
                  <span className="text-[10px] font-bold text-[#acf1d3] flex items-center gap-0.5">
                    <Zap className="w-3 h-3 text-[#D98327] fill-[#D98327]" />
                    {activeEvents[0].multiplier}x Points
                  </span>
                )}
              </div>
              <h3 className="text-base font-extrabold text-white tracking-tight">
                {activeEvents[0].title}
              </h3>
              <p className="text-xs text-[#def3e3]/90 mt-1 leading-relaxed">
                {activeEvents[0].description}
              </p>
            </div>

            <button
              onClick={handleBorrowDirect}
              className="px-4 py-2 rounded-full bg-[#ECE8AF] hover:bg-white text-[#186049] text-xs font-bold transition-all shadow-tactile-sm shrink-0 self-start sm:self-center"
            >
              Scan & Join Event
            </button>
          </div>
        </div>
      )}

      {/* Hero Metric & Impact Card (Soft Kraft Cream #ECE8AF with 20px radius) */}
      <div className="relative overflow-hidden rounded-[20px] bg-[#ECE8AF] border border-[#E2DEC2] p-5 shadow-tactile-md">
        {/* Background decorative subtle leaf icon */}
        <div className="absolute -right-4 -bottom-6 text-[#186049]/10 pointer-events-none">
          <Leaf className="w-40 h-40 transform rotate-12" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#186049] bg-[#FAF9F5]/80 px-2.5 py-1 rounded-full border border-[#E2DEC2]">
              Personal Sustainability Impact
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-[#186049]">
              <Sparkles className="w-3.5 h-3.5 text-[#D98327]" />
              <span>{user.tier}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#186049] tracking-tight">
                  {user.bagsSavedTotal}
                </span>
                <span className="text-xs font-bold text-[#2D3E35]">bags saved</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <div className="flex-1 bg-[#FAF9F5] h-2 rounded-full overflow-hidden border border-[#E2DEC2]">
                  <div
                    className="bg-[#4A943E] h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, (user.bagsSavedTotal / 50) * 100)}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-[#186049]">
                  {Math.max(0, 50 - user.bagsSavedTotal)} to Next Tier
                </span>
              </div>
            </div>

            <div className="border-l border-[#E2DEC2]/80 pl-4 flex flex-col justify-center">
              <span className="text-xs text-[#2D3E35] font-semibold">CO₂ Offset</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#14261C]">
                  {user.co2SavedKg}
                </span>
                <span className="text-xs font-bold text-[#4A943E]">kg avoided</span>
              </div>
              <span className="text-[11px] text-[#2D3E35] mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#186049]" /> 100% Cotton reusable
              </span>
            </div>
          </div>

          {/* Quick link to stamp card reward */}
          <div
            onClick={() => setActiveTab('rewards')}
            className="mt-4 pt-3 border-t border-[#E2DEC2] flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#186049] text-white flex items-center justify-center text-xs font-bold">
                {stampedCount}
              </div>
              <span className="text-xs font-semibold text-[#14261C]">
                {10 - stampedCount} more stamps until next free perk!
              </span>
            </div>
            <span className="text-xs font-bold text-[#186049] flex items-center">
              View Stamps <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Active Borrowed Bags Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#14261C] tracking-tight">
              Active Borrowed Bags
            </h2>
            <span className="w-5 h-5 rounded-full bg-[#186049] text-white text-[11px] font-bold flex items-center justify-center">
              {activeBags.length}
            </span>
          </div>
          <button
            onClick={handleBorrowDirect}
            className="text-xs font-bold text-[#186049] hover:underline flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Borrow Another
          </button>
        </div>

        {activeBags.length === 0 ? (
          <div className="p-6 text-center rounded-[20px] bg-[#FAF9F5] border border-[#E2DEC2] shadow-tactile-sm">
            <div className="w-12 h-12 rounded-full bg-[#def3e3] text-[#186049] flex items-center justify-center mx-auto mb-2">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[#14261C]">No active bags borrowed</h3>
            <p className="text-xs text-[#2D3E35] mt-1 max-w-xs mx-auto">
              Scan a QR code at any APU cafe or campus station to pick up an eco-bag in 5 seconds.
            </p>
            <button
              onClick={handleBorrowDirect}
              className="mt-4 px-5 py-2.5 rounded-full bg-[#186049] text-white text-xs font-bold hover:bg-[#004734] transition-colors shadow-tactile-sm"
            >
              Scan & Borrow Now
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeBags.map((bag) => {
              return (
                <div
                  key={bag.id}
                  className="rounded-[20px] bg-[#FAF9F5] border border-[#E2DEC2] p-4 shadow-tactile-sm hover:border-[#186049]/40 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold text-[#14261C]">
                          {bag.bagNumber}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FAF9F5] text-[#186049] border border-[#4A943E]">
                          <CheckCircle2 className="w-3 h-3 text-[#4A943E]" /> Active Loan
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#2D3E35] mt-0.5">{bag.type}</p>
                    </div>

                    <button
                      onClick={() => setSelectedBagDetails(bag)}
                      className="text-xs font-semibold text-[#186049] hover:bg-[#def3e3] px-2.5 py-1 rounded-full transition-colors"
                    >
                      Details
                    </button>
                  </div>

                  {/* Metadata Row */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[#2D3E35] bg-[#e3f9e9]/50 p-2.5 rounded-xl border border-[#E2DEC2]/60">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#186049] shrink-0" />
                      <span className="truncate">{bag.borrowedStationName.split('(')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <Sparkles className="w-3.5 h-3.5 text-[#4A943E] shrink-0" />
                      <span className="font-semibold text-[11px] text-[#186049]">No 7-day limit • Keep anytime</span>
                    </div>
                  </div>

                  {/* Action Buttons: Return Bag or Report Missing */}
                  <div className="mt-3.5 flex items-center gap-2">
                    <button
                      onClick={() => handleReturnDirect(bag.id)}
                      className="flex-1 py-2.5 px-4 rounded-full bg-[#186049] hover:bg-[#004734] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-tactile-sm active:scale-[0.99] transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Return Bag & Collect Stamp
                    </button>
                    <button
                      onClick={() => setSelectedBagDetails(bag)}
                      className="py-2.5 px-3 rounded-full bg-[#FAF9F5] hover:bg-[#fff3e0] text-[#D98327] border border-[#E2DEC2] text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                      title="Report Missing"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Report Missing</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Action Grid */}
      <div>
        <h2 className="text-lg font-bold text-[#14261C] tracking-tight mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleBorrowDirect}
            className="p-4 rounded-[20px] bg-[#FAF9F5] border border-[#E2DEC2] hover:border-[#186049] text-left shadow-tactile-sm hover:shadow-tactile-md transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-[#def3e3] text-[#186049] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <PlusCircle className="w-5 h-5 text-[#186049]" />
            </div>
            <span className="block text-sm font-bold text-[#14261C]">Borrow Eco-Bag</span>
            <span className="text-[11px] text-[#2D3E35]">Scan QR tag at station</span>
          </button>

          <button
            onClick={() => setActiveTab('stations')}
            className="p-4 rounded-[20px] bg-[#FAF9F5] border border-[#E2DEC2] hover:border-[#186049] text-left shadow-tactile-sm hover:shadow-tactile-md transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-[#def3e3] text-[#186049] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <MapPin className="w-5 h-5 text-[#186049]" />
            </div>
            <span className="block text-sm font-bold text-[#14261C]">Find Stations</span>
            <span className="text-[11px] text-[#2D3E35]">6 locations on campus</span>
          </button>
        </div>
      </div>

      {/* Campus Wide Pulse / Collective Milestone */}
      <div className="p-4 rounded-[20px] bg-[#FAF9F5] border border-[#E2DEC2] shadow-tactile-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#4A943E]/15 text-[#226d1b] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#14261C]">Campus Collective Goal</span>
          </div>
          <span className="text-xs font-extrabold text-[#186049]">
            {campusMetrics.monthlyGoal > 0
              ? Math.round((campusMetrics.totalBagsEliminated / campusMetrics.monthlyGoal) * 100)
              : 0}%
          </span>
        </div>

        <div className="w-full bg-[#e3f9e9] h-2.5 rounded-full overflow-hidden border border-[#E2DEC2]">
          <div
            className="bg-[#186049] h-full rounded-full transition-all duration-700"
            style={{
              width: `${
                campusMetrics.monthlyGoal > 0
                  ? Math.min(100, (campusMetrics.totalBagsEliminated / campusMetrics.monthlyGoal) * 100)
                  : 0
              }%`,
            }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-[#2D3E35]">
          <span>
            <strong className="text-[#14261C]">
              {campusMetrics.totalBagsEliminated.toLocaleString()}
            </strong>{' '}
            bags diverted
          </span>
          <span>Goal: {campusMetrics.monthlyGoal.toLocaleString()}</span>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div>
        <h2 className="text-lg font-bold text-[#14261C] tracking-tight mb-3">Recent Activity</h2>
        {activities.length === 0 ? (
          <div className="py-8 px-4 text-center rounded-[20px] bg-[#FAF9F5] border border-[#E2DEC2] shadow-tactile-sm">
            <div className="w-10 h-10 rounded-full bg-[#def3e3] text-[#186049] flex items-center justify-center mx-auto mb-2">
              <RotateCcw className="w-5 h-5 text-[#4A943E]" />
            </div>
            <p className="text-xs font-bold text-[#14261C]">No recent activity recorded yet</p>
            <p className="text-[11px] text-[#2D3E35] mt-1 max-w-xs mx-auto">
              Scan a QR code to borrow or return a bag. Your real-time eco logs will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E2DEC2] rounded-[20px] bg-[#FAF9F5] border border-[#E2DEC2] px-4 shadow-tactile-sm">
            {activities.slice(0, 4).map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      item.type === 'borrow'
                        ? 'bg-[#186049] text-white'
                        : item.type === 'return'
                        ? 'bg-[#4A943E] text-white'
                        : 'bg-[#D98327] text-white'
                    }`}
                  >
                    {item.type === 'borrow' ? (
                      <PlusCircle className="w-4 h-4" />
                    ) : item.type === 'return' ? (
                      <RotateCcw className="w-4 h-4" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#14261C]">
                      {item.action} — {item.bagNumber}
                    </span>
                    <span className="text-[11px] text-[#2D3E35]">{item.location}</span>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-[#707974]">{item.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

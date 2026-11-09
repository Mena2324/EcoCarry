import React, { useState } from 'react';
import { useGreenBag } from '../context/GreenBagContext';
import {
  MapPin,
  Clock,
  Sparkles,
  Navigation as NavIcon,
  Search,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Station } from '../types/greenbag';

export const StationsView: React.FC = () => {
  const {
    stations,
    setIsScannerOpen,
    setScannerMode,
    setSelectedStationForBorrow,
    selectedStationModal,
    setSelectedStationModal,
  } = useGreenBag();

  const [activeFilter, setActiveFilter] = useState<'all' | 'high_stock' | '24h' | 'near'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPinId, setSelectedPinId] = useState<string | null>(stations[0]?.id ?? null);

  // Filter stations
  const filteredStations = stations.filter((station) => {
    const matchesSearch =
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.address.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'high_stock') return station.bagInventory.available >= 15;
    if (activeFilter === '24h') return station.is24Hours;
    if (activeFilter === 'near') return station.distanceMeters <= 250;
    return true;
  });

  const handleStartBorrowAtStation = (st: Station) => {
    setSelectedStationForBorrow(st.id);
    setScannerMode('borrow');
    setIsScannerOpen(true);
  };

  const handleStartReturnAtStation = (st: Station) => {
    setSelectedStationForBorrow(st.id);
    setScannerMode('return');
    setIsScannerOpen(true);
  };

  const activeStationForPin = stations.find((s) => s.id === selectedPinId) || stations[0];

  return (
    <div className="space-y-6 pb-28 pt-2">
      {/* Title & Stats */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[#2D3E35] uppercase tracking-wider">
            Campus Network
          </span>
          <h1 className="text-2xl font-extrabold text-[#14261C] tracking-tight">
            Drop-off & Borrow Stations
          </h1>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-[#186049] bg-[#def3e3] px-2.5 py-1 rounded-full border border-[#4A943E]/30">
            {stations.reduce((acc, curr) => acc + curr.bagInventory.available, 0)} Bags Ready
          </span>
        </div>
      </div>

      {/* Interactive Visual Campus Map Schematic */}
      <div className="relative rounded-[20px] bg-[#def3e3]/70 border border-[#E2DEC2] p-4 shadow-tactile-sm overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-[#186049] uppercase tracking-wider flex items-center gap-1">
            <NavIcon className="w-3.5 h-3.5" /> Interactive Campus Map
          </span>
          <span className="text-[10px] font-semibold text-[#2D3E35]">
            Tap pins to inspect kiosks
          </span>
        </div>

        {/* Map Canvas Visual */}
        <div className="relative w-full h-52 bg-[#e9ffee] rounded-xl border border-[#bfc9c2]/60 overflow-hidden shadow-inner">
          {/* Subtle Campus Grid & Zones */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#186049 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
          
          {/* Schematic Campus Paths */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#bfc9c2] stroke-2 stroke-dashed opacity-60">
            <line x1="22%" y1="24%" x2="38%" y2="44%" />
            <line x1="38%" y1="44%" x2="55%" y2="32%" />
            <line x1="38%" y1="44%" x2="42%" y2="68%" />
            <line x1="55%" y1="32%" x2="72%" y2="48%" />
            <line x1="72%" y1="48%" x2="80%" y2="75%" />
          </svg>

          {/* Campus Landmarks */}
          <div className="absolute top-2 left-3 text-[10px] font-bold text-[#2D3E35]/60 uppercase tracking-widest">
            North APU Grounds
          </div>
          <div className="absolute bottom-2 right-3 text-[10px] font-bold text-[#2D3E35]/60 uppercase tracking-widest">
            South Athletic Fields
          </div>

          {/* Interactive Pins */}
          {stations.map((station) => {
            const isSelected = selectedPinId === station.id;
            return (
              <button
                key={station.id}
                onClick={() => setSelectedPinId(station.id)}
                style={{ left: `${station.coordinates.x}%`, top: `${station.coordinates.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-transform ${
                  isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shadow-tactile-md transition-all ${
                    isSelected
                      ? 'bg-[#186049] text-white ring-4 ring-[#93d8bb]'
                      : 'bg-[#FAF9F5] text-[#186049] border-2 border-[#186049]'
                  }`}
                >
                  <MapPin className="w-4 h-4 fill-current" />
                </div>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-0.5 whitespace-nowrap shadow-sm ${
                    isSelected
                      ? 'bg-[#186049] text-white'
                      : 'bg-[#FAF9F5]/90 text-[#14261C] border border-[#E2DEC2]'
                  }`}
                >
                  {station.shortName}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Pin Quick Preview Tray */}
        {activeStationForPin && (
          <div className="mt-3 bg-[#FAF9F5] p-3 rounded-xl border border-[#E2DEC2] flex items-center justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#14261C]">{activeStationForPin.name}</span>
                {activeStationForPin.is24Hours && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#def3e3] text-[#186049]">
                    24/7
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#2D3E35]">
                {activeStationForPin.bagInventory.available} bags in stock • {activeStationForPin.distanceMeters}m walk
              </span>
            </div>
            <button
              onClick={() => handleStartBorrowAtStation(activeStationForPin)}
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#186049] text-white hover:bg-[#004734] transition-colors"
            >
              Borrow Here
            </button>
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        {/* Search input with 52px height and 12px radius */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#707974] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search stations (Cafeteria, Library, Block D...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[52px] rounded-[12px] bg-[#FAF9F5] border border-[#E2DEC2] focus:border-[2px] focus:border-[#186049] pl-10 pr-4 text-xs text-[#14261C] outline-none transition-all shadow-tactile-sm"
          />
        </div>

        {/* Filter Chips conforming to design guidelines */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'all'
                ? 'bg-[#186049] text-[#FAF9F5] shadow-sm'
                : 'bg-[#FAF9F5] border border-[#E2DEC2] text-[#2D3E35] hover:bg-[#def3e3]'
            }`}
          >
            All Stations ({stations.length})
          </button>
          <button
            onClick={() => setActiveFilter('high_stock')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'high_stock'
                ? 'bg-[#186049] text-[#FAF9F5] shadow-sm'
                : 'bg-[#FAF9F5] border border-[#E2DEC2] text-[#2D3E35] hover:bg-[#def3e3]'
            }`}
          >
            High Stock (15+ Bags)
          </button>
          <button
            onClick={() => setActiveFilter('24h')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === '24h'
                ? 'bg-[#186049] text-[#FAF9F5] shadow-sm'
                : 'bg-[#FAF9F5] border border-[#E2DEC2] text-[#2D3E35] hover:bg-[#def3e3]'
            }`}
          >
            24/7 Access
          </button>
          <button
            onClick={() => setActiveFilter('near')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'near'
                ? 'bg-[#186049] text-[#FAF9F5] shadow-sm'
                : 'bg-[#FAF9F5] border border-[#E2DEC2] text-[#2D3E35] hover:bg-[#def3e3]'
            }`}
          >
            Closest to Me (&lt;250m)
          </button>
        </div>
      </div>

      {/* Station List Cards */}
      <div className="space-y-4">
        {filteredStations.map((station) => {
          const avail = station.bagInventory.available;
          const total = station.bagInventory.total;
          const percent = Math.round((avail / total) * 100);
          const binPercent = station.returnBinCapacityPercent;

          return (
            <div
              key={station.id}
              className="rounded-[20px] bg-[#FAF9F5] border border-[#E2DEC2] p-4 shadow-tactile-sm hover:border-[#186049]/40 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-[#14261C]">
                      {station.name}
                    </h3>
                    {station.is24Hours && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#def3e3] text-[#186049]">
                        24h
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#2D3E35] mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#186049] shrink-0" />
                    <span>{station.address}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#14261C] block">
                    {station.distanceMeters}m
                  </span>
                  <span className="text-[10px] text-[#707974]">
                    ~{Math.ceil(station.distanceMeters / 80)} min walk
                  </span>
                </div>
              </div>

              {/* Inventory Meters */}
              <div className="mt-3 grid grid-cols-2 gap-3 bg-[#e3f9e9]/50 p-3 rounded-xl border border-[#E2DEC2]/60">
                {/* Available Bags */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-[#2D3E35]">Available Bags</span>
                    <span className="font-bold text-[#186049]">
                      {avail} / {total}
                    </span>
                  </div>
                  <div className="w-full bg-[#FAF9F5] h-2 rounded-full overflow-hidden border border-[#E2DEC2]">
                    <div
                      className={`h-full rounded-full ${
                        percent < 25 ? 'bg-[#D98327]' : 'bg-[#4A943E]'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Return Bin Capacity */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-[#2D3E35]">Return Drop Bin</span>
                    <span
                      className={`font-bold ${
                        binPercent > 80 ? 'text-[#D98327]' : 'text-[#186049]'
                      }`}
                    >
                      {binPercent}% Full
                    </span>
                  </div>
                  <div className="w-full bg-[#FAF9F5] h-2 rounded-full overflow-hidden border border-[#E2DEC2]">
                    <div
                      className={`h-full rounded-full ${
                        binPercent > 80 ? 'bg-[#D98327]' : 'bg-[#186049]'
                      }`}
                      style={{ width: `${binPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Station Feature Tags */}
              <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-medium text-[#2D3E35] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#186049]" /> {station.hours}
                </span>
                {station.features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#FAF9F5] border border-[#E2DEC2] text-[#2D3E35]"
                  >
                    {feat}
                  </span>
                ))}
              </div>

              {/* Primary & Secondary Action Buttons */}
              <div className="mt-3.5 flex items-center gap-2">
                <button
                  onClick={() => handleStartBorrowAtStation(station)}
                  className="flex-1 py-2.5 px-4 rounded-full bg-[#186049] hover:bg-[#004734] text-white text-xs font-bold shadow-tactile-sm active:scale-[0.99] transition-all flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#93d8bb]" /> Borrow from Here
                </button>
                <button
                  onClick={() => handleStartReturnAtStation(station)}
                  className="py-2.5 px-4 rounded-full bg-[#ECE8AF] hover:bg-[#e4df9c] text-[#186049] border border-[#E2DEC2] text-xs font-bold transition-all"
                >
                  Drop-off Here
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

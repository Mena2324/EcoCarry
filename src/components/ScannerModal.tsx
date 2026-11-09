import React, { useState, useEffect, useRef } from 'react';
import { useGreenBag } from '../context/GreenBagContext';
import {
  X,
  Zap,
  ZapOff,
  Check,
  RotateCcw,
  PlusCircle,
  Building2,
  Calendar,
  Sparkles,
  QrCode,
  AlertCircle,
} from 'lucide-react';
import { ActiveBag } from '../types/greenbag';

export const ScannerModal: React.FC = () => {
  const {
    isScannerOpen,
    setIsScannerOpen,
    scannerMode,
    setScannerMode,
    activeBags,
    stations,
    preselectedBagIdForReturn,
    setPreselectedBagIdForReturn,
    borrowBag,
    returnBag,
    selectedStationForBorrow,
  } = useGreenBag();

  const [torchOn, setTorchOn] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Scanned verification step state
  const [scannedBagCandidate, setScannedBagCandidate] = useState<{
    bagNumber: string;
    type: ActiveBag['type'];
    stationId: string;
  } | null>(null);

  // Return step state
  const [selectedReturnBagId, setSelectedReturnBagId] = useState<string>(
    preselectedBagIdForReturn || (activeBags[0]?.id ?? '')
  );
  const [selectedReturnStationId, setSelectedReturnStationId] = useState<string>(stations[0]?.id ?? 'st-1');

  // Eco pledge checkbox
  const [agreedToPledge, setAgreedToPledge] = useState(true);

  // Manual code input
  const [manualCode, setManualCode] = useState('');

  // Update selected bag when preselect changes
  useEffect(() => {
    if (preselectedBagIdForReturn) {
      setSelectedReturnBagId(preselectedBagIdForReturn);
    } else if (activeBags.length > 0 && !selectedReturnBagId) {
      setSelectedReturnBagId(activeBags[0].id);
    }
  }, [preselectedBagIdForReturn, activeBags]);

  // Handle camera init if user toggles camera
  useEffect(() => {
    if (isScannerOpen && useCamera) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setCameraError(null);
        })
        .catch((err) => {
          console.warn('Camera access error:', err);
          setCameraError('Camera stream not accessible. Using high-fidelity scan simulator.');
          setUseCamera(false);
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isScannerOpen, useCamera]);

  if (!isScannerOpen) return null;

  // Simulate scanning a code
  const handleSimulateScan = (bagNumber: string, type: ActiveBag['type']) => {
    const stationId = selectedStationForBorrow || stations[0]?.id || 'st-1';
    setScannedBagCandidate({
      bagNumber,
      type,
      stationId,
    });
  };

  const handleConfirmBorrow = () => {
    if (!scannedBagCandidate) return;
    borrowBag(scannedBagCandidate.stationId, scannedBagCandidate.type, scannedBagCandidate.bagNumber);
    setScannedBagCandidate(null);
    setIsScannerOpen(false);
  };

  const handleConfirmReturn = () => {
    if (!selectedReturnBagId) return;
    returnBag(selectedReturnBagId, selectedReturnStationId);
    setIsScannerOpen(false);
    setPreselectedBagIdForReturn(null);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    const clean = manualCode.trim().toUpperCase();
    if (scannerMode === 'borrow') {
      handleSimulateScan(clean.startsWith('GB-') ? clean : `GB-${clean}`, 'Heavy Canvas Tote');
    } else {
      // Find matching bag or pick selected
      const found = activeBags.find((b) => b.bagNumber.toLowerCase() === clean.toLowerCase());
      if (found) {
        returnBag(found.id, selectedReturnStationId);
      } else if (selectedReturnBagId) {
        returnBag(selectedReturnBagId, selectedReturnStationId);
      }
      setIsScannerOpen(false);
    }
    setManualCode('');
  };

  const chosenStation = stations.find((s) => s.id === (scannedBagCandidate?.stationId || selectedStationForBorrow)) || stations[0];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#14261C]/85 backdrop-blur-[12px] text-white">
      {/* Top Header Bar */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          {/* Mode Switcher Pills */}
          <div className="flex items-center bg-[#14261C]/90 p-1 rounded-full border border-white/20">
            <button
              onClick={() => {
                setScannerMode('borrow');
                setScannedBagCandidate(null);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                scannerMode === 'borrow'
                  ? 'bg-[#186049] text-white shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Borrow
            </button>
            <button
              onClick={() => {
                setScannerMode('return');
                setScannedBagCandidate(null);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                scannerMode === 'return'
                  ? 'bg-[#4A943E] text-white shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Return
            </button>
          </div>
        </div>

        {/* Torch and Close Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTorchOn(!torchOn)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              torchOn ? 'bg-[#ECE8AF] text-[#186049]' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="Toggle Flashlight"
          >
            {torchOn ? <Zap className="w-5 h-5 fill-current" /> : <ZapOff className="w-5 h-5" />}
          </button>

          <button
            onClick={() => {
              setIsScannerOpen(false);
              setScannedBagCandidate(null);
            }}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Viewfinder Center Stage */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 overflow-y-auto">
        {!scannedBagCandidate ? (
          <div className="flex flex-col items-center w-full max-w-sm">
            {/* Viewfinder: Centered 260px x 260px square with 24px rounded corners framed by 3px solid #4A943E */}
            <div className="relative w-[260px] h-[260px] rounded-[24px] overflow-hidden bg-black/30 border border-white/10 shadow-tactile-fab flex items-center justify-center">
              {/* Optional Camera Feed */}
              {useCamera ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <QrCode className="w-16 h-16 text-white/20 mb-2" />
                  <p className="text-[11px] text-white/60 font-medium">
                    {scannerMode === 'borrow'
                      ? 'Point at the QR label on the bag strap'
                      : 'Scan return bin barcode or confirm below'}
                  </p>
                </div>
              )}

              {/* Four 3px solid corner brackets in Fresh Leaf Green (#4A943E) */}
              <div className="absolute top-2 left-2 w-8 h-8 border-t-[3px] border-l-[3px] border-[#4A943E] rounded-tl-xl pointer-events-none" />
              <div className="absolute top-2 right-2 w-8 h-8 border-t-[3px] border-r-[3px] border-[#4A943E] rounded-tr-xl pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-[3px] border-l-[3px] border-[#4A943E] rounded-bl-xl pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b-[3px] border-r-[3px] border-[#4A943E] rounded-br-xl pointer-events-none" />

              {/* Scan Beam: horizontal gradient passing vertically */}
              <div className="absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-[#4A943E] to-transparent shadow-[0_0_12px_#4A943E] animate-scan-beam pointer-events-none" />

              {/* Torch indicator light */}
              {torchOn && (
                <div className="absolute inset-0 bg-white/25 pointer-events-none" />
              )}
            </div>

            {/* Reticle Instructions: Pill container floating directly below the reticle filled with rgba(20, 38, 28, 0.85) */}
            <div className="mt-4 px-4 py-2 rounded-full bg-[#14261C]/90 border border-white/20 text-center shadow-md">
              <p className="text-xs font-semibold text-white tracking-wide">
                {scannerMode === 'borrow'
                  ? 'Align QR code on bag or station terminal'
                  : 'Select active bag to deposit into return bin'}
              </p>
            </div>

            {cameraError && (
              <p className="text-[11px] text-[#ffbd82] mt-2 flex items-center gap-1 text-center">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {cameraError}
              </p>
            )}

            {/* Mode-specific Fast Simulator Actions */}
            {scannerMode === 'borrow' ? (
              <div className="w-full mt-6 bg-[#FAF9F5] text-[#14261C] p-4 rounded-[20px] shadow-tactile-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#186049]">
                    Simulate Bag Scan
                  </span>
                  <span className="text-[10px] text-[#2D3E35]">Tap to test</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSimulateScan('GB-2041', 'Heavy Canvas Tote')}
                    className="p-2.5 rounded-xl bg-[#def3e3] hover:bg-[#cbeed4] text-left border border-[#E2DEC2] transition-colors"
                  >
                    <span className="block text-xs font-bold text-[#186049]">#GB-2041</span>
                    <span className="text-[10px] text-[#2D3E35]">Heavy Canvas Tote</span>
                  </button>
                  <button
                    onClick={() => handleSimulateScan('GB-4190', 'Thermal Meal Pouch')}
                    className="p-2.5 rounded-xl bg-[#ECE8AF] hover:bg-[#e4df9c] text-left border border-[#E2DEC2] transition-colors"
                  >
                    <span className="block text-xs font-bold text-[#186049]">#GB-4190</span>
                    <span className="text-[10px] text-[#2D3E35]">Thermal Meal Pouch</span>
                  </button>
                </div>

                {/* Manual Bag ID Entry */}
                <form onSubmit={handleManualSubmit} className="mt-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Or enter Bag ID (e.g. GB-3011)"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      className="w-full h-[52px] rounded-[12px] bg-[#FAF9F5] border border-[#E2DEC2] focus:border-[2px] focus:border-[#186049] px-3.5 text-xs text-[#14261C] placeholder:text-[#707974] outline-none transition-all"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-2 bottom-2 px-3 rounded-lg bg-[#186049] text-white text-xs font-bold hover:bg-[#004734] transition-colors"
                    >
                      Verify
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Return Bag Flow */
              <div className="w-full mt-6 bg-[#FAF9F5] text-[#14261C] p-4 rounded-[20px] shadow-tactile-md">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#186049] mb-2">
                  Select Bag to Return
                </span>

                {activeBags.length === 0 ? (
                  <p className="text-xs text-[#2D3E35] py-2 text-center">
                    You currently have no active bags borrowed.
                  </p>
                ) : (
                  <div className="space-y-2 mb-3 max-h-36 overflow-y-auto">
                    {activeBags.map((bag) => (
                      <label
                        key={bag.id}
                        className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                          selectedReturnBagId === bag.id
                            ? 'bg-[#def3e3] border-[#186049]'
                            : 'bg-white border-[#E2DEC2]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="returnBag"
                            checked={selectedReturnBagId === bag.id}
                            onChange={() => setSelectedReturnBagId(bag.id)}
                            className="accent-[#186049]"
                          />
                          <div>
                            <span className="block text-xs font-bold text-[#14261C]">
                              {bag.bagNumber} — {bag.type}
                            </span>
                            <span className="text-[10px] text-[#2D3E35]">
                              {bag.borrowedStationName.split('(')[0]} • {bag.dueDate}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#186049]/10 text-[#186049]">
                          +50 pts
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Drop-off Station Selector */}
                <div className="mb-3">
                  <label className="block text-[11px] font-bold text-[#2D3E35] mb-1">
                    Drop-off Return Station
                  </label>
                  <select
                    value={selectedReturnStationId}
                    onChange={(e) => setSelectedReturnStationId(e.target.value)}
                    className="w-full h-11 rounded-[12px] bg-[#FAF9F5] border border-[#E2DEC2] text-xs font-semibold text-[#14261C] px-3 outline-none"
                  >
                    {stations.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.returnBinCapacityPercent}% full)
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleConfirmReturn}
                  disabled={!selectedReturnBagId || activeBags.length === 0}
                  className="w-full py-3.5 rounded-full bg-[#186049] hover:bg-[#004734] disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-tactile-sm transition-all"
                >
                  <Check className="w-4 h-4" /> Confirm Return & Collect Stamp
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Confirmation Sheet for Checkout (Containers & cards 1.5rem / 24px) */
          <div className="w-full max-w-sm bg-[#FAF9F5] text-[#14261C] rounded-[24px] p-5 shadow-tactile-md">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2DEC2]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A943E]">
                  Verified NFC / QR Scan
                </span>
                <h3 className="text-xl font-extrabold text-[#14261C]">
                  {scannedBagCandidate.bagNumber}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#def3e3] text-[#186049] text-xs font-bold border border-[#4A943E]/30">
                UV-C Ready
              </span>
            </div>

            <div className="py-4 space-y-3 text-xs text-[#2D3E35]">
              <div className="flex items-center justify-between">
                <span className="font-medium">Model & Type:</span>
                <span className="font-bold text-[#14261C]">{scannedBagCandidate.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Pickup Station:</span>
                <span className="font-bold text-[#14261C] flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-[#186049]" /> {chosenStation.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Borrow Period:</span>
                <span className="font-bold text-[#186049] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#4A943E]" /> No time limit • Return anytime
                </span>
              </div>
            </div>

            {/* Eco Checkbox: 22px rounded square (6px radius) filled with #186049 and off-white checkmark */}
            <div className="bg-[#ECE8AF]/60 p-3.5 rounded-xl border border-[#E2DEC2] flex items-start gap-2.5 mb-5">
              <button
                type="button"
                onClick={() => setAgreedToPledge(!agreedToPledge)}
                className={`w-[22px] h-[22px] rounded-[6px] shrink-0 flex items-center justify-center transition-all ${
                  agreedToPledge ? 'bg-[#186049] text-[#FAF9F5]' : 'bg-[#FAF9F5] border border-[#E2DEC2]'
                }`}
              >
                {agreedToPledge && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
              <label
                onClick={() => setAgreedToPledge(!agreedToPledge)}
                className="text-[11px] text-[#14261C] font-semibold cursor-pointer select-none leading-tight"
              >
                I agree to return clean & dry to any campus bin whenever finished.
              </label>
            </div>

            {/* Primary Action Button: Full-width pill filled with #186049 */}
            <div className="space-y-2">
              <button
                onClick={handleConfirmBorrow}
                disabled={!agreedToPledge}
                className="w-full py-4 rounded-full bg-[#186049] hover:bg-[#004734] disabled:opacity-50 text-[#FAF9F5] font-bold text-sm shadow-tactile-sm transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#93d8bb]" /> Confirm & Unlock Bag
              </button>
              <button
                onClick={() => setScannedBagCandidate(null)}
                className="w-full py-2.5 rounded-full text-xs font-semibold text-[#2D3E35] hover:bg-[#def3e3] transition-colors"
              >
                Cancel / Re-scan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Camera Toggle Info */}
      <div className="p-4 text-center z-20">
        <button
          onClick={() => setUseCamera(!useCamera)}
          className="text-xs font-medium text-white/70 hover:text-white underline underline-offset-4"
        >
          {useCamera ? 'Switch to Tap-Simulation Mode' : 'Switch to Live Webcam Scanner'}
        </button>
      </div>
    </div>
  );
};

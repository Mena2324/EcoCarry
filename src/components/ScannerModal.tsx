import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useGreenBag } from '../context/GreenBagContext';
import {
  X,
  Zap,
  ZapOff,
  Check,
  RotateCcw,
  PlusCircle,
  Building2,
  Sparkles,
  QrCode,
  AlertCircle,
  Camera,
  RefreshCw,
} from 'lucide-react';
import { ActiveBag, GlobalBag } from '../types/greenbag';

export const ScannerModal: React.FC = () => {
  const {
    isScannerOpen,
    setIsScannerOpen,
    scannerMode,
    setScannerMode,
    globalBags,
    activeBags,
    stations,
    preselectedBagIdForReturn,
    setPreselectedBagIdForReturn,
    borrowBag,
    returnBag,
    selectedStationForBorrow,
    showToast,
  } = useGreenBag();

  const [torchOn, setTorchOn] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<'idle' | 'starting' | 'running' | 'error'>('idle');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [agreedToPledge, setAgreedToPledge] = useState(true);

  // Scanned verification step state
  const [scannedBagCandidate, setScannedBagCandidate] = useState<{
    bagId: string;
    bagNumber: string;
    type: ActiveBag['type'];
    stationId: string;
    qrToken?: string;
  } | null>(null);

  // Return step state
  const [selectedReturnBagId, setSelectedReturnBagId] = useState<string>(
    preselectedBagIdForReturn || (activeBags[0]?.id ?? '')
  );
  const [selectedReturnStationId, setSelectedReturnStationId] = useState<string>(stations[0]?.id ?? 'st-1');

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef(false);

  // Update selected return bag
  useEffect(() => {
    if (preselectedBagIdForReturn) {
      setSelectedReturnBagId(preselectedBagIdForReturn);
    } else if (activeBags.length > 0 && !selectedReturnBagId) {
      setSelectedReturnBagId(activeBags[0].id);
    }
  }, [preselectedBagIdForReturn, activeBags]);

  // Start real Html5Qrcode camera scanning when modal opens
  useEffect(() => {
    if (!isScannerOpen || scannedBagCandidate) {
      stopCamera();
      return;
    }

    let isMounted = true;

    const startScanner = async () => {
      try {
        setCameraStatus('starting');
        setCameraError(null);

        // Give DOM time to mount #html5-qr-reader
        await new Promise((r) => setTimeout(r, 200));
        if (!isMounted) return;

        const qrRegion = document.getElementById('html5-qr-reader');
        if (!qrRegion) return;

        if (!html5QrCodeRef.current) {
          html5QrCodeRef.current = new Html5Qrcode('html5-qr-reader');
        }

        const qrScanner = html5QrCodeRef.current;

        await qrScanner.start(
          { facingMode: 'environment' },
          {
            fps: 12,
            qrbox: { width: 220, height: 220 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            if (!isScanningRef.current) return;
            handleDecodedQr(decodedText);
          },
          () => {
            // Scan progress (frame skipped/no qr found)
          }
        );

        isScanningRef.current = true;
        setCameraStatus('running');
      } catch (err: any) {
        console.warn('Html5Qrcode camera error:', err);
        setCameraStatus('error');
        setCameraError(
          err?.name === 'NotAllowedError'
            ? 'Camera permission denied. Please enable camera access or enter bag ID below.'
            : 'Camera scanner unavailable on this device. You can verify bag by ID below.'
        );
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [isScannerOpen, scannedBagCandidate, scannerMode]);

  const stopCamera = async () => {
    isScanningRef.current = false;
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
      } catch (err) {
        // ignore stop errors
      }
    }
  };

  // Process decoded QR text
  const handleDecodedQr = (rawText: string) => {
    // Expected format: ECOCARRY:BAG:<bagId>:<token> or JSON or plain bag number (e.g. GB-1001)
    let bagId = '';
    let token = '';

    if (rawText.startsWith('ECOCARRY:BAG:')) {
      const parts = rawText.split(':');
      bagId = parts[2] || '';
      token = parts[3] || '';
    } else if (rawText.includes('GB-')) {
      const match = rawText.match(/GB-\d+/i);
      bagId = match ? match[0].toUpperCase() : rawText.trim().toUpperCase();
    } else {
      bagId = rawText.trim().toUpperCase();
    }

    if (scannerMode === 'borrow') {
      // Find bag in global registry
      const targetBag = globalBags.find(
        (b) => b.id.toUpperCase() === bagId || b.bagNumber.toUpperCase() === bagId
      );

      const stationId = selectedStationForBorrow || stations[0]?.id || 'st-1';

      if (targetBag) {
        if (targetBag.status === 'borrowed') {
          showToast(`Bag ${targetBag.bagNumber} is currently checked out by another borrower.`, 'warning');
          return;
        }
        stopCamera();
        setScannedBagCandidate({
          bagId: targetBag.id,
          bagNumber: targetBag.bagNumber,
          type: targetBag.type,
          stationId,
          qrToken: token || targetBag.qrToken,
        });
      } else {
        // If not found in loaded array, prepare bagId candidate to check in Firestore transaction
        stopCamera();
        setScannedBagCandidate({
          bagId,
          bagNumber: bagId,
          type: 'Heavy Canvas Tote',
          stationId,
          qrToken: token,
        });
      }
    } else {
      // Return mode: Match with active bags
      const myBag = activeBags.find(
        (b) => b.id.toUpperCase() === bagId || b.bagNumber.toUpperCase() === bagId
      );
      if (myBag) {
        setSelectedReturnBagId(myBag.id);
        showToast(`Selected bag ${myBag.bagNumber} for return deposit.`, 'info');
      } else if (activeBags.length > 0) {
        showToast(`Scanned code ${bagId}. Please confirm return below.`, 'info');
      }
    }
  };

  const handleConfirmBorrow = async () => {
    if (!scannedBagCandidate) return;
    const success = await borrowBag(
      scannedBagCandidate.stationId,
      scannedBagCandidate.bagId,
      scannedBagCandidate.qrToken
    );
    if (success) {
      setScannedBagCandidate(null);
      setIsScannerOpen(false);
    }
  };

  const handleConfirmReturn = async () => {
    if (!selectedReturnBagId) return;
    const success = await returnBag(selectedReturnBagId, selectedReturnStationId);
    if (success) {
      setIsScannerOpen(false);
      setPreselectedBagIdForReturn(null);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleDecodedQr(manualCode.trim());
    setManualCode('');
  };

  if (!isScannerOpen) return null;

  const chosenStation =
    stations.find((s) => s.id === (scannedBagCandidate?.stationId || selectedStationForBorrow)) ||
    stations[0];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#14261C] text-white">
      {/* Top App Bar with tactile styling */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/10 bg-[#14261C]/90 backdrop-blur-md z-10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A943E] block">
            QR Scanner
          </span>
          <h2 className="text-lg font-extrabold tracking-tight text-[#FAF9F5]">
            {scannerMode === 'borrow' ? 'Scan Bag QR to Checkout' : 'Deposit & Return Bag'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Torch toggle */}
          <button
            onClick={() => setTorchOn(!torchOn)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              torchOn ? 'bg-[#D98327] text-white shadow-tactile-sm' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="Toggle Light"
          >
            {torchOn ? <Zap className="w-5 h-5 fill-current" /> : <ZapOff className="w-5 h-5" />}
          </button>

          {/* Close Modal */}
          <button
            onClick={() => {
              stopCamera();
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
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 overflow-y-auto py-4">
        {!scannedBagCandidate ? (
          <div className="flex flex-col items-center w-full max-w-sm">
            {/* Real Html5Qrcode Camera Scanner Container */}
            <div className="relative w-[260px] h-[260px] rounded-[24px] overflow-hidden bg-black/50 border border-white/15 shadow-tactile-fab flex items-center justify-center">
              {/* HTML5 QR Code Mount Element */}
              <div id="html5-qr-reader" className="w-full h-full object-cover" />

              {/* Four corner brackets */}
              <div className="absolute top-2 left-2 w-8 h-8 border-t-[3px] border-l-[3px] border-[#4A943E] rounded-tl-xl pointer-events-none z-20" />
              <div className="absolute top-2 right-2 w-8 h-8 border-t-[3px] border-r-[3px] border-[#4A943E] rounded-tr-xl pointer-events-none z-20" />
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-[3px] border-l-[3px] border-[#4A943E] rounded-bl-xl pointer-events-none z-20" />
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b-[3px] border-r-[3px] border-[#4A943E] rounded-br-xl pointer-events-none z-20" />

              {/* Animated scan beam */}
              <div className="absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-[#4A943E] to-transparent shadow-[0_0_12px_#4A943E] animate-scan-beam pointer-events-none z-20" />

              {cameraStatus === 'starting' && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 text-center p-4">
                  <RefreshCw className="w-8 h-8 text-[#4A943E] animate-spin mb-2" />
                  <span className="text-xs font-semibold text-white/90">Starting Camera...</span>
                </div>
              )}
            </div>

            {/* Reticle Instructions */}
            <div className="mt-4 px-4 py-2 rounded-full bg-[#14261C]/90 border border-white/20 text-center shadow-md">
              <p className="text-xs font-semibold text-white tracking-wide">
                {scannerMode === 'borrow'
                  ? 'Point camera at the EcoCarry QR code label'
                  : 'Scan return bin barcode or select below'}
              </p>
            </div>

            {cameraError && (
              <p className="text-[11px] text-[#ffbd82] mt-2 flex items-center gap-1 text-center bg-black/40 p-2 rounded-xl">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {cameraError}
              </p>
            )}

            {/* Mode-specific Checkout / Return Section */}
            {scannerMode === 'borrow' ? (
              <div className="w-full mt-6 bg-[#FAF9F5] text-[#14261C] p-4 rounded-[20px] shadow-tactile-md">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#186049] block mb-2">
                  Verify Physical Bag Code
                </span>

                {/* Available Bags Quick Selector if scanning offline */}
                <div className="mb-3">
                  <span className="text-[10px] text-[#2D3E35] font-semibold block mb-1.5">
                    Physical Bags in Circulation:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5 max-h-24 overflow-y-auto">
                    {globalBags
                      .filter((b) => b.status === 'available')
                      .slice(0, 6)
                      .map((b) => (
                        <button
                          key={b.id}
                          onClick={() => handleDecodedQr(b.bagNumber)}
                          className="p-1.5 rounded-lg bg-[#def3e3] hover:bg-[#cbeed4] text-center border border-[#E2DEC2] transition-colors"
                        >
                          <span className="block text-xs font-bold text-[#186049]">#{b.bagNumber}</span>
                          <span className="text-[9px] text-[#2D3E35] block truncate">{b.type.split(' ')[0]}</span>
                        </button>
                      ))}
                  </div>
                </div>

                {/* Manual Bag ID Entry */}
                <form onSubmit={handleManualSubmit}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Or enter Bag ID (e.g. GB-1001)"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      className="w-full h-[48px] rounded-[12px] bg-white border border-[#E2DEC2] focus:border-[2px] focus:border-[#186049] px-3.5 text-xs text-[#14261C] placeholder:text-[#707974] outline-none transition-all"
                    />
                    <button
                      type="submit"
                      className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-[#186049] text-white text-xs font-bold hover:bg-[#004734] transition-colors"
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
                              Borrowed from {bag.borrowedStationName}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#186049] text-white">
                          Active Loan
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Return Drop Station Selector */}
                <div className="mb-4">
                  <label className="block text-[11px] font-bold text-[#2D3E35] mb-1">
                    Return Deposit Kiosk:
                  </label>
                  <select
                    value={selectedReturnStationId}
                    onChange={(e) => setSelectedReturnStationId(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-white border border-[#E2DEC2] text-xs text-[#14261C] font-semibold outline-none focus:border-[#186049]"
                  >
                    {stations.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.shortName})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleConfirmReturn}
                  disabled={activeBags.length === 0}
                  className="w-full py-3.5 rounded-full bg-[#186049] hover:bg-[#004734] disabled:opacity-50 text-white font-bold text-xs shadow-tactile-sm transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Deposit Bag & Earn 50 Points
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Confirmation Sheet for Verified Checkout */
          <div className="w-full max-w-sm bg-[#FAF9F5] text-[#14261C] rounded-[24px] p-5 shadow-tactile-md">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2DEC2]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A943E]">
                  Verified Physical Bag QR
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
                <span className="font-medium">Borrow Policy:</span>
                <span className="font-bold text-[#186049] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#4A943E]" /> No return deadline • Return anytime
                </span>
              </div>
            </div>

            {/* Eco Pledge */}
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

            {/* Action Buttons */}
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
                Cancel / Scan Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

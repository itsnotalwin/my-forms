/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { QrCode, Copy, Check, Sparkles, Smartphone, Landmark, ShieldCheck, X } from 'lucide-react';
import SignatureCanvas from './SignatureCanvas';

interface QRShareModalProps {
  shootTitle: string;
  agreementTitle: string;
  verificationCode: string;
  onModelSigned: (signatureData: string, guardianSig?: string, guardianName?: string, guardianRelationship?: string, guardianId?: string) => void;
  isMinor?: boolean;
  guardianNamePlaceholder?: string;
  isDarkMode?: boolean;
  onClose: () => void;
}

export default function QRShareModal({
  shootTitle,
  agreementTitle,
  verificationCode,
  onModelSigned,
  isMinor = false,
  guardianNamePlaceholder = '',
  isDarkMode = false,
  onClose
}: QRShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [simulatingMobile, setSimulatingMobile] = useState(false);
  
  // Signature States for the mobile simulation
  const [modelSig, setModelSig] = useState<string | null>(null);
  const [guardianSig, setGuardianSig] = useState<string | null>(null);
  const [guardianName, setGuardianName] = useState(guardianNamePlaceholder);
  const [guardianId, setGuardianId] = useState('');
  const [guardianRelationship, setGuardianRelationship] = useState('Mother');
  
  const [mobileStep, setMobileStep] = useState<'intro' | 'sign' | 'complete'>('intro');

  // Create a mock sign link based on current domain + code
  const mockSignLink = `${window.location.origin}/sign/${verificationCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mockSignLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMobileSubmit = () => {
    if (!modelSig) return;
    if (isMinor && (!guardianSig || !guardianName)) return;

    onModelSigned(
      modelSig,
      isMinor ? (guardianSig || undefined) : undefined,
      isMinor ? guardianName : undefined,
      isMinor ? guardianRelationship : undefined,
      isMinor ? guardianId : undefined
    );
    setMobileStep('complete');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className={`relative w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden my-8 ${
        isDarkMode 
          ? 'bg-cocoa border-espresso text-alabaster' 
          : 'bg-[#faf6f0] border-sand text-espresso'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b ${
          isDarkMode ? 'border-espresso' : 'border-sand'
        }`}>
          <div>
            <h3 className="font-display font-bold text-lg flex items-center gap-2">
              <QrCode className="w-5 h-5 text-sand" />
              Collect Digital Signature
            </h3>
            <p className={`text-xs ${isDarkMode ? 'text-alabaster/60' : 'text-espresso/60'}`}>
              Shoot: {shootTitle} • Document: {agreementTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-cocoa-surface-light text-alabaster/70 hover:text-alabaster' : 'hover:bg-sand/30 text-espresso/70 hover:text-espresso'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Split layout with QR/Share on left, Simulated Mobile viewport on right */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left panel: Photographer Actions */}
          <div className={`p-6 space-y-6 ${isDarkMode ? 'bg-cocoa-surface' : 'bg-white'}`}>
            <div className="space-y-4">
              <h4 className="font-display font-semibold text-sm">Option 1: Scan QR Code on Phone</h4>
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-alabaster/60' : 'text-espresso/60'}`}>
                Have the model scan this QR code with their mobile phone camera to open the instant, mobile-optimized signing portal. No app install required.
              </p>
              
              {/* Custom SVG Simulated QR Code */}
              <div className="flex justify-center p-4">
                <div className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${
                  isDarkMode ? 'bg-white border-espresso text-cocoa' : 'bg-[#faf6f0] border-sand text-espresso'
                }`}>
                  <svg className="w-36 h-36" viewBox="0 0 100 100">
                    {/* Outer corners */}
                    <path d="M5,5 h30 v30 h-30 z M15,15 h10 v10 h-10 z" fill="currentColor" />
                    <path d="M65,5 h30 v30 h-30 z M75,15 h10 v10 h-10 z" fill="currentColor" />
                    <path d="M5,65 h30 v30 h-30 z M15,75 h10 v10 h-10 z" fill="currentColor" />
                    
                    {/* Mock QR details */}
                    <rect x="45" y="5" width="8" height="8" fill="currentColor" />
                    <rect x="55" y="15" width="6" height="6" fill="currentColor" />
                    <rect x="45" y="25" width="12" height="6" fill="currentColor" />
                    <rect x="45" y="45" width="10" height="10" fill="currentColor" />
                    <rect x="5" y="45" width="8" height="12" fill="currentColor" />
                    <rect x="25" y="45" width="12" height="8" fill="currentColor" />
                    
                    <rect x="65" y="45" width="12" height="12" fill="currentColor" />
                    <rect x="85" y="45" width="10" height="8" fill="currentColor" />
                    <rect x="75" y="60" width="8" height="14" fill="currentColor" />
                    
                    <rect x="45" y="65" width="12" height="6" fill="currentColor" />
                    <rect x="55" y="75" width="14" height="8" fill="currentColor" />
                    <rect x="45" y="85" width="8" height="10" fill="currentColor" />
                    <rect x="65" y="85" width="30" height="8" fill="currentColor" />
                  </svg>
                  <span className="font-mono text-xs font-bold tracking-widest">{verificationCode}</span>
                </div>
              </div>
            </div>

            <div className={`border-t pt-5 ${isDarkMode ? 'border-espresso' : 'border-sand'}`}>
              <h4 className="font-display font-semibold text-sm mb-2">Option 2: Share Direct Link</h4>
              <p className={`text-xs mb-3 ${isDarkMode ? 'text-alabaster/60' : 'text-espresso/60'}`}>
                WhatsApp, email, or text this secure signing URL directly to the model.
              </p>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={mockSignLink}
                  className={`flex-1 px-3 py-2 text-xs font-mono rounded-lg border focus:outline-none ${
                    isDarkMode 
                      ? 'bg-cocoa-surface-light border-espresso text-alabaster/80' 
                      : 'bg-[#faf6f0] border-sand text-espresso/80'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`p-2 rounded-lg border transition-all hover:scale-[1.02] flex items-center justify-center gap-1 text-xs font-medium ${
                    copied 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : isDarkMode 
                        ? 'bg-cocoa-surface-light border-espresso text-alabaster hover:border-sand' 
                        : 'bg-oatmeal border-sand text-espresso hover:border-espresso'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className={`border-t pt-5 text-center ${isDarkMode ? 'border-espresso' : 'border-sand'}`}>
              <button
                type="button"
                id="btn-simulate-mobile"
                onClick={() => setSimulatingMobile(true)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-display font-semibold transition-all ${
                  simulatingMobile 
                    ? 'bg-sand/20 text-sand border border-sand cursor-default' 
                    : isDarkMode 
                      ? 'bg-sand text-cocoa hover:bg-alabaster' 
                      : 'bg-espresso text-oatmeal hover:bg-espresso/90'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                {simulatingMobile ? 'Simulating Phone on Right...' : 'Simulate Model Phone Signing'}
              </button>
            </div>
          </div>

          {/* Right panel: Mobile Device Simulator */}
          <div className={`p-6 border-l flex flex-col items-center justify-center ${
            isDarkMode 
              ? 'bg-cocoa border-espresso' 
              : 'bg-[#faf6f0] border-sand'
          }`}>
            {/* Phone Shell */}
            <div className={`relative w-full max-w-[320px] aspect-[9/19] rounded-[40px] border-8 shadow-xl flex flex-col overflow-hidden transition-all duration-300 ${
              simulatingMobile 
                ? 'scale-100 ring-4 ring-sand/30' 
                : 'opacity-40 hover:opacity-100 pointer-events-none md:pointer-events-auto filter blur-[1px] hover:blur-0'
            } ${
              isDarkMode ? 'border-espresso bg-cocoa-surface' : 'border-espresso bg-white'
            }`}>
              {/* Phone Speaker/Camera Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-espresso rounded-b-2xl z-20 flex items-center justify-center">
                <div className="w-12 h-1 bg-[#121110] rounded-full mb-1" />
              </div>

              {/* Phone Screen Scrollable Area */}
              <div className="flex-1 overflow-y-auto px-4 pt-10 pb-6 flex flex-col h-full scrollbar-thin">
                {mobileStep === 'intro' && (
                  <div className="flex-1 flex flex-col justify-between pt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-center mt-2">
                        <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full bg-sand/20 text-sand border border-sand/30 font-bold">
                          SECURE PORTAL
                        </span>
                      </div>
                      <h5 className="font-display font-bold text-center text-sm">Parchment Sign Portal</h5>
                      <p className={`text-[11px] text-center leading-relaxed ${isDarkMode ? 'text-alabaster/60' : 'text-espresso/60'}`}>
                        You have been requested by <strong>{shootTitle.split(' ')[0]} Photographer</strong> to digitally review and sign:
                      </p>
                      
                      <div className={`p-3 rounded-lg border text-center ${isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-oatmeal border-sand'}`}>
                        <p className="font-semibold text-xs">{agreementTitle}</p>
                        <p className="text-[9px] font-mono mt-1 text-sand">CODE: {verificationCode}</p>
                      </div>

                      <div className="flex items-center gap-2 text-[10px]">
                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Signed copies archived securely in South Africa.</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      id="btn-phone-start"
                      onClick={() => {
                        if (!simulatingMobile) setSimulatingMobile(true);
                        setMobileStep('sign');
                      }}
                      className="w-full mt-4 py-2 bg-espresso text-oatmeal dark:bg-sand dark:text-cocoa text-xs font-bold rounded-lg hover:scale-[1.01] transition-all"
                    >
                      Review & Sign Document
                    </button>
                  </div>
                )}

                {mobileStep === 'sign' && (
                  <div className="flex-1 flex flex-col justify-between pt-2">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b pb-1">
                        <span className="text-[11px] font-bold">Review Terms</span>
                        <span className="text-[9px] text-sand font-mono">EN</span>
                      </div>
                      
                      <div className={`h-24 overflow-y-auto p-2 rounded text-[9px] leading-relaxed border ${
                        isDarkMode ? 'bg-cocoa-surface border-espresso text-alabaster/70' : 'bg-[#fcfaf7] border-sand text-espresso/70'
                      }`}>
                        I hereby grant the photographer/studio full, irrevocable, and unrestricted rights to publish and use photographs of myself... Commercial advertising and social media rights included. Fully indemnified.
                      </div>

                      {/* Guardian Fields for Minors */}
                      {isMinor && (
                        <div className="space-y-2 border-t pt-2 border-dashed border-sand/40">
                          <p className="text-[10px] font-bold text-amber-500">Parent / Guardian Co-Sign Required</p>
                          
                          <div>
                            <label className="text-[9px] block font-medium mb-0.5">Parent Full Name</label>
                            <input
                              type="text"
                              value={guardianName}
                              onChange={(e) => setGuardianName(e.target.value)}
                              placeholder="e.g. Priya Naidoo"
                              className={`w-full p-1.5 text-[10px] rounded border focus:outline-none ${
                                isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                              }`}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-1.5">
                            <div>
                              <label className="text-[9px] block font-medium mb-0.5">South African ID No.</label>
                              <input
                                type="text"
                                value={guardianId}
                                onChange={(e) => setGuardianId(e.target.value)}
                                placeholder="820412 0045..."
                                className={`w-full p-1.5 text-[10px] rounded border focus:outline-none ${
                                  isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                                }`}
                              />
                            </div>
                            <div>
                              <label className="text-[9px] block font-medium mb-0.5">Relationship</label>
                              <select
                                value={guardianRelationship}
                                onChange={(e) => setGuardianRelationship(e.target.value)}
                                className={`w-full p-1.5 text-[10px] rounded border focus:outline-none ${
                                  isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                                }`}
                              >
                                <option value="Mother">Mother</option>
                                <option value="Father">Father</option>
                                <option value="Legal Guardian">Legal Guardian</option>
                              </select>
                            </div>
                          </div>

                          <div className="pt-1">
                            <label className="text-[9px] block font-bold mb-1">Guardian Signature Ink</label>
                            <SignatureCanvas
                              onSave={(sig) => setGuardianSig(sig)}
                              onClear={() => setGuardianSig(null)}
                              placeholder="Guardian Draw Signature"
                              isDarkMode={isDarkMode}
                            />
                          </div>
                        </div>
                      )}

                      {/* Model Signature */}
                      <div className="space-y-1">
                        <label className="text-[9px] block font-bold">{isMinor ? 'Minor Model Signature' : 'Model Signature Ink'}</label>
                        <SignatureCanvas
                          onSave={(sig) => setModelSig(sig)}
                          onClear={() => setModelSig(null)}
                          placeholder="Please Sign Here"
                          isDarkMode={isDarkMode}
                        />
                      </div>
                    </div>

                    <div className="flex gap-1.5 mt-4">
                      <button
                        type="button"
                        onClick={() => setMobileStep('intro')}
                        className={`flex-1 py-1.5 rounded text-[10px] font-semibold border ${
                          isDarkMode ? 'border-espresso hover:bg-cocoa-surface-light' : 'border-sand hover:bg-sand/10'
                        }`}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        id="btn-phone-submit"
                        disabled={!modelSig || (isMinor && (!guardianSig || !guardianName))}
                        onClick={handleMobileSubmit}
                        className={`flex-1 py-1.5 rounded text-[10px] font-bold text-center transition-all ${
                          (!modelSig || (isMinor && (!guardianSig || !guardianName)))
                            ? 'opacity-40 cursor-not-allowed bg-sand/25 text-espresso/40'
                            : isDarkMode 
                              ? 'bg-sand text-cocoa hover:bg-alabaster' 
                              : 'bg-espresso text-oatmeal hover:bg-espresso/80'
                        }`}
                      >
                        Confirm Sign
                      </button>
                    </div>
                  </div>
                )}

                {mobileStep === 'complete' && (
                  <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4 pt-10">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    
                    <div>
                      <h6 className="font-display font-bold text-xs">Agreement Sealed!</h6>
                      <p className={`text-[10px] mt-1 leading-relaxed ${isDarkMode ? 'text-alabaster/60' : 'text-espresso/60'}`}>
                        Your secure digital signature has been recorded and encrypted with hash.
                      </p>
                    </div>

                    <div className={`p-2.5 rounded border font-mono text-[9px] w-full text-center ${
                      isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-oatmeal border-sand'
                    }`}>
                      <p className="font-bold text-emerald-500">VERIFIED SIGNED</p>
                      <p className="mt-1 text-[8px] opacity-60">ID: {verificationCode}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setMobileStep('intro');
                        setModelSig(null);
                        setGuardianSig(null);
                        onClose();
                      }}
                      className="w-full mt-4 py-2 bg-espresso text-oatmeal dark:bg-sand dark:text-cocoa text-[11px] font-bold rounded-lg"
                    >
                      Done / Close Portal
                    </button>
                  </div>
                )}
              </div>
            </div>

            <p className={`text-[10px] mt-4 text-center max-w-[280px] leading-relaxed ${isDarkMode ? 'text-alabaster/40' : 'text-espresso/40'}`}>
              {!simulatingMobile 
                ? "💡 Hover or click 'Simulate Model Phone Signing' on left to activate full interactive phone signing!"
                : "📱 Simulating iPhone 15 browser client. Sign the sketch boxes to see real-time synchronisation!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

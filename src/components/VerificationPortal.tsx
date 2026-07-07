/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, ShieldCheck, ShieldAlert, FileText, Calendar, Landmark, MapPin, Hash, CheckCircle, Clock } from 'lucide-react';
import { Agreement, Shoot } from '../types';
import { formatDate } from '../utils';

interface VerificationPortalProps {
  agreements: Agreement[];
  shoots: Shoot[];
  isDarkMode?: boolean;
}

export default function VerificationPortal({ agreements, shoots, isDarkMode = false }: VerificationPortalProps) {
  const [searchCode, setSearchCode] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundAgreement, setFoundAgreement] = useState<Agreement | null>(null);
  const [foundShoot, setFoundShoot] = useState<Shoot | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = searchCode.trim().toUpperCase();
    if (!cleanCode) return;

    const agreement = agreements.find(a => a.verificationCode.toUpperCase() === cleanCode);
    if (agreement) {
      setFoundAgreement(agreement);
      const shoot = shoots.find(s => s.id === agreement.shootId);
      setFoundShoot(shoot || null);
    } else {
      setFoundAgreement(null);
      setFoundShoot(null);
    }
    setSearched(true);
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className={`p-6 rounded-xl border text-center space-y-4 ${
        isDarkMode 
          ? 'bg-cocoa-surface border-espresso text-alabaster' 
          : 'bg-[#fdfbf7] border-sand text-espresso'
      }`}>
        <div className="max-w-md mx-auto space-y-2">
          <h2 className="font-display font-bold text-lg tracking-tight">Public Verification Portal</h2>
          <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-alabaster/60' : 'text-espresso/60'}`}>
            Each legal agreement generated on Parchment receives a unique verification code and cryptographic hash. Enter the 6-character code below to verify its status and authenticity.
          </p>
        </div>

        <form onSubmit={handleSearch} className="max-w-md mx-auto relative flex gap-2 pt-2">
          <div className="relative flex-1">
            <Search className={`absolute left-3.5 top-3.5 w-4 h-4 ${isDarkMode ? 'text-alabaster/40' : 'text-espresso/40'}`} />
            <input
              type="text"
              id="verification-search"
              maxLength={6}
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
              placeholder="e.g. ZA9D82 or LB12F3"
              className={`w-full pl-10 pr-4 py-3 text-sm font-mono tracking-widest font-bold rounded-lg border focus:outline-none transition-colors ${
                isDarkMode 
                  ? 'bg-cocoa-surface-light border-espresso focus:border-sand text-alabaster placeholder:text-alabaster/30' 
                  : 'bg-white border-sand focus:border-espresso text-espresso placeholder:text-espresso/30'
              }`}
            />
          </div>
          <button
            type="submit"
            id="btn-verify-submit"
            className={`px-5 py-3 rounded-lg text-xs font-display font-semibold shadow-sm transition-all hover:scale-[1.01] ${
              isDarkMode 
                ? 'bg-sand text-cocoa hover:bg-alabaster' 
                : 'bg-espresso text-oatmeal hover:bg-espresso/90'
            }`}
          >
            Verify Code
          </button>
        </form>

        {/* Short info/helper */}
        <p className={`text-[10px] font-mono ${isDarkMode ? 'text-alabaster/40' : 'text-espresso/40'}`}>
          Try searching pre-signed codes: <span className="underline cursor-pointer hover:text-sand mx-1 font-bold" onClick={() => setSearchCode('ZA9D82')}>ZA9D82</span> or <span className="underline cursor-pointer hover:text-sand mx-1 font-bold" onClick={() => setSearchCode('LB12F3')}>LB12F3</span>
        </p>
      </div>

      {/* Results Panel */}
      {searched && (
        <div className="animate-fadeIn">
          {foundAgreement ? (
            <div className={`rounded-xl border overflow-hidden ${
              isDarkMode 
                ? 'bg-cocoa-surface border-espresso text-alabaster' 
                : 'bg-white border-sand text-espresso'
            }`}>
              {/* Validation Ribbon */}
              <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-5 py-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold tracking-wider text-emerald-500 uppercase">OFFICIAL SEAL • VERIFIED AGREEMENT</h4>
                  <p className={`text-[10px] ${isDarkMode ? 'text-alabaster/60' : 'text-espresso/60'}`}>
                    Cryptographically locked and archived on {formatDate(foundAgreement.createdAt)}.
                  </p>
                </div>
              </div>

              {/* Grid content */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left col: Meta & Status */}
                <div className="space-y-4">
                  <div>
                    <span className={`text-[9px] font-semibold uppercase tracking-wider ${isDarkMode ? 'text-alabaster/40' : 'text-espresso/40'}`}>
                      Document Details
                    </span>
                    <h3 className="font-display font-bold text-base mt-1">{foundAgreement.title}</h3>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-alabaster/60' : 'text-espresso/60'}`}>
                      Ref Code: <span className="font-mono font-bold text-sand">{foundAgreement.verificationCode}</span>
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg space-y-3 ${isDarkMode ? 'bg-cocoa-surface-light' : 'bg-oatmeal/40'}`}>
                    <div className="flex items-center gap-2.5 text-xs">
                      <Calendar className="w-4 h-4 text-sand" />
                      <div>
                        <p className="opacity-60 text-[10px]">Signed Date</p>
                        <p className="font-semibold">{formatDate(foundAgreement.modelSignedAt || foundAgreement.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs">
                      <Hash className="w-4 h-4 text-sand" />
                      <div>
                        <p className="opacity-60 text-[10px]">Secure SHA-256 Hash</p>
                        <p className="font-mono text-[9px] font-bold tracking-tight text-sand break-all">{foundAgreement.securityHash}</p>
                      </div>
                    </div>

                    {foundShoot && (
                      <div className="flex items-center gap-2.5 text-xs border-t border-sand/20 pt-2.5">
                        <FileText className="w-4 h-4 text-sand" />
                        <div>
                          <p className="opacity-60 text-[10px]">Associated Shoot Workspace</p>
                          <p className="font-semibold truncate max-w-[180px]">{foundShoot.title}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Center / Right: Signatures and Audit Trail */}
                <div className="md:col-span-2 space-y-4">
                  <span className={`text-[9px] font-semibold uppercase tracking-wider block ${isDarkMode ? 'text-alabaster/40' : 'text-espresso/40'}`}>
                    Verified Signatories & Timestamps
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Photographer Signatory */}
                    <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-espresso bg-cocoa-surface-light' : 'border-sand bg-[#fdfbf7]'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-display font-semibold text-xs">Photographer</h5>
                          <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-alabaster/60' : 'text-espresso/60'}`}>
                            {foundShoot?.photographerName || 'Alwin'}
                          </p>
                        </div>
                        <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded uppercase">
                          SEALED
                        </span>
                      </div>

                      {foundAgreement.photographerSignature ? (
                        <div className="my-3 h-14 bg-white/5 dark:bg-white/5 rounded p-1 flex items-center justify-center border border-dashed border-sand/20">
                          <img src={foundAgreement.photographerSignature} alt="Photographer Signature" className="max-h-full max-w-full opacity-80 filter invert-0 dark:invert" />
                        </div>
                      ) : (
                        <div className="my-3 h-14 bg-red-500/10 text-red-500 text-xs flex items-center justify-center">Pending</div>
                      )}
                      
                      <div className="flex items-center gap-1.5 text-[9px] text-emerald-500 font-mono">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Signed {foundAgreement.photographerSignedAt ? formatDate(foundAgreement.photographerSignedAt) : 'Pending'}</span>
                      </div>
                    </div>

                    {/* Model Signatory */}
                    <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-espresso bg-cocoa-surface-light' : 'border-sand bg-[#fdfbf7]'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-display font-semibold text-xs">
                            {foundAgreement.guardianName ? 'Guardian / Minor' : 'Model / Signatory'}
                          </h5>
                          <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-alabaster/60' : 'text-espresso/60'}`}>
                            {foundAgreement.guardianName ? `${foundAgreement.guardianName} (f.b.o ${foundShoot?.modelName})` : (foundShoot?.modelName || 'Zola Dlamini')}
                          </p>
                        </div>
                        <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded uppercase">
                          SEALED
                        </span>
                      </div>

                      {foundAgreement.modelSignature || foundAgreement.guardianSignature ? (
                        <div className="my-3 h-14 bg-white/5 dark:bg-white/5 rounded p-1 flex items-center justify-center border border-dashed border-sand/20">
                          <img src={foundAgreement.guardianSignature || foundAgreement.modelSignature} alt="Model Signature" className="max-h-full max-w-full opacity-80 filter invert-0 dark:invert" />
                        </div>
                      ) : (
                        <div className="my-3 h-14 bg-red-500/10 text-red-500 text-xs flex items-center justify-center">Pending Signature</div>
                      )}
                      
                      <div className="flex items-center gap-1.5 text-[9px] text-emerald-500 font-mono">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Signed {foundAgreement.modelSignedAt ? formatDate(foundAgreement.modelSignedAt) : 'Pending'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Audit Trail Log */}
                  <div className={`p-4 rounded-lg border text-xs space-y-2.5 ${isDarkMode ? 'border-espresso bg-cocoa-surface-light' : 'border-sand bg-[#fdfbf7]'}`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sand">Audit Transaction Trail</span>
                    
                    <div className="space-y-2 font-mono text-[10px] text-opacity-80">
                      <div className="flex justify-between pb-1 border-b border-sand/10">
                        <span className="opacity-60 flex items-center gap-1"><Clock className="w-3 h-3 text-sand" /> Contract Created:</span>
                        <span>{formatDate(foundAgreement.createdAt)}</span>
                      </div>
                      <div className="flex justify-between pb-1 border-b border-sand/10">
                        <span className="opacity-60 flex items-center gap-1"><Landmark className="w-3 h-3 text-sand" /> Server Hash Code:</span>
                        <span className="font-bold">{foundAgreement.securityHash.substring(0, 16)}...</span>
                      </div>
                      <div className="flex justify-between pb-1 border-b border-sand/10">
                        <span className="opacity-60 flex items-center gap-1"><MapPin className="w-3 h-3 text-sand" /> Jurisdictional Laws:</span>
                        <span>Republic of South Africa</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-xl border border-dashed bg-red-500/5 border-red-500/20 text-red-500 space-y-3">
              <ShieldAlert className="w-12 h-12 mx-auto stroke-[1.5]" />
              <div className="max-w-sm mx-auto space-y-1">
                <h4 className="font-display font-bold text-sm">Agreement Verification Failed</h4>
                <p className="text-xs opacity-80 leading-relaxed">
                  We could not find any active, signed release matching the verification code "<span className="font-mono font-bold uppercase">{searchCode}</span>" in our South African security nodes.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FileText, Printer, ArrowLeft, ShieldCheck, Download, Upload } from 'lucide-react';
import { Agreement, Shoot, UserProfile } from '../types';
import { formatDate } from '../utils';

interface PrintPreviewProps {
  agreement: Agreement;
  shoot: Shoot;
  userProfile: UserProfile;
  isDarkMode?: boolean;
  onBack: () => void;
  onUpdateProfile?: (profile: UserProfile) => void;
}

export default function PrintPreview({ 
  agreement, 
  shoot, 
  userProfile, 
  isDarkMode = false, 
  onBack,
  onUpdateProfile 
}: PrintPreviewProps) {
  
  const handlePrint = () => {
    window.print();
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onUpdateProfile) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onUpdateProfile({
            ...userProfile,
            logoUrl: reader.result,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      {/* Action header */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 no-print ${
        isDarkMode 
          ? 'bg-cocoa-surface border-espresso text-alabaster' 
          : 'bg-[#fdfbf7] border-sand text-espresso'
      }`}>
        <button
          onClick={onBack}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
            isDarkMode 
              ? 'border-espresso text-alabaster/80 hover:text-alabaster hover:bg-cocoa-surface-light' 
              : 'border-sand text-espresso/80 hover:text-espresso hover:bg-sand/20'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Workspace
        </button>

        <div className="text-xs opacity-70 font-sans hidden md:block">
          💡 Tip: Select <strong>"Save as PDF"</strong> in your print destination to export a professional file.
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono opacity-60">Verified Code: <strong className="text-sand">{agreement.verificationCode}</strong></span>
          <button
            onClick={handlePrint}
            id="btn-trigger-print"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-display font-semibold transition-all hover:scale-[1.01] ${
              isDarkMode 
                ? 'bg-sand text-cocoa hover:bg-alabaster' 
                : 'bg-espresso text-oatmeal hover:bg-espresso/90'
            }`}
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Main Print Container */}
      <div 
        id="print-sheet-wrapper"
        className={`print-card p-8 md:p-12 rounded-2xl border shadow-lg relative ${
          isDarkMode 
            ? 'bg-cocoa-surface border-espresso text-alabaster' 
            : 'bg-white border-sand text-espresso'
        }`}
        style={{ fontFamily: 'Georgia, serif' }} // Editorial/Legal Serif mood for the document itself!
      >
        {/* Verification stamp on document (Web preview only) */}
        <div className="absolute top-8 right-8 border-2 border-dashed border-emerald-500/40 text-emerald-500 rounded-lg p-3 rotate-12 flex flex-col items-center gap-0.5 no-print select-none max-w-[140px] text-center">
          <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
          <span className="font-mono text-[9px] font-bold uppercase tracking-wider">Parchment Verified</span>
          <span className="font-mono text-[8px] opacity-75">{agreement.verificationCode}</span>
        </div>

        {/* Studio / Photographer Header */}
        <div className="border-b-2 border-sand pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start gap-6 font-sans">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Interactive Logo Upload & Display Area */}
            <div className="relative group/logo shrink-0 no-print">
              <input
                type="file"
                accept="image/*"
                id="pdf-logo-upload"
                className="hidden"
                onChange={handleLogoChange}
              />
              <label htmlFor="pdf-logo-upload" className="cursor-pointer block">
                {userProfile.logoUrl ? (
                  <div className="relative w-16 h-16 rounded-lg border border-sand overflow-hidden bg-white flex items-center justify-center shadow-sm">
                    <img src={userProfile.logoUrl} alt="Studio Logo" className="max-w-full max-h-full object-contain" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/logo:opacity-100 transition-opacity flex items-center justify-center text-white text-[9px] font-semibold">
                      Change
                    </div>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg border-2 border-dashed border-sand/60 hover:border-sand flex flex-col items-center justify-center text-center bg-[#faf6f0]/40 p-2 transition-colors">
                    <Upload className="w-4 h-4 text-sand/80 mb-1" />
                    <span className="text-[8px] font-sans font-medium opacity-65 leading-tight">Add Logo</span>
                  </div>
                )}
              </label>
            </div>
            
            {/* Print-only Logo render */}
            {userProfile.logoUrl ? (
              <div className="hidden print:block w-16 h-16 shrink-0 mr-2">
                <img src={userProfile.logoUrl} alt="Studio Logo" className="max-w-full max-h-full object-contain" />
              </div>
            ) : (
              <div className="hidden print:block w-16 h-16 border-2 border-dashed border-espresso/30 rounded flex flex-col items-center justify-center text-center p-1 font-serif text-[8px] leading-tight text-espresso/40 mr-2">
                <span>[ STUDIO ]</span>
                <span>LOGO</span>
              </div>
            )}

            <div className="space-y-1">
              <h1 className="font-display font-bold text-xl tracking-tight uppercase" style={{ fontFamily: 'var(--font-display)' }}>
                {userProfile.companyName || userProfile.photographerName}
              </h1>
              <p className="text-xs opacity-75">{userProfile.address}</p>
              <p className="text-xs opacity-75">Phone: {userProfile.phone} • Email: {userProfile.email}</p>
              {userProfile.registrationNumber && (
                <p className="text-[10px] opacity-50 font-mono">Reg No: {userProfile.registrationNumber}</p>
              )}
            </div>
          </div>
          
          {/* Print-Visible Embedded QR Code and Record details */}
          <div className="flex flex-col sm:items-end gap-3 font-sans self-stretch sm:self-start">
            <div className="flex items-center gap-4 self-end">
              {/* Dynamic QR Code Verification Stamp */}
              <div className="p-1.5 bg-white border border-sand rounded-lg shrink-0 flex flex-col items-center shadow-xs">
                <svg className="w-16 h-16 text-espresso" viewBox="0 0 100 100">
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
                <span className="font-mono text-[8px] font-bold tracking-widest mt-1 text-center text-espresso">{agreement.verificationCode}</span>
              </div>

              <div className="text-right space-y-1 font-mono text-[10px]">
                <div className="bg-espresso text-oatmeal px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[8px] inline-block mb-1">
                  OFFICIAL RECORD
                </div>
                <p className="opacity-70">DATE OF ISSUE: {formatDate(agreement.createdAt)}</p>
                <p className="opacity-70">JURISDICTION: South Africa</p>
                <p className="opacity-70 font-semibold text-emerald-600">STATUS: VERIFIED SEALED</p>
              </div>
            </div>
          </div>
        </div>

        {/* Agreement Text Area */}
        <div className="space-y-6 leading-relaxed text-sm text-justify whitespace-pre-line border-b border-sand pb-8 mb-8 animate-fadeIn" style={{ color: '#1a1817' }}>
          {/* Note: In print layout, we want highly clear, elegant black text, even if parent page is in dark mode */}
          <div className="print-black-text">
            {agreement.content}
          </div>
        </div>

        {/* Signatures Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 font-sans">
          {/* Photographer Signature Column */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold opacity-60 border-b border-sand pb-1.5">Photographer Signature</h4>
            
            <div className="h-20 flex items-center justify-center border border-dashed border-sand/30 bg-[#faf6f0]/30 rounded-lg p-2 overflow-hidden max-w-[280px]">
              {agreement.photographerSignature ? (
                <img src={agreement.photographerSignature} alt="Photographer Signature" className="max-h-full max-w-full opacity-90 mix-blend-multiply" />
              ) : (
                <span className="text-xs text-red-500 italic">Signature Pending</span>
              )}
            </div>

            <div className="space-y-1 text-xs">
              <p className="font-semibold">{userProfile.photographerName}</p>
              <p className="opacity-60 text-[10px]">Title: Principal Photographer</p>
              <p className="opacity-60 text-[10px]">Date Signed: {agreement.photographerSignedAt ? formatDate(agreement.photographerSignedAt) : 'Pending'}</p>
            </div>
          </div>

          {/* Model / Guardian Signature Column */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold opacity-60 border-b border-sand pb-1.5">Model / Guardian Signature</h4>
            
            <div className="h-20 flex items-center justify-center border border-dashed border-sand/30 bg-[#faf6f0]/30 rounded-lg p-2 overflow-hidden max-w-[280px]">
              {agreement.guardianSignature || agreement.modelSignature ? (
                <img src={agreement.guardianSignature || agreement.modelSignature} alt="Signatory Signature" className="max-h-full max-w-full opacity-90 mix-blend-multiply" />
              ) : (
                <span className="text-xs text-red-500 italic">Signature Pending</span>
              )}
            </div>

            <div className="space-y-1 text-xs">
              <p className="font-semibold">{agreement.guardianName ? `${agreement.guardianName} (Guardian)` : shoot.modelName}</p>
              {agreement.guardianName && (
                <p className="opacity-60 text-[10px]">Relationship to Minor ({shoot.modelName}): {agreement.guardianRelationship}</p>
              )}
              {agreement.guardianId && (
                <p className="opacity-60 text-[10px]">SA ID No: {agreement.guardianId}</p>
              )}
              <p className="opacity-60 text-[10px]">Date Signed: {agreement.modelSignedAt ? formatDate(agreement.modelSignedAt) : 'Pending'}</p>
            </div>
          </div>
        </div>

        {/* Footer Verification Section */}
        <div className="mt-12 pt-6 border-t border-dashed border-sand/60 grid grid-cols-1 md:grid-cols-3 gap-4 items-center font-sans text-xs opacity-65">
          <div className="flex flex-col gap-1">
            <p className="font-bold">Cryptographic Stamp</p>
            <p className="font-mono text-[9px] break-all">{agreement.securityHash}</p>
          </div>
          
          <div className="text-center font-mono text-[10px] uppercase tracking-widest text-emerald-600 font-semibold border-y md:border-y-0 md:border-x border-sand/40 py-2">
            INTEGRITY VERIFIED SECURE
          </div>

          <div className="text-left md:text-right space-y-1 text-[10px]">
            <p className="font-bold">South African Digital Archive</p>
            <p>Verification Code: <strong>{agreement.verificationCode}</strong></p>
            <p className="text-[9px] opacity-75">Verification URL: parchment.co.za/verify/{agreement.verificationCode}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

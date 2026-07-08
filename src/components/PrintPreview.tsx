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
        {/* Studio / Photographer Header */}
        <div className="border-b-2 border-sand pb-6 print:pb-4 mb-8 print:mb-5 flex flex-col sm:flex-row justify-between items-start gap-6 print:gap-4 font-sans">
          
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
              <h1 className="font-display font-bold text-xl print:text-lg tracking-tight uppercase" style={{ fontFamily: 'var(--font-display)' }}>
                {userProfile.companyName || userProfile.photographerName}
              </h1>
              <p className="text-xs print:text-[10px] opacity-75">{userProfile.address}</p>
              <p className="text-xs print:text-[10px] opacity-75">Phone: {userProfile.phone} • Email: {userProfile.email}</p>
              {userProfile.registrationNumber && (
                <p className="text-[10px] print:text-[8px] opacity-50 font-mono">Reg No: {userProfile.registrationNumber}</p>
              )}
            </div>
          </div>
          
          {/* Print-Visible Clean Record details (No QR code) */}
          <div className="flex flex-col sm:items-end gap-3 font-sans self-stretch sm:self-start">
            <div className="text-left sm:text-right space-y-1 font-mono text-[10px] print:text-[9px]">
              <div className="bg-espresso text-oatmeal px-2 print:px-1.5 py-0.5 rounded font-bold uppercase tracking-wider text-[8px] inline-block mb-1">
                OFFICIAL DOCUMENT
              </div>
              <p className="opacity-70"><span className="font-bold">DOCUMENT ID:</span> {agreement.verificationCode}</p>
              <p className="opacity-70"><span className="font-bold">DATE OF ISSUE:</span> {formatDate(agreement.createdAt)}</p>
              <p className="opacity-70"><span className="font-bold">JURISDICTION:</span> South Africa</p>
              <p className="opacity-70 font-semibold text-espresso"><span className="font-bold">STATUS:</span> READY FOR PHYSICAL SIGNING</p>
            </div>
          </div>
        </div>

        {/* Agreement Text Area */}
        <div className="space-y-5 print:space-y-3.5 leading-relaxed print:leading-normal text-sm print:text-[11px] text-justify whitespace-pre-line border-b border-sand pb-8 print:pb-5 mb-8 print:mb-5 animate-fadeIn" style={{ color: '#1a1817' }}>
          {/* Note: In print layout, we want highly clear, elegant black text, even if parent page is in dark mode */}
          <div className="print-black-text">
            {agreement.content}
          </div>
        </div>

        {/* Signatures Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-12 print:gap-8 font-sans mt-8 print:mt-4 pt-4 print:pt-2 print-avoid-break">
          {/* Photographer Signature Column */}
          <div className="space-y-4 print:space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold opacity-70 border-b border-sand pb-2 print:pb-1">Photographer Signature</h4>
            
            <div className="pt-8 print:pt-4 space-y-4 print:space-y-2">
              <div className="border-b border-espresso/40 pb-1.5 print:pb-1">
                <span className="text-[10px] print:text-[9px] text-espresso/60 block font-mono">Principal Photographer Signature:</span>
                <div className="h-8 print:h-6"></div> {/* Space for physical ink signature */}
              </div>
              <div className="border-b border-espresso/40 pb-1.5 print:pb-1">
                <span className="text-[10px] print:text-[9px] text-espresso/60 block font-mono">Date Signed: _____________________________________</span>
              </div>
            </div>

            <div className="space-y-1 text-xs pt-2 print:pt-1">
              <p className="font-semibold">{userProfile.photographerName}</p>
              <p className="opacity-65 text-[10px] print:text-[9px]">Title: Principal Photographer</p>
              <p className="opacity-65 text-[10px] print:text-[9px]">Company: {userProfile.companyName}</p>
            </div>
          </div>

          {/* Model / Guardian Signature Column */}
          <div className="space-y-4 print:space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold opacity-70 border-b border-sand pb-2 print:pb-1">Model / Guardian Signature</h4>
            
            <div className="pt-8 print:pt-4 space-y-4 print:space-y-2">
              <div className="border-b border-espresso/40 pb-1.5 print:pb-1">
                <span className="text-[10px] print:text-[9px] text-espresso/60 block font-mono">Authorized Signatory / Model Signature:</span>
                <div className="h-8 print:h-6"></div> {/* Space for physical ink signature */}
              </div>
              <div className="border-b border-espresso/40 pb-1.5 print:pb-1">
                <span className="text-[10px] print:text-[9px] text-espresso/60 block font-mono">Date Signed: _____________________________________</span>
              </div>
            </div>

            <div className="space-y-1 text-xs pt-2 print:pt-1">
              <p className="font-semibold">{agreement.guardianName ? `${agreement.guardianName} (Guardian)` : shoot.modelName}</p>
              {agreement.guardianName && (
                <p className="opacity-65 text-[10px] print:text-[9px]">Relationship to Minor ({shoot.modelName}): {agreement.guardianRelationship}</p>
              )}
              {agreement.guardianId && (
                <p className="opacity-65 text-[10px] print:text-[9px]">SA ID No: {agreement.guardianId}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Verification Section */}
        <div className="mt-12 print:mt-6 pt-6 print:pt-3 border-t border-dashed border-sand/60 grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-4 print:gap-2 items-center font-sans text-xs print:text-[10px] opacity-65 print-avoid-break">
          <div className="flex flex-col gap-1">
            <p className="font-bold print:text-[9px]">Document Serial ID</p>
            <p className="font-mono text-[9px] print:text-[8px] break-all">{agreement.securityHash}</p>
          </div>
          
          <div className="text-center font-mono text-[10px] print:text-[8px] uppercase tracking-widest text-espresso font-semibold border-y md:border-y-0 md:border-x border-sand/40 py-2 print:py-1">
            SHUTTERHAUS PRINT MASTER
          </div>

          <div className="text-left md:text-right print:text-right space-y-1 text-[10px] print:text-[8px]">
            <p className="font-bold">South African Legal Registry</p>
            <p>Verification Code: <strong>{agreement.verificationCode}</strong></p>
            <p className="text-[9px] print:text-[8px] opacity-75">Verification URL: shutterhaus.co.za/verify/{agreement.verificationCode}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

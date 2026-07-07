/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Shoot, Contact, Agreement, UserProfile, AuditLog } from './types';

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11).toUpperCase();
}

export function generateVerificationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateSecurityHash(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return 'SHA-256:' + Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getExpiryStatus(expiryDate?: string): { status: 'none' | 'active' | 'warning' | 'expired'; daysLeft?: number } {
  if (!expiryDate) return { status: 'none' };
  const expiry = new Date(expiryDate);
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return { status: 'expired', daysLeft: diffDays };
  } else if (diffDays <= 30) {
    return { status: 'warning', daysLeft: diffDays };
  } else {
    return { status: 'active', daysLeft: diffDays };
  }
}

// Initial Mock Data
export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'C1',
    name: 'Zola Dlamini',
    email: 'zola.dlamini@modelagency.co.za',
    phone: '+27 82 555 0192',
    type: 'model',
    address: '42 Pine Street, Rosebank, Johannesburg, 2196',
    isMinor: false,
    notes: 'Experienced fashion and commercial model. Signed with Ice Models JHB.',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'C2',
    name: 'Devon van der Merwe',
    email: 'devon@vdmcreatives.com',
    phone: '+27 71 883 4921',
    type: 'client',
    address: '12 Beach Road, Camps Bay, Cape Town, 8005',
    isMinor: false,
    notes: 'Creative Director at VDM Creatives. Regular brand client.',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'C3',
    name: 'Amari Naidoo',
    email: 'amari.naidoo@gmail.com',
    phone: '+27 63 449 1010',
    type: 'model',
    address: '15 Ridge Road, Umhlanga, Durban, 4319',
    isMinor: true,
    guardianName: 'Priya Naidoo',
    guardianId: '820412 0045 081',
    guardianRelationship: 'Mother',
    notes: 'Minor model (16 years old). Needs mother PRIYA NAIDOO to co-sign all releases.',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'C4',
    name: 'Liezel Botha',
    email: 'liezel@bothaweddings.co.za',
    phone: '+27 83 992 0182',
    type: 'client',
    address: '7 Franschhoek Valley Road, Franschhoek, 7690',
    isMinor: false,
    notes: 'Wedding coordinator and bridal client.',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  photographerName: 'Alwin',
  companyName: 'Shutterhaus Visuals',
  email: 'itsnotalwin@gmail.com',
  phone: '+27 82 404 9382',
  address: 'Studio 12, The Foundry, 74 Cardiff Street, Green Point, Cape Town, 8005',
  logoUrl: '', // Default to standard text or placeholder
  registrationNumber: 'CK 2024/773821/07',
  isPro: true, // Let's give them Pro out of the box to showcase all rich features, but let them toggle it in settings!
  releasesCount: 3,
  maxReleases: 100
};

export const INITIAL_AGREEMENTS: Agreement[] = [
  {
    id: 'A1',
    shootId: 'S1',
    templateId: 'model-release',
    title: 'Model Release Form (Standard)',
    content: `MODEL RELEASE AGREEMENT

Photographer / Studio: Alwin (Shutterhaus Visuals)
Model Name: Zola Dlamini
Shoot Date: 2026-06-15
Shoot Location: Table Mountain Lookout, Cape Town

For valuable consideration received, I hereby grant Alwin and their legal representatives and assigns, the irrevocable and unrestricted right to use and publish photographs of me, or in which I may be included, for editorial, trade, advertising, and any other purpose and in any manner and medium; and to alter and composite the same without restriction and without my inspection or approval.

I hereby release Alwin and their legal representatives and assigns from all claims and liability relating to said photographs.

This agreement shall be binding upon me, my heirs, legal representatives, and assigns. I acknowledge that I have read this release before signing, and I fully understand the contents, meaning, and impact of this release.`,
    language: 'zu', // Pre-signed in isiZulu to showcase!
    modelSigned: true,
    modelSignature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABACAYAAABe3v9tAAAABmJLR0QA/wD/AP+gvaeTAAAAcElEQVR42u3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG4MbgAB8crEAgAAAABJRU5CYII=', // mock signature
    modelSignedAt: '2026-06-15T10:15:30.000Z',
    photographerSigned: true,
    photographerSignature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABACAYAAABe3v9tAAAABmJLR0QA/wD/AP+gvaeTAAAAcElEQVR42u3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG4MbgAB8crEAgAAAABJRU5CYII=',
    photographerSignedAt: '2026-06-15T10:20:00.000Z',
    verificationCode: 'ZA9D82',
    securityHash: 'SHA-256:7B9E3A2C',
    createdAt: '2026-06-15T09:00:00.000Z'
  },
  {
    id: 'A2',
    shootId: 'S2',
    templateId: 'minor-release',
    title: 'Minor Model Release',
    content: `MINOR MODEL RELEASE AGREEMENT
(For Models Under 18 Years of Age)

Photographer / Studio: Alwin (Shutterhaus Visuals)
Minor Model Name: Amari Naidoo
Parent / Legal Guardian Name: Priya Naidoo
Relationship to Minor: Mother
Shoot Date: 2026-06-20
Shoot Location: Umhlanga Rocks Beach, Durban

I am the parent or legal guardian of the minor named above. For valuable consideration received, I hereby grant to Alwin and their legal representatives and assigns, the irrevocable and unrestricted right to use and publish photographs of the minor, or in which the minor may be included, for editorial, trade, advertising, and any other purpose.

I release Alwin and their legal representatives from all claims and liability relating to said photographs. 

I warrant that I am of full legal age and have the right to contract for the minor in this matter. I have read this release before signing, and I fully understand the contents.`,
    language: 'en',
    modelSigned: false,
    photographerSigned: true,
    photographerSignature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABACAYAAABe3v9tAAAABmJLR0QA/wD/AP+gvaeTAAAAcElEQVR42u3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG4MbgAB8crEAgAAAABJRU5CYII=',
    photographerSignedAt: '2026-06-19T14:30:00.000Z',
    guardianSigned: false,
    verificationCode: 'AM4N11',
    securityHash: 'SHA-256:1E5D8F0B',
    createdAt: '2026-06-19T14:00:00.000Z'
  },
  {
    id: 'A3',
    shootId: 'S3',
    templateId: 'service-agreement',
    title: 'Photographer Service Agreement',
    content: `PHOTOGRAPHY SERVICE AGREEMENT

Photographer / Studio: Alwin (Shutterhaus Visuals)
Client Name: Liezel Botha
Shoot Date: 2026-06-28
Location: Grande Provence, Franschhoek
Total Fee: R18500

1. SERVICES: The Photographer agrees to provide professional photography services as agreed.
2. FEES & PAYMENT: A non-refundable booking deposit is required to secure the date. The remaining balance must be paid before or on the day of the shoot.
3. CANCELLATION: Cancellations made less than 48 hours before the shoot will forfeit the booking deposit.
4. DELIVERY: Edited digital high-resolution images will be delivered within 14 working days via a digital gallery link.
5. COPYRIGHT & USAGE: The Photographer retains copyright of all images. The Client receives a personal use license only. Commercial licensing must be obtained in writing.`,
    language: 'af', // Afrikaans setup
    modelSigned: true, // Here client is the model/signer
    modelSignature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABACAYAAABe3v9tAAAABmJLR0QA/wD/AP+gvaeTAAAAcElEQVR42u3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG4MbgAB8crEAgAAAABJRU5CYII=',
    modelSignedAt: '2026-06-25T11:42:00.000Z',
    photographerSigned: true,
    photographerSignature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABACAYAAABe3v9tAAAABmJLR0QA/wD/AP+gvaeTAAAAcElEQVR42u3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG4MbgAB8crEAgAAAABJRU5CYII=',
    photographerSignedAt: '2026-06-25T11:45:00.000Z',
    verificationCode: 'LB12F3',
    securityHash: 'SHA-256:F4B98E1A',
    createdAt: '2026-06-25T08:30:00.000Z'
  }
];

export const INITIAL_SHOOTS: Shoot[] = [
  {
    id: 'S1',
    title: 'Table Mountain High Fashion Shoot',
    date: '2026-06-15',
    location: 'Table Mountain Lookout, Cape Town',
    status: 'Signed',
    modelId: 'C1',
    modelName: 'Zola Dlamini',
    modelEmail: 'zola.dlamini@modelagency.co.za',
    modelPhone: '+27 82 555 0192',
    isMinor: false,
    clientName: 'Ice Models Johannesburg',
    clientEmail: 'bookings@icemodelsjhb.co.za',
    clientPhone: '+27 11 403 1000',
    price: 12500,
    deposit: 3500,
    isPaid: true,
    invoiceNumber: 'INV-2026-042',
    galleryLink: 'https://galleries.pixieset.com/shutterhaus/zola-fashion-tm',
    rawBackupLink: 's3://shutterhaus-raws/2026/S1-Zola-TableMountain.zip',
    expiryDate: '2028-06-15', // 2 year usage license
    agreementIds: ['A1'],
    notes: 'Stunning sunset fashion shoot. Paid in full. Standard model release acquired in isiZulu language.',
    createdAt: '2026-06-10T09:00:00.000Z'
  },
  {
    id: 'S2',
    title: 'Umhlanga Beach Swimwear Promo',
    date: '2026-06-20',
    location: 'Umhlanga Rocks Beach, Durban',
    status: 'Sent',
    modelId: 'C3',
    modelName: 'Amari Naidoo',
    modelEmail: 'amari.naidoo@gmail.com',
    modelPhone: '+27 63 449 1010',
    isMinor: true,
    clientName: 'Summer Glow Swimwear',
    clientEmail: 'collabs@summerglow.co.za',
    clientPhone: '+27 31 555 9211',
    price: 8500,
    deposit: 2500,
    isPaid: false,
    invoiceNumber: 'INV-2026-045',
    expiryDate: '2027-06-20', // 1 year commercial
    agreementIds: ['A2'],
    notes: 'Amari is 16. Awaiting signature from her mother Priya Naidoo (Minor release). Booking deposit paid.',
    createdAt: '2026-06-19T11:00:00.000Z'
  },
  {
    id: 'S3',
    title: 'Grande Provence Franschhoek Wedding',
    date: '2026-06-28',
    location: 'Grande Provence, Franschhoek',
    status: 'Completed',
    clientId: 'C4',
    clientName: 'Liezel Botha',
    clientEmail: 'liezel@bothaweddings.co.za',
    clientPhone: '+27 83 992 0182',
    modelName: 'N/A (Couple & Guests)',
    modelEmail: '',
    modelPhone: '',
    isMinor: false,
    price: 18500,
    deposit: 5000,
    isPaid: true,
    invoiceNumber: 'INV-2026-040',
    galleryLink: 'https://galleries.pixieset.com/shutterhaus/botha-wedding-gp',
    rawBackupLink: 's3://shutterhaus-raws/2026/S3-Botha-Franschhoek.zip',
    agreementIds: ['A3'],
    notes: 'Wedding contract fully executed in Afrikaans. Beautiful daylight photography. All deliverable images uploaded.',
    createdAt: '2026-06-24T08:00:00.000Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'L1',
    timestamp: '2026-06-15T10:15:30.000Z',
    action: 'Agreement Signed',
    details: 'Zola Dlamini signed Model Release (ZA9D82) via mobile browser.',
    ipAddress: '102.65.18.231',
    browser: 'Safari Mobile / iPhone'
  },
  {
    id: 'L2',
    timestamp: '2026-06-15T10:20:00.000Z',
    action: 'Agreement Signed',
    details: 'Alwin signed Model Release (ZA9D82) via desktop client.',
    ipAddress: '41.13.190.52',
    browser: 'Chrome / macOS'
  },
  {
    id: 'L3',
    timestamp: '2026-06-19T14:30:00.000Z',
    action: 'Agreement Created',
    details: 'Minor Model Release (AM4N11) drafted for Amari Naidoo by Alwin.',
    ipAddress: '41.13.190.52',
    browser: 'Chrome / macOS'
  },
  {
    id: 'L4',
    timestamp: '2026-06-25T11:42:00.000Z',
    action: 'Agreement Signed',
    details: 'Liezel Botha signed Photography Service Agreement (LB12F3).',
    ipAddress: '197.80.12.94',
    browser: 'Safari Mobile / iPad'
  }
];

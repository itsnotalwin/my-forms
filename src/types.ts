/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'model' | 'client';
  address?: string;
  // Guardian details if minor
  isMinor?: boolean;
  guardianName?: string;
  guardianId?: string;
  guardianRelationship?: string;
  createdAt: string;
  notes?: string;
}

export interface AgreementTemplate {
  id: string;
  title: string;
  category: 'Release' | 'Agreement' | 'Licensing' | 'Notice' | 'Extra';
  description: string;
  fieldsRequired: string[];
  content: {
    en: string;
    af: string;
    zu: string;
  };
}

export interface Agreement {
  id: string;
  shootId: string;
  templateId: string;
  title: string;
  content: string;
  language: 'en' | 'af' | 'zu';
  
  // Signatures
  modelSigned: boolean;
  modelSignature?: string; // base64 image
  modelSignedAt?: string;
  
  photographerSigned: boolean;
  photographerSignature?: string; // base64 image
  photographerSignedAt?: string;
  
  guardianSigned?: boolean;
  guardianSignature?: string; // base64 image
  guardianSignedAt?: string;
  guardianName?: string;
  guardianRelationship?: string;
  guardianId?: string;

  // Security & Verification
  verificationCode: string; // e.g. AB3K9L
  securityHash: string;
  createdAt: string;
}

export interface Shoot {
  id: string;
  title: string;
  date: string;
  location: string;
  status: 'Draft' | 'Sent' | 'Signed' | 'Completed' | 'Archived';
  
  // Clients / Models associated
  clientId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  
  modelId?: string;
  modelName: string;
  modelEmail: string;
  modelPhone: string;
  isMinor: boolean;
  
  // Finance
  price: number;
  deposit: number;
  isPaid: boolean;
  invoiceNumber?: string;
  
  // Digital deliverables
  galleryLink?: string;
  rawBackupLink?: string;
  expiryDate?: string; // For commercial usage limit tracking
  
  // Documents associated
  agreementIds: string[];
  
  createdAt: string;
  notes?: string;
}

export interface UserProfile {
  photographerName: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  logoUrl?: string;
  registrationNumber?: string; // e.g. CK for SA businesses
  isPro: boolean;
  releasesCount: number;
  maxReleases: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  ipAddress?: string;
  browser?: string;
}

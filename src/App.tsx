/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  FolderHeart, 
  Calendar, 
  Users, 
  FileCheck, 
  Search, 
  Plus, 
  QrCode, 
  Globe2, 
  TrendingUp, 
  History, 
  ShieldCheck, 
  Sparkles, 
  Settings as SettingsIcon, 
  Sun, 
  Moon, 
  DollarSign, 
  ExternalLink, 
  Layers, 
  Mail, 
  Phone, 
  AlertTriangle, 
  FolderOpen, 
  Database, 
  FileText, 
  Briefcase, 
  MapPin, 
  Check, 
  Undo,
  Upload,
  Info,
  Printer,
  Trash2
} from 'lucide-react';

import { Contact, Shoot, Agreement, UserProfile, AuditLog } from './types';
import { AGREEMENT_TEMPLATES } from './data/templates';
import { 
  generateId, 
  generateVerificationCode, 
  generateSecurityHash, 
  formatCurrency, 
  formatDate, 
  getExpiryStatus,
  INITIAL_CONTACTS,
  INITIAL_USER_PROFILE,
  INITIAL_AGREEMENTS,
  INITIAL_SHOOTS,
  INITIAL_AUDIT_LOGS
} from './utils';

import SignatureCanvas from './components/SignatureCanvas';
import AIHelper from './components/AIHelper';
import QRShareModal from './components/QRShareModal';
import VerificationPortal from './components/VerificationPortal';
import PrintPreview from './components/PrintPreview';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('parchment_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  // App states
  const [shoots, setShoots] = useState<Shoot[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Navigation
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'shoots' | 'contacts' | 'verifier' | 'settings'>('dashboard');
  const [selectedShootId, setSelectedShootId] = useState<string | null>(null);
  const [selectedAgreementIdForPrint, setSelectedAgreementIdForPrint] = useState<string | null>(null);

  // Search & Filter
  const [shootSearch, setShootSearch] = useState('');
  const [shootFilter, setShootFilter] = useState<'All' | 'Draft' | 'Sent' | 'Signed' | 'Completed'>('All');
  const [contactSearch, setContactSearch] = useState('');

  // Modals / Creators
  const [isCreatingShoot, setIsCreatingShoot] = useState(false);
  const [isEditingShootId, setIsEditingShootId] = useState<string | null>(null);
  const [isCreatingContact, setIsCreatingContact] = useState(false);
  const [activeQRModalAgreementId, setActiveQRModalAgreementId] = useState<string | null>(null);
  
  // Quick sign overlay
  const [signingAgreementId, setSigningAgreementId] = useState<string | null>(null);
  const [signingParty, setSigningParty] = useState<'photographer' | 'model'>('photographer');

  // New Shoot Form State
  const [newShootTitle, setNewShootTitle] = useState('');
  const [newShootDate, setNewShootDate] = useState('');
  const [newShootLocation, setNewShootLocation] = useState('');
  const [newShootPrice, setNewShootPrice] = useState(3500);
  const [newShootDeposit, setNewShootDeposit] = useState(1000);
  const [newShootModelId, setNewShootModelId] = useState('');
  const [newShootClientId, setNewShootClientId] = useState('');
  // Manual inputs if not selecting contact
  const [newShootModelName, setNewShootModelName] = useState('');
  const [newShootModelEmail, setNewShootModelEmail] = useState('');
  const [newShootModelPhone, setNewShootModelPhone] = useState('');
  const [newShootModelIsMinor, setNewShootModelIsMinor] = useState(false);
  
  const [newShootClientName, setNewShootClientName] = useState('');
  const [newShootClientEmail, setNewShootClientEmail] = useState('');
  const [newShootClientPhone, setNewShootClientPhone] = useState('');
  
  const [newShootSelectedTemplates, setNewShootSelectedTemplates] = useState<string[]>(['model-release']);
  const [newShootNotes, setNewShootNotes] = useState('');

  // New Contact Form State
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactType, setNewContactType] = useState<'model' | 'client'>('model');
  const [newContactIsMinor, setNewContactIsMinor] = useState(false);
  const [newContactGuardianName, setNewContactGuardianName] = useState('');
  const [newContactGuardianId, setNewContactGuardianId] = useState('');
  const [newContactGuardianRelationship, setNewContactGuardianRelationship] = useState('Mother');
  const [newContactNotes, setNewContactNotes] = useState('');

  // Shoot Workspace View States
  const [selectedAgreementId, setSelectedAgreementId] = useState<string | null>(null);
  const [activeAgreementLanguage, setActiveAgreementLanguage] = useState<'en' | 'af' | 'zu'>('en');
  const [shootsSubTab, setShootsSubTab] = useState<'workspaces' | 'templates'>('workspaces');
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  const [previewLang, setPreviewLang] = useState<'en' | 'af' | 'zu'>('en');

  // Cloud Storage Mock Inputs
  const [mockGalleryInput, setMockGalleryInput] = useState('');
  const [mockBackupInput, setMockBackupInput] = useState('');
  const [mockInvoiceInput, setMockInvoiceInput] = useState('');

  // Initialize and load from local storage with auto-migration to Shutterhaus Visuals
  useEffect(() => {
    const localShoots = localStorage.getItem('parchment_shoots');
    const localAgreements = localStorage.getItem('parchment_agreements');
    const localContacts = localStorage.getItem('parchment_contacts');
    const localProfile = localStorage.getItem('parchment_profile');
    const localLogs = localStorage.getItem('parchment_logs');

    if (localShoots) {
      setShoots(JSON.parse(localShoots));
    } else {
      setShoots(INITIAL_SHOOTS);
    }

    if (localAgreements) {
      let parsedAgreements = JSON.parse(localAgreements);
      if (Array.isArray(parsedAgreements)) {
        parsedAgreements = parsedAgreements.map(a => {
          if (a.content && (a.content.includes('Marais Fine Art') || a.content.includes('Kobus Marais'))) {
            a.content = a.content
              .replace(/Marais Fine Art & Commercial Photography/g, 'Shutterhaus Visuals')
              .replace(/Kobus Marais/g, 'Alwin')
              .replace(/kobus@maraisphoto\.co\.za/g, 'itsnotalwin@gmail.com');
          }
          return a;
        });
      }
      setAgreements(parsedAgreements);
    } else {
      setAgreements(INITIAL_AGREEMENTS);
    }

    if (localContacts) {
      setContacts(JSON.parse(localContacts));
    } else {
      setContacts(INITIAL_CONTACTS);
    }

    if (localProfile) {
      const parsedProfile = JSON.parse(localProfile);
      if (parsedProfile.companyName === 'Marais Fine Art & Commercial Photography' || parsedProfile.photographerName === 'Kobus Marais') {
        parsedProfile.companyName = 'Shutterhaus Visuals';
        parsedProfile.photographerName = 'Alwin';
        parsedProfile.email = 'itsnotalwin@gmail.com';
        parsedProfile.address = 'Studio 12, The Foundry, 74 Cardiff Street, Green Point, Cape Town, 8005';
        parsedProfile.registrationNumber = 'CK 2024/773821/07';
      }
      setUserProfile(parsedProfile);
    } else {
      setUserProfile(INITIAL_USER_PROFILE);
    }

    if (localLogs) {
      setAuditLogs(JSON.parse(localLogs));
    } else {
      setAuditLogs(INITIAL_AUDIT_LOGS);
    }
  }, []);

  // Sync to Local Storage
  useEffect(() => {
    localStorage.setItem('parchment_shoots', JSON.stringify(shoots));
  }, [shoots]);

  useEffect(() => {
    localStorage.setItem('parchment_agreements', JSON.stringify(agreements));
  }, [agreements]);

  useEffect(() => {
    localStorage.setItem('parchment_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('parchment_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('parchment_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('parchment_dark_mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Log action helper
  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: 'LOG-' + generateId(),
      timestamp: new Date().toISOString(),
      action,
      details,
      ipAddress: '127.0.0.1 (Local Cache)',
      browser: 'Parchment OS Desktop Client'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Pricing model upgrade simulation
  const handleTogglePro = () => {
    setUserProfile(prev => {
      const isPro = !prev.isPro;
      addAuditLog(
        isPro ? 'SaaS Upgrade' : 'SaaS Downgrade',
        isPro ? 'Photographer upgraded to Parchment PRO tier (R149/mo).' : 'Photographer switched to FREE tier.'
      );
      return { ...prev, isPro };
    });
  };

  // Autofill form when choosing client or model contact
  const handleSelectModel = (contactId: string) => {
    setNewShootModelId(contactId);
    if (!contactId) return;
    const model = contacts.find(c => c.id === contactId);
    if (model) {
      setNewShootModelName(model.name);
      setNewShootModelEmail(model.email);
      setNewShootModelPhone(model.phone);
      setNewShootModelIsMinor(!!model.isMinor);
    }
  };

  const handleSelectClient = (contactId: string) => {
    setNewShootClientId(contactId);
    if (!contactId) return;
    const client = contacts.find(c => c.id === contactId);
    if (client) {
      setNewShootClientName(client.name);
      setNewShootClientEmail(client.email);
      setNewShootClientPhone(client.phone);
    }
  };

  // Quick select via AI Helper
  const handleAISelect = (templateIds: string[], notes: string) => {
    setNewShootSelectedTemplates(templateIds);
    setNewShootNotes(notes);
    
    // Set typical prices depending on selection
    if (templateIds.includes('service-agreement')) {
      setNewShootPrice(8500);
      setNewShootDeposit(2500);
    } else if (templateIds.includes('tfp-agreement')) {
      setNewShootPrice(0);
      setNewShootDeposit(0);
    } else {
      setNewShootPrice(3500);
      setNewShootDeposit(1000);
    }

    setIsCreatingShoot(true);
    addAuditLog('AI Recommendation Applied', `AI Helper drafted shoot with templates: ${templateIds.join(', ')}`);
  };

  // Add Contact Handler
  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim()) return;

    const newContact: Contact = {
      id: 'C-' + generateId(),
      name: newContactName,
      email: newContactEmail,
      phone: newContactPhone,
      type: newContactType,
      isMinor: newContactIsMinor,
      guardianName: newContactIsMinor ? newContactGuardianName : undefined,
      guardianId: newContactIsMinor ? newContactGuardianId : undefined,
      guardianRelationship: newContactIsMinor ? newContactGuardianRelationship : undefined,
      notes: newContactNotes,
      createdAt: new Date().toISOString()
    };

    setContacts(prev => [newContact, ...prev]);
    addAuditLog('Contact Created', `New ${newContactType} contact registered: ${newContactName}`);
    
    // Reset form
    setNewContactName('');
    setNewContactEmail('');
    setNewContactPhone('');
    setNewContactIsMinor(false);
    setNewContactGuardianName('');
    setNewContactGuardianId('');
    setNewContactNotes('');
    setIsCreatingContact(false);
  };

  // Delete Contact Handler
  const handleDeleteContact = (id: string) => {
    const contactToDelete = contacts.find(c => c.id === id);
    if (!contactToDelete) return;
    
    if (confirm(`⚠️ Are you sure you want to delete ${contactToDelete.type === 'model' ? 'model' : 'client'} "${contactToDelete.name}"?`)) {
      setContacts(prev => prev.filter(c => c.id !== id));
      addAuditLog('Contact Deleted', `${contactToDelete.type === 'model' ? 'Model' : 'Client'} contact deleted: ${contactToDelete.name}`);
    }
  };

  // Create Shoot Handler
  const handleCreateShoot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShootTitle.trim() || !newShootDate) return;

    const shootId = 'S-' + generateId();
    const createdAgreementIds: string[] = [];

    // Build agreements based on template selections
    const newAgreements: Agreement[] = newShootSelectedTemplates.map(tid => {
      const template = AGREEMENT_TEMPLATES.find(t => t.id === tid);
      const code = generateVerificationCode();
      const agreementId = 'A-' + generateId();
      createdAgreementIds.push(agreementId);

      // Render text placeholders
      let rawContent = template?.content.en || '';
      rawContent = rawContent
        .replace(/{{PHOTOGRAPHER}}/g, userProfile.photographerName)
        .replace(/{{COMPANY}}/g, userProfile.companyName)
        .replace(/{{MODEL}}/g, newShootModelName || 'N/A')
        .replace(/{{CLIENT}}/g, newShootClientName || 'N/A')
        .replace(/{{DATE}}/g, formatDate(newShootDate))
        .replace(/{{LOCATION}}/g, newShootLocation || 'N/A')
        .replace(/{{PRICE}}/g, newShootPrice.toString());

      return {
        id: agreementId,
        shootId,
        templateId: tid,
        title: template?.title || 'Release Agreement',
        content: rawContent,
        language: 'en',
        modelSigned: false,
        photographerSigned: false,
        verificationCode: code,
        securityHash: generateSecurityHash(rawContent),
        createdAt: new Date().toISOString()
      };
    });

    const newShoot: Shoot = {
      id: shootId,
      title: newShootTitle,
      date: newShootDate,
      location: newShootLocation,
      status: 'Draft',
      modelId: newShootModelId || undefined,
      modelName: newShootModelName || 'N/A',
      modelEmail: newShootModelEmail || '',
      modelPhone: newShootModelPhone || '',
      isMinor: newShootModelIsMinor,
      clientId: newShootClientId || undefined,
      clientName: newShootClientName || 'N/A',
      clientEmail: newShootClientEmail || '',
      clientPhone: newShootClientPhone || '',
      price: newShootPrice,
      deposit: newShootDeposit,
      isPaid: false,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      agreementIds: createdAgreementIds,
      notes: newShootNotes,
      createdAt: new Date().toISOString()
    };

    setAgreements(prev => [...newAgreements, ...prev]);
    setShoots(prev => [newShoot, ...prev]);
    setSelectedShootId(shootId);
    
    // Auto-select first agreement in workspace
    if (createdAgreementIds.length > 0) {
      setSelectedAgreementId(createdAgreementIds[0]);
    }

    addAuditLog('Shoot Created', `Shoot Workspace "${newShootTitle}" initialized with ${newShootSelectedTemplates.length} documents.`);
    
    // Save to contacts if not already saved
    if (!newShootModelId && newShootModelName.trim()) {
      const newM: Contact = {
        id: 'C-' + generateId(),
        name: newShootModelName,
        email: newShootModelEmail,
        phone: newShootModelPhone,
        type: 'model',
        isMinor: newShootModelIsMinor,
        createdAt: new Date().toISOString()
      };
      setContacts(prev => [...prev, newM]);
    }

    // Reset Form
    setNewShootTitle('');
    setNewShootDate('');
    setNewShootLocation('');
    setNewShootPrice(3500);
    setNewShootDeposit(1000);
    setNewShootModelId('');
    setNewShootClientId('');
    setNewShootModelName('');
    setNewShootModelEmail('');
    setNewShootModelPhone('');
    setNewShootModelIsMinor(false);
    setNewShootClientName('');
    setNewShootClientEmail('');
    setNewShootClientPhone('');
    setNewShootSelectedTemplates(['model-release']);
    setNewShootNotes('');
    setIsCreatingShoot(false);
    setCurrentTab('shoots');
  };

  // Sign Agreement Event Handler
  const handleSaveSignature = (sigData: string) => {
    if (!signingAgreementId) return;

    setAgreements(prev => prev.map(a => {
      if (a.id === signingAgreementId) {
        const isPhotog = signingParty === 'photographer';
        const updated = {
          ...a,
          photographerSigned: isPhotog ? true : a.photographerSigned,
          photographerSignature: isPhotog ? sigData : a.photographerSignature,
          photographerSignedAt: isPhotog ? new Date().toISOString() : a.photographerSignedAt,
          
          modelSigned: !isPhotog ? true : a.modelSigned,
          modelSignature: !isPhotog ? sigData : a.modelSignature,
          modelSignedAt: !isPhotog ? new Date().toISOString() : a.modelSignedAt
        };

        // Recalculate hash with signature embedded
        updated.securityHash = generateSecurityHash(updated.content + (updated.modelSignature || '') + (updated.photographerSignature || ''));
        return updated;
      }
      return a;
    }));

    // Audit trail logging
    const agree = agreements.find(a => a.id === signingAgreementId);
    const shootName = shoots.find(s => s.id === agree?.shootId)?.title || 'Shoot';
    addAuditLog('Document Signed', `${signingParty === 'photographer' ? 'Photographer' : 'Model'} digitally signed ${agree?.title} under workspace "${shootName}".`);

    // Auto update shoot status to "Signed" if all completed
    const agreeObj = agreements.find(a => a.id === signingAgreementId);
    if (agreeObj) {
      setShoots(prev => prev.map(s => {
        if (s.id === agreeObj.shootId) {
          return { ...s, status: 'Signed' };
        }
        return s;
      }));
    }

    setSigningAgreementId(null);
  };

  // Sign via QR/Simulation Complete Callback
  const handleModelSignedViaPortal = (modelSig: string, guardianSig?: string, guardianName?: string, guardianRel?: string, guardianId?: string) => {
    if (!activeQRModalAgreementId) return;

    setAgreements(prev => prev.map(a => {
      if (a.id === activeQRModalAgreementId) {
        const updated = {
          ...a,
          modelSigned: true,
          modelSignature: modelSig,
          modelSignedAt: new Date().toISOString(),
          guardianSigned: guardianSig ? true : undefined,
          guardianSignature: guardianSig,
          guardianSignedAt: guardianSig ? new Date().toISOString() : undefined,
          guardianName,
          guardianRelationship: guardianRel,
          guardianId
        };
        updated.securityHash = generateSecurityHash(updated.content + (updated.modelSignature || '') + (updated.guardianSignature || ''));
        return updated;
      }
      return a;
    }));

    const agree = agreements.find(a => a.id === activeQRModalAgreementId);
    const shoot = shoots.find(s => s.id === agree?.shootId);
    if (shoot) {
      setShoots(prev => prev.map(s => {
        if (s.id === shoot.id) return { ...s, status: 'Signed' };
        return s;
      }));
    }

    addAuditLog('Mobile QR Portal Signature', `Model ${shoot?.modelName} co-signed agreement ${agree?.title} via secure QR simulator.`);
    setActiveQRModalAgreementId(null);
  };

  // Cloud storage upload mockup
  const handleUploadLink = (type: 'gallery' | 'backup' | 'invoice', value: string) => {
    if (!selectedShootId || !value.trim()) return;

    setShoots(prev => prev.map(s => {
      if (s.id === selectedShootId) {
        const updated = { ...s };
        if (type === 'gallery') {
          updated.galleryLink = value;
          updated.status = 'Completed'; // Auto mark completed when gallery uploaded!
        }
        if (type === 'backup') updated.rawBackupLink = value;
        if (type === 'invoice') updated.isPaid = true; // Auto mark paid on invoice confirmation
        return updated;
      }
      return s;
    }));

    addAuditLog('Vault Resource Registered', `Linked ${type} asset: "${value}" inside Shoot Workspace.`);
    
    // Clear inputs
    if (type === 'gallery') setMockGalleryInput('');
    if (type === 'backup') setMockBackupInput('');
    if (type === 'invoice') setMockInvoiceInput('');
  };

  // Filter shoots by Search & Filter Type
  const filteredShoots = shoots.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(shootSearch.toLowerCase()) || 
                          s.modelName.toLowerCase().includes(shootSearch.toLowerCase()) ||
                          s.clientName.toLowerCase().includes(shootSearch.toLowerCase());
    const matchesFilter = shootFilter === 'All' || s.status === shootFilter;
    return matchesSearch && matchesFilter;
  });

  // Get current active shoot details
  const activeShoot = shoots.find(s => s.id === selectedShootId);
  const activeAgreements = agreements.filter(a => a.shootId === selectedShootId);
  const currentAgreement = activeAgreements.find(a => a.id === selectedAgreementId) || activeAgreements[0];

  // Print Agreement Preview Navigation
  const agreementForPrint = agreements.find(a => a.id === selectedAgreementIdForPrint);
  const shootForPrint = agreementForPrint ? shoots.find(s => s.id === agreementForPrint.shootId) : null;

  // Statistics summaries for dashboard
  const activeShootsCount = shoots.filter(s => s.status !== 'Completed' && s.status !== 'Archived').length;
  const signedReleasesCount = agreements.filter(a => a.modelSigned && a.photographerSigned).length;
  const totalRevenue = shoots.reduce((acc, curr) => acc + (curr.isPaid ? curr.price : curr.deposit), 0);
  
  // Calculate expiry warning counts
  const expiriesCount = shoots.filter(s => {
    const { status } = getExpiryStatus(s.expiryDate);
    return status === 'warning' || status === 'expired';
  }).length;

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans flex flex-col ${
      isDarkMode 
        ? 'bg-cocoa text-alabaster' 
        : 'bg-oatmeal text-espresso'
    }`}>
      
      {/* Printable/Print-Only Layout Cover */}
      {selectedAgreementIdForPrint && agreementForPrint && shootForPrint ? (
        <div className="flex-1 p-4 md:p-8">
          <PrintPreview
            agreement={agreementForPrint}
            shoot={shootForPrint}
            userProfile={userProfile}
            isDarkMode={isDarkMode}
            onBack={() => setSelectedAgreementIdForPrint(null)}
            onUpdateProfile={(updatedProfile) => setUserProfile(updatedProfile)}
          />
        </div>
      ) : (
        <>
          {/* Main Workspace Frame */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar Left Column */}
          <aside className={`hidden md:flex md:w-64 border-r flex-col shrink-0 no-print ${
            isDarkMode ? 'border-espresso bg-cocoa-surface' : 'border-sand bg-[#faf6f0]'
          }`}>
            <div className="p-8 pb-4 flex items-center gap-3">
              <div className={`p-2 rounded-xl border ${isDarkMode ? 'bg-cocoa-surface border-espresso text-sand' : 'bg-white border-sand text-espresso'}`}>
                <FolderHeart className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h1 className="font-display font-bold text-sm leading-tight tracking-tight">Shoot OS</h1>
                <p className="text-[9px] opacity-50 uppercase tracking-widest font-mono">Creative Workspace</p>
              </div>
            </div>
            
            <nav className="flex-1 px-4 py-4 space-y-1">
              {[
                { id: 'dashboard', label: 'Shoot Workspace', icon: Layers },
                { id: 'shoots', label: 'Template Library', icon: Briefcase },
                { id: 'contacts', label: 'Clients & Models', icon: Users },
                { id: 'verifier', label: 'Signed Documents', icon: ShieldCheck },
                { id: 'settings', label: 'OS Settings', icon: SettingsIcon }
              ].map(tab => {
                const isActive = currentTab === tab.id && !selectedShootId;
                return (
                  <button
                    key={tab.id}
                    id={`sidebar-nav-${tab.id}`}
                    onClick={() => {
                      setCurrentTab(tab.id as any);
                      setSelectedShootId(null);
                    }}
                    className={`w-full flex items-center px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                      isActive
                        ? isDarkMode 
                          ? 'bg-white/5 border-sand text-sand' 
                          : 'bg-white/50 border-sand text-espresso shadow-sm'
                        : 'border-transparent opacity-60 hover:opacity-100 hover:bg-sand/10'
                    }`}
                  >
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full mr-3 shrink-0" style={{ backgroundColor: isDarkMode ? '#e6dac6' : '#272421' }}></span>
                    )}
                    {!isActive && (
                      <tab.icon className="w-4 h-4 mr-3 shrink-0 opacity-70" />
                    )}
                    <span className="text-xs font-semibold">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-6 mt-auto border-t border-sand/30 dark:border-espresso/30">
              <div className={`p-4 rounded-xl border border-dashed ${
                isDarkMode ? 'bg-cocoa-surface/40 border-espresso text-sand' : 'bg-white/40 border-sand text-espresso'
              }`}>
                <div className="text-[9px] uppercase tracking-wider mb-2 opacity-60 font-mono">AI Assistant</div>
                <div className="text-[11px] leading-relaxed italic opacity-85">
                  "It's a brand shoot in Cape Town? I've drafted the Commercial Release and NDAs for you."
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  id="sidebar-btn-toggle-theme"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'border-espresso hover:bg-cocoa-surface-light text-sand' 
                      : 'border-sand hover:bg-sand/20 text-espresso'
                  }`}
                  title="Toggle visual style"
                >
                  {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                </button>

                <div 
                  onClick={handleTogglePro}
                  className={`cursor-pointer px-2.5 py-1 rounded-full text-[9px] font-bold font-mono tracking-wider transition-all hover:scale-[1.02] ${
                    userProfile.isPro 
                      ? 'bg-amber-500 text-espresso' 
                      : 'bg-sand/20 text-sand border border-sand/30'
                  }`}
                >
                  {userProfile.isPro ? 'PRO' : 'FREE'}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column Scroll Frame */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Mobile Header */}
            <header className={`md:hidden border-b px-6 py-4 sticky top-0 z-40 backdrop-blur-md flex items-center justify-between no-print ${
              isDarkMode ? 'border-espresso bg-cocoa/90' : 'border-sand bg-[#faf6f0]/90'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl border ${isDarkMode ? 'bg-cocoa-surface border-espresso text-sand' : 'bg-white border-sand text-espresso'}`}>
                  <FolderHeart className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div>
                  <h1 className="font-display font-bold text-sm leading-tight tracking-tight">Shoot OS</h1>
                  <p className="text-[9px] opacity-65 uppercase tracking-widest font-mono">Workspace</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isDarkMode ? 'border-espresso text-sand' : 'border-sand text-espresso'
                  }`}
                >
                  {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                </button>
              </div>
            </header>

            {/* Desktop main header */}
            <header className={`hidden md:flex h-20 border-b flex items-center justify-between px-10 shrink-0 no-print ${
              isDarkMode ? 'border-espresso bg-cocoa/30' : 'border-sand bg-white/20'
            }`}>
              {selectedShootId && activeShoot ? (
                <div>
                  <h1 className="text-xl font-medium">{activeShoot.title}</h1>
                  <p className="text-xs opacity-50">Created {formatDate(activeShoot.date)} • Location: {activeShoot.location}</p>
                </div>
              ) : (
                <div>
                  <h1 className="text-xl font-medium uppercase tracking-wider text-xs opacity-60">
                    {currentTab === 'dashboard' && 'Workspace OS Overview'}
                    {currentTab === 'shoots' && 'Template Library / Workspaces'}
                    {currentTab === 'contacts' && 'Models & Clients Database'}
                    {currentTab === 'verifier' && 'Verification Node'}
                    {currentTab === 'settings' && 'OS Environment Configurations'}
                  </h1>
                  <p className="text-xs opacity-50">
                    {currentTab === 'dashboard' && 'Centralize client sessions, legal model releases, and commercial licenses safely.'}
                    {currentTab === 'shoots' && 'Create, view, edit and execute client photography contracts.'}
                    {currentTab === 'contacts' && 'Manage your South African photography contacts database.'}
                    {currentTab === 'verifier' && 'Cryptographically verify signed model releases and licensing status.'}
                    {currentTab === 'settings' && 'Customize your studio profile, pricing preferences and legal defaults.'}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3">
                {currentTab !== 'verifier' && currentTab !== 'settings' && (
                  <button
                    onClick={() => {
                      if (currentTab === 'contacts') {
                        setIsCreatingContact(true);
                      } else {
                        setIsCreatingShoot(true);
                      }
                    }}
                    className={`px-5 py-2 text-xs font-medium text-white rounded-full transition-all hover:scale-[1.01] ${
                      isDarkMode ? 'bg-sand !text-cocoa hover:bg-white' : 'bg-espresso !text-oatmeal hover:bg-espresso/95'
                    }`}
                  >
                    {currentTab === 'contacts' ? 'Add Contact' : 'Create Shoot'}
                  </button>
                )}
              </div>
            </header>

            {/* Main content view */}
            <div className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto space-y-6">
              
              {/* Mobile tabs bar */}
              <div className="md:hidden flex gap-1 overflow-x-auto pb-1 no-print border-b border-sand/30">
                {[
                  { id: 'dashboard', label: 'Workspace', icon: Layers },
                  { id: 'shoots', label: 'Library', icon: Briefcase },
                  { id: 'contacts', label: 'People', icon: Users },
                  { id: 'verifier', label: 'Verify', icon: ShieldCheck },
                  { id: 'settings', label: 'Settings', icon: SettingsIcon }
                ].map(tab => (
                  <button
                    key={tab.id}
                    id={`m-nav-${tab.id}`}
                    onClick={() => {
                      setCurrentTab(tab.id as any);
                      setSelectedShootId(null);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                      currentTab === tab.id && !selectedShootId
                        ? 'bg-espresso text-oatmeal dark:bg-sand dark:text-cocoa'
                        : 'bg-sand/10 border border-sand/10 text-opacity-80'
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>

            {/* ACTIVE DETAIL VIEW: SHOOT WORKSPACE OVERLAY */}
            {selectedShootId && activeShoot ? (
              <div className="space-y-6">
                {/* Shoot Header Bar */}
                <div className={`p-6 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                  isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                }`}>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedShootId(null)}
                      className={`text-xs font-bold underline flex items-center gap-1 mb-2 ${
                        isDarkMode ? 'text-alabaster/60 hover:text-alabaster' : 'text-espresso/60 hover:text-espresso'
                      }`}
                    >
                      <Undo className="w-3.5 h-3.5" />
                      Back to overall database
                    </button>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display font-bold text-xl tracking-tight">{activeShoot.title}</h2>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full font-mono ${
                        activeShoot.status === 'Signed' || activeShoot.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : activeShoot.status === 'Sent'
                            ? 'bg-sky-500/10 text-sky-500 border border-sky-500/20'
                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {activeShoot.status.toUpperCase()}
                      </span>
                    </div>

                    <div className={`flex flex-wrap items-center gap-3 text-xs opacity-75 ${isDarkMode ? 'text-alabaster/60' : 'text-espresso/60'}`}>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-sand" /> {formatDate(activeShoot.date)}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-sand" /> {activeShoot.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 self-stretch sm:self-auto">
                    {/* Share portal code */}
                    <div className={`px-4 py-2 rounded-lg border text-center flex flex-col justify-center ${
                      isDarkMode ? 'bg-cocoa-surface-light border-espresso' : 'bg-oatmeal border-sand'
                    }`}>
                      <span className="text-[9px] uppercase tracking-wider opacity-60">Verification Link Code</span>
                      <span className="font-mono text-xs font-bold tracking-widest text-sand">{currentAgreement?.verificationCode || 'GEN-CODE'}</span>
                    </div>
                  </div>
                </div>

                {/* Main Shoot Workspace body */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column: People Profiles & Finance */}
                  <div className="space-y-6">
                    {/* Model Info Card */}
                    <div className={`p-5 rounded-xl border space-y-4 ${
                      isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                    }`}>
                      <div className="flex items-center justify-between border-b pb-2">
                        <h4 className="font-display font-bold text-xs uppercase tracking-wider text-sand">Model / Signatory Profile</h4>
                        <Users className="w-4 h-4 text-sand" />
                      </div>
                      
                      <div className="space-y-2.5 text-xs">
                        <p className="font-semibold text-sm">{activeShoot.modelName}</p>
                        {activeShoot.modelEmail && (
                          <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-sand" /> {activeShoot.modelEmail}</p>
                        )}
                        {activeShoot.modelPhone && (
                          <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-sand" /> {activeShoot.modelPhone}</p>
                        )}
                        
                        {activeShoot.isMinor && (
                          <div className="mt-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-1">
                            <p className="font-bold text-[10px] text-amber-500">PARENTAL CO-SIGN REQUIRED</p>
                            <p className="text-[10px] opacity-85">Subject is under 18. Secure Minor Model Release templates are enabled by default for this shoot workspace.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Client & Booking Finance Info */}
                    <div className={`p-5 rounded-xl border space-y-4 ${
                      isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                    }`}>
                      <div className="flex items-center justify-between border-b pb-2">
                        <h4 className="font-display font-bold text-xs uppercase tracking-wider text-sand">Client & Service Invoice</h4>
                        <Briefcase className="w-4 h-4 text-sand" />
                      </div>
                      
                      <div className="space-y-3 text-xs">
                        <div>
                          <p className="font-semibold text-sm">{activeShoot.clientName}</p>
                          {activeShoot.clientEmail && <p className="opacity-70 mt-0.5">{activeShoot.clientEmail}</p>}
                        </div>

                        <div className={`p-3 rounded-lg space-y-2 ${isDarkMode ? 'bg-cocoa-surface-light' : 'bg-oatmeal/40'}`}>
                          <div className="flex justify-between">
                            <span>Shoot Service Fee:</span>
                            <span className="font-bold">{formatCurrency(activeShoot.price)}</span>
                          </div>
                          <div className="flex justify-between text-opacity-80">
                            <span>Booking Deposit:</span>
                            <span>{formatCurrency(activeShoot.deposit)}</span>
                          </div>
                          
                          <div className="border-t border-sand/20 pt-2 flex justify-between items-center">
                            <span className="font-bold">Payment Status:</span>
                            <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                              activeShoot.isPaid 
                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                                : 'bg-red-500/10 text-red-500 border border-red-500/20'
                            }`}>
                              {activeShoot.isPaid ? 'PAID IN FULL' : 'DEPOSIT RECEIVED'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expiry Tracking Box */}
                    {activeShoot.expiryDate && (
                      <div className={`p-5 rounded-xl border space-y-3 ${
                        isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                      }`}>
                        <div className="flex items-center justify-between border-b pb-2">
                          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-sand">Licensing Expiry</h4>
                          <History className="w-4 h-4 text-sand" />
                        </div>
                        
                        <div className="text-xs space-y-2">
                          <p className="opacity-80">Commercial advertising usage permissions timeline:</p>
                          <div className="flex justify-between items-center font-semibold">
                            <span>Expires on:</span>
                            <span>{formatDate(activeShoot.expiryDate)}</span>
                          </div>
                          
                          {(() => {
                            const { status, daysLeft } = getExpiryStatus(activeShoot.expiryDate);
                            return (
                              <div className={`p-2 rounded border text-center text-[10px] font-bold ${
                                status === 'expired' 
                                  ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                                  : status === 'warning' 
                                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse' 
                                    : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              }`}>
                                {status === 'expired' && '⚠️ CONTRACT EXPIRED - RENEW LICENSING'}
                                {status === 'warning' && `⚠️ EXPIRES IN ${daysLeft} DAYS - CONTACT MODEL`}
                                {status === 'active' && `✅ ACTIVE LICENSE (${daysLeft} DAYS REMAINING)`}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Modules: Document Editor, Signing Controls, Cloud Storage Mock */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* Active Agreement Panel */}
                    <div className={`p-6 rounded-xl border space-y-4 ${
                      isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                    }`}>
                      {/* Document Selector & Language Select */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-sand/40 pb-4">
                        <div className="flex flex-wrap items-center gap-2">
                          {activeAgreements.map(agree => (
                            <button
                              key={agree.id}
                              onClick={() => setSelectedAgreementId(agree.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                currentAgreement?.id === agree.id
                                  ? isDarkMode 
                                    ? 'bg-sand text-cocoa border-sand' 
                                    : 'bg-espresso text-oatmeal border-espresso'
                                  : isDarkMode 
                                    ? 'border-espresso bg-cocoa-surface hover:bg-cocoa-surface-light' 
                                    : 'border-sand bg-white hover:bg-sand/10'
                              }`}
                            >
                              {agree.title.split(' ')[0]} {agree.title.includes('Release') ? 'Release' : 'Contract'}
                            </button>
                          ))}
                        </div>

                        {/* Language Selection */}
                        <div className="flex items-center gap-1.5 self-end sm:self-auto">
                          <Globe2 className="w-3.5 h-3.5 text-sand" />
                          <span className="text-[10px] font-mono opacity-60 uppercase">Language:</span>
                          <div className="flex border border-sand/30 rounded-lg overflow-hidden">
                            {[
                              { id: 'en', label: 'EN' },
                              { id: 'af', label: 'AF' },
                              { id: 'zu', label: 'ZU' }
                            ].map(lang => (
                              <button
                                key={lang.id}
                                onClick={() => {
                                  setActiveAgreementLanguage(lang.id as any);
                                  // Switch actual displayed agreement text depending on chosen templates data
                                  if (currentAgreement) {
                                    const template = AGREEMENT_TEMPLATES.find(t => t.id === currentAgreement.templateId);
                                    if (template) {
                                      let txt = template.content[lang.id as 'en' | 'af' | 'zu'] || template.content.en;
                                      txt = txt
                                        .replace(/{{PHOTOGRAPHER}}/g, userProfile.photographerName)
                                        .replace(/{{COMPANY}}/g, userProfile.companyName)
                                        .replace(/{{MODEL}}/g, activeShoot.modelName || 'N/A')
                                        .replace(/{{CLIENT}}/g, activeShoot.clientName || 'N/A')
                                        .replace(/{{DATE}}/g, formatDate(activeShoot.date))
                                        .replace(/{{LOCATION}}/g, activeShoot.location || 'N/A')
                                        .replace(/{{PRICE}}/g, activeShoot.price.toString());
                                      
                                      setAgreements(prev => prev.map(a => {
                                        if (a.id === currentAgreement.id) {
                                          return { ...a, content: txt, language: lang.id as any };
                                        }
                                        return a;
                                      }));
                                    }
                                  }
                                }}
                                className={`px-2 py-1 text-[10px] font-mono font-bold transition-all ${
                                  currentAgreement?.language === lang.id
                                    ? 'bg-sand text-cocoa'
                                    : isDarkMode ? 'bg-cocoa hover:bg-cocoa-surface-light' : 'bg-white hover:bg-sand/10'
                                }`}
                              >
                                {lang.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Display Agreement Body Preview */}
                      {currentAgreement ? (
                        <div className="space-y-4">
                          <div className={`p-4 rounded-lg h-56 overflow-y-auto font-mono text-[11px] leading-relaxed border whitespace-pre-line ${
                            isDarkMode ? 'bg-cocoa border-espresso text-alabaster/90' : 'bg-[#faf6f0]/40 border-sand text-espresso/90'
                          }`}>
                            {currentAgreement.content}
                          </div>

                          {/* Signatures status & Draw controls */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Photographer Sign Status */}
                            <div className={`p-4 rounded-lg border ${
                              currentAgreement.photographerSigned 
                                ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500' 
                                : isDarkMode ? 'border-espresso bg-cocoa-surface-light' : 'border-sand bg-oatmeal/20'
                            }`}>
                              <p className="text-[10px] font-bold uppercase tracking-wider">Photographer Seal</p>
                              {currentAgreement.photographerSignature ? (
                                <div className="h-12 flex items-center justify-center my-2 p-1 bg-white/5 border border-dashed border-sand/20 rounded">
                                  <img src={currentAgreement.photographerSignature} alt="Photog Signature" className="max-h-full max-w-full dark:invert" />
                                </div>
                              ) : (
                                <div className="h-12 flex items-center justify-center my-2 text-xs italic opacity-60">Pending Ink</div>
                              )}
                              
                              {!currentAgreement.photographerSigned ? (
                                <button
                                  type="button"
                                  id="btn-sign-photog"
                                  onClick={() => {
                                    setSigningAgreementId(currentAgreement.id);
                                    setSigningParty('photographer');
                                  }}
                                  className={`w-full py-1.5 rounded text-xs font-semibold cursor-pointer text-center ${
                                    isDarkMode ? 'bg-sand text-cocoa hover:bg-alabaster' : 'bg-espresso text-oatmeal hover:bg-espresso/80'
                                  }`}
                                >
                                  Sign Contract Now
                                </button>
                              ) : (
                                <div className="text-[10px] font-mono flex items-center gap-1"><Check className="w-3.5 h-3.5" /> SECURE SIGNED</div>
                              )}
                            </div>

                            {/* Model Sign Status / QR trigger */}
                            <div className={`p-4 rounded-lg border ${
                              currentAgreement.modelSigned 
                                ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500' 
                                : isDarkMode ? 'border-espresso bg-cocoa-surface-light' : 'border-sand bg-oatmeal/20'
                            }`}>
                              <p className="text-[10px] font-bold uppercase tracking-wider">Model Likeness Seal</p>
                              {currentAgreement.modelSignature ? (
                                <div className="h-12 flex items-center justify-center my-2 p-1 bg-white/5 border border-dashed border-sand/20 rounded">
                                  <img src={currentAgreement.modelSignature} alt="Model Signature" className="max-h-full max-w-full dark:invert" />
                                </div>
                              ) : (
                                <div className="h-12 flex items-center justify-center my-2 text-xs italic opacity-60">Pending Ink</div>
                              )}

                              {!currentAgreement.modelSigned ? (
                                <div className="flex gap-1.5">
                                  <button
                                    type="button"
                                    id="btn-trigger-mobile-qr"
                                    onClick={() => setActiveQRModalAgreementId(currentAgreement.id)}
                                    className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-400 text-espresso text-xs font-bold rounded flex items-center justify-center gap-1"
                                  >
                                    <QrCode className="w-3.5 h-3.5" />
                                    Scan QR to Sign
                                  </button>
                                  <button
                                    type="button"
                                    id="btn-sign-model-direct"
                                    onClick={() => {
                                      setSigningAgreementId(currentAgreement.id);
                                      setSigningParty('model');
                                    }}
                                    className={`px-3 py-1.5 rounded text-xs font-semibold border ${
                                      isDarkMode ? 'border-espresso text-alabaster hover:bg-cocoa-surface' : 'border-sand text-espresso hover:bg-sand/20'
                                    }`}
                                  >
                                    Sign Here
                                  </button>
                                </div>
                              ) : (
                                <div className="text-[10px] font-mono flex items-center gap-1"><Check className="w-3.5 h-3.5" /> SECURE SIGNED</div>
                              )}
                            </div>
                          </div>

                          {/* Print and Export Buttons */}
                          {currentAgreement && (
                            <div className="flex gap-2 pt-3 border-t border-dashed border-sand/30">
                              <button
                                type="button"
                                id="btn-print-doc"
                                onClick={() => setSelectedAgreementIdForPrint(currentAgreement.id)}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all hover:scale-[1.01] cursor-pointer shadow-sm ${
                                  isDarkMode ? 'bg-sand text-cocoa hover:bg-alabaster' : 'bg-espresso text-oatmeal hover:bg-espresso/90'
                                }`}
                              >
                                <Printer className="w-4 h-4 text-amber-400" />
                                Print Contract / Save as PDF (Ready for Hand Signing)
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="py-8 text-center text-xs opacity-60">No documents drafted. Click "Create Shoot" to make some.</div>
                      )}
                    </div>

                    {/* Integrated Cloud Folders Simulation (Shoot Workspace OS) */}
                    <div className={`p-6 rounded-xl border space-y-4 ${
                      isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                    }`}>
                      <div className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center gap-2">
                          <FolderOpen className="w-4 h-4 text-sand" />
                          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-sand">Shoot Archival Cloud Vault</h4>
                        </div>
                        <span className="text-[10px] font-mono bg-sand/10 text-sand px-2 py-0.5 rounded font-bold">SECURE DRIVE</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Releases & Invoices Folder */}
                        <div className={`p-4 rounded-lg space-y-3 ${isDarkMode ? 'bg-cocoa-surface-light' : 'bg-oatmeal/20'}`}>
                          <p className="text-[11px] font-bold">📂 Releases & Documents</p>
                          <div className="space-y-1.5 text-xs">
                            {activeAgreements.map(agree => (
                              <div key={agree.id} className="flex justify-between items-center bg-white/5 p-1.5 rounded">
                                <span className="font-mono truncate max-w-[140px]">{agree.title}</span>
                                <span className={`text-[9px] font-bold ${agree.modelSigned ? 'text-emerald-500' : 'text-amber-500'}`}>
                                  {agree.modelSigned ? 'SIGNED' : 'DRAFT'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Gallery links / RAW backups */}
                        <div className={`p-4 rounded-lg space-y-3 ${isDarkMode ? 'bg-cocoa-surface-light' : 'bg-oatmeal/20'}`}>
                          <p className="text-[11px] font-bold">📷 Shoot Deliverables Vault</p>
                          
                          <div className="space-y-2 text-xs">
                            <div>
                              <p className="text-[10px] opacity-75 mb-1">Final Gallery link:</p>
                              {activeShoot.galleryLink ? (
                                <a href={activeShoot.galleryLink} target="_blank" rel="noreferrer" className="text-sand font-bold underline flex items-center gap-1 truncate text-[11px]">
                                  {activeShoot.galleryLink.substring(0, 30)}...
                                  <ExternalLink className="w-3 h-3 shrink-0" />
                                </a>
                              ) : (
                                <div className="flex gap-1.5">
                                  <input
                                    type="text"
                                    placeholder="https://pixieset.com/gallery..."
                                    value={mockGalleryInput}
                                    onChange={(e) => setMockGalleryInput(e.target.value)}
                                    className={`flex-1 p-1 text-[10px] rounded border focus:outline-none ${
                                      isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                                    }`}
                                  />
                                  <button onClick={() => handleUploadLink('gallery', mockGalleryInput)} className="px-2 py-1 bg-espresso text-oatmeal dark:bg-sand dark:text-cocoa rounded text-[9px] font-bold flex items-center gap-0.5">
                                    <Upload className="w-2.5 h-2.5" /> Save
                                  </button>
                                </div>
                              )}
                            </div>

                            <div>
                              <p className="text-[10px] opacity-75 mb-1">AWS RAW Backups:</p>
                              {activeShoot.rawBackupLink ? (
                                <p className="font-mono text-[10px] truncate max-w-[200px] text-emerald-500">{activeShoot.rawBackupLink}</p>
                              ) : (
                                <div className="flex gap-1.5">
                                  <input
                                    type="text"
                                    placeholder="s3://backup-bucket/..."
                                    value={mockBackupInput}
                                    onChange={(e) => setMockBackupInput(e.target.value)}
                                    className={`flex-1 p-1 text-[10px] rounded border focus:outline-none ${
                                      isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                                    }`}
                                  />
                                  <button onClick={() => handleUploadLink('backup', mockBackupInput)} className="px-2 py-1 bg-espresso text-oatmeal dark:bg-sand dark:text-cocoa rounded text-[9px] font-bold flex items-center gap-0.5">
                                    <Upload className="w-2.5 h-2.5" /> Link
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* PRIMARY TAB DISPLAYS */}
                {/* 1. BENTO DASHBOARD TAB */}
                {currentTab === 'dashboard' && (
                  <div className="space-y-6">
                    {/* Welcome Banner */}
                    <div className={`p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden ${
                      isDarkMode 
                        ? 'bg-cocoa-surface border-espresso text-alabaster' 
                        : 'bg-[#fcfaf7] border-sand text-espresso'
                    }`}>
                      {/* Aesthetic background design */}
                      <div className="absolute top-0 right-0 w-44 h-44 bg-sand/10 rounded-full blur-2xl pointer-events-none" />
                      
                      <div className="space-y-1 relative z-10">
                        <h2 className="font-display font-bold text-2xl tracking-tight">{userProfile.companyName || 'Shutterhaus Visuals'} Portfolio OS</h2>
                        <p className={`text-xs ${isDarkMode ? 'text-alabaster/60' : 'text-espresso/60'}`}>
                          Centralize client sessions, legal model releases, and commercial licenses safely.
                        </p>
                      </div>
                      
                      <button
                        onClick={() => setIsCreatingShoot(true)}
                        id="btn-dashboard-new-shoot"
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-display font-semibold shadow-md hover:scale-[1.01] transition-all relative z-10 ${
                          isDarkMode 
                            ? 'bg-sand text-cocoa hover:bg-alabaster' 
                            : 'bg-espresso text-oatmeal hover:bg-espresso/90'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        Create New Shoot Workspace
                      </button>
                    </div>

                    {/* Bento Statistics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      
                      {/* Metric 1 */}
                      <div className={`p-5 rounded-xl border flex items-center justify-between ${
                        isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                      }`}>
                        <div className="space-y-1">
                          <p className={`text-[10px] uppercase font-bold tracking-wider ${isDarkMode ? 'text-alabaster/50' : 'text-espresso/50'}`}>Active Shoots</p>
                          <p className="font-display font-bold text-2xl">{activeShootsCount}</p>
                          <p className="text-[10px] text-sand font-mono">Pending signature/upload</p>
                        </div>
                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-cocoa-surface-light text-sand' : 'bg-oatmeal text-espresso'}`}>
                          <Briefcase className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Metric 2 */}
                      <div className={`p-5 rounded-xl border flex items-center justify-between ${
                        isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                      }`}>
                        <div className="space-y-1">
                          <p className={`text-[10px] uppercase font-bold tracking-wider ${isDarkMode ? 'text-alabaster/50' : 'text-espresso/50'}`}>Signed Releases</p>
                          <p className="font-display font-bold text-2xl">{signedReleasesCount}</p>
                          <p className="text-[10px] text-emerald-500 font-mono">100% legally secured</p>
                        </div>
                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-cocoa-surface-light text-sand' : 'bg-oatmeal text-espresso'}`}>
                          <FileCheck className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Metric 3 */}
                      <div className={`p-5 rounded-xl border flex items-center justify-between ${
                        isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                      }`}>
                        <div className="space-y-1">
                          <p className={`text-[10px] uppercase font-bold tracking-wider ${isDarkMode ? 'text-alabaster/50' : 'text-espresso/50'}`}>Est. Revenue (YTD)</p>
                          <p className="font-display font-bold text-xl">{formatCurrency(totalRevenue)}</p>
                          <p className="text-[10px] text-sand font-mono">Deposits + Full balances</p>
                        </div>
                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-cocoa-surface-light text-sand' : 'bg-oatmeal text-espresso'}`}>
                          <DollarSign className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Metric 4 */}
                      <div className={`p-5 rounded-xl border flex items-center justify-between ${
                        isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                      }`}>
                        <div className="space-y-1">
                          <p className={`text-[10px] uppercase font-bold tracking-wider ${isDarkMode ? 'text-alabaster/50' : 'text-espresso/50'}`}>Expiry Warnings</p>
                          <p className="font-display font-bold text-2xl">{expiriesCount}</p>
                          <p className={`text-[10px] font-bold font-mono ${expiriesCount > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {expiriesCount > 0 ? 'Review licenses soon' : 'All license clearances valid'}
                          </p>
                        </div>
                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-cocoa-surface-light text-sand' : 'bg-oatmeal text-espresso'}`}>
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                      </div>

                    </div>

                    {/* Center Section: AI helper on left, recent shoots & log on right */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* AI Helper column */}
                      <div className="lg:col-span-1">
                        <AIHelper
                          onSelectTemplates={handleAISelect}
                          isDarkMode={isDarkMode}
                        />
                      </div>

                      {/* Recent active shoots database view */}
                      <div className="lg:col-span-2 space-y-6">
                        <div className={`p-5 rounded-xl border space-y-4 ${
                          isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                        }`}>
                          <div className="flex items-center justify-between border-b pb-2">
                            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-sand">Recent Active Workspaces</h3>
                            <button onClick={() => setCurrentTab('shoots')} className="text-xs underline font-semibold text-sand">View All Shoots</button>
                          </div>

                          <div className="space-y-3.5">
                            {shoots.slice(0, 3).map(shoot => {
                              const relatedAgree = agreements.filter(a => a.shootId === shoot.id);
                              const signedCount = relatedAgree.filter(a => a.modelSigned && a.photographerSigned).length;
                              
                              return (
                                <div
                                  key={shoot.id}
                                  onClick={() => {
                                    setSelectedShootId(shoot.id);
                                    if (shoot.agreementIds.length > 0) {
                                      setSelectedAgreementId(shoot.agreementIds[0]);
                                    }
                                  }}
                                  className={`p-4 rounded-xl border cursor-pointer hover:scale-[1.01] transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
                                    isDarkMode 
                                      ? 'bg-cocoa border-espresso hover:bg-cocoa-surface-light' 
                                      : 'bg-oatmeal/20 border-sand hover:bg-white hover:border-espresso/20'
                                  }`}
                                >
                                  <div>
                                    <h4 className="font-display font-semibold text-sm">{shoot.title}</h4>
                                    <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-alabaster/60' : 'text-espresso/60'}`}>
                                      Model: {shoot.modelName} • Client: {shoot.clientName}
                                    </p>
                                    <p className="text-[10px] text-sand font-mono mt-1">{formatDate(shoot.date)} • {shoot.location}</p>
                                  </div>

                                  <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                                    <span className={`px-2 py-0.5 text-[9px] font-bold font-mono rounded-full ${
                                      shoot.status === 'Signed' || shoot.status === 'Completed'
                                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                    }`}>
                                      {shoot.status.toUpperCase()}
                                    </span>
                                    <span className="text-[10px] opacity-60">
                                      {signedCount}/{relatedAgree.length} Releases Sealed
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Recent Digital Signature Audit Trail logs */}
                        <div className={`p-5 rounded-xl border space-y-4 ${
                          isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                        }`}>
                          <div className="flex items-center justify-between border-b pb-2">
                            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-sand">Digital Signature Audit Log</h3>
                            <History className="w-4 h-4 text-sand" />
                          </div>

                          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                            {auditLogs.slice(0, 4).map(log => (
                              <div key={log.id} className="flex gap-3 text-xs border-b border-sand/10 pb-2.5 last:border-b-0">
                                <div className={`p-1.5 rounded-lg h-fit shrink-0 ${isDarkMode ? 'bg-cocoa-surface-light' : 'bg-oatmeal'}`}>
                                  <FileCheck className="w-3.5 h-3.5 text-sand" />
                                </div>
                                <div className="space-y-0.5">
                                  <div className="flex flex-wrap items-center gap-x-2">
                                    <span className="font-semibold text-[11px]">{log.action}</span>
                                    <span className="text-[9px] opacity-50 font-mono">{formatDate(log.timestamp)}</span>
                                  </div>
                                  <p className={`text-[11px] ${isDarkMode ? 'text-alabaster/70' : 'text-espresso/70'}`}>{log.details}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* 2. SHOOTS WORKSPACES TAB */}
                {currentTab === 'shoots' && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Toggle Sub-tab: Active Workspaces vs Legal Contract Templates */}
                    <div className="flex border-b border-sand/20 pb-3 gap-6">
                      <button
                        onClick={() => setShootsSubTab('workspaces')}
                        className={`text-sm font-display font-bold pb-2 border-b-2 transition-all relative ${
                          shootsSubTab === 'workspaces'
                            ? 'border-sand text-sand'
                            : 'border-transparent opacity-65 hover:opacity-100'
                        }`}
                      >
                        Active Shoot Workspaces
                        {shootsSubTab === 'workspaces' && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sand" />
                        )}
                      </button>
                      <button
                        onClick={() => setShootsSubTab('templates')}
                        className={`text-sm font-display font-bold pb-2 border-b-2 transition-all relative ${
                          shootsSubTab === 'templates'
                            ? 'border-sand text-sand'
                            : 'border-transparent opacity-65 hover:opacity-100'
                        }`}
                      >
                        Legal Contract Templates Library ({AGREEMENT_TEMPLATES.length})
                        {shootsSubTab === 'templates' && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sand" />
                        )}
                      </button>
                    </div>

                    {shootsSubTab === 'workspaces' ? (
                      <div className="space-y-6">
                        {/* Search & filters bar */}
                        <div className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between items-center gap-4 ${
                          isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                        }`}>
                          <div className="relative w-full md:max-w-md">
                            <Search className={`absolute left-3 top-2.5 w-4 h-4 ${isDarkMode ? 'text-alabaster/40' : 'text-espresso/40'}`} />
                            <input
                              type="text"
                              id="shoot-search-input"
                              placeholder="Search shoots by title, model, or client name..."
                              value={shootSearch}
                              onChange={(e) => setShootSearch(e.target.value)}
                              className={`w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border focus:outline-none transition-colors ${
                                isDarkMode 
                                  ? 'bg-cocoa-surface-light border-espresso focus:border-sand' 
                                  : 'bg-oatmeal/20 border-sand focus:border-espresso'
                              }`}
                            />
                          </div>

                          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                            {(['All', 'Draft', 'Sent', 'Signed', 'Completed'] as const).map(status => (
                              <button
                                key={status}
                                id={`filter-${status}`}
                                onClick={() => setShootFilter(status)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                  shootFilter === status
                                    ? isDarkMode 
                                      ? 'bg-sand text-cocoa border-sand' 
                                      : 'bg-espresso text-oatmeal border-espresso'
                                    : isDarkMode 
                                      ? 'border-espresso bg-cocoa-surface hover:bg-cocoa-surface-light' 
                                      : 'border-sand bg-white hover:bg-sand/10'
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Shoots Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredShoots.map(shoot => {
                            const relatedAgrees = agreements.filter(a => a.shootId === shoot.id);
                            const signedCount = relatedAgrees.filter(a => a.modelSigned && a.photographerSigned).length;
                            
                            return (
                              <div
                                key={shoot.id}
                                className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 hover:scale-[1.01] transition-all relative ${
                                  isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                                }`}
                              >
                                <div className="space-y-2">
                                  <div className="flex justify-between items-start gap-2">
                                    <span className={`px-2 py-0.5 text-[8px] font-bold font-mono rounded-full ${
                                      shoot.status === 'Signed' || shoot.status === 'Completed'
                                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                        : shoot.status === 'Sent'
                                          ? 'bg-sky-500/10 text-sky-500 border border-sky-500/20'
                                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                    }`}>
                                      {shoot.status.toUpperCase()}
                                    </span>
                                    <span className="text-[10px] opacity-50 font-mono">{shoot.invoiceNumber}</span>
                                  </div>

                                  <h3 className="font-display font-bold text-base tracking-tight truncate">{shoot.title}</h3>
                                  
                                  <div className="space-y-1 text-xs opacity-85">
                                    <p className="truncate"><span className="text-sand font-bold">Model:</span> {shoot.modelName}</p>
                                    <p className="truncate"><span className="text-sand font-bold">Client:</span> {shoot.clientName}</p>
                                    <p className="text-[11px] opacity-70 flex items-center gap-1"><MapPin className="w-3 h-3 text-sand" /> {shoot.location}</p>
                                    <p className="text-[11px] opacity-70 flex items-center gap-1"><Calendar className="w-3 h-3 text-sand" /> {formatDate(shoot.date)}</p>
                                  </div>
                                </div>

                                <div className="border-t border-sand/20 pt-4 flex items-center justify-between">
                                  <div className="text-xs">
                                    <p className="opacity-50">Sealed Releases</p>
                                    <p className="font-bold">{signedCount} / {relatedAgrees.length} Signed</p>
                                  </div>

                                  <button
                                    type="button"
                                    id={`btn-open-shoot-${shoot.id}`}
                                    onClick={() => {
                                      setSelectedShootId(shoot.id);
                                      if (shoot.agreementIds.length > 0) {
                                        setSelectedAgreementId(shoot.agreementIds[0]);
                                      }
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border ${
                                      isDarkMode 
                                        ? 'bg-sand text-cocoa border-sand hover:bg-alabaster' 
                                        : 'bg-espresso text-oatmeal border-espresso hover:bg-espresso/80'
                                    }`}
                                  >
                                    Open Workspace
                                  </button>
                                </div>
                              </div>
                            );
                          })}

                          {filteredShoots.length === 0 && (
                            <div className="md:col-span-3 p-12 text-center rounded-xl border border-dashed text-opacity-60">
                              <p className="text-sm">No photography workspaces found matching search requirements.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Summary details */}
                        <div className={`p-5 rounded-xl border space-y-2 ${
                          isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-[#fcfaf7] border-sand'
                        }`}>
                          <h3 className="font-display font-bold text-lg">South African Legal Boilerplates Checklist</h3>
                          <p className="text-xs opacity-75">
                            Exclusively compiled for Shutterhaus Visuals. These high-fidelity, dual-language and tri-language agreements comply with SA model release standards, property/drone filming regulations (SACAA), and business collaboration protocols. Click any template below to inspect draft wording, swap languages, or instantly initiate a workspace.
                          </p>
                        </div>

                        {/* Templates List Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {AGREEMENT_TEMPLATES.map(tmpl => (
                            <div
                              key={tmpl.id}
                              className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 hover:scale-[1.01] transition-all relative ${
                                isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                              }`}
                            >
                              <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                  <span className="px-2 py-0.5 text-[8px] font-bold font-mono rounded bg-sand/20 text-sand border border-sand/30">
                                    {tmpl.category.toUpperCase()}
                                  </span>
                                  <span className="text-[10px] opacity-60 font-mono">ID: {tmpl.id}</span>
                                </div>

                                <h3 className="font-display font-bold text-base tracking-tight">{tmpl.title}</h3>
                                <p className={`text-xs opacity-75 leading-normal ${isDarkMode ? 'text-alabaster/70' : 'text-espresso/70'}`}>
                                  {tmpl.description}
                                </p>

                                <div className="pt-2 space-y-1.5">
                                  <div className="flex flex-wrap gap-1 items-center">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-sand">Required Inputs:</span>
                                    {tmpl.fieldsRequired.map(f => (
                                      <span key={f} className="text-[9px] px-1.5 py-0.5 rounded bg-sand/10 opacity-80 font-mono">
                                        {f}
                                      </span>
                                    ))}
                                  </div>
                                  <div className="flex gap-2 items-center text-[10px] opacity-75">
                                    <Globe2 className="w-3.5 h-3.5 text-sand" />
                                    <span>Available in: English, Afrikaans, isiZulu</span>
                                  </div>
                                </div>
                              </div>

                              <div className="border-t border-sand/20 pt-4 flex items-center justify-between">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPreviewTemplateId(tmpl.id);
                                    setPreviewLang('en');
                                  }}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                                    isDarkMode 
                                      ? 'border-sand/40 hover:border-sand hover:bg-sand/10 text-sand' 
                                      : 'border-sand hover:bg-sand/10 text-espresso'
                                  }`}
                                >
                                  Preview Legal Text
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewShootSelectedTemplates([tmpl.id]);
                                    setIsCreatingShoot(true);
                                  }}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border ${
                                    isDarkMode 
                                      ? 'bg-sand text-cocoa border-sand hover:bg-alabaster' 
                                      : 'bg-espresso text-oatmeal border-espresso hover:bg-espresso/80'
                                  }`}
                                >
                                  Create Shoot with This
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. MODELS & CLIENTS CONTACTS TAB */}
                {currentTab === 'contacts' && (
                  <div className="space-y-6">
                    <div className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-center gap-4 ${
                      isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                    }`}>
                      <div className="relative w-full sm:max-w-md">
                        <Search className={`absolute left-3 top-2.5 w-4 h-4 ${isDarkMode ? 'text-alabaster/40' : 'text-espresso/40'}`} />
                        <input
                          type="text"
                          id="contact-search-input"
                          placeholder="Search models, clients, and co-signers by name or email..."
                          value={contactSearch}
                          onChange={(e) => setContactSearch(e.target.value)}
                          className={`w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border focus:outline-none transition-colors ${
                            isDarkMode 
                              ? 'bg-cocoa-surface-light border-espresso focus:border-sand' 
                              : 'bg-oatmeal/20 border-sand focus:border-espresso'
                          }`}
                        />
                      </div>

                      <button
                        type="button"
                        id="btn-add-contact-trigger"
                        onClick={() => setIsCreatingContact(true)}
                        className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-display font-semibold transition-all ${
                          isDarkMode ? 'bg-sand text-cocoa' : 'bg-espresso text-oatmeal'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        Register Contact
                      </button>
                    </div>

                    {/* Contacts Directory List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {contacts
                        .filter(c => c.name.toLowerCase().includes(contactSearch.toLowerCase()) || c.email.toLowerCase().includes(contactSearch.toLowerCase()))
                        .map(contact => (
                          <div
                            key={contact.id}
                            className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 ${
                              isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                            }`}
                          >
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className={`px-2 py-0.5 text-[8px] font-bold font-mono rounded-full uppercase ${
                                  contact.type === 'model' 
                                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                                    : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                                }`}>
                                  {contact.type.toUpperCase()}
                                </span>
                                <span className="text-[10px] opacity-40 font-mono">ID: {contact.id}</span>
                              </div>

                              <div>
                                <h3 className="font-display font-bold text-base">{contact.name}</h3>
                                <div className="space-y-1 mt-2 text-xs opacity-85">
                                  <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-sand" /> {contact.email}</p>
                                  {contact.phone && <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-sand" /> {contact.phone}</p>}
                                </div>
                              </div>

                              {contact.isMinor && (
                                <div className={`p-3 rounded-lg border border-dashed text-xs ${isDarkMode ? 'bg-cocoa-surface-light border-espresso' : 'bg-oatmeal/40 border-sand'}`}>
                                  <p className="font-bold text-amber-500">Minor Co-signer Relationship:</p>
                                  <p className="mt-1">Guardian: <strong className="text-sand">{contact.guardianName}</strong> ({contact.guardianRelationship})</p>
                                  {contact.guardianId && <p className="opacity-60 text-[10px]">Guardian SA ID: {contact.guardianId}</p>}
                                </div>
                              )}

                              {contact.notes && (
                                <p className={`text-xs italic leading-relaxed border-t border-sand/20 pt-2 opacity-75 ${isDarkMode ? 'text-alabaster/60' : 'text-espresso/60'}`}>
                                  "{contact.notes}"
                                </p>
                              )}
                            </div>

                            <div className="border-t border-sand/20 pt-4 flex justify-between items-center text-[10px] opacity-70 font-mono">
                              <span>Registered on: {formatDate(contact.createdAt)}</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteContact(contact.id)}
                                className="flex items-center gap-1 text-red-500 hover:text-red-400 font-sans font-bold cursor-pointer transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* 4. VERIFICATION PUBLIC PORTAL TAB */}
                {currentTab === 'verifier' && (
                  <VerificationPortal
                    agreements={agreements}
                    shoots={shoots}
                    isDarkMode={isDarkMode}
                  />
                )}

                {/* 5. SETTINGS TAB */}
                {currentTab === 'settings' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Studio Profile Configuration */}
                    <div className={`p-6 rounded-xl border space-y-4 lg:col-span-2 ${
                      isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                    }`}>
                      <h3 className="font-display font-bold text-base border-b border-sand/30 pb-2">Studio & Photographer Settings</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs block font-semibold mb-1">Photographer Full Name</label>
                          <input
                            type="text"
                            value={userProfile.photographerName}
                            onChange={(e) => setUserProfile({ ...userProfile, photographerName: e.target.value })}
                            className={`w-full p-2 text-xs rounded border focus:outline-none ${
                              isDarkMode ? 'bg-cocoa border-espresso text-alabaster' : 'bg-[#faf6f0] border-sand text-espresso'
                            }`}
                          />
                        </div>

                        <div>
                          <label className="text-xs block font-semibold mb-1">Company / Studio Brand Name</label>
                          <input
                            type="text"
                            value={userProfile.companyName}
                            onChange={(e) => setUserProfile({ ...userProfile, companyName: e.target.value })}
                            className={`w-full p-2 text-xs rounded border focus:outline-none ${
                              isDarkMode ? 'bg-cocoa border-espresso text-alabaster' : 'bg-[#faf6f0] border-sand text-espresso'
                            }`}
                          />
                        </div>

                        {/* Company / Studio Logo Block */}
                        <div className={`sm:col-span-2 border border-dashed p-4 rounded-lg ${
                          isDarkMode ? 'border-espresso bg-cocoa-surface' : 'border-sand bg-[#faf6f0]/20'
                        }`}>
                          <label className="text-xs block font-semibold mb-2">Company / Studio Logo</label>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="relative group/logo cursor-pointer shrink-0">
                              <input
                                type="file"
                                accept="image/*"
                                id="settings-logo-upload"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    const file = e.target.files[0];
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      if (typeof reader.result === 'string') {
                                        setUserProfile({
                                          ...userProfile,
                                          logoUrl: reader.result
                                        });
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                              <label htmlFor="settings-logo-upload" className="cursor-pointer block">
                                {userProfile.logoUrl ? (
                                  <div className="relative w-20 h-20 rounded-lg border border-sand overflow-hidden bg-white flex items-center justify-center shadow-sm">
                                    <img src={userProfile.logoUrl} alt="Studio Logo" className="max-w-full max-h-full object-contain" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/logo:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-semibold">
                                      Change
                                    </div>
                                  </div>
                                ) : (
                                  <div className={`w-20 h-20 rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-center p-2 transition-colors ${
                                    isDarkMode ? 'border-espresso hover:border-sand bg-cocoa' : 'border-sand hover:border-espresso bg-white'
                                  }`}>
                                    <Upload className="w-5 h-5 opacity-50 mb-1" />
                                    <span className="text-[10px] font-sans font-medium opacity-60 leading-tight">Upload Logo</span>
                                  </div>
                                )}
                              </label>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs opacity-70">
                                Upload a high-resolution logo (PNG, JPG, or SVG). 
                              </p>
                              <p className="text-[10px] opacity-50">
                                This logo will automatically be rendered on all professional PDF exports and agreements.
                              </p>
                              {userProfile.logoUrl && (
                                <button
                                  type="button"
                                  onClick={() => setUserProfile({ ...userProfile, logoUrl: '' })}
                                  className="text-[10px] text-red-500 hover:underline cursor-pointer"
                                >
                                  Remove Logo
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs block font-semibold mb-1">Business Email Address</label>
                          <input
                            type="email"
                            value={userProfile.email}
                            onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                            className={`w-full p-2 text-xs rounded border focus:outline-none ${
                              isDarkMode ? 'bg-cocoa border-espresso text-alabaster' : 'bg-[#faf6f0] border-sand text-espresso'
                            }`}
                          />
                        </div>

                        <div>
                          <label className="text-xs block font-semibold mb-1">Phone Number</label>
                          <input
                            type="text"
                            value={userProfile.phone}
                            onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                            className={`w-full p-2 text-xs rounded border focus:outline-none ${
                              isDarkMode ? 'bg-cocoa border-espresso text-alabaster' : 'bg-[#faf6f0] border-sand text-espresso'
                            }`}
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-xs block font-semibold mb-1">Physical Studio Address</label>
                          <input
                            type="text"
                            value={userProfile.address}
                            onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
                            className={`w-full p-2 text-xs rounded border focus:outline-none ${
                              isDarkMode ? 'bg-cocoa border-espresso text-alabaster' : 'bg-[#faf6f0] border-sand text-espresso'
                            }`}
                          />
                        </div>

                        <div>
                          <label className="text-xs block font-semibold mb-1">CIPC Registration Number</label>
                          <input
                            type="text"
                            value={userProfile.registrationNumber}
                            onChange={(e) => setUserProfile({ ...userProfile, registrationNumber: e.target.value })}
                            placeholder="CK 2021/..."
                            className={`w-full p-2 text-xs rounded border focus:outline-none ${
                              isDarkMode ? 'bg-cocoa border-espresso text-alabaster' : 'bg-[#faf6f0] border-sand text-espresso'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Shutterhaus Visuals Instance Info Block */}
                    <div className="space-y-6">
                      <div className={`p-6 rounded-xl border space-y-4 text-center relative overflow-hidden ${
                        isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                      }`}>
                        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                        <h4 className="font-display font-bold text-sm text-sand uppercase tracking-wider">Private Portfolio Toolkit</h4>
                        
                        <div className="py-2">
                          <p className="text-xl font-bold font-display text-emerald-500">Active Instance</p>
                          <p className="text-[11px] opacity-70">Exclusively Licensed to Shutterhaus Visuals</p>
                        </div>

                        <ul className="text-xs space-y-2 text-left list-disc list-inside opacity-90 pl-1">
                          <li>Unlimited Shoot Management & Archives</li>
                          <li>Pre-formatted South African legal language</li>
                          <li>Bespoke QR Code Document Verification</li>
                          <li>Offline-first local secure cache</li>
                          <li>Tamper-proof Cryptographic Signature Audit Trail</li>
                          <li>Dynamic PDF Layout and custom print templates</li>
                        </ul>

                        <div className="pt-2 text-[10px] opacity-50 border-t border-dashed border-sand/40 font-mono">
                          STATUS: FULLY PROVISIONED & ACTIVE
                        </div>
                      </div>

                      {/* Backup Local Storage Data */}
                      <div className={`p-5 rounded-xl border space-y-3 ${
                        isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                      }`}>
                        <h4 className="font-display font-semibold text-xs text-sand">Database Maintenance</h4>
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ shoots, agreements, contacts, auditLogs }));
                                const dlAnchorElem = document.createElement('a');
                                dlAnchorElem.setAttribute("href", dataStr);
                                dlAnchorElem.setAttribute("download", "parchment_backup.json");
                                dlAnchorElem.click();
                              }}
                              className={`flex-1 py-1.5 rounded text-[10px] font-bold border ${
                                isDarkMode ? 'border-espresso bg-cocoa-surface-light hover:text-sand' : 'border-sand bg-oatmeal hover:bg-sand/30'
                              }`}
                            >
                              Export Backup
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("⚠️ Are you sure you want to completely reset the local photography database? This is irreversible.")) {
                                  localStorage.clear();
                                  window.location.reload();
                                }
                              }}
                              className="flex-1 py-1.5 rounded text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
                            >
                              Factory Reset
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm("🧹 Are you sure you want to clear all demo data? This will delete all shoots, agreements, and contacts so you can start with a completely clean, custom slate.")) {
                                setShoots([]);
                                setAgreements([]);
                                setContacts([]);
                                setAuditLogs([]);
                              }
                            }}
                            className="w-full py-1.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 cursor-pointer transition-all"
                          >
                            Clear Demo Data (Blank Slate)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </div>
    </>
  )}

      {/* CORE MODALS & SHEETS */}

      {/* 1. DRAW SIGNATURE MODAL OVERLAY */}
      {signingAgreementId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4 ${
            isDarkMode 
              ? 'bg-cocoa border-espresso text-alabaster' 
              : 'bg-[#faf6f0] border-sand text-espresso'
          }`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-display font-bold text-base">Digital Signature Lock</h3>
                <p className={`text-xs ${isDarkMode ? 'text-alabaster/60' : 'text-espresso/60'}`}>
                  Draw your digital ink signature on the canvas below.
                </p>
              </div>
              <button
                onClick={() => setSigningAgreementId(null)}
                className={`text-xs ${isDarkMode ? 'text-alabaster/50 hover:text-alabaster' : 'text-espresso/50 hover:text-espresso'}`}
              >
                Cancel
              </button>
            </div>

            <SignatureCanvas
              onSave={(sig) => handleSaveSignature(sig)}
              isDarkMode={isDarkMode}
              placeholder="Sketch signature using mouse or finger touch..."
            />
          </div>
        </div>
      )}

      {/* 2. QR CODE MOBILE SIGNING SIMULATOR MODAL */}
      {activeQRModalAgreementId && (() => {
        const ag = agreements.find(a => a.id === activeQRModalAgreementId);
        const sh = ag ? shoots.find(s => s.id === ag.shootId) : null;
        if (!ag || !sh) return null;
        return (
          <QRShareModal
            shootTitle={sh.title}
            agreementTitle={ag.title}
            verificationCode={ag.verificationCode}
            onModelSigned={handleModelSignedViaPortal}
            isMinor={sh.isMinor}
            guardianNamePlaceholder={sh.clientName || ''}
            isDarkMode={isDarkMode}
            onClose={() => setActiveQRModalAgreementId(null)}
          />
        );
      })()}

      {/* 3. REGISTER NEW CONTACT MODAL */}
      {isCreatingContact && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center items-start p-4 md:p-8 animate-fadeIn">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-4 my-4 sm:my-8 ${
            isDarkMode 
              ? 'bg-cocoa border-espresso text-alabaster' 
              : 'bg-[#faf6f0] border-sand text-espresso'
          }`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-display font-bold text-base">Register Contact Profile</h3>
                <p className={`text-xs ${isDarkMode ? 'text-alabaster/60' : 'text-espresso/60'}`}>
                  Save clients or models to pre-fill future shoot agreements.
                </p>
              </div>
              <button
                onClick={() => setIsCreatingContact(false)}
                className={`text-xs ${isDarkMode ? 'text-alabaster/50 hover:text-alabaster' : 'text-espresso/50 hover:text-espresso'}`}
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleAddContact} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs block font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    placeholder="e.g. Zola Dlamini"
                    className={`w-full p-2 text-xs rounded border focus:outline-none ${
                      isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs block font-semibold mb-1">Contact Type</label>
                  <select
                    value={newContactType}
                    onChange={(e) => setNewContactType(e.target.value as any)}
                    className={`w-full p-2 text-xs rounded border focus:outline-none ${
                      isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                    }`}
                  >
                    <option value="model">Model (Likeness Signatory)</option>
                    <option value="client">Client (Service Payer)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs block font-semibold mb-1">Email Address <span className="text-[10px] font-normal opacity-60">(Optional)</span></label>
                  <input
                    type="email"
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    placeholder="email@example.co.za"
                    className={`w-full p-2 text-xs rounded border focus:outline-none ${
                      isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs block font-semibold mb-1">Phone Number <span className="text-[10px] font-normal opacity-60">(Optional)</span></label>
                  <input
                    type="text"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    placeholder="+27 82..."
                    className={`w-full p-2 text-xs rounded border focus:outline-none ${
                      isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                    }`}
                  />
                </div>
              </div>

              {/* Minor toggler */}
              {newContactType === 'model' && (
                <div className="space-y-3 border-t border-sand/20 pt-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="contact-is-minor"
                      checked={newContactIsMinor}
                      onChange={(e) => setNewContactIsMinor(e.target.checked)}
                      className="rounded border-sand focus:ring-0"
                    />
                    <label htmlFor="contact-is-minor" className="text-xs font-bold text-amber-500">
                      Model is under 18 years of age (Minor)
                    </label>
                  </div>

                  {newContactIsMinor && (
                    <div className={`p-4 rounded-xl border space-y-3 ${isDarkMode ? 'bg-cocoa-surface-light border-espresso' : 'bg-[#faf6f0] border-sand'}`}>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-sand">Parent / Guardian Legal Co-Signer Details</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] block font-medium mb-0.5">Parent Full Name</label>
                          <input
                            type="text"
                            value={newContactGuardianName}
                            onChange={(e) => setNewContactGuardianName(e.target.value)}
                            placeholder="e.g. Priya Naidoo"
                            className={`w-full p-1.5 text-xs rounded border focus:outline-none ${
                              isDarkMode ? 'bg-cocoa border-espresso' : 'bg-white border-sand'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] block font-medium mb-0.5">Relationship</label>
                          <select
                            value={newContactGuardianRelationship}
                            onChange={(e) => setNewContactGuardianRelationship(e.target.value)}
                            className={`w-full p-1.5 text-xs rounded border focus:outline-none ${
                              isDarkMode ? 'bg-cocoa border-espresso' : 'bg-white border-sand'
                            }`}
                          >
                            <option value="Mother">Mother</option>
                            <option value="Father">Father</option>
                            <option value="Legal Guardian">Legal Guardian</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-[10px] block font-medium mb-0.5">South African National ID Number</label>
                          <input
                            type="text"
                            value={newContactGuardianId}
                            onChange={(e) => setNewContactGuardianId(e.target.value)}
                            placeholder="SA ID number (13 digits)"
                            className={`w-full p-1.5 text-xs rounded border focus:outline-none ${
                              isDarkMode ? 'bg-cocoa border-espresso' : 'bg-white border-sand'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="text-xs block font-semibold mb-1">Administrative / Styling Notes</label>
                <textarea
                  value={newContactNotes}
                  onChange={(e) => setNewContactNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Wardrobe sizing, makeup sensitivities, styling history..."
                  className={`w-full p-2 text-xs rounded border focus:outline-none resize-none ${
                    isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                  }`}
                />
              </div>

              <button
                type="submit"
                id="btn-register-contact-submit"
                className={`w-full py-2 rounded-lg text-xs font-display font-semibold transition-all ${
                  isDarkMode ? 'bg-sand text-cocoa' : 'bg-espresso text-oatmeal'
                }`}
              >
                Register Contact Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TEMPLATE PREVIEW MODAL */}
      {previewTemplateId && (() => {
        const tmpl = AGREEMENT_TEMPLATES.find(t => t.id === previewTemplateId);
        if (!tmpl) return null;
        const currentText = tmpl.content[previewLang] || tmpl.content['en'];
        
        // Replace placeholders with high-fidelity styled marks
        const renderFormattedContent = (text: string) => {
          const parts = text.split(/(\{\{[^}]+\}\})/g);
          return parts.map((part, index) => {
            if (part.startsWith('{{') && part.endsWith('}}')) {
              const placeholderName = part.substring(2, part.length - 2);
              return (
                <span key={index} className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-sand/20 text-sand border border-sand/30 mx-0.5 inline-block">
                  {placeholderName}
                </span>
              );
            }
            return part;
          });
        };

        return (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 animate-fadeIn">
            <div className={`w-full max-w-2xl rounded-2xl border p-6 shadow-2xl space-y-4 my-8 ${
              isDarkMode 
                ? 'bg-[#1e1b18] border-espresso text-alabaster' 
                : 'bg-[#faf6f0] border-sand text-espresso'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 text-[8px] font-bold font-mono rounded bg-sand/20 text-sand border border-sand/30">
                      {tmpl.category.toUpperCase()}
                    </span>
                    <span className="text-[10px] opacity-60 font-mono">Boilerplate Template</span>
                  </div>
                  <h3 className="font-display font-bold text-base mt-1">{tmpl.title}</h3>
                </div>
                <button
                  onClick={() => setPreviewTemplateId(null)}
                  className={`text-xs p-1 ${isDarkMode ? 'text-alabaster/50 hover:text-alabaster' : 'text-espresso/50 hover:text-espresso'}`}
                >
                  Close
                </button>
              </div>

              {/* Language Selector */}
              <div className="flex border-b border-sand/20 pb-2 gap-4">
                {(['en', 'af', 'zu'] as const).map(lang => {
                  const labels = { en: 'English', af: 'Afrikaans', zu: 'isiZulu' };
                  return (
                    <button
                      key={lang}
                      onClick={() => setPreviewLang(lang)}
                      className={`text-[11px] font-bold pb-1 border-b-2 transition-all ${
                        previewLang === lang
                          ? 'border-sand text-sand font-bold'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      {labels[lang]}
                    </button>
                  );
                })}
              </div>

              {/* Scrollable Content View */}
              <div className={`p-4 rounded-lg border max-h-[350px] overflow-y-auto font-mono text-[11px] leading-relaxed whitespace-pre-wrap ${
                isDarkMode ? 'bg-[#2b2520] border-espresso text-alabaster/90' : 'bg-white border-sand text-espresso/90'
              }`}>
                {renderFormattedContent(currentText)}
              </div>

              {/* Required inputs list helper info */}
              <div className="flex flex-wrap gap-1.5 items-center justify-between text-[11px] pt-1">
                <div className="flex flex-wrap gap-1 items-center">
                  <span className="font-bold text-sand text-[10px] uppercase">Fills automatically:</span>
                  {tmpl.fieldsRequired.map(f => (
                    <span key={f} className="text-[9px] px-1.5 py-0.5 rounded bg-sand/10 opacity-80 font-mono border border-sand/20">
                      {f}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewTemplateId(null)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      isDarkMode ? 'border-espresso hover:bg-white/5' : 'border-sand hover:bg-sand/10'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewShootSelectedTemplates([tmpl.id]);
                      setPreviewTemplateId(null);
                      setIsCreatingShoot(true);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border ${
                      isDarkMode 
                        ? 'bg-sand text-cocoa border-sand hover:bg-alabaster' 
                        : 'bg-espresso text-oatmeal border-espresso hover:bg-espresso/80'
                    }`}
                  >
                    Create Shoot
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 4. CREATE NEW SHOOT WORKSPACE OVERLAY */}
      {isCreatingShoot && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center items-start p-4 md:p-8 animate-fadeIn">
          <div className={`w-full max-w-2xl rounded-2xl border p-6 shadow-2xl space-y-4 my-4 sm:my-8 ${
            isDarkMode 
              ? 'bg-cocoa border-espresso text-alabaster' 
              : 'bg-[#faf6f0] border-sand text-espresso'
          }`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-display font-bold text-base">New Shoot Workspace Setup</h3>
                <p className={`text-xs ${isDarkMode ? 'text-alabaster/60' : 'text-espresso/60'}`}>
                  Configure shoot specs, autofill model details, and select contracts.
                </p>
              </div>
              <button
                onClick={() => setIsCreatingShoot(false)}
                className={`text-xs ${isDarkMode ? 'text-alabaster/50 hover:text-alabaster' : 'text-espresso/50 hover:text-espresso'}`}
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateShoot} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-sand/20 pb-4">
                <div className="space-y-1">
                  <label className="font-semibold block">Shoot Campaign Title</label>
                  <input
                    type="text"
                    required
                    value={newShootTitle}
                    onChange={(e) => setNewShootTitle(e.target.value)}
                    placeholder="e.g. Camps Bay Swimwear Promo"
                    className={`w-full p-2 rounded border focus:outline-none ${
                      isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold block">Shoot Date</label>
                  <input
                    type="date"
                    required
                    value={newShootDate}
                    onChange={(e) => setNewShootDate(e.target.value)}
                    className={`w-full p-2 rounded border focus:outline-none ${
                      isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold block">Shoot Location / Venue</label>
                  <input
                    type="text"
                    value={newShootLocation}
                    onChange={(e) => setNewShootLocation(e.target.value)}
                    placeholder="e.g. Clifton Beach, Cape Town"
                    className={`w-full p-2 rounded border focus:outline-none ${
                      isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-semibold block">Shoot Fee (ZAR)</label>
                    <input
                      type="number"
                      value={newShootPrice}
                      onChange={(e) => setNewShootPrice(Number(e.target.value))}
                      className={`w-full p-2 rounded border focus:outline-none ${
                        isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold block">Deposit (ZAR)</label>
                    <input
                      type="number"
                      value={newShootDeposit}
                      onChange={(e) => setNewShootDeposit(Number(e.target.value))}
                      className={`w-full p-2 rounded border focus:outline-none ${
                        isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Models Profiles & Autosuggestions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-sand/20 pb-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-sand uppercase tracking-wider text-[10px]">Model Contact Info</label>
                    {/* Auto-suggest list */}
                    <select
                      value={newShootModelId}
                      onChange={(e) => handleSelectModel(e.target.value)}
                      className={`p-1 text-[10px] rounded border focus:outline-none max-w-[140px] ${
                        isDarkMode ? 'bg-cocoa border-espresso' : 'bg-white border-sand'
                      }`}
                    >
                      <option value="">-- Auto-fill saved --</option>
                      {contacts.filter(c => c.type === 'model').map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Model Name"
                      required
                      value={newShootModelName}
                      onChange={(e) => setNewShootModelName(e.target.value)}
                      className={`w-full p-2 rounded border focus:outline-none ${
                        isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                      }`}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="email"
                        placeholder="Model Email"
                        value={newShootModelEmail}
                        onChange={(e) => setNewShootModelEmail(e.target.value)}
                        className={`p-2 rounded border focus:outline-none ${
                          isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                        }`}
                      />
                      <input
                        type="text"
                        placeholder="Model Phone"
                        value={newShootModelPhone}
                        onChange={(e) => setNewShootModelPhone(e.target.value)}
                        className={`p-2 rounded border focus:outline-none ${
                          isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                        }`}
                      />
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="checkbox"
                        id="new-shoot-minor-check"
                        checked={newShootModelIsMinor}
                        onChange={(e) => setNewShootModelIsMinor(e.target.checked)}
                        className="rounded border-sand focus:ring-0"
                      />
                      <label htmlFor="new-shoot-minor-check" className="font-bold text-amber-500 text-[10px]">
                        Model is under 18 (Minor Model co-signer required)
                      </label>
                    </div>
                  </div>
                </div>

                {/* Client Profiles & Autofill */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-sand uppercase tracking-wider text-[10px]">Client / Sponsor Info</label>
                    <select
                      value={newShootClientId}
                      onChange={(e) => handleSelectClient(e.target.value)}
                      className={`p-1 text-[10px] rounded border focus:outline-none max-w-[140px] ${
                        isDarkMode ? 'bg-cocoa border-espresso' : 'bg-white border-sand'
                      }`}
                    >
                      <option value="">-- Auto-fill saved --</option>
                      {contacts.filter(c => c.type === 'client').map(cl => (
                        <option key={cl.id} value={cl.id}>{cl.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Sponsoring Brand / Client Name"
                      value={newShootClientName}
                      onChange={(e) => setNewShootClientName(e.target.value)}
                      className={`w-full p-2 rounded border focus:outline-none ${
                        isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                      }`}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="email"
                        placeholder="Client Email"
                        value={newShootClientEmail}
                        onChange={(e) => setNewShootClientEmail(e.target.value)}
                        className={`p-2 rounded border focus:outline-none ${
                          isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                        }`}
                      />
                      <input
                        type="text"
                        placeholder="Client Phone"
                        value={newShootClientPhone}
                        onChange={(e) => setNewShootClientPhone(e.target.value)}
                        className={`p-2 rounded border focus:outline-none ${
                          isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Template Documents selection library checklist */}
              <div className="space-y-2.5">
                <label className="font-bold text-sand uppercase tracking-wider text-[10px] block">Agreement Contracts Library Checklist</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {AGREEMENT_TEMPLATES.map(tmpl => {
                    const isChecked = newShootSelectedTemplates.includes(tmpl.id);
                    return (
                      <div
                        key={tmpl.id}
                        onClick={() => {
                          if (isChecked) {
                            setNewShootSelectedTemplates(prev => prev.filter(id => id !== tmpl.id));
                          } else {
                            setNewShootSelectedTemplates(prev => [...prev, tmpl.id]);
                          }
                        }}
                        className={`p-3 rounded-lg border cursor-pointer flex items-start gap-2.5 transition-all ${
                          isChecked 
                            ? 'border-sand bg-sand/10' 
                            : 'border-sand/40 hover:border-sand'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by parent onClick
                          className="rounded border-sand text-espresso mt-0.5 shrink-0"
                        />
                        <div className="space-y-0.5">
                          <p className="font-bold text-[11px] leading-tight">{tmpl.title}</p>
                          <p className={`text-[10px] leading-normal opacity-70 ${isDarkMode ? 'text-alabaster/60' : 'text-espresso/60'}`}>{tmpl.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Advanced notes */}
              <div>
                <label className="font-semibold block mb-1">Administrative notes / Special legal clauses</label>
                <textarea
                  value={newShootNotes}
                  onChange={(e) => setNewShootNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Deliverable files specs, weather conditions delay policy..."
                  className={`w-full p-2 rounded border focus:outline-none resize-none ${
                    isDarkMode ? 'bg-cocoa-surface border-espresso' : 'bg-white border-sand'
                  }`}
                />
              </div>

              <button
                type="submit"
                id="btn-create-shoot-submit"
                className={`w-full py-3 rounded-xl font-display font-semibold transition-all shadow-md ${
                  isDarkMode ? 'bg-sand text-cocoa' : 'bg-espresso text-oatmeal'
                }`}
              >
                Assemble Shoot Workspace
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

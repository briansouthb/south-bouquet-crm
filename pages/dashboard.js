// pages/dashboard.js
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';

// Sample data for initial setup before Google Sheet is connected
const SAMPLE_CLIENTS = [
  {
    clientName: 'Simon Data',
    industry: 'B2B SaaS',
    location: 'New York, NY',
    contactPerson: 'Jason Davis',
    contactEmail: 'jason@simondata.com',
    spousePartner: 'Rachel',
    startDate: '2023-06',
    engagementType: 'Fractional CFO',
    monthlyRevenue: '8500',
    accountingMethod: 'Accrual',
    keySystems: 'QuickBooks Online, Stripe, Salesforce',
    relationshipStage: 'Active Client',
    financialHealth: 'Green',
    currentInitiatives: 'Investment banking process, financial model assumptions',
    pastInitiatives: 'Series A close, revenue recognition policy',
    keyGoals: 'Prepare for Series B fundraise',
    notes: '',
    driveFolderLink: '',
    emailSummary: '',
    autoFilledFields: '',
  },
  {
    clientName: 'Aquavoss Inc',
    industry: 'D2C / Consumer Products',
    location: 'Miami, FL',
    contactPerson: 'Marcus Chen',
    contactEmail: 'marcus@aquavoss.com',
    spousePartner: 'Lisa',
    startDate: '2023-09',
    engagementType: 'Monthly Financial Reporting',
    monthlyRevenue: '5000',
    accountingMethod: 'Accrual',
    keySystems: 'QuickBooks Online, Shopify, Stripe',
    relationshipStage: 'Active Client',
    financialHealth: 'Yellow',
    currentInitiatives: 'Monthly presentation deck, margin analysis',
    pastInitiatives: 'Chart of accounts restructure',
    keyGoals: 'Improve gross margins to 60%+',
    notes: '',
    driveFolderLink: '',
    emailSummary: '',
    autoFilledFields: '',
  },
  {
    clientName: 'Judith Creative',
    industry: 'Creative Services',
    location: 'Brooklyn, NY',
    contactPerson: 'Judith Amara',
    contactEmail: 'judith@judithcreative.com',
    spousePartner: '',
    startDate: '2024-01',
    engagementType: 'Bookkeeping + FP&A',
    monthlyRevenue: '3500',
    accountingMethod: 'Cash',
    keySystems: 'QuickBooks Online',
    relationshipStage: 'Active Client',
    financialHealth: 'Green',
    currentInitiatives: 'Chart of accounts setup, monthly close process',
    pastInitiatives: '',
    keyGoals: 'Establish proper financial infrastructure',
    notes: 'New client onboarding in progress',
    driveFolderLink: '',
    emailSummary: '',
    autoFilledFields: '',
  },
  {
    clientName: 'Meridian Real Estate',
    industry: 'Real Estate',
    location: 'Jersey City, NJ',
    contactPerson: 'David Park',
    contactEmail: 'david@meridianre.com',
    spousePartner: 'Soo-Jin',
    startDate: '2022-11',
    engagementType: 'Fractional CFO',
    monthlyRevenue: '10000',
    accountingMethod: 'Accrual',
    keySystems: 'QuickBooks Online, AppFolio',
    relationshipStage: 'Active Client',
    financialHealth: 'Green',
    currentInitiatives: 'Property acquisition modeling, investor reporting',
    pastInitiatives: 'Fund I close, waterfall restructure',
    keyGoals: 'Launch Fund II by Q3',
    notes: '',
    driveFolderLink: '',
    emailSummary: '',
    autoFilledFields: '',
  },
  {
    clientName: 'BrightPath Learning',
    industry: 'EdTech / SaaS',
    location: 'Austin, TX',
    contactPerson: 'Sarah Kim',
    contactEmail: 'sarah@brightpath.io',
    spousePartner: 'Tom',
    startDate: '2023-03',
    engagementType: 'FP&A Advisory',
    monthlyRevenue: '6000',
    accountingMethod: 'Accrual',
    keySystems: 'QuickBooks Online, Stripe, HubSpot',
    relationshipStage: 'Active Client',
    financialHealth: 'Green',
    currentInitiatives: 'Board deck preparation, ARR forecasting',
    pastInitiatives: 'Pricing model analysis, CAC/LTV framework',
    keyGoals: 'Hit $5M ARR by year-end',
    notes: '',
    driveFolderLink: '',
    emailSummary: '',
    autoFilledFields: '',
  },
  {
    clientName: 'Coastal Wellness Co',
    industry: 'Health & Wellness / D2C',
    location: 'San Diego, CA',
    contactPerson: 'Amy Torres',
    contactEmail: 'amy@coastalwellness.com',
    spousePartner: 'Mike',
    startDate: '2024-02',
    engagementType: 'Bookkeeping',
    monthlyRevenue: '2500',
    accountingMethod: 'Cash',
    keySystems: 'QuickBooks Online, Shopify',
    relationshipStage: 'Onboarding',
    financialHealth: 'Yellow',
    currentInitiatives: 'QBO cleanup, historical reconciliation',
    pastInitiatives: '',
    keyGoals: 'Clean books for potential investor conversations',
    notes: 'Referred by Judith Creative',
    driveFolderLink: '',
    emailSummary: '',
    autoFilledFields: '',
  },
  {
    clientName: 'Nexus Ventures',
    industry: 'Venture Capital',
    location: 'New York, NY',
    contactPerson: 'Robert Stein',
    contactEmail: 'robert@nexusvc.com',
    spousePartner: 'Diana',
    startDate: '2023-08',
    engagementType: 'Fund Accounting',
    monthlyRevenue: '7500',
    accountingMethod: 'Accrual',
    keySystems: 'QuickBooks Online, Carta',
    relationshipStage: 'Active Client',
    financialHealth: 'Green',
    currentInitiatives: 'K-1 preparation, quarterly LP reporting',
    pastInitiatives: 'Fund formation accounting setup',
    keyGoals: 'Streamline LP reporting cadence',
    notes: '',
    driveFolderLink: '',
    emailSummary: '',
    autoFilledFields: '',
  },
  {
    clientName: 'Opal Studios',
    industry: 'Media / Entertainment',
    location: 'Los Angeles, CA',
    contactPerson: 'Nina Alvarez',
    contactEmail: 'nina@opalstudios.com',
    spousePartner: '',
    startDate: '2023-12',
    engagementType: 'Fractional CFO',
    monthlyRevenue: '9000',
    accountingMethod: 'Accrual',
    keySystems: 'QuickBooks Online, Wrapbook',
    relationshipStage: 'Active Client',
    financialHealth: 'Red',
    currentInitiatives: 'Cash flow forecasting, vendor payment restructure',
    pastInitiatives: 'Production budget templates',
    keyGoals: 'Resolve cash flow gap before Q2 production',
    notes: 'Needs immediate attention on AP aging',
    driveFolderLink: '',
    emailSummary: '',
    autoFilledFields: '',
  },
];

const HEALTH_COLORS = { Green: '#2e7d32', Yellow: '#f9a825', Red: '#c62828' };
const STAGES = ['All', 'Active Client', 'Onboarding', 'Prospect', 'Paused', 'Churned'];

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [useSheetData, setUseSheetData] = useState(false);
  const [mobileShowDetail, setMobileShowDetail] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/');
  }, [status, router]);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/clients');
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setClients(data);
          setUseSheetData(true);
        } else {
          setClients(SAMPLE_CLIENTS);
        }
      } else {
        setClients(SAMPLE_CLIENTS);
      }
    } catch {
      setClients(SAMPLE_CLIENTS);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (session) fetchClients();
  }, [session, fetchClients]);

  const filteredClients = clients.filter(c => {
    const matchSearch =
      c.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      c.industry?.toLowerCase().includes(search.toLowerCase()) ||
      c.contactPerson?.toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === 'All' || c.relationshipStage === stageFilter;
    return matchSearch && matchStage;
  });

  function selectClient(client) {
    setSelectedClient(client);
    setEditing(false);
    setEditData(client);
    setMobileShowDetail(true);
  }

  function handleEdit(key, value) {
    setEditData(prev => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (useSheetData) {
        const res = await fetch(`/api/clients/${encodeURIComponent(selectedClient.clientName)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editData),
        });
        if (!res.ok) throw new Error('Save failed');
      }
      // Update local state
      setClients(prev => prev.map(c => c.clientName === selectedClient.clientName ? editData : c));
      setSelectedClient(editData);
      setEditing(false);
    } catch (err) {
      alert('Error saving: ' + err.message);
    }
    setSaving(false);
  }

  async function handleSync() {
    setSyncing(true);
    try {
      const res = await fetch('/api/sync', { method: 'POST' });
      if (res.ok) {
        await fetchClients();
        alert('Sync complete! Client data refreshed.');
      } else {
        alert('Sync encountered an error. Check your Google integrations.');
      }
    } catch {
      alert('Sync failed. Make sure your Google services are configured.');
    }
    setSyncing(false);
  }

  if (status === 'loading' || loading) {
    return <div className="loading-screen"><div className="spinner" /><p>Loading CRM...</p></div>;
  }

  if (!session) return null;

  const FIELDS = [
    { key: 'clientName', label: 'Client Name', readonly: true },
    { key: 'industry', label: 'Industry' },
    { key: 'location', label: 'Location' },
    { key: 'contactPerson', label: 'Contact Person' },
    { key: 'contactEmail', label: 'Contact Email' },
    { key: 'spousePartner', label: 'Spouse / Partner' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'engagementType', label: 'Engagement Type' },
    { key: 'monthlyRevenue', label: 'Monthly Revenue ($)' },
    { key: 'accountingMethod', label: 'Accounting Method' },
    { key: 'keySystems', label: 'Key Systems' },
    { key: 'relationshipStage', label: 'Relationship Stage', type: 'select', options: STAGES.slice(1) },
    { key: 'financialHealth', label: 'Financial Health', type: 'select', options: ['Green', 'Yellow', 'Red'] },
    { key: 'currentInitiatives', label: 'Current Initiatives', type: 'textarea' },
    { key: 'pastInitiatives', label: 'Past Initiatives', type: 'textarea' },
    { key: 'keyGoals', label: 'Key Goals', type: 'textarea' },
    { key: 'notes', label: 'Notes', type: 'textarea' },
  ];

  const autoFilled = selectedClient?.autoFilledFields ? selectedClient.autoFilledFields.split(',') : [];

  return (
    <div className="dashboard">
      {/* HEADER */}
      <header className="header">
        <div className="header-left">
          <span className="header-logo">SB</span>
          <h1 className="header-title">South Bouquet CRM</h1>
        </div>
        <div className="header-right">
          <button
            className={`sync-button ${syncing ? 'syncing' : ''}`}
            onClick={handleSync}
            disabled={syncing}
          >
            {syncing ? 'Syncing...' : '↻ Sync Data'}
          </button>
          <span className="header-email">{session.user.email}</span>
          <button className="signout-button" onClick={() => signOut()}>Sign Out</button>
        </div>
      </header>

      <div className="main-content">
        {/* LEFT PANEL - CLIENT LIST */}
        <aside className={`sidebar ${mobileShowDetail ? 'mobile-hidden' : ''}`}>
          <div className="sidebar-controls">
            <input
              className="search-input"
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="filter-select"
              value={stageFilter}
              onChange={e => setStageFilter(e.target.value)}
            >
              {STAGES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="client-list">
            {filteredClients.map(client => (
              <div
                key={client.clientName}
                className={`client-card ${selectedClient?.clientName === client.clientName ? 'selected' : ''}`}
                onClick={() => selectClient(client)}
              >
                <div className="client-card-top">
                  <h3 className="client-card-name">{client.clientName}</h3>
                  <span
                    className="health-dot"
                    style={{ backgroundColor: HEALTH_COLORS[client.financialHealth] || '#999' }}
                    title={client.financialHealth || 'Unknown'}
                  />
                </div>
                <p className="client-card-type">{client.engagementType}</p>
                <div className="client-card-bottom">
                  <span className="client-card-stage">{client.relationshipStage}</span>
                  {client.monthlyRevenue && (
                    <span className="client-card-revenue">
                      ${Number(client.monthlyRevenue).toLocaleString()}/mo
                    </span>
                  )}
                </div>
              </div>
            ))}
            {filteredClients.length === 0 && (
              <p className="no-results">No clients match your search.</p>
            )}
          </div>

          <div className="sidebar-footer">
            <span className="client-count">{filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''}</span>
            {!useSheetData && <span className="sample-badge">Sample Data</span>}
          </div>
        </aside>

        {/* RIGHT PANEL - CLIENT DETAIL */}
        <main className={`detail-panel ${!mobileShowDetail ? 'mobile-hidden' : ''}`}>
          {!selectedClient ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h2>Select a client</h2>
              <p>Choose a client from the list to view their details.</p>
            </div>
          ) : (
            <>
              {/* Mobile back button */}
              <button className="back-button" onClick={() => setMobileShowDetail(false)}>
                ← Back to list
              </button>

              <div className="detail-header">
                <div>
                  <h2 className="detail-name">{selectedClient.clientName}</h2>
                  <p className="detail-industry">{selectedClient.industry} · {selectedClient.location}</p>
                </div>
                <div className="detail-actions">
                  {editing ? (
                    <>
                      <button className="save-button" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button className="cancel-button" onClick={() => { setEditing(false); setEditData(selectedClient); }}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button className="edit-button" onClick={() => setEditing(true)}>
                      ✏️ Edit
                    </button>
                  )}
                </div>
              </div>

              <div className="detail-grid">
                {FIELDS.map(field => {
                  const isAutoFilled = autoFilled.includes(field.key);
                  const value = editing ? (editData[field.key] || '') : (selectedClient[field.key] || '');

                  return (
                    <div
                      key={field.key}
                      className={`detail-field ${field.type === 'textarea' ? 'full-width' : ''} ${isAutoFilled ? 'auto-filled' : ''}`}
                    >
                      <label className="field-label">
                        {field.label}
                        {isAutoFilled && <span className="auto-badge">⚠️ Auto-filled</span>}
                      </label>
                      {editing && !field.readonly ? (
                        field.type === 'textarea' ? (
                          <textarea
                            className="field-textarea"
                            value={value}
                            onChange={e => handleEdit(field.key, e.target.value)}
                            rows={3}
                          />
                        ) : field.type === 'select' ? (
                          <select
                            className="field-select"
                            value={value}
                            onChange={e => handleEdit(field.key, e.target.value)}
                          >
                            {field.options.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            className="field-input"
                            type="text"
                            value={value}
                            onChange={e => handleEdit(field.key, e.target.value)}
                          />
                        )
                      ) : (
                        <p className="field-value">{value || '—'}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* EMAIL SUMMARY */}
              {selectedClient.emailSummary && (
                <div className="info-section">
                  <h3 className="section-title">📧 Recent Email Summary</h3>
                  <p className="section-content">{selectedClient.emailSummary}</p>
                </div>
              )}

              {/* DRIVE FOLDER */}
              {selectedClient.driveFolderLink && (
                <div className="info-section">
                  <h3 className="section-title">📁 Client Folder</h3>
                  <a
                    href={selectedClient.driveFolderLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="folder-link"
                  >
                    Open in Google Drive →
                  </a>
                </div>
              )}

              {/* LAST SYNCED */}
              {selectedClient.lastSynced && (
                <p className="last-synced">Last synced: {selectedClient.lastSynced}</p>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

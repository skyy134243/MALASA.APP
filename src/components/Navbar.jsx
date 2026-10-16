import React from 'react';

export default function Navbar({ activeTab, setActiveTab, binCount }) {
  const tabs = [
    { id: 'edge-iot', label: '1. Physical & Edge IoT Simulator' },
    { id: 'gatekeeper-ai', label: '2. Gatekeeper AI Vision' },
    { id: 'predictive', label: '3. Predictive Analytics (LSTM)' },
    { id: 'routing', label: '4. Maggot Logistics & Smart Routing' },
    { id: 'dlh-economy', label: '5. DLH & Circular Economy' },
    { id: 'blueprint', label: '6. Blueprint & Jury Defense' },
  ];

  return (
    <>
      <header className="app-header">
        <div className="brand-wrapper">
          <div className="brand-badge">MALASA</div>
          <div>
            <div className="brand-title">Malasa.App Core Platform</div>
            <div className="brand-subtitle">Smart Communal Bin • Gatekeeper AI • Cloud SaaS Ecosystem</div>
          </div>
        </div>
        <div className="header-status-pills">
          <div className="status-pill">
            <span className="status-dot active"></span> Edge IoT: <strong>{binCount} Tong Aktif</strong>
          </div>
          <div className="status-pill">
            <span className="status-dot active"></span> Gatekeeper AI: <strong>Online</strong>
          </div>
          <div className="status-pill">
            <span className="status-dot active"></span> Pilot: <strong>KSKM UNEJ / Jember</strong>
          </div>
        </div>
      </header>

      <nav className="app-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </>
  );
}

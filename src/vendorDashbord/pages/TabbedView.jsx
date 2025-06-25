import React, { useState } from 'react';

import Invoice from './Invoice';
import LTA from './LTA';
import Proforma from './Proforma';
import Receipts from './Receipts';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';


// Define tabs with correct component references
const tabs = [
  { id: 'invoice',   label: 'INVOICE',   Component: Invoice  },
  { id: 'lta',       label: 'LTA',       Component: LTA      },
  { id: 'proforma',  label: 'PROFORMA',  Component: Proforma },
  { id: 'receipts',  label: 'RECEIPTS',  Component: Receipts }
];

// Main tab component
const TabbedView = () => {
  const [activeTab, setActiveTab] = useState('invoice');
  const ActiveComponent = tabs.find(t => t.id === activeTab).Component;

  // Handler for creating invoice
  const handleCreateInvoice = () => {
    // TODO: open create-invoice modal or navigate to invoice creation page
    console.log('Create Invoice clicked');
  };

  return (
    <>
    <NavBar />
      <SideBar />
    <main id="main" className="main">
    <div className="container mt-4">
      <ul className="nav nav-tabs">
        {tabs.map(tab => (
          <li className="nav-item" key={tab.id}>
            <button
              className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="tab-content p-4 border border-top-0">
        {activeTab === 'invoice' && (
          <div className="mb-3">
            <button className="btn btn-primary" onClick={handleCreateInvoice}>
              Create Invoice
            </button>
          </div>
        )}
        <ActiveComponent />
      </div>
    </div>
    </main>
    <Footer />
    </>
    
  );
};

export default TabbedView;

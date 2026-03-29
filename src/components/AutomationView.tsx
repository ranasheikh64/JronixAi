import React from 'react';
import { Play, Plus, Settings, Zap } from 'lucide-react';
import styles from './ChatWindow.module.css'; // Reuse some styles

const AutomationView: React.FC = () => {
  const automations = [
    { name: 'Daily SEO Report', desc: 'Analyzes top 10 keywords daily', status: 'Active' },
    { name: 'Git Commit Summarizer', desc: 'Summarizes repo changes via AI', status: 'Paused' },
  ];

  return (
    <div className={styles.messageList} style={{ padding: '40px' }}>
      <header style={{ marginBottom: '32px' }}>
        <h2 className="display-font" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Automations</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your AI-powered background tasks.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {automations.map((a, i) => (
          <div key={i} className="glass-panel" style={{ padding: '24px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <Zap size={20} color="var(--accent-primary)" />
              <span style={{ fontSize: '0.7rem', background: 'var(--accent-glow)', padding: '2px 8px', borderRadius: '4px', color: 'var(--accent-primary)' }}>{a.status}</span>
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{a.name}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>{a.desc}</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Play size={14} /> Run Now
              </button>
              <button className="btn-icon" style={{ width: '32px', height: '32px' }}>
                <Settings size={14} />
              </button>
            </div>
          </div>
        ))}
        
        <button className="glass-panel flex-center" style={{ borderStyle: 'dashed', minHeight: '180px', cursor: 'pointer', transition: 'all 0.2s' }}>
          <div style={{ textAlign: 'center' }}>
            <Plus size={32} color="var(--text-tertiary)" style={{ marginBottom: '12px' }} />
            <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>New Automation</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AutomationView;

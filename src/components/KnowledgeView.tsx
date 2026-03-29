import React from 'react';
import { BookOpen, Search, Plus, FileText, LayoutGrid } from 'lucide-react';
import styles from './ChatWindow.module.css';

const KnowledgeView: React.FC = () => {
  const knowledgeItems = [
    { title: 'Project Specs', tags: ['Specs', 'Architecture'], size: '12 KB' },
    { title: 'API Documentation', tags: ['API', 'Endpoints'], size: '45 KB' },
    { title: 'Market Analysis 2024', tags: ['Market', 'Analysis'], size: '1.2 MB' },
  ];

  return (
    <div className={styles.messageList} style={{ padding: '40px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h2 className="display-font" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Knowledge Base</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Centralize all facts and information.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="glass-panel" style={{ padding: '8px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Search size={16} color="var(--text-tertiary)" />
            <input 
              placeholder="Search knowledge..." 
              style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '0.9rem' }}
            />
          </div>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={16} /> New Item
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <button className="btn-icon" style={{ padding: '0 12px', width: 'auto', display: 'flex', gap: '8px', fontSize: '0.85rem' }}>
          <LayoutGrid size={14} /> Grid
        </button>
        <button className="btn-icon" style={{ padding: '0 12px', width: 'auto', display: 'flex', gap: '8px', fontSize: '0.85rem' }}>
          <FileText size={14} /> List
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {knowledgeItems.map((item, i) => (
          <div key={i} className="glass-panel" style={{ padding: '20px', cursor: 'pointer', transition: 'all 0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--bg-card-hover)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={20} color="var(--accent-secondary)" />
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{item.size}</span>
            </div>
            <h3 style={{ fontSize: '1rem', marginBottom: '12px', color: 'var(--text-primary)' }}>{item.title}</h3>
            <div style={{ display: 'flex', gap: '6px' }}>
              {item.tags.map((t, j) => (
                <span key={j} style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-tertiary)' }}>#{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeView;

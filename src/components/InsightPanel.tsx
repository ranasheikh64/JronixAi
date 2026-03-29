import React from 'react';
import { useChat } from '../context/ChatContext';
import { Activity, Shield, Cpu, Code, Search, Image as ImageIcon, Brain } from 'lucide-react';
import styles from './InsightPanel.module.css';

const InsightPanel: React.FC = () => {
  const { messages, activeModel, memoryItems } = useChat();
  
  const stats = [
    { label: 'Messages', value: messages.length, sub: `+${messages.filter(m => m.timestamp === new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })).length} this session`, color: 'var(--status-green)' },
    { label: 'Tokens', value: (messages.reduce((acc, m) => acc + m.content.length, 0) * 1.2).toFixed(0), sub: 'est. used', color: 'var(--status-gold)' },
  ];

  const capabilities = [
    { name: 'Code Engine', icon: <Code size={14} />, status: 'Optimized', active: true },
    { name: 'Web Search', icon: <Search size={14} />, status: 'Available', active: true },
    { name: 'Image Gen', icon: <ImageIcon size={14} />, status: 'Ready', active: true },
  ];

  const memory = memoryItems.length > 0 ? memoryItems : [
    'User prefers TypeScript',
    'Dark mode by default',
  ];

  return (
    <aside className={styles.insightPanel}>
      <header className={styles.header}>
        <Activity size={16} className={styles.headerIcon} />
        <h2 className="display-font">Session Insight</h2>
      </header>

      <section className={styles.section}>
        <div className={styles.statsGrid}>
          {stats.map((s, i) => (
            <div key={i} className={styles.statCard}>
              <span className={styles.statLabel}>{s.label}</span>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statSub} style={{ color: s.color }}>{s.sub}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>CAPABILITIES</h3>
        <div className={styles.capList}>
          {capabilities.map((c, i) => (
            <div key={i} className={`${styles.capItem} ${!c.active ? styles.inactive : ''}`}>
               <div className={styles.capIcon}>{c.icon}</div>
               <div className={styles.capInfo}>
                 <span className={styles.capName}>{c.name}</span>
                 <span className={styles.capStatus}>{c.status}</span>
               </div>
               <div className={`${styles.indicator} ${c.active ? styles.activeInd : ''}`} />
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>AI MEMORY</h3>
          <Shield size={12} className={styles.shield} />
        </header>
        <div className={styles.memoryList}>
          {memory.map((m, i) => (
            <div key={i} className={styles.memoryItem}>
              <Brain size={12} />
              <span>{m}</span>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.footer}>
        <div className={styles.systemStatus}>
          <Cpu size={14} />
          <div className={styles.statusInfo}>
            <span className={styles.modelName}>{activeModel}</span>
            <span className={styles.latency}>Latency: 120ms</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default InsightPanel;

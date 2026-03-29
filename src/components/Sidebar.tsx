import React from 'react';
import { LayoutDashboard, MessageSquare, Database, Settings, Plus, History, Trash2, Zap } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import styles from './Sidebar.module.css';

const Sidebar: React.FC = () => {
  const { messages, clearHistory, activeTab, setActiveTab } = useChat();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <Zap size={20} fill="var(--accent-primary)" />
        </div>
        <div className={styles.brandInfo}>
          <h1 className="display-font">Jronix AI</h1>
          <span>Pro Assistant</span>
        </div>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navSection}>
          <span className={styles.sectionTitle}>WORKSPACE</span>
          <button 
            className={`${styles.navItem} ${activeTab === 'chat' ? styles.active : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageSquare size={18} />
            Chat
            <span className={styles.badge}>Live</span>
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'automation' ? styles.active : ''}`}
            onClick={() => setActiveTab('automation')}
          >
            <LayoutDashboard size={18} />
            Automations
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'knowledge' ? styles.active : ''}`}
            onClick={() => setActiveTab('knowledge')}
          >
            <Database size={18} />
            Knowledge
          </button>
        </div>

        <div className={styles.navSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>RECENT CHATS</span>
            <button className={styles.newChatBtn} onClick={() => window.location.reload()}>
              <Plus size={14} />
            </button>
          </div>
          <div className={styles.historyList}>
            {messages.length === 0 ? (
              <div className={styles.emptyHistory}>No recent chats</div>
            ) : (
              messages.filter(m => m.role === 'user').slice(-5).reverse().map((m) => (
                <div key={m.id} className={styles.historyItem}>
                  <History size={14} />
                  <span className={styles.historyText}>{m.content}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </nav>

      <div className={styles.footer}>
        <div className={styles.userCard}>
          <div className={styles.avatar}>R</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Rafi Dev</span>
            <span className={styles.userStatus}>Online</span>
          </div>
          <div className={styles.statusDot} />
        </div>
        
        <div className={styles.footerActions}>
          <button className={styles.actionBtn} title="Settings">
            <Settings size={18} />
          </button>
          <button className={styles.actionBtn} title="Clear All" onClick={clearHistory}>
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

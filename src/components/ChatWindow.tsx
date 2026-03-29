import React, { useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import Message from './Message';
import InputArea from './InputArea';
import { Sparkles, Info, ShieldCheck, Zap, Database } from 'lucide-react';
import styles from './ChatWindow.module.css';
import AutomationView from './AutomationView';
import KnowledgeView from './KnowledgeView';

const ChatWindow: React.FC = () => {
  const { messages, isLoading, isGeneratingImage, error, activeModel, activeTab } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      // Also scroll parent if needed
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading, isGeneratingImage]);

  const renderContent = () => {
    switch (activeTab) {
      case 'automation':
        return <AutomationView />;
      case 'knowledge':
        return <KnowledgeView />;
      default:
        return (
          <>
            <div className={styles.messageList} ref={scrollRef}>
              {messages.length === 0 ? (
                <div className={styles.welcome}>
                   {/* ... welcome card ... */}
                   <div className={styles.welcomeCard}>
                    <div className={styles.welcomeIcon}>
                      <Sparkles size={32} />
                    </div>
                    <h3 className="display-font">Welcome to Jronix AI</h3>
                    <p>How can I assist your workflow today?</p>
                    <div className={styles.capabilities}>
                      <div className={styles.cap}>Advanced Reasoning</div>
                      <div className={styles.cap}>Code Generation</div>
                      <div className={styles.cap}>Image Creation</div>
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <Message 
                    key={msg.id} 
                    role={msg.role} 
                    content={msg.content} 
                    timestamp={msg.timestamp}
                    imageUrl={msg.imageUrl}
                  />
                ))
              )}

              {(isLoading || isGeneratingImage) && (
                <div className={styles.typing}>
                  <div className={styles.typingDot} />
                  <div className={styles.typingDot} />
                  <div className={styles.typingDot} />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginLeft: '8px' }}>
                    {isGeneratingImage ? 'Generating image...' : 'AI is thinking...'}
                  </span>
                </div>
              )}

              {error && (
                <div className={styles.errorBanner}>
                  <p>{error}</p>
                </div>
              )}
            </div>
            <InputArea />
          </>
        );
    }
  };

  return (
    <main className={styles.chatWindow}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconBox}>
             {activeTab === 'chat' && <Sparkles size={20} className={styles.icon} />}
             {activeTab === 'automation' && <Zap size={20} className={styles.icon} />}
             {activeTab === 'knowledge' && <Database size={20} className={styles.icon} />}
          </div>
          <div className={styles.titleArea}>
            <h2 className="display-font">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <div className={styles.modelStatus}>
              <span className={styles.activeLabel}>AI Model: </span>
              <span className={styles.modelName}>{activeModel}</span>
              <div className={styles.dot} />
            </div>
          </div>
        </div>
        
        <div className={styles.headerRight}>
          <button className={styles.utilityBtn} title="Session Info">
            <Info size={18} />
          </button>
          <button className={styles.utilityBtn} title="Encrypted Connection">
            <ShieldCheck size={18} />
          </button>
        </div>
      </header>

      {renderContent()}
    </main>
  );
};

export default ChatWindow;

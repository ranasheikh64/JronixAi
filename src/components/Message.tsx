import React from 'react';
import { User, Cpu, Copy, Check, RotateCcw } from 'lucide-react';
import styles from './Message.module.css';

interface MessageProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  imageUrl?: string;
}

const Message: React.FC<MessageProps> = ({ role, content, timestamp, imageUrl }) => {
  const [copied, setCopied] = React.useState(false);
  const isAssistant = role === 'assistant';

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`${styles.messageWrapper} ${isAssistant ? styles.assistant : styles.user}`}>
      <div className={styles.avatar}>
        {isAssistant ? <Cpu size={16} /> : <User size={16} />}
      </div>
      
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <span className={styles.roleName}>{isAssistant ? 'Jronix AI' : 'You'}</span>
          <span className={styles.time}>{timestamp}</span>
        </div>
        
        <div className={styles.bubble}>
          {imageUrl && (
            <div className={styles.imageContainer}>
              <img src={imageUrl} alt="AI Generated" className={styles.generatedImage} />
            </div>
          )}
          {content.split('```').map((block, i) => {
            if (i % 2 === 1) {
              // Simple code block rendering
              const lines = block.split('\n');
              const lang = lines[0].trim();
              const code = lines.slice(1).join('\n').trim();
              return (
                <div key={i} className={styles.codeBlock}>
                  <div className={styles.codeHeader}>
                    <span>{lang || 'code'}</span>
                    <button onClick={() => navigator.clipboard.writeText(code)} className={styles.codeCopy}>
                      <Copy size={12} />
                    </button>
                  </div>
                  <pre><code>{code}</code></pre>
                </div>
              );
            }
            return <p key={i} className={styles.text}>{block}</p>;
          })}
        </div>
        
        {isAssistant && (
          <div className={styles.actions}>
            <button className={styles.actionBtn} onClick={handleCopy} title="Copy response">
              {copied ? <Check size={14} className={styles.checkIcon} /> : <Copy size={14} />}
            </button>
            <button className={styles.actionBtn} title="Regenerate">
              <RotateCcw size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;

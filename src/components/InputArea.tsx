import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, ChevronDown, Paperclip, X, Settings2, Image as ImageIcon, Wand2 } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import styles from './InputArea.module.css';

const InputArea: React.FC = () => {
  const [text, setText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const { 
    sendMessage, generateAIImage, analyzeAIImage, 
    isLoading, isGeneratingImage, activeModel, models, setActiveModel,
    selectedFile, setSelectedFile, imagePreview,
    imgConfig, setImgConfig, imageModels 
  } = useChat();
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!text.trim() && !selectedFile) return;
    if (isLoading || isGeneratingImage) return;
    const content = text;
    setText('');
    await sendMessage(content);
  };

  const handleImageGen = async () => {
    if (!text.trim() || isGeneratingImage) return;
    const prompt = text;
    setText('');
    await generateAIImage(prompt);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleAnalyze = () => {
    if (selectedFile) analyzeAIImage(selectedFile);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  const ratios = [
    { label: '1:1', val: { w: 1, h: 1 } },
    { label: '16:9', val: { w: 16, h: 9 } },
    { label: '9:16', val: { w: 9, h: 16 } },
  ];

  const qualities = ['low', 'medium', 'high'];

  return (
    <div className={styles.container}>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
        accept="image/*" 
      />

      {/* Media Preview */}
      {imagePreview && (
        <div className={styles.previewArea}>
          <div className={styles.thumbnailWrapper}>
            <img src={imagePreview} className={styles.thumbnail} alt="Preview" />
            <button className={styles.removeBtn} onClick={() => setSelectedFile(null)}>
              <X size={12} />
            </button>
            <button className={styles.analyzeBtn} onClick={handleAnalyze}>
              <Wand2 size={12} /> Analyze
            </button>
          </div>
        </div>
      )}

      <div className={styles.suggestions}>
        {['Fix this code', 'Explain recursion', 'Write a test case'].map(s => (
          <button key={s} className={styles.suggestionChip} onClick={() => setText(s)}>
            {s}
          </button>
        ))}
      </div>

      <div className={`${styles.inputWrapper} ${(isLoading || isGeneratingImage) ? styles.loading : ''}`}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          placeholder={isGeneratingImage ? "Describing the image..." : "Message Jronix AI or type /image..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isLoading || isGeneratingImage}
        />

        <div className={styles.controls}>
          <div className={styles.leftControls}>
            <button 
              className={styles.iconBtn} 
              title="Upload Image"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip size={18} />
            </button>
            <button 
              className={styles.iconBtn} 
              title="Image Settings"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings2 size={18} color={showSettings ? "var(--accent-primary)" : "inherit"} />
            </button>
            
            {showSettings && (
              <div className={styles.popover}>
                <div className={styles.popoverRow}>
                  <span>Generator Model</span>
                  <select 
                    value={imgConfig.model}
                    onChange={(e) => setImgConfig({...imgConfig, model: e.target.value})}
                    className={styles.popoverSelect}
                  >
                    {imageModels.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className={styles.popoverRow}>
                  <span>Ratio</span>
                  <div className={styles.btnGroup}>
                    {ratios.map(r => (
                      <button 
                        key={r.label}
                        className={imgConfig.ratio.w === r.val.w ? styles.activeVal : ''}
                        onClick={() => setImgConfig({...imgConfig, ratio: r.val})}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.popoverRow}>
                  <span>Quality</span>
                  <div className={styles.btnGroup}>
                    {qualities.map(q => (
                      <button 
                        key={q}
                        className={imgConfig.quality === q ? styles.activeVal : ''}
                        onClick={() => setImgConfig({...imgConfig, quality: q})}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className={styles.divider} />
            
            <button 
              className={styles.iconBtn} 
              title="Generate AI Image"
              onClick={handleImageGen}
              disabled={!text.trim() || isGeneratingImage}
            >
              <ImageIcon size={18} color={text.trim() ? "var(--accent-primary)" : "inherit"} />
            </button>
            
            <div className={styles.modelSelector}>
              <Sparkles size={14} className={styles.sparkle} />
              <select
                value={activeModel}
                onChange={(e) => setActiveModel(e.target.value)}
                className={styles.select}
              >
                {models.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <ChevronDown size={12} className={styles.chevron} />
            </div>
          </div>

          <div className={styles.rightControls}>
            <span className={styles.charCount}>{text.length} chars</span>
            <button
              className={styles.sendBtn}
              onClick={handleSend}
              disabled={(!text.trim() && !selectedFile) || isLoading}
            >
              {isLoading ? <div className={styles.spinner} /> : <Send size={18} />}
            </button>
          </div>
        </div>
      </div>

      <p className={styles.disclaimer}>
        Jronix AI can make mistakes. Check important info. Powered by <b>JronixAI</b>
      </p>
    </div>
  );
};

export default InputArea;

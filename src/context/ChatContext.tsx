import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { chatWithAI, generateImage, saveToKV, getFromKV, type Message, analyzeImage } from '../services/puterService';

interface ChatMessage extends Message {
  id: string;
  timestamp: string;
  type?: 'text' | 'image';
  imageUrl?: string;
}

interface ChatContextType {
  messages: ChatMessage[];
  models: string[];
  activeModel: string;
  isLoading: boolean;
  isGeneratingImage: boolean;
  error: string | null;
  activeTab: 'chat' | 'automation' | 'knowledge';
  memoryItems: string[];
  imgConfig: { model: string, ratio: { w: number, h: number }, quality: string };
  imageModels: string[];
  selectedFile: File | null;
  imagePreview: string | null;
  sendMessage: (content: string) => Promise<void>;
  generateAIImage: (prompt: string) => Promise<void>;
  analyzeAIImage: (file: File) => Promise<void>;
  setActiveModel: (model: string) => void;
  setActiveTab: (tab: 'chat' | 'automation' | 'knowledge') => void;
  setImgConfig: (config: any) => void;
  setSelectedFile: (file: File | null) => void;
  clearHistory: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const DEFAULT_MODES = [
  'gpt-4o-mini',
  'gpt-4o',
  'claude-3-5-sonnet-latest',
  'claude-3-opus-latest',
  'meta-llama-3-1-405b-instruct',
  'gemini-1.5-flash',
  'grok-beta',
];

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeModel, setActiveModel] = useState(DEFAULT_MODES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'automation' | 'knowledge'>('chat');
  const [memoryItems, setMemoryItems] = useState<string[]>([]);
  const [imgConfig, setImgConfig] = useState({ 
    model: 'gpt-image-1',
    ratio: { w: 1, h: 1 }, 
    quality: 'medium' 
  });
  const [selectedFile, setSelectedFileState] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const setSelectedFile = (file: File | null) => {
    setSelectedFileState(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // Load from Puter KV vs LocalStorage
  useEffect(() => {
    const savedMsg = localStorage.getItem('jronix_chat_history');
    if (savedMsg) setMessages(JSON.parse(savedMsg));
    
    // Memory can be loaded from KV
    const loadMemory = async () => {
      const items = await getFromKV('jronix_ai_memory');
      if (items) setMemoryItems(items);
    };
    loadMemory();
  }, []);

  useEffect(() => {
    localStorage.setItem('jronix_chat_history', JSON.stringify(messages));
    
    // Auto-extract memory from history if long enough
    if (messages.length > 5 && messages.length % 4 === 0) {
      extractMemory();
    }
  }, [messages]);

  const extractMemory = async () => {
    // Basic heuristic or we could call AI to "summarize what you know about user"
    const userMsgs = messages.filter(m => m.role === 'user').slice(-3).map(m => m.content).join('\n');
    try {
      const resp = await chatWithAI([{ 
        role: 'system', 
        content: 'Extract a single short fact about the user from these messages (e.g. "User likes Python"). If no facts, return "NONE".' 
      }, { role: 'user', content: userMsgs }], 'gpt-4o-mini');
      
      if (resp && resp !== 'NONE' && !memoryItems.includes(resp)) {
        const newMemory = [...memoryItems, resp].slice(-5);
        setMemoryItems(newMemory);
        await saveToKV('jronix_ai_memory', newMemory);
      }
    } catch (e) {
      console.warn('Memory extraction failed', e);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() && !selectedFile) return;

    if (content.startsWith('/image ')) {
      return generateAIImage(content.replace('/image ', ''));
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content || 'Uploaded an image',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrl: imagePreview || undefined,
      type: imagePreview ? 'image' : 'text'
    };

    setMessages((prev) => [...prev, userMessage]);
    setSelectedFile(null); // Clear after send
    setIsLoading(true);
    setError(null);

    try {
      const history: Message[] = messages.slice(-10).map(({ role, content }) => ({ role, content }));
      history.push({ role: 'user', content: content || 'I uploaded an image' });

      const aiResponse = await chatWithAI(history, activeModel);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIImage = async (prompt: string) => {
    setIsGeneratingImage(true);
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: `Generating [${imgConfig.quality}] image (${imgConfig.ratio.w}:${imgConfig.ratio.h}): "${prompt}"`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(p => [...p, userMessage]);

    try {
      const url = await generateImage(prompt, { 
        quality: imgConfig.quality, 
        ratio: imgConfig.ratio 
      });
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Refined result for: "${prompt}"`,
        imageUrl: url,
        type: 'image',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setError('Image generation failed.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const analyzeAIImage = async (file: File) => {
    setIsLoading(true);
    try {
      const result = await analyzeImage(file);
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `**Image Analysis Result:**\n\n${result}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(p => [...p, assistantMessage]);
    } catch (e) {
      setError('Failed to analyze image.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem('jronix_chat_history');
  };

  const imageModels = [
    'gpt-image-1',
    'gpt-image-1.5',
    'black-forest-labs/FLUX.1-pro',
    'black-forest-labs/FLUX.1-schnell',
    'black-forest-labs/FLUX.1.1-pro',
    'black-forest-labs/FLUX.1-kontext-pro',
    'stabilityai/stable-diffusion-xl-base-1.0',
    'stabilityai/stable-diffusion-3-medium',
    'google/imagen-4.0-ultra',
    'google/imagen-4.0-fast',
    'ideogram/ideogram-3.0',
    'dall-e-3',
    'dall-e-2',
    'gemini-2.5-flash-image-preview',
  ];

  return (
    <ChatContext.Provider
      value={{
        messages,
        models: DEFAULT_MODES,
        activeModel,
        isLoading,
        isGeneratingImage,
        error,
        activeTab,
        memoryItems,
        imgConfig,
        imageModels,
        selectedFile,
        imagePreview,
        sendMessage,
        generateAIImage,
        analyzeAIImage,
        setActiveModel,
        setActiveTab,
        setImgConfig,
        setSelectedFile,
        clearHistory,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

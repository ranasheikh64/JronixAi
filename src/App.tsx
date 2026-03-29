import React from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import InsightPanel from './components/InsightPanel';
import { ChatProvider } from './context/ChatContext';

const App: React.FC = () => {
  return (
    <ChatProvider>
      <div style={{ 
        display: 'flex', 
        height: '100vh', 
        width: '100vw', 
        overflow: 'hidden',
        backgroundColor: 'var(--bg-deep)' 
      }}>
        <Sidebar />
        <ChatWindow />
        <InsightPanel />
      </div>
    </ChatProvider>
  );
};

export default App;

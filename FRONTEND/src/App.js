import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ChatContextProvider } from './context/ChatContext';

// Pages
import MinimalChatPage from './pages/MinimalChatPage';

/**
 * Minimal App - Chatbot Only
 * Displays only a floating chat button that opens a collapsible chat widget
 */
function App() {
  return (
    <ErrorBoundary>
      <ChatContextProvider>
        <Routes>
          <Route path="/" element={<MinimalChatPage />} />
          <Route path="*" element={<MinimalChatPage />} />
        </Routes>
      </ChatContextProvider>
    </ErrorBoundary>
  );
}

export default App;



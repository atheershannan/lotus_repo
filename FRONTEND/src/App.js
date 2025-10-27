import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';

// Pages
import MinimalChatPage from './pages/MinimalChatPage';

/**
 * Minimal App - Chatbot Only
 * Displays only the chatbot widget in the bottom-right corner
 */
function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<MinimalChatPage />} />
        <Route path="*" element={<MinimalChatPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;



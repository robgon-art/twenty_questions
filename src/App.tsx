import React from 'react';
import './App.css';
import ChatInterface from './components/ChatInterface/ChatInterface';

function App() {
  const handleAskQuestion = (question: string) => {
    // TODO: Implement the logic to handle the question
    console.log('Question asked:', question);
  };

  return (
    <div className="App">
      <ChatInterface onAskQuestion={handleAskQuestion} />
    </div>
  );
}

export default App;

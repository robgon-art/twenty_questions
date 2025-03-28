import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import GameInterface from './views/game/GameInterface';
import SuccessPage from './test/SuccessPage';
import FailurePage from './test/FailurePage';
import { useGameController } from './controllers/game/useGameController';

const App: React.FC = () => {
  const { state, handleQuestion, startNewGame } = useGameController();

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="App">
            <GameInterface 
              gameState={state}
              onAskQuestion={handleQuestion}
              onStartNewGame={startNewGame}
            />
          </div>
        } />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/failure" element={<FailurePage />} />
      </Routes>
    </Router>
  );
};

export default App;

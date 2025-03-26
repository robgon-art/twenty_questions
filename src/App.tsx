import React from 'react';
import './App.css';
import GameInterface from './components/GameInterface/GameInterface';
import { useGameState } from './components/GameState/GameState';

function App() {
  const handleGameComplete = (success: boolean) => {
    // TODO: Handle game completion (e.g., show message, reset game)
    console.log('Game completed:', success ? 'success' : 'failure');
  };

  const {
    state,
    handleQuestion,
    handleAnswer,
    startNewGame
  } = useGameState(handleGameComplete);

  return (
    <div className="App">
      <GameInterface 
        onAskQuestion={handleQuestion}
        gameState={state}
        onStartNewGame={startNewGame}
      />
    </div>
  );
}

export default App;

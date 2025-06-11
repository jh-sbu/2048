import Grid from './Grid'
import './App.css'
import { useState } from 'react'

function App() {
  const [gameKey, setGameKey] = useState(0);
  const [score, setScore] = useState(0);

  const startNewGame = () => {
    setGameKey(prevKey => prevKey + 1);
    setScore(0);
  };

  return (
    <div>
      <h1>2048</h1>
      <div className="score">Score: {score}</div>
      <button className="new-game-btn" onClick={startNewGame}>
        New Game
      </button>
      <Grid key={gameKey} onScoreChange={(delta) => setScore(s => s + delta)} />
    </div>
  )
}

export default App;

import Grid from './Grid'
import './App.css'
import { useEffect, useState, useRef } from 'react'

function App() {
  const gridRef = useRef<{ undo: () => void; canUndo: () => boolean }>();
  const [gameKey, setGameKey] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('2048-highScore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const startNewGame = () => {
    setGameKey(prevKey => prevKey + 1);
    setScore(0);
  };

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('2048-highScore', score.toString());
    }
  }, [score, highScore]);

  return (
    <div>
      <h1>2048</h1>
      <div className="scores-container">
        <div className="score">Score: {score}</div>
        <div className="score">High Score: {highScore}</div>
      </div>
      <div className="controls">
        <button className="new-game-btn" onClick={startNewGame}>
          New Game
        </button>
        <button 
          className="undo-btn" 
          onClick={() => gridRef.current?.undo()}
          disabled={!gridRef.current?.canUndo()}
        >
          Undo
        </button>
      </div>
      <Grid 
        key={gameKey} 
        onScoreChange={(delta) => setScore(s => s + delta)}
        ref={gridRef}
      />
    </div>
  )
}

export default App;

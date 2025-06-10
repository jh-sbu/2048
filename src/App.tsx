import Grid from './Grid'
import './App.css'
import { useState } from 'react'

function App() {
  const [gameKey, setGameKey] = useState(0);

  const startNewGame = () => {
    setGameKey(prevKey => prevKey + 1);
  };

  return (
    <div>
      <h1>2048</h1>
      <button className="new-game-btn" onClick={startNewGame}>
        New Game
      </button>
      <Grid key={gameKey} />
    </div>
  )
}

export default App

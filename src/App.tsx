import Grid from './Grid'
import './App.css'
import { useEffect, useState, useCallback } from 'react'
import { generateNewGrid, addNewNumber, processGrid, hasValidMoves } from './gameLogic'; // New import

function App() {
  // Removed: const gridRef = useRef<{ undo: () => void; canUndo: () => boolean } | null>(null);

  const [gameKey, setGameKey] = useState(0); // Used to force Grid remount on new game
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('2048-highScore');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Game state lifted from Grid component
  const [grid, setGrid] = useState<number[][]>(() => generateNewGrid());
  const [previousGrid, setPreviousGrid] = useState<number[][] | null>(null);
  const [previousScoreDelta, setPreviousScoreDelta] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const startNewGame = () => {
    setGameKey(prevKey => prevKey + 1); // Forces Grid to remount
    setScore(0);
    setGrid(generateNewGrid()); // Reset grid
    setPreviousGrid(null); // Clear undo history
    setPreviousScoreDelta(0);
    setGameOver(false);
  };

  const undo = useCallback(() => {
    if (previousGrid) {
      setGrid(previousGrid);
      setScore(s => s - previousScoreDelta); // Subtract the score delta
      setPreviousGrid(null); // Clear previous grid after undo
      setPreviousScoreDelta(0);
      setGameOver(false); // If game was over, undo makes it not over
    }
  }, [previousGrid, previousScoreDelta]);

  const canUndo = useCallback(() => {
    return !!previousGrid;
  }, [previousGrid]);

  const moveTiles = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    if (gameOver) return;

    const { grid: newGrid, delta } = processGrid(grid, direction);

    // Check if the grid actually changed
    if (JSON.stringify(newGrid) !== JSON.stringify(grid)) {
      setPreviousGrid(grid); // Save current grid for undo
      setPreviousScoreDelta(delta); // Save score delta for undo

      const updatedGrid = addNewNumber(newGrid); // Add a new tile
      setGrid(updatedGrid);
      setScore(s => s + delta); // Update score

      if (!hasValidMoves(updatedGrid)) {
        setGameOver(true);
      }
    }
  }, [grid, gameOver]); // Dependencies for useCallback

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    event.preventDefault();
    if (gameOver) {
      // Allow 'N' for new game even if game is over
      if (event.key === 'n' || event.key === 'N') {
        startNewGame();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowLeft': return moveTiles('left');
      case 'ArrowRight': return moveTiles('right');
      case 'ArrowUp': return moveTiles('up');
      case 'ArrowDown': return moveTiles('down');
      case 'n':
      case 'N': return startNewGame();
      case 'u':
      case 'U': return undo();
    }
  }, [moveTiles, gameOver, startNewGame, undo]); // Dependencies for useCallback

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]); // Re-add listener only if handleKeyDown changes

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
          onClick={undo} // Call the undo function directly
          disabled={!canUndo()} // Check canUndo status
        >
          Undo
        </button>
      </div>
      <Grid
        key={gameKey} // Still useful for forcing a full reset of Grid component if it had internal state
        grid={grid} // Pass grid as prop
        gameOver={gameOver} // Pass gameOver as prop
      />
    </div>
  )
}

export default App;

import Square from "./Square";
import { useState, useEffect, useCallback } from 'react';

function hasValidMoves(grid: number[][]): boolean {
  // Check for empty cells
  if (grid.some(row => row.some(cell => cell === 0))) return true;

  // Check for possible merges
  const size = grid.length;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const current = grid[i][j];
      // Check right neighbor
      if (j < size - 1 && current === grid[i][j + 1]) return true;
      // Check bottom neighbor
      if (i < size - 1 && current === grid[i + 1][j]) return true;
    }
  }
  return false;
}

function Grid({ onScoreChange }: { onScoreChange?: (delta: number) => void }) {
  const [grid, setGrid] = useState(() => generateNewGrid());
  const [previousGrid, setPreviousGrid] = useState<number[][] | null>(null);
  const [previousScoreDelta, setPreviousScoreDelta] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const undo = useCallback(() => {
    if (previousGrid) {
      setGrid(previousGrid);
      onScoreChange?.(-previousScoreDelta);
      setPreviousGrid(null);
    }
  }, [previousGrid, previousScoreDelta, onScoreChange]);

  const canUndo = () => !!previousGrid;

  const moveTiles = (direction: 'left' | 'right' | 'up' | 'down') => {
    const { grid: newGrid, delta } = processGrid(grid, direction);
    if (JSON.stringify(newGrid) !== JSON.stringify(grid)) {
      setPreviousGrid(grid);
      setPreviousScoreDelta(delta);
      const updatedGrid = addNewNumber(newGrid);
      setGrid(updatedGrid);
      onScoreChange?.(delta);

      if (!hasValidMoves(updatedGrid)) {
        setGameOver(true);
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();
    if (gameOver) return;
    switch (event.key) {
      case 'ArrowLeft': return moveTiles('left');
      case 'ArrowRight': return moveTiles('right');
      case 'ArrowUp': return moveTiles('up');
      case 'ArrowDown': return moveTiles('down');
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid]);

  return (
    <div className="grid">
      {grid.flat().map((value, index) => (
        <Square key={index} value={value} />
      ))}
      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-message">Game Over!</div>
        </div>
      )}
    </div>
  );
}

function processGrid(grid: number[][], direction: string): { grid: number[][], delta: number } {
  const size = grid.length;
  const newGrid = Array(size).fill(0).map(() => Array(size).fill(0));
  let delta = 0;

  // Process based on direction
  for (let i = 0; i < size; i++) {
    let row: number[] = [];
    switch (direction) {
      case 'left':
      case 'right':
        row = [...grid[i]];
        break;
      case 'up':
      case 'down':
        row = grid.map(r => r[i]);
        break;
    }

    // Process right/down directions by reversing the array before merging
    let filtered = row.filter(x => x !== 0);
    let merged: number[] = [];

    // The reversing code below comes out of nowhere and is not correct
    // The comment is left here as an example of something not to do
    // Reverse if we're processing right or down
    // if (direction === 'right' || direction === 'down') {
    //   filtered = filtered.reverse();
    // }

    // Merge tiles with proper direction handling
    for (let j = 0; j < filtered.length; j++) {
      if (j < filtered.length - 1 && filtered[j] === filtered[j + 1]) {
        const mergedValue = filtered[j] * 2;
        merged.push(mergedValue);
        delta += mergedValue;
        j++; // Skip next element since it's merged
      } else {
        merged.push(filtered[j]);
      }
    }

    // Add zeros to the beginning for right/down directions
    while (merged.length < size) {
      direction === 'left' || direction === 'up'
        ? merged.push(0)
        : merged.unshift(0);
    }

    // Reverse back if we processed right/down
    if (direction === 'right' || direction === 'down') {
      merged = merged.reverse();
    }

    // Update newGrid based on direction
    for (let j = 0; j < size; j++) {
      switch (direction) {
        case 'left':
          newGrid[i][j] = merged[j];
          break;
        case 'right':
          newGrid[i][size - 1 - j] = merged[j];
          break;
        case 'up':
          newGrid[j][i] = merged[j];
          break;
        case 'down':
          newGrid[size - 1 - j][i] = merged[j];
          break;
      }
    }
  }

  return { grid: newGrid, delta };
}

function generateNewGrid(): number[][] {
  const newGrid = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  return addNewNumber(newGrid);
}

function addNewNumber(grid: number[][]): number[][] {
  const emptyCells: [number, number][] = [];
  grid.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === 0) emptyCells.push([i, j]);
    });
  });

  if (emptyCells.length > 0) {
    const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[i][j] = Math.random() < 0.75 ? 2 : 4;
  }

  return grid.map(row => [...row]);
}


export default Grid;

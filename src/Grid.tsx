import Square from "./Square";
import { useState, useEffect } from 'react';

function Grid() {
  const [grid, setGrid] = useState(() => generateNewGrid());

  const moveTiles = (direction: 'left' | 'right' | 'up' | 'down') => {
    const newGrid = processGrid(grid, direction);
    if (JSON.stringify(newGrid) !== JSON.stringify(grid)) {
      setGrid(addNewNumber(newGrid));
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();
    switch(event.key) {
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
    </div>
  );
}

function processGrid(grid: number[][], direction: string): number[][] {
  const size = grid.length;
  const newGrid = Array(size).fill(0).map(() => Array(size).fill(0));
  
  // Process based on direction
  for (let i = 0; i < size; i++) {
    let row = [];
    switch(direction) {
      case 'left':
      case 'right':
        row = [...grid[i]];
        break;
      case 'up':
      case 'down':
        row = grid.map(r => r[i]);
        break;
    }

    // Remove zeros and merge
    let filtered = row.filter(x => x !== 0);
    let merged: number[] = [];
    for (let j = 0; j < filtered.length; j++) {
      if (j < filtered.length - 1 && filtered[j] === filtered[j + 1]) {
        merged.push(filtered[j] * 2);
        j++; // Skip next element since it's merged
      } else {
        merged.push(filtered[j]);
      }
    }

    // Add zeros back based on direction
    while (merged.length < size) {
      direction === 'left' || direction === 'up' 
        ? merged.push(0) 
        : merged.unshift(0);
    }

    // Update newGrid based on direction
    for (let j = 0; j < size; j++) {
      switch(direction) {
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
  
  return newGrid;
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

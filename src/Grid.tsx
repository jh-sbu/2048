import Square from "./Square";
import { useState } from 'react';

export default function Grid() {
  const [grid, setGrid] = useState(() => generateNewGrid());

  return (
    <div className="grid">
      {grid.flat().map((value, index) => (
        <Square key={index} value={value} />
      ))}
    </div>
  );
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
}

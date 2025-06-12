import Square from "./Square";
// Removed: import { useState, useEffect, useCallback } from 'react';
// Removed: import { hasValidMoves, processGrid, generateNewGrid, addNewNumber } from './gameLogic'; // No longer needed here

interface GridProps {
  grid: number[][];
  gameOver: boolean;
}

// Grid is now a purely presentational component
function Grid({ grid, gameOver }: GridProps) {
  // Removed all state and logic related to game mechanics

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

// Removed all helper functions and game logic from here
// function hasValidMoves(...)
// function processGrid(...)
// function generateNewGrid(...)
// function addNewNumber(...)

export default Grid;

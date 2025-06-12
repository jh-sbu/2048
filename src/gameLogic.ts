export function generateNewGrid(): number[][] {
  const newGrid = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  return addNewNumber(newGrid);
}

export function addNewNumber(grid: number[][]): number[][] {
  const emptyCells: [number, number][] = [];
  grid.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === 0) emptyCells.push([i, j]);
    });
  });

  if (emptyCells.length > 0) {
    const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newGrid = grid.map(row => [...row]); // Create a deep copy to ensure immutability
    newGrid[i][j] = Math.random() < 0.75 ? 2 : 4;
    return newGrid;
  }

  return grid.map(row => [...row]); // Return a new copy even if no number was added
}

// Helper to slide and merge a single line (row or column)
function slideLine(line: number[], direction: 'left' | 'right'): { newLine: number[], delta: number } {
  let filtered = line.filter(x => x !== 0);
  let merged: number[] = [];
  let scoreDelta = 0;

  if (direction === 'right') {
    filtered.reverse(); // Process from right to left
  }

  for (let j = 0; j < filtered.length; j++) {
    if (j < filtered.length - 1 && filtered[j] === filtered[j + 1]) {
      const mergedValue = filtered[j] * 2;
      merged.push(mergedValue);
      scoreDelta += mergedValue;
      j++; // Skip next element
    } else {
      merged.push(filtered[j]);
    }
  }

  // Pad with zeros
  while (merged.length < line.length) {
    merged.push(0);
  }

  if (direction === 'right') {
    merged.reverse(); // Restore original order (left to right)
  }

  return { newLine: merged, delta: scoreDelta };
}

export function processGrid(grid: number[][], direction: 'left' | 'right' | 'up' | 'down'): { grid: number[][], delta: number } {
  const size = grid.length;
  const newGrid = Array(size).fill(0).map(() => Array(size).fill(0));
  let totalDelta = 0;

  for (let i = 0; i < size; i++) {
    let line: number[] = [];
    let processedLine: number[] = [];
    let lineDelta = 0;

    if (direction === 'left' || direction === 'right') {
      line = [...grid[i]];
      const result = slideLine(line, direction);
      processedLine = result.newLine;
      lineDelta = result.delta;
      newGrid[i] = processedLine;
    } else { // 'up' or 'down'
      line = grid.map(r => r[i]); // Extract column
      // Treat 'up' as 'left' and 'down' as 'right' for the slideLine logic
      const result = slideLine(line, direction === 'up' ? 'left' : 'right');
      processedLine = result.newLine;
      lineDelta = result.delta;
      // Assign back to column
      for (let j = 0; j < size; j++) {
        newGrid[j][i] = processedLine[j];
      }
    }
    totalDelta += lineDelta;
  }

  return { grid: newGrid, delta: totalDelta };
}

export function hasValidMoves(grid: number[][]): boolean {
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

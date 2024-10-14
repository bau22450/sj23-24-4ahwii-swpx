import express from "express";
import { readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 6969;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, 'public')));

function solveSudoku(sudokuGrid, depth = 0) {
  const size = 9;
  const boxSize = 3;
  const empty = 0;
  let maxDepth = depth;

  function getBoxValues(row, col) {
    const boxRow = Math.floor(row / boxSize) * boxSize;
    const boxCol = Math.floor(col / boxSize) * boxSize;
    const values = new Set();
    for (let r = 0; r < boxSize; r++) {
      for (let c = 0; c < boxSize; c++) {
        const value = sudokuGrid[boxRow + r][boxCol + c];
        if (value !== empty) {
          values.add(value);
        }
      }
    }
    return values;
  }

  function getPossibleValues(row, col) {
    const allValues = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (let i = 0; i < size; i++) {
      allValues.delete(sudokuGrid[row][i]);
      allValues.delete(sudokuGrid[i][col]);
    }
    const boxValues = getBoxValues(row, col);
    boxValues.forEach((value) => allValues.delete(value));
    return Array.from(allValues);
  }

  function solve(depth = 0) {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (sudokuGrid[row][col] === empty) {
          const possibleValues = getPossibleValues(row, col);
          for (const value of possibleValues) {
            sudokuGrid[row][col] = value;
            const newDepth = depth + 1;
            maxDepth = Math.max(maxDepth, newDepth);
            if (solve(newDepth)) {
              return true;
            }
            sudokuGrid[row][col] = empty;
          }
          return false;
        }
      }
    }
    return true;
  }

  const solved = solve();
  return { solved, grid: sudokuGrid, maxDepth };
}

async function getUnsolvedSudoku(filename) {
  const inputPath = join(__dirname, filename);
  const jsonData = await readFile(inputPath, "utf-8");
  return JSON.parse(jsonData);
}

app.get("/unsolved", async (req, res) => {
  const filename = req.query.filename || "unsolvedSudoku1.json";
  try {
    const unsolvedSudoku = await getUnsolvedSudoku(filename);
    res.json(unsolvedSudoku);
  } catch (error) {
    res.status(500).send("Unable to fetch the unsolved Sudoku puzzle.");
  }
});

app.get("/solve", async (req, res) => {
  const filename = req.query.filename || "unsolvedSudoku1.json";
  try {
    const unsolvedSudoku = await getUnsolvedSudoku(filename);
    const { solved, grid: solvedSudoku, maxDepth } = solveSudoku(JSON.parse(JSON.stringify(unsolvedSudoku)));
    if (solved) {
      res.json({ grid: solvedSudoku, maxDepth });
    } else {
      const emptySudoku = Array.from({ length: 9 }, () => Array(9).fill(0));
      res.json({ grid: emptySudoku });
    }
  } catch (error) {
    res.status(500).send("Error solving the Sudoku puzzle.");
  }
});

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Sudoku solver UI running at http://localhost:${port}`);
});

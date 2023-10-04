var bunny = document.querySelector("#bunny");
var root = document.querySelector("#root");

var button = document.getElementById("getgoin");
var rabbit = document.getElementById("root");

const numRows = 7;
const numCols = 7;

button.onclick = function () {
  let currentRow = 1;
  let currentCol = 1;
  const interval = setInterval(() => {
    // Update the grid-row and grid-column CSS properties
    bunny.style.gridRow = currentRow;
    bunny.style.gridColumn = currentCol;

    currentCol++;

    if (currentCol > numCols) {
      currentCol = 1;
      currentRow++;

      if (currentRow > numRows) {
        clearInterval(interval);
        bunny.style.gridRow = 1;
        bunny.style.gridColumn = 1;
      }
    }
  }, 100);
};

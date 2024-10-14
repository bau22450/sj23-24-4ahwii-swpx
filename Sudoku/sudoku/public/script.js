function getSelectedFile() {
    const selectElement = document.getElementById("sudokuSelect");
    return selectElement.value;
}

async function fetchUnsolved() {
    const filename = getSelectedFile();
    const response = await fetch(`/unsolved?filename=${filename}`);
    const data = await response.json();
    displaySudoku(data, "unsolvedTable");
}

async function fetchSolved() {
    const filename = getSelectedFile();
    const response = await fetch(`/solve?filename=${filename}`);
    const resultMessage = document.getElementById("result-message");

    if (response.ok) {
        const data = await response.json();
        const { grid, maxDepth } = data;

        displaySudoku(grid, "solvedTable");
        resultMessage.textContent = `Solved! Maximum recursion depth: ${maxDepth}`;
    } else {
        resultMessage.textContent = "Unable to solve the Sudoku puzzle.";
    }
}

function displaySudoku(grid, tableId) {
    const table = document.getElementById(tableId);
    table.innerHTML = "";
    grid.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(value => {
            const td = document.createElement("td");
            td.textContent = value || "";
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
}
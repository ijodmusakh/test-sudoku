document.addEventListener("DOMContentLoaded", () => {
    let selectedCell = null;

    // Define sample Sudoku puzzles
    const puzzles = {
        easy: [
            [5, 3, "", "", 7, "", "", "", ""],
            [6, "", "", 1, 9, 5, "", "", ""],
            ["", 9, 8, "", "", "", "", 6, ""],
            [8, "", "", "", 6, "", "", "", 3],
            [4, "", "", 8, "", 3, "", "", 1],
            [7, "", "", "", 2, "", "", "", 6],
            ["", 6, "", "", "", "", 2, 8, ""],
            ["", "", "", 4, 1, 9, "", "", 5],
            ["", "", "", "", 8, "", "", 7, 9],
        ],
        medium: [
            [8, "", "", "", "", "", "", "", 2],
            ["", 5, "", "", 6, "", "", 9, ""],
            ["", "", 6, 7, "", 4, 3, "", ""],
            ["", 7, "", "", 9, "", "", 2, ""],
            ["", "", 5, "", "", "", 6, "", ""],
            ["", 2, "", "", 8, "", "", 1, ""],
            ["", "", 9, 2, "", 8, 4, "", ""],
            ["", 1, "", "", 5, "", "", 3, ""],
            [6, "", "", "", "", "", "", "", 7],
        ],
        hard: [
            ["", "", "", 1, "", 5, "", "", ""],
            [4, "", "", "", "", "", "", "", 9],
            ["", 2, 1, "", 6, "", 3, 5, ""],
            ["", "", "", "", "", "", "", "", ""],
            [2, 6, "", "", "", "", "", 1, 4],
            ["", "", "", "", "", "", "", "", ""],
            ["", 3, 7, "", 4, "", 9, 6, ""],
            [6, "", "", "", "", "", "", "", 1],
            ["", "", "", 8, "", 7, "", "", ""],
        ],
    };

    // Initialize the grid with a puzzle
    const gridCells = document.querySelectorAll(".grid-container > div");
    const messageElement = document.querySelector("#game-message");

    function initializeGrid(puzzle) {
        gridCells.forEach((cell, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            const value = puzzle[row][col];

            if (value) {
                cell.textContent = value;
                cell.classList.add("non-editable"); // Prefilled cells are non-editable
            } else {
                cell.textContent = "";
                cell.classList.remove("non-editable");
            }

            cell.style.color = ""; // Reset color
            cell.classList.remove("cell-selected");
        });

        selectedCell = null; // Clear the selection
        messageElement.textContent = ""; // Clear any previous message
    }
    // Validate row, column, and 3x3 sub-grid
    function isValidPlacement(cellIndex, value) {
        const row = Math.floor(cellIndex / 9);
        const col = cellIndex % 9;

        // Check row
        const rowStart = row * 9;
        for (let i = rowStart; i < rowStart + 9; i++) {
            if (gridCells[i].textContent == value && i !== cellIndex) return false;
        }

        // Check column
        for (let i = col; i < 81; i += 9) {
            if (gridCells[i].textContent == value && i !== cellIndex) return false;
        }

        // Check 3x3 sub-grid
        const subGridRowStart = Math.floor(row / 3) * 3;
        const subGridColStart = Math.floor(col / 3) * 3;
        for (let r = subGridRowStart; r < subGridRowStart + 3; r++) {
            for (let c = subGridColStart; c < subGridColStart + 3; c++) {
                const subGridIndex = r * 9 + c;
                if (gridCells[subGridIndex].textContent == value && subGridIndex !== cellIndex) return false;
            }
        }

        return true;
    }

    function isGameComplete() {
        // Check if all cells are filled with valid numbers
        for (let i = 0; i < gridCells.length; i++) {
            const cell = gridCells[i];
            const value = cell.textContent;

            if (!value || !isValidPlacement(i, value)) {
                return false; // Game is not complete or invalid placement found
            }
        }

        return true; // All cells are filled and valid
    }

    // Add click functionality to grid cells
    gridCells.forEach((cell) => {
        cell.addEventListener("click", () => {
            if (!cell.classList.contains("non-editable")) {
                // Deselect other cells
                gridCells.forEach((c) => c.classList.remove("cell-selected"));

                // Select the clicked cell
                cell.classList.add("cell-selected");
                selectedCell = cell;
            }
        });
    });

    // Handle difficulty selection
    const difficultyButtons = document.querySelectorAll(".difficulty-btn");
    difficultyButtons.forEach((button) => {
        button.addEventListener("click", () => {
            difficultyButtons.forEach((btn) => btn.classList.remove("selected"));
            button.classList.add("selected");

            const difficulty = button.id; // "easy", "medium", "hard"
            initializeGrid(puzzles[difficulty]);
        });
    });

    // Handle New Game button
    const newGameButton = document.querySelector("#new_game");
    newGameButton.addEventListener("click", () => {
        const selectedDifficulty = document.querySelector(".difficulty-btn.selected").id;
        initializeGrid(puzzles[selectedDifficulty]);
    });

    // Handle number input buttons
    const numberButtons = document.querySelectorAll(".buttons .btn");
    numberButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (selectedCell && !selectedCell.classList.contains("non-editable")) {
                const cellIndex = Array.from(gridCells).indexOf(selectedCell);
                const value = button.textContent;

                if (button.classList.contains("clear-btn")) {
                    selectedCell.textContent = ""; // Clear the cell
                    selectedCell.style.color = ""; // Reset color
                } else {
                    // Check if the placement is valid
                    if (isValidPlacement(cellIndex, value)) {
                        selectedCell.textContent = value; // Place the number
                        selectedCell.style.color = "black"; // Valid placement
                    } else {
                        selectedCell.textContent = value; // Place the number
                        selectedCell.style.color = "red"; // Invalid placement
                    }
                    // Check if the game is complete
                    if (isGameComplete()) {
                        messageElement.textContent = "CONGRATULATIONS! YOU HAVE FINISHED.";
                    }                    
                }
            }
        });
    });

    // Initialize the grid with Easy difficulty on page load
    initializeGrid(puzzles.easy);
    document.querySelector("#easy").classList.add("selected"); // Highlight Easy as default
});

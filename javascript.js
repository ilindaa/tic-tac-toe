function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    // Loop through the 2D array and add a Cell to it
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i][j] = Cell();
        }
    }
    
    // Gets the entire gameboard 
    const getBoard = () => board;

    // If the space is empty (checked in the clickHandlerBoard), add the player's mark
    const makeMark = (row, column, playerMark) => {
        board[row][column].addMark(playerMark);
    }
    
    // Prints the board object for now
    // Maps the board's rows with the corresponding cell value
    // const printBoard = () => {
    //     const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
    //     console.log(boardWithCellValues);
    // }

    return { getBoard, makeMark/*, printBoard */ };
}

// Player can update the cell's value with their player mark and retrieve the value
function Cell() {
    let value = '';

    const addMark = (playerMark) => {
        value = playerMark;
    };

    const getValue = () => value;

    return { addMark, getValue };
}

const PlayerFactory = (playerName, playerMark) => {
    return { playerName, playerMark };
};

function GameController() {
    const board = Gameboard();
    let gameRoundNum = 0;
    let gameWinner = '';

    const playerOne = PlayerFactory('Player 1', 'X');
    const playerTwo = PlayerFactory('Player 2', 'O');

    let activePlayer = playerOne;

    // Switch the player's turn after the active player's turn is over
    const switchPlayerTurn = () => {
        if (activePlayer === playerOne) {
            activePlayer = playerTwo;
        } else {
            activePlayer = playerOne;
        }
    };

    function getActivePlayer() {
        return activePlayer;
    }

    // const printNewRound = () => {
    //     board.printBoard(); 
    //     console.log(`${getActivePlayer().playerName}'s turn.`);
    // };

    const checkWinner = () => {
        // 00 - 01 - 02
        // 10 - 11 - 12
        // 20 - 21 - 22
        // console.log("Checking Winner", gameRoundNum);
        // Ex: Check rows (3), columns (3), diagonals (2)
        const b = board.getBoard().map((row) => row.map((cell) => cell.getValue()));
        const rows = b.length;
        const columns = b[0].length;

        // Check 3-in-a-row for any number of rows and columns (if I ever want to change the number of rows and columns)

        // Increment the game round number
        gameRoundNum += 1;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {

                // Check rows
                if (j+2 < columns && b[i][j] != '' && b[i][j] === b[i][j+1] && b[i][j+1] === b[i][j+2]) {
                    return b[i][j];
                }

                // Check columns
                if (i+2 < rows && b[i][j] != '' && b[i][j] === b[i+1][j] && b[i+1][j] === b[i+2][j]) {
                    return b[i][j];
                }

                // Check diagonals (left)
                if (i+2 < rows && j+2 < columns && b[i][j] != '' && b[i][j] === b[i+1][j+1] && b[i+1][j+1] === b[i+2][j+2]) {
                    return b[i][j];
                }

                // Check diagonals (right) 
                if (i+2 < rows && columns-3 >= 0 && [i][columns-1] != '' && b[i][columns-1] === b[i+1][columns-2] && b[i+1][columns-2] === b[i+2][columns-3]) {
                    return b[i][columns-1];
                }

            }
        }

        // If the game round number is equal to the number of cells in the board (there is no win yet), the game ends in a tie
        if (gameRoundNum === (rows*columns)) return 'Tie';

        return '';
    }

    // Gets the game winner
    const getGameWinner = () => gameWinner;

    // Take in a row and column and put the player's mark there
    const playRound = (row, column) => {
        // console.log(`${getActivePlayer().playerName} is marking row ${row}, column ${column}.`);
        board.makeMark(row, column, getActivePlayer().playerMark);

        // Check for a winner, if there's exists a winner/tie, set that as the game winner
        let winner = checkWinner();
        if (winner != '') {
            gameWinner = winner;
        }

        switchPlayerTurn();
        // printNewRound();
    };

    // printNewRound();

    return { playRound, getActivePlayer, getBoard: board.getBoard, getGameWinner };
}

(function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const playerWinnerDiv = document.querySelector('.winner');

    const updateScreen = () => {
        boardDiv.textContent = '';

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.playerName}'s turn.`;

        // Loop through the board's rows and columns, create a button element for the cell
        // Add a data-row and data-column to track the index value of each cell
        // Append the cell's value and button to the board
        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement('button');
                cellButton.classList.add('cell');

                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;

                cellButton.textContent = cell.getValue();

                boardDiv.appendChild(cellButton);
            });
        });

        // Gets GameController()'s gameWinner
        winMessage(game.getGameWinner());
    }

    // Display the win message, end the game, remove the boardDiv event listener that handles the board
    const winMessage = (winner) => {
        // If there is no winner, return nothing (do nothing)
        if (winner === '') return;

        if (winner === 'X') {
            playerWinnerDiv.textContent = 'X has won!';
        } else if (winner === 'O') {
            playerWinnerDiv.textContent = 'O has won!';
        } else if (winner === 'Tie') {
            playerWinnerDiv.textContent = 'Tie! No winner.';
        }

        playerTurnDiv.textContent = 'Game over!';

        boardDiv.removeEventListener('click', clickHandlerBoard);
    }

    // If there is a selected row and column, play the game and update the screen
    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        // No gaps
        if (!selectedRow && !selectedColumn) return;

        // No already chosen positions
        const board = game.getBoard();
        if (board[selectedRow][selectedColumn].getValue() != '') return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }

    // Runs at page load
    boardDiv.addEventListener('click', clickHandlerBoard);
    updateScreen();
})();
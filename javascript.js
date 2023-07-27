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

    // If the space is empty, add the player's mark
    const makeMark = (row, column, playerMark) => {
        if (board[row][column].getValue() != '') return;

        board[row][column].addMark(playerMark);
    }
    
    // Prints the board object for now
    // Maps the board's rows with the corresponding cell value
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    }

    return { getBoard, makeMark, printBoard };
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

    const printNewRound = () => {
        board.printBoard(); 
        console.log(`${getActivePlayer().playerName}'s turn.`);
    };

    // Take in a row and column and put the player's mark there
    const playRound = (row, column) => {
        console.log(`${getActivePlayer().playerName} is marking row ${row}, column ${column}.`);
        board.makeMark(row, column, getActivePlayer().playerMark);

        // Check for a winner, win message

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return { playRound, getActivePlayer, getBoard: board.getBoard };
}

(function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

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
                cellButton.addEventListener('click', clickHandlerButton);

                boardDiv.appendChild(cellButton);
            })
        })
    }

    // If there is a selected row and column, play the game and update the screen
    function clickHandlerButton(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }

    updateScreen();
})();
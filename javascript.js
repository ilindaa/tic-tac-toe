function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

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
        if (board[row][column] != '') return;

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
        board.makeMark(row, column, activePlayer.playerMark);

        // Check for a winner, win message

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return { playRound, getActivePlayer};
}

const game = GameController();
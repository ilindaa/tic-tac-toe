function gameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i][j] = '';
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
    const printBoard = () => console.log(board);

    return {
        getBoard,
        printBoard,
        makeMark
    };

}

const playerFactory = (playerName, playerMark) => {
    return { playerName, playerMark };
};

function gameController() {
    const board = gameBoard();

    const playerOne = playerFactory('Player 1', 'X');
    const playerTwo = playerFactory('Player 2', 'O');

    let activePlayer = playerOne;

    const switchPlayerTurn = () => {
        if (activePlayer === playerOne) {
            activePlayer = playerTwo;
        } else {
            activePlayer = playerOne;
        }
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard(); 
        console.log(`${getActivePlayer.playerName}'s turn.`);
    }

    // Take in a row and column and put the player's mark there
    const playRound = (row, column) => {
        console.log(`${getActivePlayer().playerName}'s turn.`)

        board.makeMark(row, column, getActivePlayer().playerMark)
        // Check for a winner, win message

        switchPlayerTurn();
        printNewRound();
    };

    return {
        playRound,
        getActivePlayer
    };
}

const game = gameController();
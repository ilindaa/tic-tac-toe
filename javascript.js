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

    const reset = () => {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i][j] = Cell();
            }
        }
    }

    return { getBoard, makeMark, reset };
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

const PlayerFactory = (playerName, playerMark, playerScore) => {
    const getPlayerName = () => playerName;
    const getPlayerMark = () => playerMark;
    const getPlayerScore = () => playerScore;

    function setPlayerName(name) {
        playerName = name;
    }

    function incrementPlayerScore() {
        playerScore += 1;
    }

    return { getPlayerName, getPlayerMark, getPlayerScore, setPlayerName, incrementPlayerScore };
};

function GameController() {
    const board = Gameboard();
    let gameRoundNum = 0;
    let gameWinner = '';

    const playerOne = PlayerFactory('Player One', 'Chips', 0);
    const playerTwo = PlayerFactory('Player Two', 'Cola', 0);

    let activePlayer = playerOne;

    // Get players
    const getPlayerOne = () => playerOne;
    const getPlayerTwo = () => playerTwo;

    // Switch the player's turn after the active player's turn is over
    const switchPlayerTurn = () => {
        if (activePlayer === playerOne) {
            activePlayer = playerTwo;
        } else {
            activePlayer = playerOne;
        }
    };

    const getActivePlayer = () => {
        return activePlayer;
    }

    const checkWinner = () => {
        // 00 - 01 - 02
        // 10 - 11 - 12
        // 20 - 21 - 22
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
        board.makeMark(row, column, getActivePlayer().getPlayerMark());

        // Check for a winner, if there's exists a winner/tie, set that as the game winner
        let winner = checkWinner();
        if (winner != '') {
            gameWinner = winner;
            // If the winning mark is equal to a player's mark, increment the winning player's score by 1
            if (winner === playerOne.getPlayerMark()) {
                playerOne.incrementPlayerScore();
            } else if (winner === playerTwo.getPlayerMark()) {
                playerTwo.incrementPlayerScore();
            }
        }

        switchPlayerTurn();
    };

    const reset = () => {
        gameWinner = '';
        activePlayer = playerOne;
        gameRoundNum = 0;
    }

    // getGameboard retrieves the board module, getBoard retrieves the board module's gameboard (array)
    return { playRound, getActivePlayer, getGameboard: board, getBoard: board.getBoard, getGameWinner, getPlayerOne, getPlayerTwo, reset };
}

function ScreenController() {
    const game = GameController();
    const board = game.getBoard();
    const playerTurnDiv = document.querySelector('.turn');
    const playerWinnerDiv = document.querySelector('.winner');
    const boardDiv = document.querySelector('.board');
    const playAgainButton = document.getElementById('play-again-btn');
    const menuButton = document.getElementById('menu-btn');

    const playerOne = game.getPlayerOne();
    const playerTwo = game.getPlayerTwo();

    const updateScreen = () => {
        boardDiv.textContent = '';

        const playerOneScoreDiv = document.querySelector('.player-one-score');
        const playerTwoScoreDiv = document.querySelector('.player-two-score');
        const playerOneImgDiv = document.querySelector('.player-one-img');
        const playerTwoImgDiv = document.querySelector('.player-two-img');

        // Active player changes, need to get it each time
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `(${activePlayer.getPlayerMark()}) ${activePlayer.getPlayerName()}'s turn.`;

        if (activePlayer.getPlayerName() === playerOne.getPlayerName()) {
            playerOneImgDiv.classList.add('active-player-bg');
            playerTwoImgDiv.classList.remove('active-player-bg');
        } else {
            playerTwoImgDiv.classList.add('active-player-bg');
            playerOneImgDiv.classList.remove('active-player-bg');
        }

        // Loop through the board's rows and columns, create a button element for the cell
        // Add a data-row and data-column to track the index value of each cell
        // Append the cell's value and button to the board
        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement('button');
                cellButton.classList.add('cell');

                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;

                // Updated x's and o's to images inside the button

                if (cell.getValue() === playerOne.getPlayerMark()) {
                    const pic = new Image(90, 90);
                    pic.src = "./Images/chips.png";
                    cellButton.appendChild(pic);

                } else if (cell.getValue() === playerTwo.getPlayerMark()) {
                    const pic = new Image(90, 90);
                    pic.src = "./Images/cola.png";
                    cellButton.appendChild(pic);
                }

                boardDiv.appendChild(cellButton);
            });
        });

        // Gets GameController()'s gameWinner
        winMessage(game.getGameWinner());
        // Update the score in the player score div
        playerOneScoreDiv.textContent = `Score: ${playerOne.getPlayerScore()}`;
        playerTwoScoreDiv.textContent = `Score: ${playerTwo.getPlayerScore()}`;
    }

    // Display the win message, end the game, remove the boardDiv event listener that handles the board
    const winMessage = (winner) => {
        // If there is no winner, return nothing (do nothing)
        if (winner === '') return;

        if (winner === playerOne.getPlayerMark()) {
            playerWinnerDiv.textContent = `(${playerOne.getPlayerMark()}) ${playerOne.getPlayerName()} won!`;
        } else if (winner === playerTwo.getPlayerMark()) {
            playerWinnerDiv.textContent = `(${playerTwo.getPlayerMark()}) ${playerTwo.getPlayerName()} won!`;
        } else if (winner === 'Tie') {
            playerWinnerDiv.textContent = 'Tie! No winner.';
        }

        playerTurnDiv.textContent = 'GAME OVER';
        boardDiv.removeEventListener('click', clickHandlerBoard);
        playAgainButton.style.display = 'block';
    }

    // If there is a selected row and column, play the game and update the screen
    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        // No gaps
        if (!selectedRow && !selectedColumn) return;

        // No already chosen positions
        if (board[selectedRow][selectedColumn].getValue() != '') return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }

    // Restart the game
    function restartGame() {
        const activePlayer = game.getActivePlayer();
        game.reset();
        game.getGameboard.reset();
        playerTurnDiv.textContent = `(${activePlayer.getPlayerMark()}) ${activePlayer.getPlayerName()}'s turn.`;;
        runsAtRestartAndPageLoad();
    }

    function runsAtRestartAndPageLoad() {
        updateScreen();
        boardDiv.addEventListener('click', clickHandlerBoard);
        playerWinnerDiv.textContent = '';
        playAgainButton.style.display = 'none';
    }

    function updatePlayerNames() {
        const playerOneText = document.getElementById('player-one');
        const playerTwoText = document.getElementById('player-two');
        const playerOneNameDiv = document.querySelector('.player-one-name');
        const playerTwoNameDiv = document.querySelector('.player-two-name');
        const namesForm = document.getElementById('names-form');
        const gameContainer = document.querySelector('.game-container');
        namesForm.style.display = 'none';
        gameContainer.style.display = 'block';
        menuButton.style.display = 'block';

        // Set the names if they're not left empty, else keep the default Player One and Player Two
        if (playerOneText.value != '') {
            playerOne.setPlayerName(playerOneText.value);
        }
        if (playerTwoText.value != '') {
            playerTwo.setPlayerName(playerTwoText.value);
        }

        playerOneNameDiv.textContent = `(${playerOne.getPlayerMark()}) ${playerOne.getPlayerName()}`;
        playerTwoNameDiv.textContent = `(${playerTwo.getPlayerMark()}) ${playerTwo.getPlayerName()}`;
        playerOneText.value = '';
        playerTwoText.value = '';

        updateScreen();
    }

    function backToMenu() {
        const namesForm = document.getElementById('names-form');
        const gameContainer = document.querySelector('.game-container');
        namesForm.style.display = 'block';
        gameContainer.style.display = 'none';
        menuButton.style.display = 'none';
    }

    // Add event listeners to the play again btn and menu btn
    playAgainButton.addEventListener('click', restartGame);
    menuButton.addEventListener('click', backToMenu);
    runsAtRestartAndPageLoad();
    updatePlayerNames();
}
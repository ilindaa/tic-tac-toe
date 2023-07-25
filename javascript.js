const Gameboard = (() => {
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
    
    // Prints the board object for now
    const printBoard = () => console.log(board);

    return {
        getBoard,
        printBoard
    };

})();

const playerFactory = (name, mark) => {
    return { name, mark };
};

const playerOne = playerFactory('Player X', 'X');
const playerTwo = playerFactory('Player O', 'O');

console.log(playerOne.name, playerOne.mark);
console.log(playerTwo.name, playerTwo.mark);

Gameboard.printBoard();
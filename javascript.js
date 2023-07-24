const gameBoard = (() => {
    let gameboard = [];
    return {
        gameboard,
    };
})();

const displayController = (() => {
    let displayBox = document.querySelector('.display-box');
    
})();

const player = (name, mark) => {
    return {name, mark};
}

const player1 = player('You', 'x');
const player2 = player('Friend', 'o');

console.log(player1.name, player1.mark);
console.log(player2.name, player2.mark);
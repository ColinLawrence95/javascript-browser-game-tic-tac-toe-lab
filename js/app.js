/*-------------------------------- Constants --------------------------------*/
const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];
/*---------------------------- Variables (state) ----------------------------*/
let board;
let turn;
let winner;
let tie;
let winSoundVolume = 0.08;
let backgroundMusicVolume = 0.02;
let backgroundMusicMuted;
/*------------------------ Cached Element References ------------------------*/
const squareEls = document.querySelectorAll(".sqr");
const messageEL = document.querySelector("#message");
const resetBtnEl = document.querySelector("#reset");
const mutebtnEL = document.querySelector("#mute");

/*-------------------------------- Functions --------------------------------*/
/**
 * inittilizes game to its starting point.
 */
function init() {
    board = ["", "", "", "", "", "", "", "", ""];
    turn = "⚔️";
    winner = false;
    tie = false;

    squareEls.forEach((cell) => {
        cell.classList.remove("win");
    });
    backgroundMusic();
    render();
}
/**
 * runs updateBoard and updateMessage
 */
function render() {
    updateBoard();
    updateMessage();
}
/**
 * itterates through board and changes the text content of the cell
 */
function updateBoard() {
    board.forEach((value, index) => {
        const cell = squareEls[index];
        cell.textContent = value;
    });
}
/**
 * updates the message field indicating whos turn it is and what the result of the game is
 */
function updateMessage() {
    if (winner === false && tie === false) {
        messageEL.textContent = `${turn}'s Turn`;
    } else if (winner === false && tie === true) {
        messageEL.textContent = "It's a tie!";
    } else {
        messageEL.textContent = `${turn} has won!`;
    }
}
/**
 * Checks if the space clicked on is empty and the winner and tie status are false
 * @param {*} event event parameter
 * @returns exits if space clicked on isn't empty
 */
function handleClick(event) {
    const squareIndex = event.target.id;
    if (board[squareIndex] !== "" || winner || tie) {
        return;
    }
    placePiece(squareIndex);
    checkForWinner();
    checkForTie();
    switchPlayerTurn();
    render();
}
/**
 * determines if placing a sword or shield based on value in turn
 * @param {*} index Position on the board
 */
function placePiece(index) {
    board[index] = turn;
}
/**
 * Determines if a win state is present and plays a little fun animation
 */
function checkForWinner() {
    //iterating through winning combos
    winningCombos.forEach((currentCombo) => {
        //populating combos array
        const [a, b, c] = currentCombo;

        //checking if theres no empty spaces and if currentCombo matches any winnng combos
        if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
            winner = true;
            winJuice(a, b, c);
        }
    });
}
/**
 * Checks if any open spaces are left. If none then a tie is declared
 */
function checkForTie() {
    if (!board.includes("")) {
        tie = true;
    } else {
        tie === false;
    }
}
/**
 * Toggles between turns
 */
function switchPlayerTurn() {
    if (winner) {
        return;
    } else {
        if (turn === "⚔️") {
            turn = "🛡️";
        } else {
            turn = "⚔️";
        }
    }
}
function winJuice(a, b, c) {
    //win animation and sound
    const winSound = new Audio("./sounds/winSound.mp3");
    winSound.preload = "auto";
    winSound.volume = winSoundVolume;
    winSound.play();
    squareEls[a].classList.add("win");
    squareEls[b].classList.add("win");
    squareEls[c].classList.add("win");
    document.body.classList.add("flash");
    //stoping background flash
    setTimeout(() => {
        document.body.classList.remove("flash");
    }, 1000);
}
/**
 * mustes background music
 */
function mute() {
    const backgroundMusic = document.getElementById("background-music");
    backgroundMusicMuted = !backgroundMusicMuted;
    if (backgroundMusicMuted) {
        backgroundMusic.volume = 0;
    } else {
        backgroundMusic.volume = backgroundMusicVolume;
    }
}

/**
 * Sets the background music to the correct volume based on mute state
 */
function backgroundMusic() {
    const backgroundMusic = document.getElementById("background-music");
    backgroundMusic.preload = "auto";
    if (!backgroundMusicMuted) {
        backgroundMusic.volume = backgroundMusicVolume;
    } else {
        backgroundMusic.volume = 0;
    }
    backgroundMusic.play();
}

/*----------------------------- Event Listeners -----------------------------*/
//listening for a square to be clicked on
squareEls.forEach((square) => {
    square.addEventListener("click", handleClick);
});
//listening for reset button to be clicked
document.querySelector("#reset").addEventListener("click", init);
document.querySelector("#mute").addEventListener("click", mute);
/*----------------------------- MAIN -----------------------------*/
init();

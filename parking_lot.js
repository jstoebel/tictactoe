var gameLoop = function(playerInput){
//     //the main loop for the game
//     //playerInput: the player's choice of Xs or Os
//     //and if they will go first or second

//     var board = [
//         [null,  null,   null],
//         [null,  null, null],
//         [null, null, null]
//     ]    

//     var game = new Game(board, playerInput["compFirst"], 0, [null, null], playerInput["xOrO"])

//     //if its the player's turn
//         //listen for a click

//     if (game.player) {
//         //its the computer's turn
//         // run minimax to determine computer's move
//     } else {
//         //its the player's turn

//         $("body").click(function(event) {
//             var cellNum = event.target.id;
//             var re = /cell(\d)/;
//             var match = cellNum.match(/\d/)[0];
//             console.log(match[0])

//             //row is Math.floor(c/3)
//             //column is c%3
//         })
//     }

//     //make a new game based on the input
// }
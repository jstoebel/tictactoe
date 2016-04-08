var PerfectGame = function(board){
    //creates a game state object:
        //board: a 2d array (3x3) representing a game state

    this.board = board;
    this.scores = [];
    this.moves = [];

    this.checkRow = function(start){

    }

    this.checkColumn = function(start){

    }

    this.checkDiagonal = function(start) {
        
    }

    this.isOver = function(){
        //returns true if someone has won the game
        // returns false otherwise

        //check rows


        //check columns

        //check diagonals
    }

    this.minimax = function(board){
        //figure out the best move
    }

    this.availableMoves = function(){
        //return an array of the available moves. Each move is an array 
        //representing the coordinates of the move.

        for (var i=0; i<this.board.length; i++){
            var row = this.board[i];
            for (var j=0; j<row.length; j++) {
                if (row[j] == "") {
                    //its a possible move!

                }
            }
        }
    }


}



$(document).ready(function() {


})
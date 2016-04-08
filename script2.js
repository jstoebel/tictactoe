var Game = function(board, compTurn){
    //board: a 2d array of representing the game state
    //turn: whose turn is it? ('x' or 'o')
    //1 = computer, 0 = human

    this.board = board;
    this.compTurn = compTurn;


    this.win = function(){
        //determines if the game is in a winning state
        //we check win state before a turn is taken, therfore if there is a winner,
        //it is always the opposing player.
        var player = Number(!this.compTurn);

        _checkSequences = function(arrs, player){
            //checks if entire 3 item array is filled with player's value

            console.log(arrs);
            for (i in arrs){
                var arr = arrs[i];
                var allMatch = arr.every(function(i){
                    return i == player;
                });

                if (allMatch){
                    return true;
                }
            }
            return false;
        }

        _checkRows = function(player, board){
            //any winner in the rows?

            var rows = []
            for (var i=0; i<3; i++){
                //are all elements in this row the same?

                var row = board[i];
                rows.push(row);
            }
            return _checkSequences(rows, player);
        }

        _checkColumns = function(player, board){
            //any winner in the columns?

            var cols = [];
            for (var c=0; c<3; c++ ){
                var col = [];
                for (var r=0; r<3; r++ ){
                    col.push(board[r][c])
                }
                cols.push(col);
            }

            return _checkSequences(cols, player);
        };

        _checkPrimeDiagonal = function(player, board) {
            //any winner in the diagonals?

            var seq = [];
            for (var i=0; i<3; i++) {
                seq.push(board[i][i]);
            }

            return _checkSequences([seq], player)
        }

        _checkSecondDiagonal = function(player, board) {
            //any winner in the diagonals?

            var seq = [];
            for (var i=0; i<3; i++) {
                seq.push(board[i][2-i])
            }

            return _checkSequences([seq], player)
        }

        console.log(_checkSecondDiagonal(player, board))
        // return (this._checkColumn(player) || this._checkRow(player) || 
        //     this._checkPrimeDiagonal(player) || this._checkSecondDiagonal(player))
    }

    this.score = function() {
        //returns the score of the current game state
    }

    this.getPossibleMoves = function() {
        //returns 2d array of all possible moves. examlpe [[0,1], [0, 2]...]
    }

    this.minimax = function() {
        //recursivly determines all possible outcomes starting from current state
        //returns the most desired move
    }

};

var board = [
    [1, 1, 1],
    [null,1,null],
    [1, null, null]
]

game = new Game(board, false)
console.log(game.win())



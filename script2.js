var Game = function(board, player, depth, lastMove){
    //board: a 2d array of representing the game state
    //player: whose turn is it? ('x' or 'o')
    //1 = computer, 0 = human
    //depth: how many turns have occured? Start counting with 0

    this.board = board;
    this.player = player;
    this.depth = depth;
    this.lastMove = lastMove;


    this.win = function(){
        //determines if the game is in a winning state
        //we check win state before a turn is taken, therfore if there is a winner,
        //it is always the opposing player.

        var playerToCheck = Number(!this.player)

        _checkSequences = function(arrs, player){
            //checks if entire 3 item array is filled with player's value

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

        return (_checkColumns(playerToCheck, board) || _checkRows(playerToCheck, board) || 
            _checkPrimeDiagonal(playerToCheck, board) || _checkSecondDiagonal(playerToCheck, board))
    }

    this.score = function() {
        //returns the score of the current game state

        if (this.win()){
            if(this.player){
                //the current player is 1, meaning 0 wins
                return -10;
            } else {
                //the current player is 0, meaing 1 wins
                return 10;
            }
        } else {
            return 0;
        }
    }

    this.step = function(move){
        //creates a new game object based on move and returns the result
        //move: a 2d array of coordinates to move
        //returns a new game with move applied
            //player is flipped
            //depth is incremented by 1

        //shallow copy the board!
        var newBoard = this.board.map(function(arr) {
            return arr.slice();
        })
        newBoard[move[0]][move[1]] = this.player;

        var turn = Number(!this.player);

        var depth = this.depth + 1;
        return new Game(newBoard, turn, depth, move)
    }

    this.getPossibleMoves = function() {
        //returns 2d array of all possible moves. examlpe [[0,1], [0, 2]...]

        var possibleMoves = [];
        for (r in this.board){
            for (c in this.board){
                if (this.board[r][c] === null){
                    possibleMoves.push([r, c]);
                }
            }
        }
        return possibleMoves;
    }

    this.minimax = function() {
        //RECURSION HAPPENS HERE
        //recursivly determines all possible outcomes starting from current state
        //returns the object structured as {bestScore: move}

        if(this.score() != 0){

            outcome = new Object;
            outcome[this.score()] = this.lastMove;
            return outcome;
        } else {
            //recursion!
            var outcomes = [];
            var possibleMoves = this.getPossibleMoves();
            for (var m=0; m<possibleMoves.length; m++){
                    var move = possibleMoves[m];
                    newGame = this.step(move);
                    outcome = newGame.minimax();
                    outcomes.push(outcome);
                }
        }

        var pickOutcome = function(outcomes) {

            for (o in outcomes){
                var outcome = outcomes[o];
                var outcomeScore = Object.keys(outcome)[0] 
                if ( betterScore( outcomeScore )){
                    bestScore  = outcomeScore;
                    bestOutcome = outcome
                }

            }
            return bestOutcome;
        }

        var betterScore = function(outcomeScore){
            //player 1 wants the highest score
            //player 2 wants the lowest score

            if (player == 1){
                return outcomeScore > bestScore;
            } else {
                return outcomeScore < bestScore;
            }
        }

        var bestScore = -(11 * this.player); //lower than lowest possible

        return pickOutcome(outcomes);

    }

    this.minimaxBoot = function() {
        //bootstraps the minimax function
        //returns the best possible move.

        var outcomes = this.minimax();
        return outcomes;
    }
            
    //     //look at all of the outcomes, 
    //     //decide which is the best and return
            

    //     }
    // }

}

var board = [
    [null,  1,   1],
    [null,  0,   0],
    [0,  1,   0]
];

game = new Game(board, 1, 0);

move = game.minimaxBoot();
console.log(move);
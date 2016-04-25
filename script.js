var Game = function(board, player, depth, lastMove, playerLtr){
    //board: a 2d array of representing the game state
    //player: whose turn is it? (player or computer)
        //1 = computer, 0 = human
    //depth: how many turns have occured? Start counting with 0
    //lastMove: the last move that was made
    //playerLtr: which letter the computer is playing as. 


    this.board = board;
    this.player = player;
    this.depth = depth;
    this.lastMove = lastMove;
    this.playerLtr = playerLtr;

    //set the player turn in the screen

    $("#whosTurn").text("Player turn: "+ this.playerLtr);

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
        //NOTE: THIS FUNCTION IS TO BE USED WITH MINIMAX. DON'T USE IT TO SWAP PLAYERS IN THE ACTUAL GAME.

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

    this.compGo = function() {
        //bootstraps the minimax function
        //returns the best possible move.

        var moveChoice = this.minimax();
        this.move(moveChoice);
        //call player to go if game isn't over.

        console.log("handing off to player")
        this.playerGo();
    }

    this.playerGo = function() {
        //listen for click
        $("body").click(clickBoard(event).then(
            function(match){
                var row = Math.floor(match / 3);
                var column = match % 3;
                var moveChoice = [row, column];
                this.move((moveChoice));
                console.log("handing off to computer!")
                this.compGo()
            })
        )
    }

    this.move = function(mv) {
        //player's move is added to the board 
        //and player is swapped
        //mv: array of x,y coords, assume they are null.
        //NOTE: this is the method to use for moving in actual game play.

        this.board[mv[0], mv[1]] = this.player;
        this.player = Number(!this.player);
        this.popPage();
    }


    this.popPage = function() {
        //page is populated with board.

        if (this.playerLtr == 'x'){
            var coordPrintable = { '0':'x' , '1': 'o' };
        } else {
            var coordPrintable = { '1': 'x', '0': 'o' };
        }

        var pageRows = $(".ttt-row");
        for (var r=0; r<this.board.length; r++){
            var pageRow = pageRows[r];
            var cells = $(pageRow).find(".table-cell");
            for (c=0; c<this.board[r].length; c++){
                //populate the page cell with the right value
                var boardValue = this.board[r][c];
                var cell = cells[c]
                $(cell).text(coordPrintable[boardValue])
                // .text(coordPrintable[boardValue]);
            }
        }
    }

}

var clickBoard = function(event) {

    return new Promise(function(resolve, reject){

        try {

            //make sure player isn't cheating and trying to click on an occupied spot!
            if (!event.target.text() === null ) {
                throw TypeError;
            }
 
            var cellNum = event.target.id;
            // var re = /cell(\d)/;
            var match = cellNum.match(/\d/)[0];
            // var row = Math.floor(match / 3);
            // var column = match % 3;
            resolve(match);
            
        } catch (e) {
            reject();
        }

    })
}


$(document).ready(function(){
    console.log("doc ready!")
    $('#setupModal').modal('show');

    $("#submitBtn").click(function(event) {

        var dataArr = $("#gameSetupForm").serializeArray();

        //prep user input
        var data = {}        
        for (i in dataArr){
            var obj = dataArr[i];
            data[obj["name"]] = obj["value"];
        }

        var emptyBoard = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];

        var game = new Game(emptyBoard, data["compFirst"], 0, [null, null], data["xOrO"])
        //here is where the game loop begins

        console.log("LET'S START THE GAME!")

        if (game.player) {
            game.compGo()
        } else {
            game.playerGo();
        }

    });

})
var Game = function(board, player, depth, lastMove, playerLtr){
    //board: an array of representing the game state upper left =0, lower right =8
    //player: whose turn is it? (player or computer)
        //1 = computer, 0 = human
    //depth: how many turns have occured? Start counting with 0
    //lastMove: the last move that was made. Index if the last square filled in.
    //playerLtr: the letter representing the human player


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
        board = this.board


        function checkItem(i){
            return board[i] == playerToCheck;
        }

        var wins = [

            //rows
            [0,1,2],
            [3,4,5],
            [6,7,8],

            //columns
            [0,3,6],
            [1,4,7],
            [2,5,8],

            //diagnals
            [0,4,8],
            [2,4,6]

        ]

        for(w=0;w<wins.length;w++){
            var possibleWin = wins[w];
            if(possibleWin.every(checkItem)){
                return true;
            }
        }

        return false;

    }

    this.score = function() {
        //returns the score of the current game state

        if (this.win()){
            if(this.player){
                //the current player is 1, meaning 0 wins
                return 10 - this.depth;
            } else {
                //the current player is 0, meaing 1 wins
                return -10 + this.depth;
            }
        } else {
            return 0;
        }
    }

    this.step = function(move){
        //creates a new game object based on move and returns the result
        //move: an integer of the index to move into
        //returns a new game with move applied
            //player is flipped
            //depth is incremented by 1
        //NOTE: THIS FUNCTION IS TO BE USED WITH MINIMAX. DON'T USE IT TO SWAP PLAYERS IN THE ACTUAL GAME.

        //shallow copy the board!
        var newBoard = this.board.slice();

        newBoard[move] = this.player;

        var player = Number(!this.player);

        var depth = this.depth + 1;

        return new Game(newBoard, player, depth, move, this.playerLtr);
    }

    this.getPossibleMoves = function() {
        //returns array of all possible moves.

        return this.board.map(function(v, i, arr){
            if(v===null){
                return i;
            }
        }).filter(function(j){ return j != undefined; })
    }

    this.getbestMove = function(depth) {
        //look for the best possible move


        //base case condition:
            //
        if(this.score() != 0 || this.depth == depth){

            //setting max depth
            console.log("base case!")
            outcome = new Object;
            outcome[this.score()] = this.lastMove;
            return outcome;
            
        } else {


            console.log("gonna recurse!")
            //recursion!
            var outcomes = [];
            var possibleMoves = this.getPossibleMoves();
            for (var m=0; m<possibleMoves.length; m++){
                    var move = possibleMoves[m];
                    newGame = this.step(move);
                    outcome = newGame.getbestMove(depth);
                    outcomes.push(outcome);
                }
        }


        //after possible moves have been anaylized to determine their score, determine the best one
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

        console.log("handing back to turn controller!")
        this.turnController();
    }

    this.playerGo = function() {
        //listen for click
        $("body").click(clickBoard(event).then(
            function(match){
                // call back for when the player picks a spot

                var row = Math.floor(match / 3);
                var column = match % 3;
                var moveChoice = [row, column];
                this.move((moveChoice));
                console.log("handing back to turn controller!")
                this.turnController();
            })
        )
    }


    this.turnController = function() {
        //determines who's turn is next and prompts their move.
        //if player is up next, prompt the computer and visa-versa
        //if the game is over, wrap up

        if (this.win()) {
            console.log("the game is over")
            //wrap up the game
        } else if (this.player) {
            //its the computer's turn
            console.log("handing off to computer")
            this.compGo()
        } else {
            console.log("handing off to player")
            //its the player's turn
            this.playerGo();
        }


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
        var emptyBoard = [1, 1, null, null, 1, null, null, null, null];


        //(board, player, depth, lastMove, playerLtr)
        var game = new Game(emptyBoard, 1, 0, null, 'x')
        // console.log(game.getPossibleMoves());
        console.log(game.getbestMove(3));





    // $('#setupModal').modal('show');

    // $("#submitBtn").click(function(event) {

    // $('#setupModal').modal('hide');        

    //     var dataArr = $("#gameSetupForm").serializeArray();

    //     console.log(dataArr);

    //     //prep user input
    //     var data = {}        
    //     for (i in dataArr){
    //         var obj = dataArr[i];
    //         data[obj["name"]] = obj["value"];
    //     }

    //     var emptyBoard = [
    //         [1,1,1],
    //         [null, null, null],
    //         [null, null, null]
    //     ];

    //     var game = new Game(emptyBoard, data["compFirst"], 0, [null, null], data["xOrO"])
    //     //here is where the game loop begins

    //     console.log("LET'S START THE GAME!")

    //     console.log("testing first move...")
    //     var t0 = new Date();

    //     console.log(game.minimax());

    //     t1 = new Date();
    //     console.log("Time to run... ");
    //     console.log(t1-t0);
    //     // game.turnController();

    // });

})
var Game = function(board, player, depth, lastMove, parentState, playerLtr){
    //board: a 2d array of representing the game state
    //player: whose turn is it? (player or computer)
        //1 = computer, 0 = human
    //depth: how many turns have occured? Start counting with 0
    //lastMove: the last move that was made
    //lastState: the gameState prior to the move that created the current game state.
    //playerLtr: which letter the computer is playing as. 



    this.board = board;
    this.player = player;
    this.depth = depth;
    this.lastMove = lastMove;
    this.parentState = parentState;
    this.playerLtr = playerLtr;

    //set the player turn in the screen

    $("#whosTurn").text("Player turn: "+ this.playerLtr);

    this.win = function(){
        //determines if the game is in a winning state
        //we check win state before a turn is taken, therfore if there is a winner,
        //it is always the opposing player.

        var playerToCheck = Number(!this.player)
        var board = this.board;

        // can we just hard code victory conditions

        var winStates = [

            // horizontal wins
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],

            // vertical wins
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],

            // diagonal wins
            [0, 4, 8],
            [6, 4, 2]
        ]

        _matchesPlayer = function(index){
            //is player found at this index?

            var row = Math.floor(index/3);
            var col = index % 3;
            return board[row][col] == playerToCheck;
        }

        for(var i=0; i<winStates.length; i++){
            var state = winStates[i];

            if(state.every(_matchesPlayer)){
                return true;
            }
        }
        return false;
    }

    this.score = function() {
        //returns the score of the current game state

        console.time("score")

        if (this.win()){
            if(this.player){
                //the current player is 1, meaning 0 wins
                console.timeEnd("score")

                return -10 + this.depth;
            } else {
                //the current player is 0, meaing 1 wins
                console.timeEnd("score")

                return 10 - this.depth;
            }
        } else {
            console.timeEnd("score")

            return 0;
        }
    }

    this.step = function(move){
        //creates a new game object based on move and returns the result
        //move: a 2d array of coordinates to move
        //returns a new game with move applied
            //player is flipped
            //depth is incremented by 1
        //function(board, player, depth, lastMove, lastState, playerLtr)

        console.time("step")
        
        var newBoard = this.board.map(function(arr) {
            return arr.slice(); //shallow copy the board!
        })
        newBoard[move[0]][move[1]] = this.player;

        var player = Number(!this.player);    //flip the player

        var depth = this.depth + 1;

        console.timeEnd("step")
        return new Game(newBoard, player, depth, move, this, this.playerLtr)
    }

    this.getPossibleMoves = function() {
        //returns 2d array of all possible moves. examlpe [[0,1], [0, 2]...]

        console.time("getPossibleMoves")
        var possibleMoves = [];
        for (r in this.board){
            for (c in this.board){
                if (this.board[r][c] === null){
                    possibleMoves.push([r, c]);
                }
            }
        }

        console.timeEnd("getPossibleMoves")
        return possibleMoves;
    }

    this.findBestOutcome = function() {
        //SECOND ATTEMPT
        //perform a bredth first search of the tree. 
        //return the best winning game state


        //THIS STILL TAKES TOO LONG!
        console.time("findBestOutcome");

        var queue = []; //a queue of Game objects.


        queue.push(this)    

        while(queue.length > 0){

            var gameState = queue.shift();    // dequeue a Game

            if (gameState.score() > 0){
                // a winning game for the computer!
                console.timeEnd("findBestOutcome");
                return gameState;

            } else {
                // get all possible children states and enqueue

                //idea: rather than iterating over the whole board for each step,
                //lets persist an array of possible moves that parents
                //pass on to their children

                // if the game is a tie, hold on to it. We may use it as a
                //consolation

                var possibleMoves = this.getPossibleMoves();
                for (var m=0; m<possibleMoves.length; m++) {
                    newGame = gameState.step(possibleMoves[m]);
                    queue.push(newGame);
                }
            }

        }
    }


    this.traceBack = function(childGame){
        // given a decendant game state, traces back to the immediate child.
        // returns immediate child of this, that leads to childGame


        var child = childGame;
        while(true){

            if(child.parentState === this){
                // we found the immediate child!    
                return child.lastMove;
            } else {
                child = child.parentState;
            }
        }
    }

    this.compGo = function() {
        //bootstraps the minimax function
        //returns the best possible move.

        var bestState = this.findBestOutcome();
        var bestMove = this.traceBack(bestState);
        console.log("here's the best move");
        console.log(bestMove);
        this.move(bestMove);

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
                console.log("done with computer move");

                this.turnController();
            })
        )
    }


    this.turnController = function() {
        //determines who's turn is next and prompts their move.
        //if player is up next, prompt the computer and visa-versa
        //if the game is over, wrap up

        if (this.win()) {
            console.log("GAME OVER")
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

        this.board[mv[0]][mv[1]] = this.player;
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

    $('#setupModal').modal('show');

    $("#submitBtn").click(function(event) {

    $('#setupModal').modal('hide');        

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

        game.turnController();

    });

})
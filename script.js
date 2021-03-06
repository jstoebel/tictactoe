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
        //remember: if the game was won, it was won by the opposing player
        //since we check for a win after a move is made and players are swapped 

        if (this.win()){
            if(this.player){
                //the current player is 1, meaning 0 wins
                return -10 + this.depth;
            } else {
                //the current player is 0, meaing 1 wins
                return 10 - this.depth;
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

    this.getbestMove = function(maxDepth) {
        //look for the best possible move


        //base case condition:
            //
        if(this.score() != 0 || this.depth == maxDepth){

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
                    outcome = newGame.getbestMove(maxDepth);
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

        var moveChoice = this.getbestMove(this.depth + 3);
        console.log(moveChoice);

        var moveIndex = moveChoice[Object.keys(moveChoice)[0]]; 
        this.move(Number(moveIndex));
        console.log("handing back to turn controller!")
        this.turnController();
    }

    this.playerGo = function() {
        //listen for click
        var game = this;
        $(".empty-cell").on("click", function(event){
            var clicked = event.target.id;
            var cellNum = clicked.match(/\d/)[0];
            game.move(Number(cellNum));

            $(".cell"+cellNum).removeClass(".empty-cell")
            $(".empty-cell").off("click")
            console.log("handing back to turn controller!")
            game.turnController();            
        })

    }

    this.turnController = function() {
        //determines who's turn is next and prompts their move.
        //if player is up next, prompt the computer and visa-versa
        //if the game is over, wrap up

        if (this.getPossibleMoves() == 0){
            console.log("TIE");
            wrapUp(null);
        } else if(this.win()) {
            console.log("WINNER!")
            wrapUp(Number(!this.player));
        } else if (Number(this.player)) {
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
        //mv: index of move to make
        //NOTE: this is the method to use for moving in actual game play.

        this.board[mv] = this.player;
        this.player = Number(!this.player);

        var cell = "#cell"+mv


        //TODO maybe populate the board in this function?
        if (this.playerLtr == 'x'){
            var coordPrintable = { 0:'x' , 1: 'o' };
        } else {
            var coordPrintable = { 0: 'o' , 1: 'x' };
        }

        $(cell).text(coordPrintable[this.player])

        console.log(this.board)
    }

}


function clearBoard() {
    $(".table-cell").text("")

}

function wrapUp(compWin) {
    //wraps up the game, displaying the right winner message

    $("#winner-msg").removeClass("hidden");

    if(compWin == 1) {
        var msg = "I win!"
    } else if (compWin === 0) {
        var msg = "You win!"
    } else {
        var msg = "Tie game!"
    }

    var msg = msg + " Let's play again!"

    $("#winner-msg").text(msg);
    startGame();


}

function startGame(){

    $('#setupModal').modal('show');

    $("#submitBtn").click(function(event) {

    $('#setupModal').modal('hide');        
        clearBoard();

        var dataArr = $("#gameSetupForm").serializeArray();

        //prep user input
        var data = {}        
        for (i in dataArr){
            var obj = dataArr[i];
            data[obj["name"]] = obj["value"];
        }

        var emptyBoard = [null, null, null, null, null, null, null, null, null];

        var game = new Game(emptyBoard, Number(data["compFirst"]), 0, [null, null], data["xOrO"])
        //here is where the game loop begins
        game.turnController();

    });    
}

$(document).ready(function(){

    startGame();
})
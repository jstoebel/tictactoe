var Game = function(board, player, depth, lastMove, ltrKey){
    //board: a array of size nine representing the current board
        // the first player is represented with 0 and the second player with 1
    //player: whose turn is it? (player or computer)
        //1 = computer, 0 = human
    //depth: how many turns have occured? Start counting with 0
    //lastMove: the last move that was made. 
    //ltrKey: object mapping players number (0 or 1) to letter (x or o). 

    this.board = board;
    this.player = player;
    this.depth = depth;
    this.lastMove = lastMove;
    this.ltrKey = ltrKey;

    this.pathways = {};     
    //a hash mapping this game state to its children when .move is called, 
    // we create a new game, and map the move that created it to the new game object.
    //this way each game state knows how to get to each of its children

    this.win = function(){
        //determines if the game is in a winning state
        //we check win state before a turn is taken, therfore if there is a winner,
        //it is always the opposing player.


    }

    this.score = function() {
        //returns the score of the current game state

    }


    this.getPossibleMoves = function() {
        //returns array of all possible moves. example [0, 3, 5]

        function isEmpty(i){
            return i === null;
        }

        return this.board.filter(isEmpty)
    }

    this.findBestOutcome = function() {

    }


    this.compGo = function() {
        //handles the computer's turn

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
        //generate a new game state based on the given move
            //generate a new game, with new board state (based on move)
            //swap player
        //mv: index of array

        console.time("move")

        var newBoard = this.board.slice();
        newBoard[mv] = this.player;

        var newPlayer = Number(!this.player);

        //(board, player, depth, lastMove, ltrKey)
        newGame = new Game(newBoard, newPlayer, this.depth+1, mv, this.ltrKey);
        this.pathways[lastMove] = newGame;  //record how to get to this child
        console.timeEnd("move")
        return newGame;
    }


    this.project = function(steps) {
        // builds out possible future states from current state
        // steps: number of steps to move ahead

        console.time("project");

        var maxDepth = this.depth + steps;
        var queue = [this];

        while(queue.length > 0){
            var curGame = queue.shift(); //grab a gameState

            //generate its children if we aren't at the max depth
            if(curGame.depth <= maxDepth){

                possibleMoves = curGame.getPossibleMoves();

                for(var m=0; m<possibleMoves.length; m++){
                    var mv = possibleMoves[m];
                    var newGame = curGame.move(mv);

                    queue.push(newGame); 
                }
            }
        }
        console.timeEnd("project");

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

var treeSetup = function(humanLtr) {
    // sets up the tree of game outcomes.
    // 0 (human) goes  first

    if (humanLtr == 'x'){
        var playerLtrs = { '0':'x' , '1': 'o' };
    } else {
        var playerLtrs = { '1': 'x', '0': 'o' };
    }

    var emptyBoard = [null, null, null, null, null, null, null, null, null];

    //(board, player, depth, lastMove, ltrKey)
    var root = new Game(emptyBoard, 0, 0, mv, playerLtrs);
    
    var queue = [root];
    while(queue.length > 0){
        var curGame = queue.shift();
        possibleMoves = curGame.getPossibleMoves();

        for(var m=0; m<possibleMoves.length; m++){
            var mv = possibleMoves[m];
            var newGame = curGame.move(mv);
            queue.push(newGame); 
        }

    }

    return root;

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

    var humanLtr = 'x';

    if (humanLtr == 'x'){
        var playerLtrs = { '0':'x' , '1': 'o' };
    } else {
        var playerLtrs = { '1': 'x', '0': 'o' };
    }
    var emptyBoard = [null, null, null, null, null, null, null, null, null];
    var game = new Game(emptyBoard, 0, 0, null, playerLtrs);
    console.log("LET'S START!");

});
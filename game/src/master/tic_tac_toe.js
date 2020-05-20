

// fen-> fen for tic tac toe
var TicTacToe = function(fen) {

    // 0 corresponds to empty square, 1 to 'x' and 2 to 'o'
    var board = '000000000';

    var validator = /^([0-2]{9})$/;

    // the first 9 chars corespond to the position
    // the next number corresponds to the half-move number (1 for the first 2 moves, 2 for the next 2 etc)
    var DEFAULT_POSITION = '000000000';
    var PLAYER_1 = '1';
    var PLAYER_2 = '2';
    var EMPTY = '0';

    var moves = [];
    var l;

    if (typeof fen === 'undefined') {
        load(DEFAULT_POSITION);
    } else {
        load(fen) || load(DEFAULT_POSITION);
    }


    function setCharAt(str,index,chr) {
        if(index > str.length-1) return str;
        return str.substr(0,index) + chr + str.substr(index+1);
    }

    function count(needle,haystack) {
        var pattern = new RegExp(needle, "g");
        return (haystack.match(pattern) || []).length;
    }

    /*
        Returns 1 if player 1 plays,
        2 if player 2 plays and 0
        if there was an error
    */
    function getPlayerTurn(my_board) {

        var count_x = count(PLAYER_1,my_board);
        var count_o = count(PLAYER_2,my_board);

        if(count_x == count_o + 1) {
            return 2;

        } else if(count_x == count_o) {
            
            return 1;

        } else return 0;

    }

    /*
        Returns true if player is winning
        and false otherwise
    */
    function isWinning(my_board,player) {
        
        var b = my_board.split('').map((x) => x-'0');
        var c = player - '0';

        if((b[0] & b[1] & b[2]) == c || (b[3] & b[4] & b[5]) == c || (b[6] & b[7] & b[8]) == c ) return true;
        
        if((b[0] & b[3] & b[6]) == c || (b[1] & b[4] & b[7]) == c || (b[2] & b[5] & b[8]) == c ) return true;
        
        if((b[0] & b[4] & b[8]) == c || (b[2] & b[4] & b[6]) == c ) return true;
        
        return false;
    }

    /*
        Returns 1 if player 1 won, 
                2 if player 2 won and 
                0 if nobody has won yet
    */
    function hasGameEnded(my_board) {

        if (isWinning(my_board,PLAYER_1)) return 1;
        else if(isWinning(my_board,PLAYER_2)) return 2;
        else return 0;
    }

    /*
        Gets the half move number.
        If the board is in a normal state,
        then the half move is >=1. Otherwise,
        the half move is 0
    */
    function getHalfMove(my_board) {
        return count(PLAYER_1, my_board);
    }

    /*
        move is of the form '00','01','02','10' etc
    */
    function makeMove(move) {
        
        if (hasGameEnded(board)) return false;

        var move_validator = /^([0-2])([0-2])$/;

        var matches = move_validator.exec(move);

        if(!matches || matches.length < 3) return false;

        var idx = 3*(matches[1]-'0') + (matches[2]-'0');

        if(idx>=board.length || board[idx] != EMPTY) return false;

        var turn = getPlayerTurn(board);

        if(turn == 0) return false;

        board = setCharAt(board,idx,turn+'');
        moves.push(move);

        return move;
    }

    /*
        Load position from string
    */
    function load(pos) {
        

        var matches = validator.exec(pos);

        if(!matches || matches.length != 2) return false;

        var new_board = matches[1];

        var turn = getPlayerTurn(new_board);

        if(turn == 0) return false;

        if(isWinning(new_board,PLAYER_1) && isWinning(new_board,PLAYER_2)) return false;

        moves = [];
        board = new_board;

        return true;
    }

    // PUBLIC API
    return {
        hasGameEnded: () => {
            /*
                Returns 1 if player 1 won, 
                        2 if player 2 won and 
                        0 if nobody has won yet
            */
            return hasGameEnded(board);
        },
        move: (move) => {
            /* 
                Returns the move on success and false on failure.
                Move must be in the form [0-2]{2}
                e.g. '00','01','02','10'
            */
            return makeMove(move);
        },
        fen: () => {
            /*
                Returns the board position as is
            */
            return board;
        },
        getLastMove: () => {
            /*
                Returns the last move on success and
                false otherwise.
            */
           if(moves.length == 0) return false;
           return moves[moves.length - 1];
        },
        getMoves: () => {
            /*
                Returns the array of moves
            */
            return moves;
        }
    };
}


if (typeof exports !== 'undefined') exports.TicTacToe = TicTacToe
/* export Chess object for any RequireJS compatible environment */
if (typeof define !== 'undefined')
  define(function() {
    return TicTacToe
  })



// var t = TicTacToe('110020002');

// console.log(t.getBoard());
// console.log('Has ended ',t.hasGameEnded());
// console.log(t.move('02'));
// console.log('Has ended ',t.hasGameEnded());

// console.log('Hello');
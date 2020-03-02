import * as actionTypes from '../constants/actionTypes';
import Chess from 'chess.js';
import { CHESS_POSITIONS, MOVES } from '../constants/chessMoves'

const synth = window.speechSynthesis;

export function initBoard() {
    return dispatch => {
        dispatch({ type: actionTypes.INIT_BOARD })
    }
}
export function  makeMove(payload) {
    return dispatch => {
        dispatch({ type: actionTypes.MAKE_MOVE });
        const chess = new Chess(payload.fen);
        const olfFen = payload.fen;
        chess.move({ from: payload.from, to: payload.to });
        const fen = chess.fen();
        if(chess.in_checkmate()){

        }else if(olfFen === fen) {
            dispatch({ type: actionTypes.MAKE_MOVE_FAILURE, payload });
            if (synth.speaking) {
                console.error('speechSynthesis.speaking');
                return;
            }
            
            let utterThis = new SpeechSynthesisUtterance('Failure');
            utterThis.onend = function (event) {
                console.log('SpeechSynthesisUtterance.onend');
            }
            utterThis.onerror = function (event) {
                console.error('SpeechSynthesisUtterance.onerror');
            }

            synth.speak(utterThis);
        }else{
            if (synth.speaking) {
                console.error('speechSynthesis.speaking');
                return;
            }
            
            let utterThis = new SpeechSynthesisUtterance(`Moved ${payload.from} to ${payload.to}`);
            utterThis.onend = function (event) {
                console.log('SpeechSynthesisUtterance.onend');
            }
            utterThis.onerror = function (event) {
                console.error('SpeechSynthesisUtterance.onerror');
            }

            utterThis.rate = 1.2;
            synth.speak(utterThis);
            dispatch({ type: actionTypes.MAKE_MOVE_SUCCESS, payload: {...payload, fen, oldFen: payload.fen, prevFrom: payload.from, prevTo: payload.to} });
        }
    }
}

export function doUndo() {
    return dispatch => {
        dispatch({ type: actionTypes.DO_UNDO })
    }
}
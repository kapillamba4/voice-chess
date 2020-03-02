import * as actionTypes from "../constants/actionTypes";
import Chess from "chess.js";

const synth = window.speechSynthesis;

export function initBoard() {
  return dispatch => {
    dispatch({ type: actionTypes.INIT_BOARD });
  };
}
export function makeMove(payload) {
  return dispatch => {
    dispatch({ type: actionTypes.MAKE_MOVE });
    const chess = new Chess(payload.fen);
    const olfFen = payload.fen;
    chess.move({ from: payload.from, to: payload.to });
    const fen = chess.fen();
    if (chess.in_checkmate()) {
    } else if (olfFen === fen) {
      dispatch({ type: actionTypes.MAKE_MOVE_FAILURE, payload });
      if (synth.speaking) {
        console.error("speechSynthesis.speaking");
        return;
      }

      let utterThis = new SpeechSynthesisUtterance("Failure");
      utterThis.onend = function(event) {
        console.log("SpeechSynthesisUtterance.onend");
      };
      utterThis.onerror = function(event) {
        console.error("SpeechSynthesisUtterance.onerror");
      };

      synth.speak(utterThis);
    } else {
      if (synth.speaking) {
        console.error("speechSynthesis.speaking");
        return;
      }

      let utterThis = new SpeechSynthesisUtterance(
        `Moved ${payload.from} to ${payload.to}`
      );
      utterThis.onend = function(event) {
        console.log("SpeechSynthesisUtterance.onend");
      };
      utterThis.onerror = function(event) {
        console.error("SpeechSynthesisUtterance.onerror");
      };

      utterThis.rate = 1.2;
      synth.speak(utterThis);
      const oldFenMap = payload.fen
        .split(" ")[0]
        .split("")
        .filter(e => e !== "/")
        .filter(e => e !== "8")
        .filter(e => e !== "7")
        .filter(e => e !== "6")
        .filter(e => e !== "5")
        .filter(e => e !== "4")
        .filter(e => e !== "3")
        .filter(e => e !== "2")
        .filter(e => e !== "1")
        .filter(e => e !== "0")
        .reduce((acc, {}, idx, arr) => {
          acc[arr[idx]] = acc[arr[idx]] === undefined ? 0 : acc[arr[idx]] + 1;
          return acc;
        }, {});
      const newFenMap = fen
        .split(" ")[0]
        .split("")
        .filter(e => e !== "/")
        .filter(e => e !== "8")
        .filter(e => e !== "7")
        .filter(e => e !== "6")
        .filter(e => e !== "5")
        .filter(e => e !== "4")
        .filter(e => e !== "3")
        .filter(e => e !== "2")
        .filter(e => e !== "1")
        .filter(e => e !== "0")
        .reduce((acc, {}, idx, arr) => {
          acc[arr[idx]] = acc[arr[idx]] === undefined ? 0 : acc[arr[idx]] + 1;
          return acc;
        }, {});
      const pieceName = {
        r: "Black Rook",
        n: "Black Knight",
        b: "Black Bishop",
        q: "Black Qween",
        k: "Black King",
        p: "Black Pawn",
        R: "White Rook",
        N: "White Knight",
        B: "White Bishop",
        Q: "White Qween",
        K: "White King",
        P: "White Pawn"
      };
      Object.keys(oldFenMap).forEach(val => {
        if (newFenMap[val] !== oldFenMap[val]) {
          utterThis = new SpeechSynthesisUtterance(
            `${pieceName[val]} Eliminated`
          );
          utterThis.onend = function(event) {
            console.log("SpeechSynthesisUtterance.onend");
          };
          utterThis.onerror = function(event) {
            console.error("SpeechSynthesisUtterance.onerror");
          };

          utterThis.rate = 1.2;
          synth.speak(utterThis);
        }
      });
      dispatch({
        type: actionTypes.MAKE_MOVE_SUCCESS,
        payload: {
          ...payload,
          fen,
          oldFen: payload.fen,
          prevFrom: payload.from,
          prevTo: payload.to
        }
      });
    }
  };
}

export function doUndo() {
  return dispatch => {
    dispatch({ type: actionTypes.DO_UNDO });
  };
}

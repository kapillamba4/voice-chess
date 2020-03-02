import * as actionTypes from '../constants/actionTypes';
import Chess from 'chess.js';

const initialState = {
    oldFen: null,
    fen: new Chess().fen(),
    prevFrom: null,
    prevTo: null,
    from: null,
    to: null
};

export default (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.INIT_BOARD:
            return state;
        case actionTypes.MAKE_MOVE:
            return state;
        case actionTypes.MAKE_MOVE_SUCCESS:
            return {
                ...state,
                oldFen: action.payload.oldFen,
                fen: action.payload.fen,
                prevFrom: action.payload.prevFrom,
                prevTo: action.payload.prevTo,
                from: action.payload.from,
                to: action.payload.to
            }   
        case actionTypes.MAKE_MOVE_FAILURE:
            return state;
        case actionTypes.DO_UNDO:
            if (state.oldFen === null) {
                return state
            }
            return {
                ...state,
                oldFen: null,
                prevFrom: null,
                prevTo: null,
                fen: state.oldFen,
                from: state.prevFrom,
                to: state.prevTo
            }
        default: 
            return state;
    }
}
import React, {Component} from 'react';
import Header from './Header';
import './App.scss';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { initBoard, makeMove, doUndo } from '../actions/commands';
import { MOVES, CHESS_POSITIONS } from '../constants/chessMoves';
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList

const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();
const grammar = '#JSGF V1.0; grammar chess; public <chess_position> = ' + CHESS_POSITIONS.join(' | ') + ' ; public <chess_move> = <chess_position> TO <chess_position>;';
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1000;
const FuzzySet = window.FuzzySet;
const fzySet = FuzzySet(MOVES);
class App extends Component {
    state = {
        board: null,
        diagnostic: {}
    }
    componentDidMount() {
        this.props.initBoard();
        console.log(this.props);
        this.state.board = window.ChessBoard('board', {
            position: this.props.fen
        });
        document.addEventListener('keyup', event => {
            if (event.code === 'Space') {
              recognition.start();
              console.log('Ready to receive a command.');
            }
        })
        recognition.onresult = (event) => {
            // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
            // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
            // It has a getter so it can be accessed like an array
            // The [last] returns the SpeechRecognitionResult at the last position.
            // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
            // These also have getters so they can be accessed like arrays.
            // The [0] returns the SpeechRecognitionAlternative at position 0.
            // We then return the transcript property of the SpeechRecognitionAlternative object
          
            var last = event.results.length - 1;
            var result = event.results[last][0].transcript.toUpperCase();
            console.log(event.results);
            var flag = false;
            for(let i = 0; i < event.results[last].length; i++){
              for(let j = 0; j < MOVES.length; j++){
                if(event.results[last][i].transcript.toUpperCase() === 'UNDO') {
                    this.props.doUndo();
                    return;
                }
    
                if(event.results[last][i].transcript.toUpperCase() === MOVES[j]){
                  result = MOVES[j];
                  flag = true;
                  break;
                }
                if(flag) break;
              }
            }
          
            // if(!flag) {
            //   for(let i = 0; i < event.results[last].length; i++){
            //     console.log(fzySet.get(event.results[last][i].transcript.toUpperCase()));
            //     if(fzySet.get(event.results[last][i].transcript.toUpperCase()) !== null){
            //       result = fzySet.get(event.results[last][i].transcript.toUpperCase())[0][1];
            //       break;
            //     }
            //   }
            // }
          
            var fzySetList = [];
            if(!flag) {
              for(let i = 0; i < event.results[last].length; i++){
                fzySetList = fzySetList.concat(fzySet.get(event.results[last][i].transcript.toUpperCase()) || []);
              }
          
              fzySetList.sort(function(a, b){return b[0] - a[0]});
              result = fzySetList[0][1];
            }
            this.props.makeMove({fen: this.props.fen, from: result.slice(0,2).toLowerCase(), to: result.slice(6,8).toLowerCase()});

            console.log('Result received: ' + result + '.');
        }
          
        recognition.onspeechend = function() {
            recognition.stop();
        }
          
        recognition.onnomatch = (event) => {
            console.log("I didn't recognise that.");
        }
          
        recognition.onerror = (event) => {
            console.log('Error occurred in recognition.');
        }
    }
    componentDidUpdate() {
        this.state.board.destroy();
        this.state.board = window.ChessBoard('board', {
            position: this.props.fen
        });
    }
    render() {
        return (<div>
            <Header />
            <div id="board"></div>     
        </div>);
    }
}


const mapStateToProps = state => ({ ...state.commands });
const matchDispatchToProps = dispatch =>
  bindActionCreators({ initBoard, makeMove, doUndo }, dispatch);

export default connect(
  mapStateToProps,
  matchDispatchToProps,
)(App);

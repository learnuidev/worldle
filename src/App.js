import { useState, useEffect } from 'react'
import './App.css';
import { wordsDictionary } from './constants'
import { world } from './data/cities'


console.log("worldle", world)
// Steps:
// 1. Define game state
// 2. Define handlers
// 3. Custom Components - KeyList
// 4. Custom Component - GameBoard


// Custom Components
function KeyList(props) {
  return <div id="key-list">
    {props.keyList.map(key => {
      return (<button onClick={() => props.handleKeyBoard(key)}>{key}</button>)
    })}
  </div>
}

function GameTile(props) {
  const { letter } = props
  return (
    <div class="game-tile">
      {letter}
    </div>
  )
}

function GameRow(props) {
  const { guess } = props;
  return (
    <div class="game-row">
      {guess.map(letter => {
        return <GameTile letter={letter} />
      })}
    </div>
  );
}

function transformForView(currentGuess) {
  const guessColl = currentGuess.split("")
  return Array(5).fill("").map((i, idx) => {
    if (guessColl[idx]) {
      return guessColl[idx]
    }
    return " "
  })
}

function GameBoard(props) {
  const { guessHistory, currentGuess } = props
  const guessHistoryLength = guessHistory.length
  const empties = Array(5 - guessHistory.length).fill("     ")
  console.log("EMPTIES", empties)
  return (

    <main class="game-board-container">
      <div class="game-board">
        {guessHistory.map((guess, idx) => {
          return (<GameRow key={`${guess}-${idx}`} guess={guess.split("")} />)
        })}
        <GameRow guess={transformForView(currentGuess)} />

        {/* <GameRow  */}
        {empties.map((guess, idx) => {
          return (<GameRow key={`${guess}-${idx}`} guess={guess.split("")} />)
        })}
      </div>
    </main>

  )
}

// FUTURE WORK:
// Convert keys items from string to object
// Why? - can metadata such as cutom key color,
// User can set their own color
function KeyBoard(props) {
  const { on, handleKeyBoard } = props
  const keys = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', "Backspace"]
  ]

  return (
    <div id="keyboard">
      {keys.map(keyList => {
        return <KeyList keyList={keyList} handleKeyBoard={handleKeyBoard} />
      })}
    </div>
  )
}


const secret = 'PARIS'

function App() {
  // 1. game state
  const [guessHistory, setGuessHistory] = useState([])
  const [currentGuess, setCurrentGuess] = useState('')

  // Define event handlers (3)

  // 1. handler - handles characters
  const handleChar = char => {
    // guard
    if (currentGuess.length < 5) {
      setCurrentGuess(`${currentGuess}${char}`.toUpperCase())
    }
  }

  // 2. handles deleting charater
  const handleDelete = () => {
    // handle delete
    setCurrentGuess(currentGuess.slice(0, -1))
  }

  // 3. handles submittion
  const handleEnter = () => {
    // check if the currentGuess has 5 chars
    if (currentGuess.length < 5) {
      alert("Not enough letters")
    } else if (secret === currentGuess) {
      alert('You win')
    } else if (!world.includes(currentGuess)) {
      alert('Word not in list')
    }
    else if (guessHistory.length === 5) {
      alert('You lose')
    }
    else {
      // add the current guess to guessHistory
      // reset currentGuess
      setGuessHistory(guessHistory.concat(currentGuess))
      setCurrentGuess('')
    }
  }

  const handleKeyBoard = (value) => {
    if (value === 'Backspace') {
      handleDelete()
    } else if (value === "Enter") {
      handleEnter()
    } else {
      handleChar(value)
    }
  }

  const handleKeyup = (event) => {
    handleKeyBoard(event.key)
  }


  useEffect(() => {
    window.addEventListener("keyup", handleKeyup)
    // cleanup function
    return () => window.removeEventListener('keyup', handleKeyup)
  }, [handleChar, handleDelete, handleEnter])


  return (
    <div className="game" onKeyUp={handleKeyup}>
      <header>
        worldle
      </header>
      <GameBoard guessHistory={guessHistory} currentGuess={currentGuess} />
      <KeyBoard handleKeyBoard={handleKeyBoard} />
    </div>
  );
}

export default App;

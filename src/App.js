import { useState, useEffect } from 'react'
import './App.css';
import { wordsDictionary } from './constants'
import { world } from './data/cities'


console.log("worldle", world)
// Steps:
// 1. Define game state
// 2. Define handlers


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

  const handleKeyup = (event) => {
    if (event.key === 'Backspace') {
      handleDelete()
    } else if (event.key === "Enter") {
      handleEnter()
    } else {
      handleChar(event.key)
    }
  }


  useEffect(() => {
    window.addEventListener("keyup", handleKeyup)
    // cleanup function
    return () => window.removeEventListener('keyup', handleKeyup)
  }, [handleChar, handleDelete, handleEnter])


  return (
    <div className="App" onKeyUp={handleKeyup}>
      <header>
        worldle
      </header>
      <main>
        <div>
          {guessHistory.map((guess, idx) => {
            return (<div key={`${guess}-${idx}`}> {guess}</div>)
          })}
        </div>
        <div>
          {currentGuess}
        </div>
      </main>
    </div>
  );
}

export default App;

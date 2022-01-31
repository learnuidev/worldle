import {
  InformationCircleIcon,
  ChartBarIcon,
  SunIcon,
} from '@heroicons/react/outline'
import { useState, useEffect } from 'react'
import { wordsDictionary } from './constants'
import { world } from './data/cities'


console.log("worldle", world)
// Steps:
// 1. Define game state
// 2. Define handlers
// 3. Custom Components - KeyList
// 4. Custom Component - GameBoard


// Custom Components

function GameTile(props) {
  const { letter } = props
  return (
    <div className="w-14 h-14 border-solid border-2 flex items-center justify-center mx-0.5
                    text-lg font-bold">
      {letter}
    </div>
  )
}

function GameRow(props) {
  const { guess } = props;
  return (
    <div className="flex justify-center mb-1">
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

    <main className="pb-6">

      {guessHistory.map((guess, idx) => {
        return (<GameRow key={`${guess}-${idx}`} guess={guess.split("")} />)
      })}
      <GameRow guess={transformForView(currentGuess)} />

      {/* <GameRow  */}
      {empties.map((guess, idx) => {
        return (<GameRow key={`${guess}-${idx}`} guess={guess.split("")} />)
      })}

    </main>

  )
}

// FUTURE WORK:
// Convert keys items from string to object
// Why? - can metadata such as cutom key color,
// User can set their own color
function KeyItem(props) {
  return (
    <button className={`flex mx-auto items-center 
                        justify-center bg-slate-300 
                        rounded mx-0.5 text-xs font-bold
                        cursor-pointer uppercase`}
      style={{ width: "100%", height: "58px" }}
      onClick={() => props.handleKeyBoard(props.value)}>
      {props.value}
    </button>
  )
}

function KeyList(props) {
  return <div className={"flex justify-center mb-1 mx-auto"}>
    {props.keyList.map(key => {
      return (
        <KeyItem key={key} handleKeyBoard={props.handleKeyBoard} value={key} />
      )
    })}
  </div>
}


function KeyBoard(props) {
  const { on, handleKeyBoard } = props
  const keys = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', "Backspace"]
  ]

  return (
    <div>
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
    <div className="py-8 sm:px-6 lg:px-8 max-w-7xl" onKeyUp={handleKeyup}>
      <header className="flex w-80 mx-auto mt-10 mb-8">
        <h1 className={"grow text-xl font-bold"}>worldle </h1>
        <SunIcon className={"h-6"}
        />
        <InformationCircleIcon className={"h-6"}
        />
        <ChartBarIcon className={"h-6"}
        />
      </header>
      <GameBoard guessHistory={guessHistory} currentGuess={currentGuess} />
      <KeyBoard handleKeyBoard={handleKeyBoard} />
    </div>
  );
}

export default App;

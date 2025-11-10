import { useState } from 'react'
import TerminalMode from './pages/TerminalMode'


function App() {
  const [count, setCount] = useState(0)

  return (
    <TerminalMode />
  )
}

export default App

import Grid from './Grid'
import './App.css'
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>2048</h1>
      <Grid />
    </div>
  )
}

export default App

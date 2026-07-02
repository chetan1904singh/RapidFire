import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>Hello</div>
      <Home />
    </>
  )
}

export default App

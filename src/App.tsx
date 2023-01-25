import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Model from './components/Model/Model'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App" style={{height: "100%"}}>
      <Model />
    </div>
  )
}

export default App

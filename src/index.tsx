import React from 'react'
import ReactDOM from 'react-dom'
import Resizer from './lib'

function App() {
  return (
    <Resizer style={{ background: 'green', padding: 20 }}>Hello world</Resizer>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))

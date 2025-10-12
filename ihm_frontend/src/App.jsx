import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ApiService from './services/api'

function App() {
  const [count, setCount] = useState(0)
  const [backendStatus, setBackendStatus] = useState('Checking...')
  const [echoMessage, setEchoMessage] = useState('')
  const [echoResponse, setEchoResponse] = useState('')

  useEffect(() => {
    // Test backend connection on component mount
    const testBackendConnection = async () => {
      try {
        await ApiService.healthCheck()
        setBackendStatus('✅ Connected to Backend')
      } catch (error) {
        setBackendStatus('❌ Backend Connection Failed')
        console.error('Backend connection error:', error)
      }
    }

    testBackendConnection()
  }, [])

  const handleEchoTest = async () => {
    if (!echoMessage.trim()) return
    
    try {
      const response = await ApiService.echo(echoMessage)
      setEchoResponse(response.message || 'No response')
    } catch (error) {
      setEchoResponse('Error: ' + error.message)
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>IHM Frontend + Backend</h1>
      
      {/* Backend Status */}
      <div className="card">
        <h3>Backend Status</h3>
        <p style={{ color: backendStatus.includes('✅') ? 'green' : 'red' }}>
          {backendStatus}
        </p>
      </div>

      {/* Counter Demo */}
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      {/* Echo Test */}
      <div className="card">
        <h3>Test Backend Echo</h3>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={echoMessage}
            onChange={(e) => setEchoMessage(e.target.value)}
            placeholder="Enter message to echo"
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <button onClick={handleEchoTest}>Send Echo</button>
        </div>
        {echoResponse && (
          <p>Response: <strong>{echoResponse}</strong></p>
        )}
      </div>

      <p className="read-the-docs">
        Frontend is now configured with backend API integration
      </p>
    </>
  )
}

export default App

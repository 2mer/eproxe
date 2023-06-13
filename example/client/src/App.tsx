import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import API from './api'

function App() {
	// @ts-ignore
  const { data, mutate, isValidating } = API.testApi.getRandomNumber.use(-50, 50);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>eproxe + swr</h1>
      <div className="card">
        <button onClick={() => mutate()}>
          mutate
        </button>
        <p>
          random: {isValidating ? 'Loading...' : data}
        </p>
      </div>
    </>
  )
}

export default App

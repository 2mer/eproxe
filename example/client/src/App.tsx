import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import API from './api';

function App() {
	const { data, mutate, isValidating } = API.testApi.getRandomNumber.use(
		-50,
		50
	);

	API.testApi.getRandomNumber.use(1, 2);
	API.testApi.getRandomNumber.mutate();
	API.testApi.mutate();
	API.testApi.getRandomNumber(1, 2);
	// API.testApi.mutate();
	// API.testApi.getRandomNumber

	return (
		<>
			<div>
				<a href='https://vitejs.dev' target='_blank'>
					<img src={viteLogo} className='logo' alt='Vite logo' />
				</a>
				<a href='https://react.dev' target='_blank'>
					<img
						src={reactLogo}
						className='logo react'
						alt='React logo'
					/>
				</a>
			</div>
			<h1>eproxe + axios + swr</h1>
			<div
				className='card'
				style={{
					display: 'flex',
					gap: '1rem',
					justifyContent: 'center',
				}}
			>
				<button
					onClick={() =>
						API.testApi.getRandomNumber(0, 100).then(console.log)
					}
				>
					request
				</button>
				<button onClick={() => mutate()}>mutate</button>
			</div>
			<div className='card'>
				<p>random: {isValidating ? 'Loading...' : data}</p>
			</div>
		</>
	);
}

export default App;

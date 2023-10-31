import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './assets/css/index.css'
import './assets/css/output.css'
import App from './App'
import { AuthProvider } from './context/AuthProvider'
import { TailwindProvider } from './context/TailwindProvider'

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<TailwindProvider>
					<Routes>
						<Route path='/*' element={<App />} />
					</Routes>
				</TailwindProvider>
			</AuthProvider>
		</BrowserRouter>
	</React.StrictMode>
)
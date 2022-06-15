import './App.css';
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css"
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from './components/Header';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from './store/auth';

function App() {
	const dispatch = useDispatch();
	const user = JSON.parse(localStorage.getItem("user"));
	const token = localStorage.getItem("token");

	useEffect(() => {
		dispatch(setUser(user));
	}, [user, dispatch])

	useEffect(() => {
		dispatch(setToken(token))
	}, [token, dispatch])

	return (
		<BrowserRouter>
			<div className="App background">
				<Header />
				<ToastContainer />
				<Routes>
					<Route path="/" element={<Dashboard />} />
					<Route path="/login" element={<Login className="background" />} />
					<Route path="/register" element={<Register />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;

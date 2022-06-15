import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../config/api";

const initialState = {
	user: null,
	token: null,
	error: "",
	loading: false,
}

export const login = createAsyncThunk('api/login', async ({ formValue, navigate, toast }) => {
	try {
		const response = await api.post('/api/login', formValue)
		toast.success(`Bienvenido ${response.data.user.username}!!`, {
			position: "top-right",
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});

		navigate('/');
		return response.data;
	} catch (e) {
		toast.error(e.response.data.message, {
			position: "top-right",
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
	}
});

export const register = createAsyncThunk('api/register', async ({ formValue, navigate, toast }) => {
	try {
		const response = await api.post('/api/register', formValue)
		toast.success(`Registrado exitosamente!!`, {
			position: "top-right",
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});

		navigate('/');
		return response.data;
	} catch (e) {
		toast.error(e.response.data.message, {
			position: "top-right",
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
	}
});

const authSlice = createSlice({
	name: 'auth',
	initialState: initialState,
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
		},
		setToken: (state, action) => {
			state.token = action.payload;
		},
		setLogout: (state, action) => {
			state.user = null;
			state.token = null;
			localStorage.clear();
		}
	},
	extraReducers: {
		[login.pending]: (state, action) => {
			state.loading = true;
		},
		[login.fulfilled]: (state, action) => {
			state.loading = false;
			if (action.payload) {
				localStorage.setItem('user', JSON.stringify({ ...action.payload.user }));
				localStorage.setItem('token', action.payload.token);
				state.user = action.payload.user;
				state.token = action.payload.token;
			}
		},
		[login.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		},
		[register.pending]: (state, action) => {
			state.loading = true;
		},
		[register.fulfilled]: (state, action) => {
			state.loading = false;
			if (action.payload) {
				localStorage.setItem('user', JSON.stringify({ ...action.payload.user }));
				localStorage.setItem('token', action.payload.token);
				state.user = action.payload.user;
				state.token = action.payload.token;
			}
		},
		[register.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		}
	},
})

export const { setUser, setToken, setLogout } = authSlice.actions;
export default authSlice.reducer;

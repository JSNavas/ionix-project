import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../config/api";
import { toast } from "react-toastify";

const initialState = {
	users: [],
	error: "",
	loading: false,
	updateSuccess: false,
	createSuccess: false,
	deleteSuccess: false,
}

export const getUsers = createAsyncThunk('api/users/get', async () => {
	try {
		const response = await api.get('/api/users');
		console.log(response.data);
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

export const createUser = createAsyncThunk('api/users/create', async ({ formValueCreate, toast, navigate, dispatch }) => {
	try {

		const response = await api.post(`/api/users`, formValueCreate)
		const { file } = formValueCreate;
		const data = new FormData();

		data.append('user_id', response.data.user.id)
		data.append('file', file)

		await api.post(`/api/images`, data)

		toast.success(response.data.message, {
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
		dispatch(createRejected());
	}
});

export const updateUser = createAsyncThunk('api/users/update', async ({ formValue, toast, navigate, dispatch }) => {
	try {
		const response = await api.patch(`/api/users/${formValue.id}`, formValue)
		const { id, file } = formValue;

		if(file){
			const data = new FormData();
	
			data.append('user_id', id)
			data.append('file', file)
	
			await api.post(`/api/images`, data)
		}

		toast.success('Usuario actualizado con exito!', {
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
		dispatch(updateRejected());
	}
});

export const deleteUser = createAsyncThunk('api/users/delete', async ({ id, toast, navigate, dispatch }) => {
	try {
		const response = await api.delete(`/api/users/${id}`)
		toast.success(response.data.message, {
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
		dispatch(deleteRejected());
	}
});

const userSlice = createSlice({
	name: 'users',
	initialState: initialState,
	reducers: {
		createRejected: (state, action) => {
			state.loading = false;
			state.createSuccess = false;
		},
		updateRejected: (state, action) => {
			state.loading = false;
			state.updateSuccess = false;
		},
		deleteRejected: (state, action) => {
			state.loading = false;
			state.deleteSuccess = false;
		}
	},
	extraReducers: {
		[createUser.pending]: (state, action) => {
			state.loading = false;
			state.createSuccess = false;
		},
		[createUser.fulfilled]: (state, action) => {
			state.loading = false;
			state.createSuccess = true;
			state.users = [...state.users, action.payload.user];
		},
		[createUser.rejected]: (state, action) => {
			state.loading = false;
			state.createSuccess = false;
			state.error = action.payload.message;
		},
		[getUsers.pending]: (state, action) => {
			state.loading = true;
		},
		[getUsers.fulfilled]: (state, action) => {
			state.loading = false;
			state.users = action.payload;
		},
		[getUsers.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		},
		[updateUser.pending]: (state, action) => {
			state.loading = false;
			state.updateSuccess = false;
		},
		[updateUser.fulfilled]: (state, action) => {
			state.loading = false;
			state.updateSuccess = true;
			state.users = state.users.map((item) => item.id === action.payload.id ? action.payload : item);
		},
		[updateUser.rejected]: (state, action) => {
			state.loading = false;
			state.updateSuccess = false;
			state.error = action.payload.message;
		},
		[deleteUser.pending]: (state, action) => {
			state.loading = false;
			state.deleteSuccess = false;
		},
		[deleteUser.fulfilled]: (state, action) => {
			state.loading = false;
			state.deleteSuccess = true;
			const {
				arg: { id }
			} = action.meta;

			if (id && action.payload) {
				state.users = state.users.filter((item) => item.id !== id);
			}
		},
		[deleteUser.rejected]: (state, action) => {
			state.loading = false;
			state.deleteSuccess = false;
			state.error = action.payload.message;
			state.users = [...state.users];
		},
	},
})

export const { updateRejected, createRejected, deleteRejected } = userSlice.actions;
export default userSlice.reducer;

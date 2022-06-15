import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux";
import { getUsers, updateUser, createUser, deleteUser } from "../store/users";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Avatar, Backdrop, Button, ButtonGroup, Card, CardActions, CircularProgress, DialogActions, DialogContentText, Stack, TableFooter, TablePagination } from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "../components/Modal";
import { MDBInput, MDBValidation, MDBValidationItem, MDBTypography } from "mdb-react-ui-kit";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_URL }  from '../config/api';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: "#c9c9c9a8",
		color: "#1266f1",
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	"&:last-child td, &:last-child th": {
		border: 0,
	},
}));

const initialState = {
	firstname: "",
	lastname: "",
	email: "",
	username: "",
	avatar: "", 
	file: {}
}

const Dashboard = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { users, loading, updateSuccess, createSuccess, deleteSuccess } = useSelector((state) => ({ ...state.users }));
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [deleteUserData, setDeleteUserData] = useState({});
	const [open, setOpen] = useState(false);
	const [openCreate, setOpenCreate] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const [formValue, setformValue] = useState(initialState);
	const { firstname, lastname, email, username, avatar } = formValue;
	const [formValueCreate, setformValueCreate] = useState({ ...initialState, password: "", confirmPassword: "", avatar: "", file: {} });

	const handleFileCreate = (e) => {
		let { value } = e.target;
		setformValueCreate({ ...formValueCreate, avatar: value, file: e.target.files[0] });
	}

	const handleFileEdit = (e) => {
		let { value } = e.target;
		setformValue({ ...formValue, avatar: value, file: e.target.files[0] });
	}

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const handleCloseEdit = () => setOpen(false);
	const handleCloseCreate = () => setOpenCreate(false);
	const handleCloseDelete = () => {
		setOpenDelete(false)
		setDeleteUserData({});
	}

	const handleDeleteConfirm = (data) => {
		setOpenDelete(true);
		setDeleteUserData(data);
	}

	const handleDeleteSubmit = (e) => {
		e.preventDefault();

		if (deleteUserData) {
			const { id } = deleteUserData;
			dispatch(deleteUser({ id, navigate, toast, dispatch }));
		}
	}

	const handleCreateView = () => {
		const newUser = { ...initialState, password: "", confirmPassword: "" };
		setformValue({ newUser });
		setOpenCreate(true);
	}

	const handleCreateSubmit = (e) => {
		e.preventDefault();
		
		if (formValueCreate.password && formValueCreate.confirmPassword && formValueCreate.password !== formValueCreate.confirmPassword) {
			return toast.error("Las contraseñas no coinciden");
		}
		if (formValueCreate) {
			dispatch(createUser({ formValueCreate, navigate, toast, dispatch }));
		}
	}

	const handleEditView = (data) => {
		setformValue(data);
		setOpen(true);
	}

	const handleEditSubmit = (e) => {
		e.preventDefault();

		if (firstname && lastname && email && username) {
			dispatch(updateUser({ formValue, toast, navigate, dispatch }));
		}
	}

	const onInputChange = (e) => {
		let { name, value } = e.target;
		setformValue({ ...formValue, [name]: value });
	};

	const onInputChangeCreate = (e) => {
		let { name, value } = e.target;
		setformValueCreate({ ...formValueCreate, [name]: value });
	};

	useEffect(() => {
		dispatch(getUsers());
	}, [dispatch]);

	useEffect(() => {
	}, [users]);

	useEffect(() => {
		updateSuccess && setOpen(!updateSuccess);

	}, [updateSuccess])

	useEffect(() => {
		createSuccess && setOpenCreate(!createSuccess);

	}, [createSuccess])

	useEffect(() => {
		deleteSuccess && setOpenDelete(!deleteSuccess);

	}, [deleteSuccess])

	useEffect(() => {
		if (!localStorage.getItem("token") || !localStorage.getItem("user")) {
			navigate("/login");
		}
	}, [dispatch, navigate])

	return (
		<div className="container" style={{ marginTop: "40px" }}>
			<Backdrop
				sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={loading}
			>
				<CircularProgress color="inherit" />
			</Backdrop>

			<Card style={{ padding: 15 }}>
				<CardActions>
					<Button variant="contained" size="small" onClick={handleCreateView}>Crear usuario</Button>
				</CardActions>
			</Card>
			<TableContainer component={Paper} locale="es">
				<Table stickyHeader sx={{ minWidth: 700 }} size="small" aria-label="customized table">
					<TableHead>
						<TableRow>
							<StyledTableCell>Avatar</StyledTableCell>
							<StyledTableCell>Nombres</StyledTableCell>
							<StyledTableCell>Apellidos</StyledTableCell>
							<StyledTableCell>Usuario</StyledTableCell>
							<StyledTableCell>Correo electronico</StyledTableCell>
							<StyledTableCell>Accion</StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{!loading && users?.length === 0 && (
							<MDBTypography>
								No hay usuarios registrados
							</MDBTypography>
						)}

						{users?.length > 0 && users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
							<StyledTableRow key={row.name}>
								<StyledTableCell component="th" scope="row">
									<Stack direction="row" spacing={2}>
										<Avatar alt="Remy Sharp" src={row?.images ? API_URL + row.images?.url : '/images/no-avatar.png'} />
									</Stack>
								</StyledTableCell>
								<StyledTableCell>{row.firstname}</StyledTableCell>
								<StyledTableCell>{row.lastname}</StyledTableCell>
								<StyledTableCell>{row.username}</StyledTableCell>
								<StyledTableCell>{row.email}</StyledTableCell>
								<StyledTableCell>{row.protein}
									<ButtonGroup variant="outlined" aria-label="outlined button group">
										<Button variant="outlined" onClick={() => handleEditView(row)}><EditIcon /></Button>
										<Button variant="outlined" onClick={() => handleDeleteConfirm(row)} color="error"><DeleteIcon /></Button>
									</ButtonGroup>
								</StyledTableCell>
							</StyledTableRow>
						))}
					</TableBody>
				</Table>
				<TableFooter>
					<TableRow>
						<TablePagination
							rowsPerPageOptions={[5, 10, 25, 100]}
							component="div"
							count={users?.length || 0}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
						/>
					</TableRow>
				</TableFooter>
			</TableContainer>

			<Modal
				title={"Editar usuario"}
				loading={loading}
				open={open}
			>
				<div className="mdbContent">
					<MDBValidation onSubmit={handleEditSubmit} noValidate className="row g-3">
						<MDBValidationItem feedback="Ingresa tu nombre" invalid className="col-6">
							<MDBInput
								label="Nombres"
								type="text"
								name="firstname"
								value={firstname || ""}
								onChange={onInputChange}
								required
							/>
						</MDBValidationItem>
						<MDBValidationItem feedback="Ingresa tu apellido" invalid className="col-6">
							<MDBInput
								label="Apellidos"
								type="text"
								name="lastname"
								value={lastname || ""}
								onChange={onInputChange}
								required
							/>
						</MDBValidationItem>
						<MDBValidationItem feedback="Ingresa un nombre de usuario" invalid className="col-12">
							<MDBInput
								label="Usuario"
								type="text"
								name="username"
								minLength={4}
								maxLength={20}
								value={username || ""}
								onChange={onInputChange}
								required
							/>
						</MDBValidationItem>
						<MDBValidationItem feedback="Ingresa tu correo electrónico" invalid className="col-12">
							<MDBInput
								label="Correo electrónico"
								type="email"
								name="email"
								value={email || ""}
								onChange={onInputChange}
								required
							/>
						</MDBValidationItem>
						<MDBValidationItem feedback="Agregue un avatar" invalid className="col-12">
							<MDBInput
								type="file"
								name="avatar"
								minLength={6}
								value={avatar || ""}
								onChange={handleFileEdit}
							/>
						</MDBValidationItem>
						<DialogActions>
							<Button type="reset" onClick={handleCloseEdit}>Cancelar</Button>
							<LoadingButton loading={loading} variant="contained" type="submit">Guardar</LoadingButton>
						</DialogActions>
					</MDBValidation>
				</div>
			</Modal>

			<Modal
				title={"Crear usuario"}
				loading={loading}
				open={openCreate}
			>
				<div className="mdbContent">
					<MDBValidation onSubmit={handleCreateSubmit} noValidate className="row g-3">
						<MDBValidationItem feedback="Ingresa tu nombre" invalid className="col-6">
							<MDBInput
								label="Nombres"
								type="text"
								name="firstname"
								value={formValueCreate.firstname || ""}
								onChange={onInputChangeCreate}
								required
							/>
						</MDBValidationItem>
						<MDBValidationItem feedback="Ingresa tu apellido" invalid className="col-6">
							<MDBInput
								label="Apellidos"
								type="text"
								name="lastname"
								value={formValueCreate.lastname || ""}
								onChange={onInputChangeCreate}
								required
							/>
						</MDBValidationItem>
						<MDBValidationItem feedback="Ingresa un nombre de usuario" invalid className="col-12">
							<MDBInput
								label="Usuario"
								type="text"
								name="username"
								minLength={4}
								maxLength={20}
								value={formValueCreate.username || ""}
								onChange={onInputChangeCreate}
								required
							/>
						</MDBValidationItem>
						<MDBValidationItem feedback="Ingresa tu correo electrónico" invalid className="col-12">
							<MDBInput
								label="Correo electrónico"
								type="email"
								name="email"
								value={formValueCreate.email || ""}
								onChange={onInputChangeCreate}
								required
							/>
						</MDBValidationItem>
						<MDBValidationItem feedback="Ingresa tu contraseña" invalid className="col-12">
							<MDBInput
								label="Contraseña"
								type="password"
								name="password"
								minLength={6}
								value={formValueCreate.password || ""}
								onChange={onInputChangeCreate}
								required
							/>
						</MDBValidationItem>
						<MDBValidationItem feedback="Confirme su contraseña" invalid className="col-12">
							<MDBInput
								label="Confirmar contraseña"
								type="password"
								name="confirmPassword"
								minLength={6}
								value={formValueCreate.confirmPassword || ""}
								onChange={onInputChangeCreate}
								required
							/>
						</MDBValidationItem>
						<MDBValidationItem feedback="Agregue un avatar" invalid className="col-12">
							<MDBInput
								type="file"
								name="avatar"
								minLength={6}
								value={formValueCreate.avatar || ""}
								onChange={handleFileCreate}
								required
							/>
						</MDBValidationItem>
						<DialogActions>
							<Button type="reset" onClick={handleCloseCreate}>Cancelar</Button>
							<LoadingButton loading={loading} variant="contained" type="submit">Guardar</LoadingButton>
						</DialogActions>
					</MDBValidation>
				</div>
			</Modal>

			<Modal
				title={"Eliminar usuario"}
				loading={loading}
				open={openDelete}
			>
				<div className="mdbContent">
					<MDBValidation onSubmit={handleDeleteSubmit} noValidate className="row g-3 mt-2">
						<DialogContentText id="alert-dialog-description">
							¿Seguro que deseas eliminar este usuario?
						</DialogContentText>
						<DialogActions>
							<Button type="reset" onClick={handleCloseDelete}>No</Button>
							<LoadingButton loading={loading} variant="contained" color="error" type="submit">Si</LoadingButton>
						</DialogActions>
					</MDBValidation>
				</div>
			</Modal>
		</div>
	)
}

export default Dashboard;

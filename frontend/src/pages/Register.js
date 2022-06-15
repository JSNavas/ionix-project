import React, { useState, useEffect } from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCardFooter,
  MDBValidation,
  MDBValidationItem,
  MDBBtn,
  MDBIcon,
  MDBSpinner
} from "mdb-react-ui-kit";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { register } from '../store/auth';

const initialState = {
  firstname: "",
  lastname: "",
  email: "",
  username: "",
  password: "",
  confirmPassoword: ""
}

const Register = () => {
  const [formValue, setformValue] = useState(initialState);
  const { firstname, lastname, email, username, password, confirmPassword } = formValue;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => ({ ...state.auth }));

  useEffect(() => {
    error && toast.error(error)

  }, [error])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password && confirmPassword && password !== confirmPassword) {
      return toast.error("Las contraseñas no coinciden");
    }
    if (firstname && lastname && email && username && password && confirmPassword) {
      dispatch(register({ formValue, navigate, toast }));
    }
  };

  const onInputChange = (e) => {
    let { name, value } = e.target;
    setformValue({ ...formValue, [name]: value });
  };

	useEffect(() => {
		if (localStorage.getItem("token") && localStorage.getItem("user")) {
			navigate("/");
		}
  }, [dispatch, navigate])

  return (
    <div style={{ margin: "auto", padding: "15px", maxWidth: "500px", alignContent: "center", marginTop: "80px" }}>
      <MDBCard alignment="center">
				<MDBIcon className='mt-4 mb-2'>
					<img
						src='/images/header-logo-dark-x2.png'
						height='40'
						alt=''
						loading='lazy'
					/>
				</MDBIcon>
				<h5>Registro</h5>
        <MDBCardBody>
          <MDBValidation onSubmit={handleSubmit} noValidate className='row g-3'>
            <MDBValidationItem feedback='Ingresa tu nombre' invalid className="col-6">
              <MDBInput
                label="Nombres"
                type="text"
                name="firstname"
                value={firstname || ""}
                onChange={onInputChange}
                required
              />
            </MDBValidationItem>
            <MDBValidationItem feedback='Ingresa tu apellido' invalid className="col-6">
              <MDBInput
                label="Apellidos"
                type="text"
                name="lastname"
                value={lastname || ""}
                onChange={onInputChange}
                required
              />
            </MDBValidationItem>
            <MDBValidationItem feedback='Ingresa un nombre de usuario' invalid className="col-12">
              <MDBInput
                label="Usuario"
                type="text"
                name="username"
                value={username || ""}
                onChange={onInputChange}
                required
              />
            </MDBValidationItem>
            <MDBValidationItem feedback='Ingresa tu correo electrónico' invalid className="col-12">
              <MDBInput
                label="Correo electrónico"
                type="email"
                name="email"
                value={email || ""}
                onChange={onInputChange}
                required
              />
            </MDBValidationItem>
            <MDBValidationItem feedback="Ingresa tu contraseña" invalid className="col-12">
              <MDBInput
                label="Contraseña"
                type="password"
                name="password"
								minLength={6}
                value={password || ""}
                onChange={onInputChange}
                required
              />
            </MDBValidationItem>
            <MDBValidationItem feedback="Confirme su contraseña" invalid className="col-12">
              <MDBInput
                label="Confirmar contraseña"
                type="password"
                name="confirmPassword"
								minLength={6}
                value={confirmPassword || ""}
                onChange={onInputChange}
                required
              />
            </MDBValidationItem>
            <div className="col-12">
              <MDBBtn style={{ width: "100%" }} className="mt-2">
                {loading && (
                  <MDBSpinner
                    size="sm"
                    role="status"
                    tag="span"
                    className="me-2"
                  />
                )}
                Registrar
              </MDBBtn>
            </div>
          </MDBValidation>
        </MDBCardBody>
        <MDBCardFooter>
          <p> Ya tienes una cuenta?<Link to="/login"> Inicia sesion</Link></p>
        </MDBCardFooter>
      </MDBCard>
    </div>
  )
}

export default Register;

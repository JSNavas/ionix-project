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
import { login } from '../store/auth';

const initialState = {
  email: "",
  password: ""
}

const Login = () => {
  const [formValue, setformValue] = useState(initialState);
  const { email, password } = formValue;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => ({ ...state.auth }));

  useEffect(() => {
    error && toast.error(error)

  }, [error])

	useEffect(() => {
		if (localStorage.getItem("token") && localStorage.getItem("user")) {
			navigate("/");
		}
  }, [dispatch, navigate])

	useEffect(() => {
		
  }, [loading])

  const handleSubmit = (e) => {
    e.preventDefault();
    if(email && password) {
      dispatch(login({formValue, navigate, toast}));
    }
  };

  const onInputChange = (e) => {
    let { name, value } = e.target;
    setformValue({ ...formValue, [name]: value });
  };

  return (
    <div style={{ margin: "auto", padding: "15px", maxWidth: "450px", alignContent: "center", marginTop: "80px" }}>
      <MDBCard alignment="center">
        <MDBIcon className='mt-4 mb-2'>
					<img
						src='/images/header-logo-dark-x2.png'
						height='40'
						alt=''
						loading='lazy'
					/>
				</MDBIcon>
        <h5>Iniciar sesion</h5>
        <MDBCardBody>
          <MDBValidation onSubmit={handleSubmit} noValidate className='row g-3'>
            <MDBValidationItem feedback='Ingresa tu correo electrónico' invalid className="col-12">
              <MDBInput
                label="Correo electrónico"
                type="email"
                name="email"
                value={email}
                onChange={onInputChange}
                required
              />
            </MDBValidationItem>
            <MDBValidationItem feedback="Ingresa tu contraseña" invalid className="col-12">
              <MDBInput
                label="Contraseña"
                type="password"
                name="password"
                value={password}
								minLength={6}
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
                Iniciar
              </MDBBtn>
            </div>
          </MDBValidation>
        </MDBCardBody>
        <MDBCardFooter>
            <p> No tienes una cuenta?<Link to="/register"> Registrate</Link></p>
        </MDBCardFooter>
      </MDBCard>
    </div>
  )
}

export default Login;

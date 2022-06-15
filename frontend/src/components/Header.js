import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setLogout } from '../store/auth';
import { API_URL } from '../config/api';

const StyledBadge = styled(Badge)(({ theme }) => ({
	'& .MuiBadge-badge': {
		backgroundColor: '#44b700',
		color: '#44b700',
		boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
		'&::after': {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			borderRadius: '50%',
			content: '""',
		},
	},
}));

const Header = () => {
	const [anchorElNav, setAnchorElNav] = useState(null);
	const [anchorElUser, setAnchorElUser] = useState(null);
	const { user } = useSelector((state) => ({ ...state.auth }));
	const dispatch = useDispatch();

	const handleLogout = () => {
		dispatch(setLogout())
		handleCloseUserMenu();
	}

	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	useEffect(() => {

	}, [user])
	
	const desktopItemsLogged = (
		<>
			<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
			</Box>
			<Box sx={{ flexGrow: 0 }}>
				<Tooltip title={user?.username || ""}>
					<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
						<StyledBadge
							overlap="circular"
							anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
							variant="dot"
						>
							<Avatar alt="avatar" src={user?.images ? API_URL + user.images.url : '/images/no-avatar.png'} />
						</StyledBadge>
					</IconButton>
				</Tooltip>
				<Menu
					sx={{ mt: '45px' }}
					id="menu-appbar"
					anchorEl={anchorElUser}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					keepMounted
					transformOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					open={Boolean(anchorElUser)}
					onClose={handleCloseUserMenu}
				>
					<Link to="/login">
						<MenuItem onClick={handleLogout}>
							<Typography textAlign="center">Cerrar sesion</Typography>
						</MenuItem>
					</Link>
				</Menu>
			</Box>
		</>
	);

	const desktopItemsNotLogged = (
		<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
			<Link to="/login">
				<Button
					onClick={handleCloseNavMenu}
					sx={{ my: 2, color: 'white', display: 'block' }}
				>
					Iniciar
				</Button>
			</Link>
			<Link to="/register">
				<Button
					onClick={handleCloseNavMenu}
					sx={{ my: 2, color: 'white', display: 'block' }}
				>
					Registro
				</Button>
			</Link>
		</Box>
	);

	const mobileItemsLogged = (
		<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}></Box>
	);

	const mobileItemsNotLogged = (
		<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
			<IconButton
				size="large"
				aria-label="account of current user"
				aria-controls="menu-appbar"
				aria-haspopup="true"
				onClick={handleOpenNavMenu}
				color="inherit"
			>
				<MenuIcon />
			</IconButton>
			<Menu
				id="menu-appbar"
				anchorEl={anchorElNav}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				keepMounted
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
				open={Boolean(anchorElNav)}
				onClose={handleCloseNavMenu}
				sx={{
					display: { xs: 'block', md: 'none' },
				}}
			>
				<Link to="/login">
					<MenuItem>
						<Typography textAlign="center">Iniciar</Typography>
					</MenuItem>
				</Link>

				<Link to="/register">
					<MenuItem>
						<Typography textAlign="center">Registro</Typography>
					</MenuItem>
				</Link>
			</Menu>
		</Box>
	);

	return (
		<AppBar position="static">
			<Container maxWidth="xl">
				<Toolbar disableGutters>

					{/* MOBILE */}
					<Typography
						variant="h6"
						noWrap
						component="a"
						href=""
						sx={{
							mr: 2,
							display: { xs: 'none', md: 'flex' },
							fontFamily: 'monospace',
							fontWeight: 700,
							letterSpacing: '.3rem',
							color: 'inherit',
							textDecoration: 'none',
						}}
					>
						<Link to="/">
							<img
								src='/images/ionix-menu-logo-light.png'
								height='30'
								alt='logo'
								loading='lazy'
							/>
						</Link>
					</Typography>

					{user?.username ?
						(
							mobileItemsLogged
						) :
						(
							mobileItemsNotLogged
						)
					}

					{/*  DESKTOP */}
					<Typography
						variant="h5"
						noWrap
						component="a"
						href=""
						sx={{
							mr: 2,
							display: { xs: 'flex', md: 'none' },
							flexGrow: 1,
							fontFamily: 'monospace',
							fontWeight: 700,
							letterSpacing: '.3rem',
							color: 'inherit',
							textDecoration: 'none',
						}}
					>
						<Link to="/">
							<img
								src='/images/ionix-menu-logo-light.png'
								height='30'
								alt='logo'
								loading='lazy'
							/>
						</Link>
					</Typography>

					{user?.username ?
						(
							desktopItemsLogged
						) :
						(
							desktopItemsNotLogged
						)
					}
				</Toolbar>
			</Container>
		</AppBar>
	);
};
export default Header;

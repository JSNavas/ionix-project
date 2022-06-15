import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const Modal = ({ loading, title, open, children }) => {
	return (
		<Dialog open={open}>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>
				{children}
			</DialogContent>
		</Dialog>
	)
}

export default Modal;

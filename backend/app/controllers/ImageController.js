const { Image } = require('../models/Index');

module.exports = {
	async upload(req, res) {
		try {
			if (req.file == undefined) {
				return res.status(400).send({
					status: false,
					message: "Por favor suba un avatar!"
				});
			}

			const { user_id } = req.body;

			Image.findOne({
				where: {
					user_id: user_id
				},
			}).then(image => {
				if (image) {
					image.url = "/uploads/" + req.file.filename;
					image.save();

					res.status(200).send({
						status: true,
						message: "Avatar actualizado con exito!",
						image: req.file.originalname
					});
				} else {
					Image.create({
						user_id: req.body.user_id,
						url: "/uploads/" + req.file.filename,
					})
					res.status(200).send({
						status: true,
						message: "Avatar agregado correctamente!",
						image: req.file.originalname
					});
				}
			})
		} catch (err) {
			console.log(err);

			if (err.code == "LIMIT_FILE_SIZE") {
				return res.status(500).send({
					message: "La imagen no puede tener un tamaño mayor a 2MB!",
				});
			}

			res.status(500).send({
				status: false,
				message: `No se ha podido subir la imagen!`,
			});
		}
	}
};

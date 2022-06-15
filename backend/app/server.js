const express = require('express');
const cors = require("cors");
const path = require('path')
const app = express();
const { sequelize } = require('./models/Index');

// config directory
global.__basedir = __dirname;

// settings
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/uploads',express.static(path.join(__dirname, 'resources/uploads')));

// routes
app.use(require('./routes'));

app.listen(PORT, function () {
	console.log(`Api listening on http://localhost:${PORT}!`);

	sequelize.authenticate().then(() => {
		console.log('Connected to the database successfully!');
	})
});

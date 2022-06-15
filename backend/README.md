# IONIX PROJECT SERVER

# Requerimientos
	npm   >= 6.14.16 								[gestor de paquetes]
	node  >= 14.19.1 								[servidor]

# Instalación
	1. npm install									[instala las dependencias]
	2. configurar .env								[abrir el archivo oculto .env.example para agregar los datos de la conexion a la base de datos MySQL y luego renombrar el archivo quedando ".env"]
	3. npx sequelize-cli db:migrate					[crea las tablas de la BD]
	4. npx sequelize-cli db:seed:all				[ejecuta los seeders]

# Desplegar servidor
	npm start 										[podras ver el servidor corriendo en la siguente ruta `localhost:8000`]

# Usuarios precargados
	(ADMIN)
	email: 		admin@admin.com
	password: 	123456
        
	(USER)
	email: 		user@user.com
	password: 	123456

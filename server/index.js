const express = require('express');
var bodyParser = require('body-parser');
	jwt = require('jsonwebtoken');
var	config = require('./config/config');
const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'access-token, Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

var config = {
	llave : "llavesecreta"
};

app.set('llave', config.llave);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.post('/api/empleados', function(req,res){

	res.send();

});

app.get('/', function(req, res) {
    res.json({ message: 'recurso de entrada' });
});

app.post('/api/autenticar', (req, res) => {
    if(req.body.usuario === "tester" && req.body.contrasena === "prueba123") {
		const payload = {
			check:  true
		};
		const token = jwt.sign(payload, app.get('llave'), {
			expiresIn: 1440
		});
		res.json({
			mensaje: 'Autenticación correcta',
			IsApproved : true,
			token: token
		});
    } else {
        res.json({ 
			mensaje: "Usuario o contraseña incorrectos",
			IsApproved : false
		})
    }
})

const rutasProtegidas = express.Router(); 
rutasProtegidas.use((req, res, next) => {
    const token = req.headers['access-token'];
	
    if (token) {
      jwt.verify(token, app.get('llave'), (err, decoded) => {      
        if (err) {
          return res.json({ mensaje: 'Token inválida' });    
        } else {
          req.decoded = decoded;    
          next();
        }
      });
    } else {
      res.send({ 
          mensaje: 'Token no proveída.' 
      });
    }
 });

app.post('/api/datos', rutasProtegidas, (req, res) => {
	const datos = [
		{ id: 1, nombre: "Asfo" },
		{ id: 2, nombre: "Denisse" },
		{ id: 3, nombre: "Carlos" }
	];
	
	res.json(datos);
});


app.use(express.static(__dirname + '/public/'));

app.listen('3000', function() {
    console.log('Servidor web escuchando en el puerto 3000');
});
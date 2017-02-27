var express = require('express');
var session = require('express-session');
var path = require('path');
var os = require('os');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var package = require("./package.json");
if (os.platform() == 'linux') {
	var syspref = require('./pref');
}
var confservices = require('./services/conf');

var typedef = require('./typedef');

var app = express();
app.use(session({
	secret: 'zlt123',
	name: 'c818e6',
	cookie: {
		maxAge: 5 * 60 * 1000
	}, // 设置maxAge后session和相应的cookie失效过期
	resave: false,
	saveUninitialized: true
}));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, 'public')));

app.use('/rest', function (req, res, next) {
	res.set("Access-Control-Allow-Origin", "*");
	res.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, HEAD");
	res.set("Access-Control-Allow-Headers", "X-PINGOTHER, Origin, X-Requested-With, Content-Type, Accept");
	var info = {};
	if (os.platform() == 'linux') {
		info = syspref.pref();
	}
	res.json(info);
});
app.use('/v', function (req, res, next) {//返回版本号
	res.set("Access-Control-Allow-Origin", "*");
	res.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, HEAD");
	res.set("Access-Control-Allow-Headers", "X-PINGOTHER, Origin, X-Requested-With, Content-Type, Accept");
	var version = {
			version: package.version
		};
	res.json(version);
});

app.use('/login', function (req, res, next) {
	var username = req.body.username;
	var pwd = req.body.password;
	var status = 0;
	if (username && pwd) {
		var conf = confservices.conf();
		var iuser = conf.loadUserConf();
		if (iuser && iuser.username == username && iuser.password == pwd) {
			req.session.user = {
				username: username,
				password: pwd
			};
			status = 1;
		}
	}
	res.json({
		status: status
	});
});
app.post('/load', function (req, res, next) {
	var cfg = {
		status: 0
	};
	if (req.body.id) {
		var actionType = typedef.typedef();
		var id = parseInt(req.body.id);
		var conf = confservices.conf();
		switch (id) {
			case actionType.LOAD_PASSWORD:
				cfg = conf.loadUserConf();
				break;
			case actionType.LOAD_IPADDRESS:
				cfg = conf.loadIpConf();
				break;
			case actionType.LOAD_SPORT:
				if (req.body.port) {
					cfg = conf.loadSerialPortConf(parseInt(req.body.port));
				}
				break;
			default:
				break;
		}
	}
	res.json(cfg);
});
app.post('/loadDefault', function (req, res, next) {
	var cfg = {
		status: 0
	};
	if (req.body.id) {
		var actionType = typedef.typedef();
		var id = parseInt(req.body.id);
		var conf = confservices.conf();
		switch (id) {
			case actionType.LOAD_PASSWORD:
				cfg = conf.loadDefaultUserConf();
				break;
			case actionType.LOAD_IPADDRESS:
				cfg = conf.loadDefaultIpConf();
				break;
			case actionType.LOAD_SPORT:
				if (req.body.port) {
					cfg = conf.loadDefaultSerialPortConf(parseInt(req.body.port));
				}
				break;
			default:
				break;
		}
	}

	res.json(cfg);
});
app.use('/validate', function (req, res, next) {
	var b = false;
	if (req.body.address) {
		var conf = confservices.conf();
		b = conf.validateIpAddress(req.body.address);
	}
	res.json({
		status: b ? 1 : 0
	});
});
app.use('/restart', function (req, res, next) {
	var b = 0;
	if (req.session.user) {
		var conf = confservices.conf();
		conf.restart();
		b = 1;
	} else {
		b = -1;
	}
	res.json({
		status: b
	});
});
app.post('/save', function (req, res, next) {
	var status = 0;
	if (req.body.id && req.body.data) {
		var cfg = JSON.parse(req.body.data);
		if (cfg) {
			if (!req.session.user) {
				status = -1;
			} else {
				var actionType = typedef.typedef();
				var conf = confservices.conf();
				var id = parseInt(req.body.id);
				switch (id) {
					case actionType.MODIFY_PASSWORD:
						status = conf.modifyUserPassword(req.session.user.username, cfg);
						break;
					case actionType.MODIFY_IPADDRESS:
						status = conf.updateIpConf(cfg);
						break;
					case actionType.MODIFY_SPORT:
						if (req.body.index) {
							status = conf.updateSerialPortConf(parseInt(req.body.index), req.body.port, cfg);
						}
						break;
					default:
						break;
				}
			}
		}
	}
	res.json({
		status: status
	});
});

app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.json({
			message: err.message
		});
	});
}

app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.json({
		message: err.message
	});
});

module.exports = app;

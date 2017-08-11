var logger = require('morgan');
var os = require('os');
var fs = require('fs');
var sscanf = require('scanf').sscanf;
var prefInfo = new Array(2);
var point = 0;
var allCache = new Array(2);

function cache() {
	if(prefInfo[0] && prefInfo[1]) {
		//当前时间
		var dt = new Date();
		dt.setMilliseconds(0);
		var now = dt.getTime();
		var info = {
			cpu: 0,
			cores: [],
			runtimes: 0,
			mem: 0
		};
		var first = prefInfo[0];
		var last = prefInfo[1];
		var p = 1 - (last.cpu.total.idle - first.cpu.total.idle) / (last.cpu.total.all - first.cpu.total.all);
		if(p < 0 || isNaN(p)) {
			p = 0;
		}
		p = p * 100;
		info.cpu = parseFloat(p.toFixed(2));
		cap = first.cpu.cores.length;
		for(var j = 0; j < cap; j++) {
			var pp = 1 - (last.cpu.cores[j].idle - first.cpu.cores[j].idle) / (last.cpu.cores[j].all - first.cpu.cores[j].all);
			if(pp < 0 || isNaN(pp)) {
				pp = 0;
			}
			pp = pp * 100;
			info.cores.push(parseFloat(pp.toFixed(2)));
		}
		var runtimes = (prefInfo[1].hasruntime + prefInfo[0].hasruntime) / 2;
		runtimes = runtimes.toFixed(0);
		info.runtimes = parseInt(runtimes);
		var mem = (((prefInfo[1].mem + prefInfo[0].mem) / 2) / os.totalmem()).toFixed(2);
		info.mem = parseFloat(mem);
		info.time = now;
		//console.log(info);
		allCache[1] = allCache[0];
		allCache[0] = info;
	}
}

function cb() {
	if(os) {
		var info = {};
		var hasruntime = os.uptime();
		var mem = os.freemem();
		var platform = os.platform();
		if(platform == 'linux') {
			var proc = function(cpuinfo) {
				var rl = fs.readFileSync('/proc/stat', 'utf-8');
				if(rl == null) {
					return;
				}
				cpuinfo["total"] = {
					all: 0,
					idle: 0
				};
				cpuinfo["cores"] = [];
				var lines = rl.split("\n");
				for(var j = 0; j < lines.length; j++) {
					var line = lines[j];
					var rs = line.split(" ");
					if(rs && rs.length >= 8) {
						switch(rs[0].trim()) {
							case 'cpu':
								{ //CPU统计
									var r = sscanf(line, "%s%d%d%d%d%d%d%d");
									if(r && r.length == 8) {
										for(var i = 1; i < 8; i++) {
											cpuinfo.total.all += parseInt(r[i]);
										}
										cpuinfo.total.idle = parseInt(r[4]);
									}
									break;
								}

							case 'cpu0':
							case 'cpu1':
							case 'cpu2':
							case 'cpu3':
							case 'cpu4':
							case 'cpu5':
							case 'cpu6':
							case 'cpu7':
								{ //核心M线程X
									var core = {
										all: 0,
										idle: 0
									};
									var r = sscanf(line, "%s%d%d%d%d%d%d%d");
									if(r && r.length == 8) {
										for(var i = 1; i < 8; i++) {
											core.all += parseInt(r[i]);
										}
										core.idle = parseInt(r[4]);
									}
									cpuinfo.cores.push(core);
									break;
								}
							default:
								break;
						}
					}
				}
			};
			var cpuinfos = {};
			proc(cpuinfos);
			info["cpu"] = cpuinfos;
		}

		info["hasruntime"] = hasruntime;
		info["mem"] = mem;
		prefInfo[point] = info;
		point++;
		if(point > 1) {
			point = 0;
		}
		cache();
	}
}
setInterval(cb, 1000);

function pref() {
	var info = allCache[0];
	if(info == null) { //初始化
		var dt = new Date();
		dt.setMilliseconds(0);
		var now = dt.getTime();
		var corenum = os.cpus().length;
		var defaults = new Array();
		for(var j = 0; j < corenum; j++) {
			defaults.push(0);
		}
		var defInfo = {
			cpu: 0,
			cores: defaults,
			runtimes: 0,
			mem: 0,
			time: now - i * 1000
		};
		info = defInfo;
	}
	return info;
}

exports.pref = pref;
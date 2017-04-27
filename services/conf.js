var os = require('os');
var path = require('path');
var fs = require('fs');
var util = require('util');

function conf() {
    var fpath = null;
    var bakpath = null;
    if (os.platform() == 'linux') {
        fpath = "/etc/c818e6/c818e6.conf";
        bakpath = "/etc/c818e6/default.conf";
    } else {
        fpath = path.join(__dirname, '..\\test\\c818e6.conf');
        bakpath = path.join(__dirname, '..\\test\\default.conf');
    }
    var obj = {
        restart: function() {
            //var exec = require('child_process').execSync;
            var exec = require('child_process').exec;
            try {
                var cmd = null;
                if (os.platform() == 'linux') {
                    cmd = "sleep 3 && shutdown -r now &";
                } else {
                    cmd = "cmd /c shutdown -r -t 0";
                }
                exec(cmd, {
                    //timeout : 1000,
                    encoding: 'utf-8'
                });
            } catch (e) {
                console.log(e);
            }
        },
        validateIpAddress: function(addr) {
            var rt = false;
            var exec = require('child_process').execSync;
            try {
                var str = exec(util.format("ping -%s 1 %s",
                    (os.platform() == 'linux') ? "c" : "n", addr), {
                    timeout: 1000,
                    encoding: 'utf-8'
                });
                if (str) {
                    if (str.indexOf(addr) > 0 &&
                        (str.indexOf("TTL=") > 0 || str.indexOf("ttl=") > 0)) {
                        rt = true;
                    }
                }
            } catch (e) {

            }
            return rt;
        },
        _readFile: function() {
            var rs = null;
            var rl = fs.readFileSync(fpath, {
                encoding: 'utf-8'
            });
            if (rl) {
                var tmp = rl.toString().split('\n');
                if (tmp && tmp.length > 0) {
                    rs = [];
                    for (var i = 0; i < tmp.length; i++) {
                        rs.push(tmp[i].replace('\r', ''));
                    }
                }
            }
            return rs;
        },
        _defaultCfg: function() {
            var str = "";
            for (var i = 0; i < 7; i++) {
                var tmp = util.format("%d\t%d\t%s\t%d\t%d", 27011 + i, 9600,
                    'n', 8, 1);
                if (str == '') {
                    str = tmp;
                } else {
                    str = util.format('%s\n%s', str, tmp);
                }
            }
            str = util.format('%s\n%s', str, util.format("%s %s", "address",
                "127.0.0.1"));
            str = util.format('%s\n%s', str, util.format("%s %s", "netmask",
                "255.255.255.0"));
            str = util.format('%s\n%s', str, util
                .format("%s %s", "gateway", ""));
            str = util.format('%s\n%s', str, util.format("%s %s", "dns1", ""));
            str = util.format('%s\n%s', str, util.format("%s %s", "dns2", ""));
            str = util.format('%s\n%s', str, util.format("%s %s", "username",
                "admin"));
            str = util.format('%s\n%s', str, util.format("%s %s", "password",
                "123"));
            fs.writeFileSync(bakpath, str, {
                encoding: 'utf-8',
                flag: 'w'
            });
        },
        _readDefaultFile: function() {
            var rs = null;
            try {
                if (os.platform() != 'linux' && !fs.existsSync(bakpath)) {
                    this._defaultCfg();
                }
            } catch (e) {

            }
            var rl = fs.readFileSync(bakpath, {
                encoding: 'utf-8'
            });
            if (rl) {
                var tmp = rl.toString().split('\n');
                if (tmp && tmp.length > 0) {
                    rs = [];
                    for (var i = 0; i < tmp.length; i++) {
                        rs.push(tmp[i].replace('\r', ''));
                    }
                }
            }
            return rs;
        },
        loadDefaultIpConf: function() {
            var cfg = {};
            var lines = this._readDefaultFile();
            if (lines) {
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i];
                    if (line != null) {
                        if (line.indexOf("address") == 0) {
                            cfg["address"] = line.split(' ')[1];
                        }
                        if (line.indexOf("netmask") == 0) {
                            cfg["netmask"] = line.split(' ')[1];
                        }
                        if (line.indexOf("gateway") == 0) {
                            cfg["gateway"] = line.split(' ')[1];
                        }
                        if (line.indexOf("dns1") == 0) {
                            cfg["dns1"] = line.split(' ')[1];
                        }
                        if (line.indexOf("dns2") == 0) {
                            cfg["dns2"] = line.split(' ')[1];
                        }
                    }
                }
                if (!cfg.dns1) {
                    cfg["dns1"] = "";
                }
                if (!cfg.dns2) {
                    cfg["dns2"] = "";
                }
            }
            return cfg;
        },
        loadDefaultUserConf: function() {
            var cfg = {};
            var lines = this._readDefaultFile();
            if (lines) {
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i];
                    if (line != null) {
                        if (line.indexOf("username") == 0) {
                            cfg["username"] = line.split(' ')[1];
                        }
                        if (line.indexOf("password") == 0) {
                            cfg["password"] = line.split(' ')[1];
                        }
                    }
                }
            }
            return cfg;
        },
        loadDefaultSerialPortConf: function(port) {
            var cfg = {};
            if (port >= 0 && port < 7) {
                var lines = this._readDefaultFile();
                if (lines) {
                    var line = lines[port];
                    if (line != null) {
                        var tmp = line.split('\t');
                        cfg["port"] = tmp[0];
                        cfg["baud_rate"] = tmp[1]; // 波特率
                        cfg["parity"] = tmp[2]; // 校验位
                        cfg["data_bits"] = tmp[3]; // 数据位
                        cfg["stop_bits"] = tmp[4]; // 停止位
                    }
                }
            }
            return cfg;
        },

        loadIpConf: function() {
            var cfg = {};
            var lines = this._readFile();
            if (lines) {
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i];
                    if (line != null) {
                        if (line.indexOf("address") == 0) {
                            cfg["address"] = line.split(' ')[1];
                        }
                        if (line.indexOf("netmask") == 0) {
                            cfg["netmask"] = line.split(' ')[1];
                        }
                        if (line.indexOf("gateway") == 0) {
                            cfg["gateway"] = line.split(' ')[1];
                        }
                        if (line.indexOf("dns1") == 0) {
                            cfg["dns1"] = line.split(' ')[1];
                        }
                        if (line.indexOf("dns2") == 0) {
                            cfg["dns2"] = line.split(' ')[1];
                        }
                    }
                }
                if (!cfg.dns1) {
                    cfg["dns1"] = "";
                }
                if (!cfg.dns2) {
                    cfg["dns2"] = "";
                }
            }
            return cfg;
        },
        loadUserConf: function() {
            var cfg = {};
            var lines = this._readFile();
            if (lines) {
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i];
                    if (line != null) {
                        if (line.indexOf("username") == 0) {
                            cfg["username"] = line.split(' ')[1];
                        }
                        if (line.indexOf("password") == 0) {
                            cfg["password"] = line.split(' ')[1];
                        }
                    }
                }
            }
            return cfg;
        },
        loadSerialPortConf: function(port) {
            var cfg = {};
            if (port >= 0 && port < 7) {
                var lines = this._readFile();
                if (lines) {
                    var line = lines[port];
                    if (line != null) {
                        var tmp = line.split('\t');
                        cfg["port"] = tmp[0];
                        cfg["baud_rate"] = tmp[1]; // 波特率
                        cfg["parity"] = tmp[2]; // 校验位
                        cfg["data_bits"] = tmp[3]; // 数据位
                        cfg["stop_bits"] = tmp[4]; // 停止位
                    }
                }
            }
            return cfg;
        },
        updateIpConf: function(cfg) {
            var status = 0;
            if (cfg) {
                var tmp = this.loadAll();
                if (tmp && tmp.ip) {
                    tmp.ip.address = cfg.address || tmp.ip.address;
                    tmp.ip.netmask = cfg.netmask || tmp.ip.netmask;
                    tmp.ip.gateway = cfg.gateway || tmp.ip.gateway;
                    tmp.ip.dns1 = cfg.dns1 || tmp.ip.dns1;
                    tmp.ip.dns2 = cfg.dns2 || tmp.ip.dns2;
                    status = this.updateAll(tmp);
                }
            }
            return status;
        },
        modifyUserPassword: function(username, info) {
            var status = 0;
            if (info && info.oldpassword && info.password) {
                var tmp = this.loadAll();
                if (tmp && tmp.user) {
                    if (tmp.user.username == username && tmp.user.password == info.oldpassword) {
                        tmp.user.password = info.password;
                        status = this.updateAll(tmp);
                    }
                }
            }
            return status;
        },
        updateUserConf: function(cfg) {
            var status = 0;
            if (cfg) {
                cfg.user.username = cfg.user.username || 'admin';
                var tmp = this.loadAll();
                if (tmp && tmp.user) {
                    tmp.user.username = cfg.username || tmp.user.username;
                    tmp.user.password = cfg.password || tmp.user.password;
                    status = this.updateAll(tmp);
                }
            }
            return status;
        },
        updateSerialPortConf: function(index, port, cfg) {
            var status = 0;
            if (cfg) {
                var tmp = this.loadAll();
                if (tmp && tmp.serials) {
                    var p = parseInt(port);
                    if (index >= 0 && index < 6) {
                        var cf = tmp.serials[index];
                        for (var i = 0; i < 6; i++) {
                            if (i == index) {
                                continue;
                            } else {
                                if (tmp.serials[i].port == p) { //端口重复
                                    status = -2;
                                    return status;
                                }
                            }
                        }
                        cf["port"] = p;
                        cf["baud_rate"] = cfg.baud_rate;
                        cf["parity"] = cfg.parity;
                        cf["data_bits"] = cfg.data_bits;
                        cf["stop_bits"] = cfg.stop_bits;
                        status = this.updateAll(tmp);
                    }
                }
            }
            return status;
        },
        loadAll: function() {
            var cfg = {};
            cfg["ip"] = this.loadIpConf();
            cfg["serials"] = [this.loadSerialPortConf(0),
                this.loadSerialPortConf(1),
                this.loadSerialPortConf(2),
                this.loadSerialPortConf(3),
                this.loadSerialPortConf(4),
                this.loadSerialPortConf(5)
            ];
            cfg["user"] = this.loadUserConf();
            return cfg;
        },
        updateAll: function(cfg) {
            var status = 0;
            if (cfg) {
                if (cfg.ip && cfg.serials && cfg.serials.length == 6 && cfg.user) {
                    var str = "";
                    for (var i = 0; i < cfg.serials.length; i++) {
                        var tmp = util.format("%d\t%d\t%s\t%d\t%d",
                            cfg.serials[i].port, cfg.serials[i].baud_rate,
                            cfg.serials[i].parity,
                            cfg.serials[i].data_bits,
                            cfg.serials[i].stop_bits);
                        if (str == '') {
                            str = tmp;
                        } else {
                            str = util.format('%s\n%s', str, tmp);
                        }
                    }
                    str = util.format('%s\n%s', str, util.format("%s %s",
                        "address", cfg.ip.address));
                    str = util.format('%s\n%s', str, util.format("%s %s",
                        "netmask", cfg.ip.netmask));
                    str = util.format('%s\n%s', str, util.format("%s %s",
                        "gateway", cfg.ip.gateway));
                    str = util.format('%s\n%s', str, util.format("%s %s",
                        "dns1", cfg.ip.dns1));
                    str = util.format('%s\n%s', str, util.format("%s %s",
                        "dns2", cfg.ip.dns2));
                    if (!cfg.user.username) {
                        cfg.user["username"] = "admin";
                        cfg.user["password"] = "123";
                    }
                    str = util.format('%s\n%s', str, util.format("%s %s",
                        "username", cfg.user.username));
                    str = util.format('%s\n%s', str, util.format("%s %s",
                        "password", cfg.user.password));
                    fs.writeFileSync(fpath, str, {
                        encoding: 'utf-8',
                        flag: 'w'
                    });
                    status = 1;
                }
            }
            return status;
        }
    };
    return obj;
}
//conf().restart();
exports.conf = conf;
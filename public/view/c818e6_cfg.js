var viewport = null;
var state = true;
(function() {
    Ext.onReady(function() {
        initExtJS();
        if (viewport == null) {
            var buildserialport = function(cfg) {
                var rt = null;
                if (cfg && cfg.exName) {
                    var items = [];
                    if (cfg.title) {
                        items.push({
                            xtype: 'label',
                            text: cfg.title,
                            height: 30,
                            border: false,
                            cls: 'form_label'
                        });
                    }
                    if (cfg.items && Ext.isArray(cfg.items)) {
                        for (var i = 0; i < cfg.items.length; i++) {
                            var it = cfg.items[i];
                            var tmp = {};
                            Ext.apply(tmp, it);
                            if (i == 0 && !tmp.style) {
                                tmp["style"] = {
                                    'margin-top': '15px !important'
                                };
                            }
                            tmp['cls'] = 'form_item';
                            items.push(tmp);
                        }
                    }
                    rt = {
                        initFormData: function(port) {
                            Ext.Ajax.request({
                                url: '/load',
                                method: 'POST',
                                waitTitle: '请稍等...',
                                waitMsg: '正在加载信息...',
                                params: {
                                    id: 5,
                                    port: port
                                },
                                success: function(response, opts) {
                                    var jsonobject = Ext.util.JSON.decode(response.responseText);
                                    if (jsonobject) {
                                        var obj = Ext.getCmp(Ext.String.format("serialport_{0}", cfg.exName));
                                        if (obj) {
                                            obj.getForm().setValues(jsonobject);
                                        }
                                    }
                                }
                            });
                        },
                        xtype: 'form',
                        trackResetOnLoad: true,
                        formid: Ext.String.format("{0}", cfg.sindex),
                        id: Ext.String.format("serialport_{0}", cfg.exName),
                        layout: 'column',
                        cls: Ext.String.format('serialport_cfg_{0}', cfg.exName),
                        defaults: {
                            columnWidth: 1,
                            margin: '10px 80px 0 50px',
                            labelAlign: 'right'
                        },
                        flex: 1,
                        width: '500px',
                        defaultType: 'textfield',
                        items: items,
                        listeners: {
                            afterrender: function(p, opt) {
                                this.initFormData(cfg.sindex);
                            }
                        },
                        buttons: [
                            '->',
                            '->',
                            {
                                text: '立即生效',
                                id: 'form_port_submit',
                                cls: 'sui-btn btn-bordered btn-xlarge btn-success',
                                enableToggle: true,
                                //											scale: 'medium',
                                handler: function() {
                                    var vals = this.up('form').getForm().getValues();
                                    if (cfg.update && Ext.isFunction(cfg.update) && this.up('form').getForm().isDirty()) {
                                        try {
                                            console.log("提交中....");
                                            cfg.update([vals['port'], vals, this.up('form').id, parseInt(this.up('form').formid)]);
                                            this.up('form').getForm().setValues(vals);
                                        } catch (e) {
                                            console.log(e);
                                            this.up("form").getForm().trackResetOnLoad = false;
                                        }
                                    } else {
                                        console.log("无需提交");
                                    }
                                }
                            },
                            '->',
                            {
                                text: '放弃修改',
                                cls: 'sui-btn btn-bordered btn-xlarge btn-info',
                                handler: function() {
                                    this.up('form').getForm().reset();
                                    this.up('form').initFormData(cfg.sindex);
                                    state = true;
                                }
                            },
                            '->',
                            {
                                text: '恢复默认',
                                cls: 'sui-btn btn-bordered btn-xlarge btn-warning',
                                handler: function() {
                                    state = false;
                                    this.up("form").getForm().trackResetOnLoad = false;
                                    if (cfg.loadDefault && Ext.isFunction(cfg.loadDefault)) {
                                        try {
                                            cfg.loadDefault(this.up('form').formid, this.up('form').id);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }
                                }
                            }, '->', '->'
                        ]
                    };
                }
                return rt;
            };
            var formItems = [{
                fieldLabel: '端口',
                name: 'port',
                id: 'c818e6_port',
                allowBlank: false,
                xtype: 'textfield',
                validator: function(val) {
                    var b = Ext.isNumeric(val) &&
                        parseInt(val) >= 10000 &&
                        parseInt(val) < 65536;
                    var obj = Ext.getCmp('form_port_submit');
                    if (obj) {
                        obj.setDisabled(!b);
                    }
                    return b ? true : '端口值无效(10000-65535)';
                },
                listeners: {
                    'blur': function(v) {
                        if (this.up("form").getForm().isDirty()) {
                            state = false;
                        } else {
                            state = true;
                        }
                    }
                }
            }, {
                fieldLabel: '波特率',
                name: 'baud_rate',
                allowBlank: false,
                xtype: 'combo',
                queryMode: 'local',
                displayField: 'name',
                editable: false,
                valueField: 'rate',
                store: Ext.create('Ext.data.Store', {
                    fields: ['rate', 'name'],
                    data: [{
                        "rate": "9600",
                        "name": "9600"
                    }, {
                        "rate": "300",
                        "name": "300"
                    }, {
                        "rate": "600",
                        "name": "600"
                    }, {
                        "rate": "1200",
                        "name": "1200"
                    }, {
                        "rate": "1800",
                        "name": "1800"
                    }, {
                        "rate": "2400",
                        "name": "2400"
                    }, {
                        "rate": "4800",
                        "name": "4800"
                    }, {
                        "rate": "19200",
                        "name": "19200"
                    }, {
                        "rate": "38400",
                        "name": "38400"
                    }, {
                        "rate": "57600",
                        "name": "57600"
                    }, {
                        "rate": "115200",
                        "name": "115200"
                    }]
                }),
                listeners: {
                    'blur': function(v) {
                        if (this.up("form").getForm().isDirty()) {
                            state = false;
                        } else {
                            state = true;
                        }
                    }
                }
            }, {
                fieldLabel: '数据位',
                name: 'data_bits',
                allowBlank: false,
                xtype: 'combo',
                queryMode: 'local',
                editable: false,
                displayField: 'name',
                valueField: 'db',
                store: Ext.create('Ext.data.Store', {
                    fields: ['db', 'name'],
                    data: [{
                        "db": "5",
                        "name": "5"
                    }, {
                        "db": "6",
                        "name": "6"
                    }, {
                        "db": "7",
                        "name": "7"
                    }, {
                        "db": "8",
                        "name": "8"
                    }]
                }),
                listeners: {
                    'blur': function(v) {
                        if (this.up("form").getForm().isDirty()) {
                            state = false;
                        } else {
                            state = true;
                        }
                    }
                }
            }, {
                fieldLabel: '校验方式',
                name: 'parity',
                allowBlank: false,
                xtype: 'combo',
                queryMode: 'local',
                editable: false,
                displayField: 'name',
                valueField: 'parity',
                store: Ext.create('Ext.data.Store', {
                    fields: ['parity', 'name'],
                    data: [{
                        "parity": "n",
                        "name": "none"
                    }, {
                        "parity": "o",
                        "name": "ODD"
                    }, {
                        "parity": "e",
                        "name": "EVEN"
                    }, {
                        "parity": "s",
                        "name": "SPACE"
                    }]
                }),
                listeners: {
                    'blur': function(v) {
                        if (this.up("form").getForm().isDirty()) {
                            state = false;
                        } else {
                            state = true;
                        }
                    }
                }
            }, {
                fieldLabel: '停止位',
                name: 'stop_bits',
                allowBlank: false,
                xtype: 'combo',
                editable: false,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'sb',
                store: Ext.create('Ext.data.Store', {
                    fields: ['sb', 'name'],
                    data: [{
                        "sb": "1",
                        "name": "1"
                    }, {
                        "sb": "2",
                        "name": "2"
                    }]
                }),
                listeners: {
                    'blur': function(v) {
                        if (this.up("form").getForm().isDirty()) {
                            state = false;
                        } else {
                            state = true;
                        }
                    }
                }
            }];
            var viewItem = [];
            var page = localStorage['id'];
            if (page) {
                var base = {
                    items: formItems,
                    init: function(index, name) {
                        if (index && name) {
                            Ext.Ajax.request({
                                url: '/load',
                                async: false,
                                method: 'POST',
                                waitTitle: '请稍等...',
                                waitMsg: '正在加载信息...',
                                params: {
                                    id: 5,
                                    port: parseInt(index)
                                },
                                success: function(response,
                                    opts) {
                                    var jsonobject = Ext.util.JSON
                                        .decode(response.responseText);
                                    if (jsonobject) {
                                        try {
                                            Ext.getCmp(name).getForm().setValues(jsonobject);
                                        } catch (e) {

                                        }
                                    }
                                }
                            });
                        }
                    },
                    update: function(params) {
                        if (params && Ext.isArray(params) &&
                            params.length == 4) {
                            var index = params[0],
                                vals = params[1];
                            Ext.Ajax.request({
                                url: '/save',
                                method: 'POST',
                                waitTitle: '请稍等...',
                                waitMsg: '正在提交信息...',
                                params: {
                                    id: 2,
                                    index: params[3],
                                    port: parseInt(index),
                                    data: Ext.util.JSON
                                        .encode(vals)
                                },
                                success: function(response, opts) {
                                    var jsonobject = Ext.util.JSON.decode(response.responseText);
                                    if (jsonobject.status == -1 || jsonobject.status == -2) {
                                        if (jsonobject.status == -1) {
                                            if (parent.Ext && parent.Ext.loginview && base) {
                                                parent.Ext.loginview(0, base.update, params);
                                            }
                                        } else {
                                            var obj = Ext.getCmp('form_port_submit');
                                            if (obj) {
                                                obj.setDisabled(true);
                                            }
                                            obj = Ext.getCmp('c818e6_port');
                                            if (obj) {
                                                obj.markInvalid('端口号重复!');
                                            }
                                        }
                                    } else {
                                        Ext.Msg.alert('信息', Ext.String.format('保存{0}', (jsonobject && jsonobject.status == 1) ? "成功" : "失败"));
                                        if (jsonobject && jsonobject.status == 1) {
                                            state = true;
                                        }
                                    }
                                },
                                failure: function() {
                                    Ext.Msg.alert('信息', "保存失败");
                                }
                            });
                        }
                    },
                    loadDefault: function(index, name) {
                        if (index && name) {
                            Ext.Ajax
                                .request({
                                    url: '/loadDefault',
                                    async: false,
                                    method: 'POST',
                                    waitTitle: '请稍等...',
                                    waitMsg: '正在加载信息...',
                                    params: {
                                        id: 5,
                                        port: parseInt(index)
                                    },
                                    success: function(response,
                                        opts) {
                                        var jsonobject = Ext.util.JSON
                                            .decode(response.responseText);
                                        if (jsonobject) {
                                            try {
                                                Ext
                                                    .getCmp(
                                                        name)
                                                    .getForm()
                                                    .setValues(
                                                        jsonobject);
                                            } catch (e) {

                                            }
                                        }
                                    }
                                });
                        }
                    }
                };
                switch (page) {
                    case '2':
                        {
                            var tmp = {};
                            Ext.apply(tmp, base);
                            tmp['sindex'] = parseInt(page) - 2;
                            tmp['exName'] = 'a';
                            tmp['index'] = 27011;
                            tmp['title'] = '串口（232-1）参数配置';
                            var rt = buildserialport(tmp);
                            if (rt) {
                                viewItem.push(rt);
                            }
                            break;
                        }
                    case '3':
                        {
                            var tmp = {};
                            Ext.apply(tmp, base);
                            tmp['sindex'] = parseInt(page) - 2;
                            tmp['exName'] = 'b';
                            tmp['index'] = 27012;
                            tmp['title'] = Ext.String.format('串口（485-{0}）参数配置',
                                1);
                            var rt = buildserialport(tmp);
                            if (rt) {
                                viewItem.push(rt);
                            }
                            break;
                        }
                    case '4':
                        {
                            var tmp = {};
                            Ext.apply(tmp, base);
                            tmp['sindex'] = parseInt(page) - 2;
                            tmp['exName'] = 'c';
                            tmp['index'] = 27013;
                            tmp['title'] = Ext.String.format('串口（485-{0}）参数配置',
                                2);
                            var rt = buildserialport(tmp);
                            if (rt) {
                                viewItem.push(rt);
                            }
                            break;
                        }
                    case '5':
                        {
                            var tmp = {};
                            Ext.apply(tmp, base);
                            tmp['sindex'] = parseInt(page) - 2;
                            tmp['exName'] = 'd';
                            tmp['index'] = 27014;
                            tmp['title'] = Ext.String.format('串口（485-{0}）参数配置',
                                3);
                            var rt = buildserialport(tmp);
                            if (rt) {
                                viewItem.push(rt);
                            }
                            break;
                        }
                    case '6':
                        {
                            var tmp = {};
                            Ext.apply(tmp, base);
                            tmp['sindex'] = parseInt(page) - 2;
                            tmp['exName'] = 'e';
                            tmp['index'] = 27015;
                            tmp['title'] = Ext.String.format('串口（485-{0}）参数配置',
                                4);
                            var rt = buildserialport(tmp);
                            if (rt) {
                                viewItem.push(rt);
                            }
                            break;
                        }
                    case '7':
                        {
                            var tmp = {};
                            Ext.apply(tmp, base);
                            tmp['sindex'] = parseInt(page) - 2;
                            tmp['exName'] = 'f';
                            tmp['index'] = 27016;
                            tmp['title'] = Ext.String.format('串口（485-{0}）参数配置',
                                5);
                            var rt = buildserialport(tmp);
                            if (rt) {
                                viewItem.push(rt);
                            }
                            break;
                        }
                    default:
                        break;
                }
            }

            viewport = Ext.create('Ext.container.Viewport', {
                xtype: 'panel',
                items: viewItem,
                listeners: {
                    resize: function(p, width, height, oldWidth,
                        oldHeight, eOpts) {
                        // 缩放

                    }
                },
                cls: 'web_cfg',
            });
        }
        unmask();

    });
})();
var viewport = null;
var state=true;//跳转状态
(function() {
	Ext.onReady(function() {
		Ext.QuickTips.init();
				initExtJS();
				if (viewport == null) {
					var _ip='';
					var buildipaddr = function(cfg) {
						var rt = null;
						if (cfg) {
							var items = [];
							if (cfg.title) {
								items.push({
									xtype : 'label',
									text : cfg.title,
									height : 30,
									border : false,
									cls : 'form_label'
								});
							}
							if (cfg.items && Ext.isArray(cfg.items)) {
								for ( var i = 0; i < cfg.items.length; i++) {
									var it = cfg.items[i];
									var tmp = {};
									Ext.apply(tmp, it);
									if (i == 0 && !tmp.style) {
										tmp["style"] = {
											'margin-top' : '15px !important'
										};
									}
									tmp['cls'] = 'form_item';
									items.push(tmp);
								}
							}
							rt = {
								xtype : 'panel',
								region : 'center',
								cls : 'ip_config',
								border : false,
								items : [ {
									initFormData : function() {
										Ext.Ajax.request({
													url : '/load',
													method : 'POST',
													waitTitle : '请稍等...',
													waitMsg : '正在加载信息...',
													params : {
														id : 4
													},
													success : function(response, opts) {
														var jsonobject = Ext.util.JSON.decode(response.responseText);
														_ip=jsonobject.address;
														// console.log("原ip："+_ip);
														if (jsonobject) {
															var obj = Ext.getCmp("ip_config");
															if (obj) {
																obj.getForm().setValues(jsonobject);
															}
														}
													}
												});
									},
									xtype : 'form',
									id : 'ip_config',
									layout : 'column',
									border : 'false',
									trackResetOnLoad:true,
									defaults : {
										columnWidth : 1,
										margin : '15px 80px 0 50px',
										labelAlign : 'right',
									},
									defaultType : 'textfield',
									items : items,
									listeners : {
										afterrender : function(p, opt) {
											this.initFormData();
										}
									},
									buttons : ['->','->',
											{
												text : '立即提交',
												id : 'form_button_save',
												cls : 'sui-btn btn-bordered btn-xlarge btn-success',
												handler : function() {
													if (cfg.update && Ext.isFunction(cfg.update)) {
														try {
															var form = this.up("form").getForm();
															console.log(form.isDirty());
															if(form.isDirty()){
																if (form.isValid()) {
																	cfg.update(form.getValues());
																	form.setValues(form.getValues());
																} else {
																	Ext.Msg.alert("非法提交","请按要求填写!!!");
																}
															}else{
																console.log("无需提交")
															}
														} catch (e) {
															console.log(e);
														}
													}

												}
											},
											'->',
											{
												text : '放弃修改',
												cls : 'sui-btn btn-bordered btn-xlarge btn-info',
												handler : function() {
													this.up('form').getForm().reset();
													this.up('form').initFormData();
													Ext.getCmp('form_button_save').setDisabled(false);
													state=true;
												}
											},
											'->',
											{
												text : '恢复默认',
												cls : 'sui-btn btn-bordered btn-xlarge btn-warning',
												handler : function() {
													this.up("form").getForm().trackResetOnLoad=false;
													state=false;
													if (cfg.loadDefault&& Ext.isFunction(cfg.loadDefault)) {
														try {
															cfg.loadDefault(this.up("form").getForm());
															Ext.getCmp('form_button_save').setDisabled(false);
														} catch (e) {
															console.log(e);
														}
													}
												}
									    }, '->', '->' ]
								} ]
							};
						}
						return rt;
					};
					var formItems = [{
								fieldLabel : 'IP地址',
								id : 'form_ip_address',
								name : 'address',
								blankText:'请输入IP地址',
   							    msgTarget:'qtip',
								allowBlank : false,
								enableKeyEvents : true,
								listeners : {//失去焦点
									'blur':function(v) {
										var a=v.lastValue;
										if(this.up("form").getForm().isDirty()){
											state=false;
										}else{
											state=true;
										}
										if (judge_ip(a)) {
											console.log(a);
											console.log(_ip);
//											var u_ip =window.location.host.split(":");
//											if（!judge_ip(judge_ip)){
//												u_ip='192.168.1.1';
//											}
//											console.log(u_ip[0]);&&a!=u_ip[0]
											if(_ip!=a){
												Ext.Ajax.request({
													url : '/validate',
													method : 'POST',
													waitTitle : '请稍等...',
													waitMsg : '正在加载信息...',
													params : {
														address : a
													},
													success : function(response, opts) {
														var jsonobject = Ext.util.JSON.decode(response.responseText);
														if (jsonobject) {
															var obj = Ext.getCmp("form_ip_address");
															var c = Ext.getCmp('form_button_save');
															if (c) {
																c.setDisabled(jsonobject.status == 1);
															}
															if (obj){
																if (jsonobject.status == 1) {
																	obj.markInvalid([{field : 'address',message : 'IP地址冲突,已经被使用.'}]);
																	console.log(a+" IP地址,已经被使用.");
																} else {
																	console.log(a+" IP地址,可以使用.");
																	obj.clearInvalid();
																	c.setDisabled(false);
																}
															}
														}
													}
												});
											}
										}else{
											var c = Ext.getCmp('form_button_save');
											var obj = Ext.getCmp("form_ip_address");
											obj.markInvalid([{field : 'address',message : 'IP地址不合法.'}]);
											c.setDisabled(true);
										}
								}}
					}, {
								fieldLabel : '子网掩码',
								name : 'netmask',
								id:'form_ip_netmask',
								allowBlank : false,
								enableKeyEvents : true,
								listeners : {
									'blur':function(v) {
										if(this.up("form").getForm().isDirty()){
											state=false;//修改了表单
										}else{
											state=true;
										}
										var c = Ext.getCmp('form_button_save');
										var a=v.lastValue;
										if (judge_ip(a)){
											c.setDisabled(false);
										}else{
											c.setDisabled(true);
											var obj = Ext.getCmp("form_ip_netmask");
											obj.markInvalid([{field : 'netmask',message : '子网掩码不合法.'}]);
										}
									}
								}
								
							}, {
								fieldLabel : '默认网关',
								name : 'gateway',
								id:'form_ip_gateway',
								allowBlank : false,
								enableKeyEvents : true,
								listeners : {
									'blur':function(v) {
										if(this.up("form").getForm().isDirty()){
											state=false;
										}else{
											state=true;
										}
										var c = Ext.getCmp('form_button_save');
										var a=v.lastValue;
										if (judge_ip(a)){
											c.setDisabled(false);
										}else{
											c.setDisabled(true);
											var obj = Ext.getCmp("form_ip_gateway");
											obj.markInvalid([{field : 'gateway',message : '默认网关不合法.'}]);
										}
									}
								}	
							}, {
								fieldLabel : '首选DNS',
								name : 'dns1',
								allowBlank : true,
								id:'form_ip_dns1',
								listeners : {
									'blur':function(v) {
										if(this.up("form").getForm().isDirty()){
											state=false;
										}else{
											state=true;
										}
										var c = Ext.getCmp('form_button_save');
										var a=v.lastValue;
										if(a!=''){
											if (judge_ip(a)){
													c.setDisabled(false);
												}else{
													c.setDisabled(true);
													var obj = Ext.getCmp("form_ip_dns1");
													obj.markInvalid([{field : 'dns1',message : '首选DNS不合法.'}]);
											}
										}
									}
								}
							}, {
								fieldLabel : '备用DNS',
								name : 'dns2',
								allowBlank : true,
								id:'form_ip_dns2',
								listeners : {
									'blur':function(v) {
										if(this.up("form").getForm().isDirty()){
											state=false;
										}else{
											state=true;
										}
										var c = Ext.getCmp('form_button_save');
										var a=v.lastValue;
										if(a!=''){
											if (judge_ip(a)){
												c.setDisabled(false);
											}else{
												c.setDisabled(true);
												var obj = Ext.getCmp("form_ip_dns2");
												obj.markInvalid([{field : 'dns2',message : '首选DNS不合法.'}]);
											}
										}
									}
								}
							} ];
					var judge_ip=function (ip){
							var b = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip);
							var c=true;
							var arr=ip.split(".");
							if (b) {
								for (var i=0;i<arr.length;i++) {
									if(arr[i]<0||arr[i]>255){
										c=false;
									}
								}
							}else{
								c=false;
							}
							return c;
					}
					var viewItem = null;
					var base = {
						items : formItems,
						update : function(vals) {
							Ext.Ajax.request({
										url : '/save',
										method : 'POST',
										waitTitle : '请稍等...',
										waitMsg : '正在提交信息...',
										params : {
											id : 1,
											data : Ext.util.JSON.encode(vals)
										},
										success : function(response, opts) {
											var jsonobject = Ext.util.JSON.decode(response.responseText);
											if (jsonobject.status == -1) {
												if (parent.Ext&& parent.Ext.loginview) {
													parent.Ext.loginview(0,base.update,vals);
												}
											} else {
												if(jsonobject && jsonobject.status == 1){
													var url = "http://"+vals.address+":"+window.location.port+"/";
													Ext.Msg.wait('跳转网页: '+url,'提示 5S后'); 
													state=true;
													setTimeout(function () {top.location.href=url; },5000);
												}else{
													Ext.Msg.alert('信息','失败');
												}
											}
										},
										failure : function() {
											Ext.Msg.alert('信息', "保存失败");
										}
									});
						},
						loadDefault : function(form) {
							if (form) {
								Ext.Ajax.request({
									url : '/loadDefault',
									async : false,
									method : 'POST',
									waitTitle : '请稍等...',
									waitMsg : '正在加载信息...',
									params : {
										id : 4
									},
									success : function(response, opts) {
										var jsonobject = Ext.util.JSON.decode(response.responseText);
										if (jsonobject) {
											form.setValues(jsonobject);
										}
									}
								});
							}
						}
					};
					var tmp = {};
					Ext.apply(tmp, base);
					tmp['index'] = 0;
					tmp['title'] = '网络配置';
					viewItem = buildipaddr(tmp);
					viewport = Ext.create('Ext.container.Viewport', {
						xtype : 'panel',
						items : viewItem,
						listeners : {
							resize : function(p, width, height, oldWidth,
									oldHeight, eOpts) {
								// 缩放
							}
						},
						cls : 'web_cfg',
					});
		}
	
	});
})();

var viewport = null;
(function() {
	Ext
			.onReady(function() {
				initExtJS();
				if (viewport == null) {
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
										Ext.Ajax
												.request({
													url : '/load',
													method : 'POST',
													waitTitle : '请稍等...',
													waitMsg : '正在加载信息...',
													params : {
														id : 4
													},
													success : function(
															response, opts) {
														var jsonobject = Ext.util.JSON
																.decode(response.responseText);
														if (jsonobject) {
															var obj = Ext
																	.getCmp("ip_config");
															if (obj) {
																obj
																		.getForm()
																		.setValues(
																				jsonobject);
															}
														}
													}
												});
									},
									xtype : 'form',
									id : 'ip_config',
									layout : 'column',
									border : 'false',
									defaults : {
										columnWidth : 1,
										margin : '15px 80px 0 50px',
										labelWidth : 60,
										labelAlign : 'right',
										cls : 'form_item_tra'
									},
									defaultType : 'textfield',
									items : items,
									listeners : {
										afterrender : function(p, opt) {
											this.initFormData();
										}
									},
									buttons : [
											'->',
											'->',
											{
												text : '立即生效',
												id : 'form_button_save',
												cls : 'sui-btn btn-bordered btn-xlarge btn-success',
												handler : function() {
													if (cfg.update
															&& Ext
																	.isFunction(cfg.update)) {
														try {
															var form = this.up(
																	"form")
																	.getForm();
															if (form.isValid()) {
																cfg
																		.update(form
																				.getValues());
															} else {
																Ext.Msg
																		.alert(
																				"非法提交",
																				"请按要求填写!!!");
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
													this.up('form').getForm()
															.reset();
													this.up('form')
															.initFormData();
												}
											},
											'->',
											{
												text : '恢复默认',
												cls : 'sui-btn btn-bordered btn-xlarge btn-warning',
												handler : function() {
													if (cfg.loadDefault
															&& Ext
																	.isFunction(cfg.loadDefault)) {
														try {
															cfg
																	.loadDefault(this
																			.up(
																					"form")
																			.getForm());
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
					var formItems = [
							{
								fieldLabel : 'IP地址',
								id : 'form_ip_address',
								name : 'address',
								allowBlank : false,
								enableKeyEvents : true,
								validator : function(v) {
									var b = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
											.test(v);
									if (b) {
										Ext.Ajax
												.request({
													url : '/validate',
													method : 'POST',
													waitTitle : '请稍等...',
													waitMsg : '正在加载信息...',
													params : {
														address : v
													},
													success : function(
															response, opts) {
														var jsonobject = Ext.util.JSON
																.decode(response.responseText);
														if (jsonobject) {
															var obj = Ext
																	.getCmp("form_ip_address");
															var c = Ext
																	.getCmp('form_button_save');
															if (c) {
																c
																		.setDisabled(jsonobject.status == 1);
															}
															if (obj) {
																if (jsonobject.status == 1) {
																	obj
																			.markInvalid([ {
																				field : 'address',
																				message : 'IP地址冲突,已经被使用.'
																			} ]);
																} else {
																	obj
																			.clearInvalid();
																}
															}
														}
													}
												});

									}
									return b;
								}
							}, {
								fieldLabel : '子网掩码',
								name : 'netmask',
								allowBlank : false
							}, {
								fieldLabel : '默认网关',
								name : 'gateway',
								allowBlank : false
							}, {
								fieldLabel : '首选DNS',
								name : 'dns1',
								allowBlank : true
							}, {
								fieldLabel : '备用DNS',
								name : 'dns2',
								allowBlank : true
							} ];
					var viewItem = null;
					var base = {
						items : formItems,
						update : function(vals) {
							Ext.Ajax
									.request({
										url : '/save',
										method : 'POST',
										waitTitle : '请稍等...',
										waitMsg : '正在提交信息...',
										params : {
											id : 1,
											data : Ext.util.JSON.encode(vals)
										},
										success : function(response, opts) {
											var jsonobject = Ext.util.JSON
													.decode(response.responseText);
											if (jsonobject.status == -1) {
												if (parent.Ext
														&& parent.Ext.loginview) {
													parent.Ext.loginview(0,base.update,vals);
												}
											} else {
												Ext.Msg
														.alert(
																'信息',
																Ext.String
																		.format(
																				'保存{0}',
																				(jsonobject && jsonobject.status == 1) ? "成功"
																						: "失败"));
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
										var jsonobject = Ext.util.JSON
												.decode(response.responseText);
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
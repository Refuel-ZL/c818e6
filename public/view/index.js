var viewport = null; // 代表浏览器窗口的整个区域
(function() {
	Ext.onReady(function() {
		initExtJS();
		if(viewport == null) { // 初始化主页
			// vcenter中的翻页按钮
			var hasLogin = (Ext.loginstatus == 1);
			var pageNavi = '<div id="allpage" class="no_Selection">' +
				'<a id="Left" class="a1" href="javascript:void(0)" onmousedown="moveLeft()"></a>' +
				'<div id="page">' +
				'<ul>' +
				'<li><a href="#" class="active" alt="ip设置" title="ip设置"><div><span>ip</br>设置</span></div></a></li>' +
				'<li><a href="#" alt="串口(232-1)" title="串口(232-1)"><div><span>串口</br>1</span></div></a></li>' +
				'<li><a href="#" alt="串口(232-2)" title="串口(232-2)"><div><span>串口</br>2</span></div></a></li>' +
				'<li><a href="#" alt="串口(485-1)" title="串口(485-1)"><div><span>串口</br>3</span></div></a></li>' +
				'<li><a href="#" alt="串口(485-2)" title="串口(485-2)"><div><span>串口</br>4</span></div></a></li>' +
				'<li><a href="#" alt="串口(485-3)" title="串口(485-3)"><div><span>串口</br>5</span></div></a></li>' +
				'<li><a href="#" alt="串口(485-4)" title="串口(485-4)"><div><span>串口</br>6</span></div></a></li>' +
				'</ul>' +
				'</div>' +
				'<a  id="Right" class="a1" href="javascript:void(0)" onmousedown="moveRight()"></a>' +
				'</div>';
			var vcenter = { // 子面板 items
				xtype: 'panel',
				region: 'center',
				layout: 'border',
				border: false,
				items: [{ // 北部型号显示
					xtype: 'panel',
					region: 'north',
					border: false,
					layout: 'fit',
					items: [{
						xtype: 'panel',
						region: 'north',
						height: 150,
						layout: 'border',
						border: false,
						items: [{
							region: 'west',
							width: 425,
							xtype: 'panel',
							border: false,
							layout: {
								type: 'fit'
							},
							cls: 'head_left',
						}, {
							region: 'center',
							xtype: 'panel',
							border: false,
							html: '<p id="prologo"><a href=#></a></p>',
							cls: 'head_centre',
						}, {
							region: 'east',
							width: 425,
							border: false,
							xtype: 'panel',
							layout: {
								type: 'vbox',
								align: 'east',
								pack: 'east'
							},
							cls: 'head_right',
						}]
					}]
				}, { // 中间显示区域
					layout: 'fit',
					region: 'center',
					border: false,
					frame: false,
					margin: '0 0',
					padding: '0 0',
					items: [{
						xtype: 'panel',
						region: 'center',
						layout: 'border',
						border: false,
						items: [{
							region: 'west',
							xtype: 'panel',
							border: false,
							layout: {
								type: 'fit'
							},
							html: '<div class="clearfix no_Selection"><div class="allcpu"> <span class="title1">CPU资源监测</span><div id="cpu1"  class="cpu">1</div><div id="cpu2"  class="cpu">2</div></div></div>',
							cls: 'content_left',
						}, {
							region: 'center',
							layout: 'fit',
							border: false,
							frame: false,
							listeners: {
								resize: function(p, width, height, oldWidth, oldHeight, eOpts) {}
							},
							html: '<div id="loader_container"><div id="loader"><div id="loader_bg"></div><div align="center">页面组件加载中……<br />加载可能会花费一些时间，请稍候...</div></div></div><iframe id="c818e6_ip_cfg" class="ifrmae_border" src="view/c818e6_ip_cfg.html" frameborder="0" scrolling="no" width="100%" height="100%"></iframe>',
						}, {
							region: 'east',
							border: false,
							xtype: 'panel',
							layout: {
								type: 'fit'
							},
							html: '<div class="memory_box no_Selection"><div class="allmemory"><span class="title2">内存资源监测</span><div id="memory"  class="memory">1</div></div></div>',
							cls: 'content_east',
						}]
					}]
				}, { // 南显示区域
					xtype: 'panel',
					region: 'south',
					border: false,
					items: [{
						xtype: 'panel',
						layout: 'fit',
						border: false,
						items: [{
							xtype: 'panel',
							region: 'south',
							height: 150,
							layout: 'border',
							border: false,
							items: [{
								region: 'west',
								xtype: 'panel',
								border: false,
								layout: {
									type: 'vbox',
									align: 'west',
									pack: 'west'
								},
								cls: 'below_west',
							}, {
								region: 'center',
								border: false,
								xtype: 'panel',
								layout: {
									type: 'vbox',
									align: 'center',
									pack: 'center'
								},
								items: [{
									xtype: 'panel',
									border: false,
									region: 'center',
									html: pageNavi,
								}],
								cls: 'below_center',
							}, {
								region: 'east',
								border: false,
								xtype: 'panel',
								layout: {
									type: 'vbox',
									align: 'east',
									pack: 'east'
								},
								cls: 'below_east',
							}]
						}]
					}]
				}]
			};
			var center = { // 父中部面板
				xtype: 'panel',
				region: 'center',
				layout: 'border',
				border: false,
				minWidth: 1000,
				cls: 'panel_center',
				items: [vcenter]
			};
			var north = { // 父北部面板
				xtype: 'panel',
				height: 60,
				region: 'north',
				layout: 'border',
				border: false,
				minWidth: 1000,
				cls: 'header panel_north',
				items: [{
					xtype: 'image',
					region: 'west',
					width: 429,
					border: false,
					cls: 'header-west-panel'
				}, {
					xtype: 'panel',
					region: 'center',
					border: false,
					cls: 'nobackground'
				}, {
					xtype: 'panel',
					region: 'east',
					width: 255,
					height: 30,
					border: false,
					layout: 'hbox',
					cls: 'header-east-panel',
					items: [{
						text: hasLogin ? '改密码' : '登录',
						xtype: 'button',
						id: 'main-login-menu1',
						width: 83,
						height: 30,
						cls: 'main-login-menu1',
						handler: function(p) {
							Ext.loginstatus = Ext.loginstatus || 0;
							Ext.loginview(Ext.loginstatus);
						}
					}, {
						text: '全屏',
						xtype: 'panel',
						cls: 'main-login-menu2',
						width: 83,
						height: 30,
						html: '<button type="button" id="fullScreen"  onclick="fullScreen(this.id)" onmouseout="this.style.backgroundColor=\'transparent\'"  onmouseover="this.style.backgroundColor=\'#b0ccf2\'">全屏</button>'
					}, {
						xtype: 'button',
						cls: 'main-login-menu3',
						width: 83,
						height: 30,
						restartImpl: function(f) {
							if(Ext.loginstatus != 1) {
								Ext.loginview(0, f);
							} else {
								Ext.Ajax.request({
									url: '/restart',
									method: 'POST',
									waitTitle: '请稍等...',
									waitMsg: '正在重启...',
									success: function(response, opts) {
										var jsonobject = Ext.util.JSON.decode(response.responseText);
										if(jsonobject) {
											if(jsonobject.status == -1) {
												Ext.loginview(0);
											} else {
												 var url = window.location.href;
												 if(jsonobject.status == 1){
													 Ext.Msg.wait('正在尝试重新连接。。。。。',"重启成功"); 
													 var n=0;
													 var timer1=setInterval(
													 	function () {
													 	if(n>=6){
													 		clearInterval(timer1);
													 		Ext.Msg.hide();
													 		Ext.Msg.alert("错误","重连超时！，请确认设备是否运行正常"); 
													 	}
													 	Ext.Ajax.request({
																url: url,
																method: 'GET',
																success: function(response, opts) {
																	console.log("重启成功");
																	Ext.Msg.hide();
																	clearInterval(timer1);
																	top.location.href=url;
																},
																failure: function(response, opts) {
																	n++;
																	console.log("尝试重新连接");
															    }
														});
													 },5000);
												}else{
													Ext.Msg.alert("错误","重启失败"); 
												}
											}
										}
									}
								});
							}
						},
						text: '重启',
						//						iconCls: 'main-menu3-icon',
						listeners: {
							click: function(p, e, opt) {
								this.restartImpl(p.restartImpl);
							}
						}
					}]
				}]
			};
			viewport = Ext.create('Ext.panel.Panel', { // 创建border布局
				layout: 'border',
				width: Ext.get("fullviewport").getWidth(),
				height: Ext.get("fullviewport").getHeight(),
				border: false,
				renderTo: 'fullviewport',
				items: [center, north],
				listeners: {
					resize: function(p, width, height, oldWidth,
						oldHeight, eOpts) {
						// 缩放
					}
				},
				cls: 'web'
			});
			Ext.loginview = function(p, next, nextParams) {
				var mod = (p == 1);
				var item = null;
				if(mod) {
					item = {
						xtype: 'textfield',
						columnWidth: 1,
						labelWidth: 60,
						fieldLabel: '旧密码',
						labelPad: 10,
						inputType: 'password',
						labelAlign: 'right',
						id: 'textfiled_username',
						cls: 'textfiled_username',
						validateBlank: true,
						emptyText: '请输入旧密码',
						blankText: '只有密码验证通过才能更改密码'
					};
				} else {
					item = {
						xtype: 'textfield',
						columnWidth: 1,
						labelWidth: 60,
						fieldLabel: '账号',
						labelPad: 10,
						labelAlign: 'right',
						id: 'textfiled_username',
						editable: false,
						cls: 'textfiled_username',
						value: 'admin',
						validateBlank: true,
						emptyText: '请输入用户名'
					};
				}
				var win = Ext.create(
					'Ext.window.Window', {
						width: 494,
						height: 273,
						layout: {
							align: 'middle',
							pack: 'center',
							type: 'hbox'
						},
						plain: true,
						header: false,
						id: 'user-login-win',
						resizable: false,
						border: false,
						closable: false,
						renderTo: document.body,
						cls: 'login-windows',
						modal: true,
						items: [{
							xtype: 'panel',
							width: 260,
							height: 70,
							cls: 'login-form',
							layout: 'column',
							border: false,
							modal: true,
							items: [
								item, {
									xtype: 'textfield',
									labelWidth: 60,
									inputType: 'password',
									labelPad: 10,
									fieldLabel: '密码',
									labelAlign: 'right',
									columnWidth: 1,
									cls: 'textfiled_password',
									id: 'textfiled_password',
									validateBlank: true,
									emptyText: '请输入密码'
								}
							]
						}, {
							xtype: 'button',
							width: 70,
							height: 70,
							id: 'user-login-button',
							baseCls: 'login-button-base',
							cls: mod ? 'changepwd-button' : 'login-button',
							overCls: mod ? 'changepwd-button-over' : 'login-button-over',
							focusCls: mod ? 'changepwd-button-focus' : 'login-button-focus',
							handler: function(p, e, opt) {
								var user = Ext.getCmp('textfiled_username').getValue();
								var pwd = Ext.getCmp('textfiled_password').getValue();
								var b= /^[A-Za-z0-9]{3,16}$/.test(pwd);
								console.log(b);
								if(b){
								Ext.Ajax.request({
									url: mod ? '/save' : '/login',
									method: 'POST',
									waitTitle: '请稍等...',
									waitMsg: '正在加载信息...',
									params: mod ? {
										id: 0,
										data: Ext.util.JSON.encode({
											oldpassword: user,
											password: pwd
										})
									} : {
										username: user,
										password: pwd
									},
									success: function(response, opts) {
										var jsonobject = Ext.util.JSON.decode(response.responseText);
										if(jsonobject && jsonobject.status == 1) {
											Ext.getCmp('user-login-win').close();
											var menu = Ext.getCmp('main-login-menu1');
											if(menu) {
												menu.fireEvent('blur', menu);
												if(!mod) { // 登录成功后
													Ext.loginstatus = 1;
													try {
														menu.setText("改密码");
													} catch(e) {

													}
												}
											}
											try {
												if(next && Ext.isFunction(next)) {
													next(nextParams);
												}
											} catch(e) {

											}

										} else {
											if(mod) {
												Ext.getCmp('textfiled_username').markInvalid('旧密码有误!');
											} else {
												Ext.getCmp('textfiled_password').markInvalid('密码有误!');
											}
										}
									}
								});
								}else{
									Ext.getCmp('textfiled_password').markInvalid('密码格式有误!数字字母 3-16位');
								}
							}
						}]
					});
				win.show();
			};
		}

		var loadC818E6Page = function(id, n) {
			localStorage['id'] = id;
			var el = Ext.get('c818e6_ip_cfg');
			if(el) {
				mask();
				var url = (id === 1 ? 'view/c818e6_ip_cfg.html' : 'view/c818e6_cfg.html');
				el.dom.src = url;
				var iframe = document.getElementById("c818e6_ip_cfg");
				var targelem = document.getElementById('loader_container');
				targelem.style.display = 'block';
				targelem.style.visibility = 'visible';
				iframe.style.visibility = 'hidden';
				if(iframe.attachEvent) {
					iframe.attachEvent("onload", function() {
						targelem.style.display = 'none';
						iframe.style.visibility = 'visible';
						targelem.style.visibility = 'hidden';
					});
				} else {
					iframe.onload = function() {
						targelem.style.display = 'none';
						iframe.style.visibility = 'visible';
						targelem.style.visibility = 'hidden';
					};
				}
			}
		};
		var initPaging = function(id) {
			loadC818E6Page(id, 0);
			var m = id;
			var aLi = Ext.getDom('page').getElementsByTagName('a');
			if(aLi) {
				for(var i = 0; i < aLi.length; i++) {
					aLi[i].index = i + 1;
					aLi[i].onclick = function() {
						if(this.className != "active") { // 非活动页
							for(var n = 0; n < aLi.length; n++) {
								aLi[n].className = "";
							}
							var l = this.index;
							var ss = document.getElementById("c818e6_ip_cfg").contentWindow.state;
							if(ss) {
								Ext.getDom('page').getElementsByTagName('a')[l - 1].className = "active"; // 活动页
								loadC818E6Page(l, 1000);
								m = l - 1;
							} else {
								Ext.MessageBox.confirm("你已经作了一些数据修改", "是否真的要放弃",
									function(button, text) {
										if(button == "yes") {
											Ext.getDom('page').getElementsByTagName('a')[l - 1].className = "active"; // 活动页
											// 切换显示内容
											loadC818E6Page(l, 1000);
											m = l - 1;
										} else {
											Ext.getDom('page').getElementsByTagName('a')[m].className = "active"; // 上次活动页
										}
									}
								);
							}

						}
					};
				}
			}
		};
		initPaging(1);
		Highcharts.setOptions({
			global: {
				useUTC: true
			}
		});
		var lineoptions = {
			// colors: ["#04F404"],
			colors: ["#012D98"],
			credits: { // 不显示Highcharts.com的链接
				enabled: false
			},
			chart: {
				// animation: Highcharts.svg, // don't animate in old IE
				animation: false,
				renderTo: 'cpu1',
				type: 'area',
				// backgroundColor: 'rgba(0,0,0,0)',//背景透明
				backgroundColor: { // 渐变背景
					linearGradient: [0, 0, 0, 200],
					stops: [
						[0, 'rgb(96, 96, 96)'],
						[1, 'rgb(16, 16, 16)']
					]
				},
			},
			plotOptions: {
				series: {
					marker: {
						// radius: 2,
						enabled: false
							// 关闭数据点显示
					},
					lineWidth: 2
				},
			},
			title: {
				style: {
					color: '#FFF',
					font: '16px 微软雅黑,arial black,新宋体, sans-serif'
				},
				text: 'CPU1使用率（%）'
			},
			xAxis: {
				minorGridLineColor: '#197F07',
				lineColor: '#197F07', // 设置X轴颜色
				tickInterval: 10 * 1000, // 刻度步长
				tickWidth: 0,
				// tickPixelInterval: 80, //刻度密度像素控制
				gridLineColor: 'transparent', // 设置纵向标尺颜色
				gridLineWidth: 0, // 设置纵向标尺宽度
				labels: {
					enabled: false
				}
			},
			yAxis: {
				title: false,
				min: 0,
				max: 100, // y轴最大值
				tickInterval: 20,
				gridLineWidth: 1,
				gridLineColor: "#008040",
				lineWidth: 0,
				tickWidth: 0,
				labels: {
					style: {
						color: '#fff'
					}
				},
			},
			tooltip: {
				enabled: false
			},
			legend: {
				enabled: false
			},
			exporting: {
				enabled: false
			},
			series: [{
				name: 'CPU1使用率（%）',
				data: (function() {
					var data = [];
					Ext.Ajax.request({
						url: '/rest',
						method: 'POST',
						async: false,
						success: function(response, opts) {
							var tmp = Ext.JSON.decode(response.responseText);
							if(tmp && Ext.isObject(tmp)) {
								for(var i = 30; i >= 0; i--) {
									data.push({
										x: tmp.time - i * 1000,
										y: 0
									});
								}
							}
						},
						failure: function(response, opts) {
							console.log("更新数据失败");
						}
					});
					return data;
				}())
			}]
		};
		var pie_chart = {
			colors: ['#0059A7', // 第一个颜色 空闲
				'red', // 第二个颜色 使用
			],
			chart: {
				renderTo: 'memory',
				backgroundColor: 'rgba(0,0,0,0)', // 背景透明
				plotBackgroundColor: null,
				plotBorderWidth: 0,
				plotShadow: true,
			},
			title: {
				text: '能耗监控'
			},
			credits: {
				enabled: false
			},
			exporting: {
				enabled: false
			},
			tooltip: {
				pointFormat: '{point.name}: <b>{point.percentage}%</b>',
				percentageDecimals: 1,
				formatter: function() {
					// return '<b>' + this.point.name + '</b>: ' +
					// Highcharts.numberFormat(this.percentage, 2) + '
					// %';
					return '<b>' + this.point.name + '</b>: ' +Highcharts.numberFormat(this.y, 2) * 1024 +' MB';
				}
			},
			plotOptions: {
				pie: {
					size: '100%',
					borderWidth: 0,
					allowPointSelect: false,
					cursor: 'pointer',
					showInLegend: true,
					dataLabels: {
						enabled: true,
						color: '#fff',
						connectorColor: '#000000',
						distance: -30,
						style: {
							fontSize: '10px',
							// lineHeight: '10px',
						},
						formatter: function() {
							return '<b>' + Highcharts.numberFormat(this.percentage, 2) + ' %' + '</b>';
						},

					},
					point: {
						events: {
							legendItemClick: function() {
								return false;
							},
							click: function() {
								return false;
							}
						}
					}
					//padding : 20,

				}

			},
			legend: { // 图列
				align: 'center', // 程度标的目标地位
				verticalAlign: 'top', // 垂直标的目标地位
				x: 0, // 间隔x轴的间隔
				y: 0, // 间隔Y轴的间隔
				//						 layout: 'vertical',
				backgroundColor: '#0164B7',
				itemHoverStyle: {
					color: '#000000'
				},
				itemStyle: {
					'fontSize': '12px',
					'color': '#fff',
				},
				floating: false,

			},
			series: [{
				type: 'pie',
				//innerSize:'50%',
				data: [{
					name: '空闲内存',
					y: 1,
					color: '#0059A7',
					//sliced: true
					selected: true
				}, {
					name: '使用内存',
					y: 1,
					color: 'red',
					//sliced: true,
					selected: true
				}]
			}]
		};
		$(document).ready(
			function() {
				var cpu1 = new Highcharts.Chart(lineoptions);
				lineoptions.chart.renderTo = "cpu2";
				lineoptions.title.text = "CPU2使用记录(%)";
				var cpu2 = new Highcharts.Chart(lineoptions);
				/** 饼图* */
				pie_chart.title.text = "";
				var memory1 = new Highcharts.Chart(pie_chart);
				 var time=0;
				setInterval(function() {
						Ext.Ajax.request({
							url: '/rest',
							method: 'POST',
							success: function(response, opts) {
								var tmp = Ext.JSON.decode(response.responseText);
								if(tmp && Ext.isObject(tmp) && Ext.isArray(tmp.cores) &&tmp.mem != null) {
									console.log(tmp.time);
									time=tmp.time;
									var series = cpu1.series[0];
									series.addPoint([tmp.time, tmp.cores[0]], true, true);
									series = cpu2.series[0];
									series.addPoint([tmp.time, tmp.cores[1]], true, true);
									series = memory1.series[0];
									var data = [];
									var setcolor = '#0059A7';
									if(tmp.mem < 0.5) {
										setcolor = '#FF6347';
									} else if(tmp.mem < 0.75) {
										setcolor = '#FF0000';
									} else {
										setcolor = '#8B0000';
									}
									data.push({
										name: '空闲内存',
										y: 1 - tmp.mem,
										color: '#0059A7'
									}, {
										name: '使用内存',
										y: tmp.mem,
										color: setcolor
									});
									series.setData(data, true);
								}else{
									var series = cpu1.series[0];
									series.addPoint([time, 0], true, true);
									series = cpu2.series[0];
									series.addPoint([time, 0], true, true);
									console.log("无数据");
									time+=1000;
								}
							},
							failure: function(response, opts) {
								var series = cpu1.series[0];
								series.addPoint([time, 0], true, true);
								series = cpu2.series[0];
								series.addPoint([time, 0], true, true);
								console.log("更新数据失败");
								time+=1000;
							}
						});
					}, 1000);

			});

	});

})();
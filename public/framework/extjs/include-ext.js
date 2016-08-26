(function() {
	function getQueryParam(name) {
		var regex = RegExp('[?&]' + name + '=([^&]*)');

		var match = regex.exec(location.search) || regex.exec(scriptPath);
		return match && decodeURIComponent(match[1]);
	}

	function hasOption(opt, queryString) {
		var s = queryString || location.search;
		var re = new RegExp('(?:^|[&?])' + opt + '(?:[=]([^&]*))?(?:$|[&])',
			'i');
		var m = re.exec(s);

		return m ? (m[1] === undefined || m[1] === '' ? true : m[1]) : false;
	}

	function loadCss(url) {
		document.write('<link rel="stylesheet" type="text/css" href="' + url +
			'"/>');
	}

	function loadScript(url, defer) {
		document.write('<script type="text/javascript" src="' + url + '"' +
			(defer ? ' defer' : '') + '></script>');
	}

	Ext = window.Ext || {};

	// The value of Ext.repoDevMode gets replaced during a build - do not change
	// this line
	// 2 == internal dev mode, 1 == external dev mode, 0 == build mode
	Ext.devMode = 1;

	var scriptEls = document.getElementsByTagName('script'),
		scriptPath = scriptEls[scriptEls.length - 1].src,
		rtl = getQueryParam('rtl'),
		themeName = getQueryParam('theme') ||
		'triton',
		includeCSS = !hasOption('nocss', scriptPath),
		useDebug = hasOption('debug'),
		hasOverrides = !hasOption(
			'nooverrides', scriptPath) &&
		!!{
			neptune: 1,
			triton: 1,
			classic: 1,
			gray: 1,
			triton: 1,
			'neptune-touch': 1,
			crisp: 1,
			'crisp-touch': 1
		}[themeName],
		i = 1,
		devMode = Ext.devMode,
		extDir = scriptPath,
		rtlSuffix = (rtl ? '-rtl' :
			''),
		debugSuffix = (devMode ? '-debug' : ''),
		cssSuffix = rtlSuffix +
		debugSuffix + '.css',
		themePackageDir, chartsJS, uxJS, themeOverrideJS, extPrefix, extPackagesRoot;

	rtl = rtl && rtl.toString() === 'true';

	while(i--) {
		extDir = extDir.substring(0, extDir.lastIndexOf('/'));
	}

	extPackagesRoot = devMode ? (extDir + '/build') : extDir;

	uxJS = extPackagesRoot + '/packages/ux/classic/ux' + debugSuffix + '.js';
	chartsJS = extPackagesRoot + '/packages/charts/classic/charts' +
		debugSuffix + '.js';
	themePackageDir = extPackagesRoot + '/classic/theme-' + themeName + '/';

	if(includeCSS) {
		loadCss(themePackageDir + 'resources/theme-' + themeName + '-all' +
			cssSuffix);
		loadCss(extPackagesRoot + '/packages/charts/classic/' + themeName +
			'/resources/charts-all' + cssSuffix);
		loadCss(extPackagesRoot + '/packages/ux/classic/' + themeName +
			'/resources/ux-all' + cssSuffix);
	}

	extPrefix = useDebug ? '/ext-all-debug' : '/ext-all';

	document.write('<script type="text/javascript" src="' + extDir + extPrefix +
		rtlSuffix + '.js"></script>');
	/** ****************************************************************************** */
	document.write('<script type="text/javascript" src="' + extDir +
		'/build/classic/locale/locale-zh_CN.js"></script>');

	if(hasOverrides) {
		themeOverrideJS = themePackageDir + 'theme-' + themeName + debugSuffix +
			'.js';
		if(devMode) {
			if(window.ActiveXObject) {
				Ext = {
					_beforereadyhandler: function() {
						Ext.Loader.loadScript({
							url: themeOverrideJS
						});
					}
				};
			} else {
				loadScript(themeOverrideJS, true);
			}
		} else {
			loadScript(themeOverrideJS, true);
			loadScript(uxJS);
			loadScript(chartsJS);
		}
	}

})();

function initExtJS() {
	try {
		Ext.Loader.setConfig({
			enabled: true,
			disableCaching: false
		});
		Ext.QuickTips.init();
		Ext.Msg.YES = "";
		Ext.getDoc().on("contextmenu", function(e) {
			e.stopEvent();
		});
		mask();
	} catch(e) {
		console.log(e);
	}
}

function mask(msg) {
	if(msg) {
		var m = msg || "数据重新加载中，请稍等";
		Ext.getBody().mask(m);
	}
}

function unmask() {
	try {
		var p = window.parent;
		if(p && p.Ext) {
			p.Ext.getBody().unmask();
		}
		Ext.getBody().unmask();
	} catch(e) {
		console.log(e);
	}
}

function requestFullScreen() {
	 var el = document.documentElement;
//      rfs = el.requestFullscreen || el.mozRequestFullScreen || el.webkitRequestFullScreen || el.msRequestFullscreen,
//      wscript;
//  if(typeof rfs != "undefined" && rfs) {
//      rfs.call(el);
//      return;
//  }else if(typeof window.ActiveXObject != "undefined") {
//      wscript = new ActiveXObject("WScript.Shell");
//      if(wscript) {
//          wscript.SendKeys("{F11}");
//      }
//  }
  if(el.requestFullscreen) {
       el.requestFullscreen();
     } else if(el.mozRequestFullScreen) {
       el.mozRequestFullScreen();
     } else if(el.msRequestFullscreen){ 
       el.msRequestFullscreen();  
     } else if(el.oRequestFullscreen){
        el.oRequestFullscreen();
    }
    else if(el.webkitRequestFullscreen)
     {
       el.webkitRequestFullScreen();
     }else if(typeof window.ActiveXObject != "undefined") {
       var wscript = new ActiveXObject("WScript.Shell");
        if(wscript) {
            wscript.SendKeys("{F11}");
        }
    }
}

function exitFullscreen() {
	var de = document;
	if (de.exitFullscreen) {
		de.exitFullscreen();
	}else if(de.msExitFullscreen) {
		de.msExitFullscreen();
	} else if (de.mozCancelFullScreen) {
		de.mozCancelFullScreen();
	} else if (de.webkitCancelFullScreen) {
		de.webkitCancelFullScreen();
	} else if(document.oRequestFullscreen) {
					document.oCancelFullScreen();
	}else if (typeof window.ActiveXObject != "undefined") {
		// for IE
		try {
			var wscript = new ActiveXObject("WScript.Shell");
			if (wscript != null) {
				wscript.SendKeys("{F11}");
			}
		} catch (e) {

		}
	}
}

function fullScreen(id){
	console.log(id);
	if(!window.isFullScreen){
		window.isFullScreen=false;
	}
	window.isFullScreen=window.isFullScreen?false:true;
	if(window.isFullScreen){
		requestFullScreen();
		document.getElementById("fullScreen").innerHTML="恢复";
//		try{
//			if(id){
//				var obj=Ext.getCmp(id);
//				if(obj){
//					obj.setText('恢复');
//				}
//			}
//		}catch(e){
//			
//		}
	}else{
		exitFullscreen();
		try{
			document.getElementById("fullScreen").innerHTML="全屏";
		}catch(e){
			
		}
	}
}
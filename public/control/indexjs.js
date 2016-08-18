//最大宽度li:菜单的宽度=li个数*（宽度+间距）
//var maxWidth = $("page").getElementsByTagName("ul")[0].getElementsByTagName("li").length * 60;
 var maxWidth= 420;
var l = 295 + 5; //设置页宽度
var targetx = 0; //水平移动的距离
var dx;
var a = null;
var n = 0;
function W$W(obj) {
	return document.getElementById(obj)
}
function moveLeft() { //向前
	//获取当前水平移动位置
	var le = parseInt($("page").scrollLeft);
	if(le != 0) {
		if(le > l) {
			targetx = le - l;
		} else {
			targetx = 0;
		}
		scLeft();
	}
}
function scLeft() {
	W$W("page").scrollLeft = targetx;
	icon();
}
function moveRight() { //向后
	var le = parseInt(W$W("page").scrollLeft) + l; //预备水平移动位置
	var maxL = maxWidth - parseInt(W$W("page").scrollLeft) - 295 - 5; //后面隐藏长度=最大长度-偏移量-显示长度
	if(maxL != 0) {
		if(l < maxL) { //剩余足够
			targetx = le;
		} else { //不足就是后面隐藏长度
			targetx = parseInt(W$W("page").scrollLeft) + maxL;
		}
		scRight();
	}
}

function scRight() {
	W$W("page").scrollLeft = targetx;
	icon();
}

function icon() {
	var yi = parseInt(W$W("page").scrollLeft);
	var maxL = maxWidth - parseInt(W$W("page").scrollLeft) - 295 - 5; //后面隐藏长度=最大长度-偏移量-显示长度
	if(yi > 0) {
//		console.log("左移有位置");
		W$W("Left").style.backgroundPosition = "-0px -0px";
	} else {
//		console.log("左移无位置");
		W$W("Left").style.backgroundPosition = "-0px -36px";
	}
	if(maxL > 0) {
//		console.log("右移有位置");
		W$W("Right").style.backgroundPosition = "-125px 0px";
	} else {
		W$W("Right").style.backgroundPosition = "-125px -36px";
//		console.log("右移无位置");
	}
}
window.onload = function() {
	initialButton();
	reInitialButton();
	enableLi();
	bigButton();
	var button = document.getElementById("button");
	button.onmousemove = handle;
}

function initialButton() {
	var x = document.getElementsByTagName("li");
	var span = document.getElementsByTagName("span");
	x[0].onclick = function() {
		if (this.style.backgroundColor.toString() == "blue") {
			var child = this.childNodes;
			child[0].innerHTML = "...";
			var sum = 0;
			for (var i = 1; i < span.length; i++) {
				sum += parseInt(span[i].innerHTML);
			}
			span[0].innerHTML = sum;
			this.style.backgroundColor = "gray";
		}
	}
	for (var i = 1; i < x.length; i++) {
		x[i].onclick = function() {
			if (this.style.backgroundColor.toString() == "blue") {
				unableLi(this.id);
				var newSpan = createSpan();
				this.appendChild(newSpan);
				getAjax(this.id);
			}
		}
	}
}


function createSpan() {
	var newSpan = document.createElement("span");
	newSpan.style.display = "block";
	newSpan.style.width = "15px";
	newSpan.style.height = "15px";
	newSpan.style.borderRadius = "15px";
	newSpan.style.fontSize = "0.5px";
	newSpan.style.textAlign = "center";
	newSpan.style.color = "white";
	newSpan.style.backgroundColor = "red";
	newSpan.style.position = "relative";
	newSpan.style.top = "-25px";
	newSpan.style.left = "25px";
	newSpan.innerHTML = "...";
	return newSpan;
}

function bigButton() {
	var span = document.getElementsByTagName("span");
	if (span.length == 6) {
		document.getElementById("big").style.backgroundColor = "blue";
		return;
	} else {
		document.getElementById("big").style.backgroundColor = "gray";
		return;
	}
}

function reInitialButton() {
	var x = document.getElementById("button");
	x.onmouseleave = function() {
		var g = document.getElementsByTagName("span");
		g[0].innerHTML = "";
		for (var i = 1; i < g.length; ) {
			var parent = g[i].parentNode;
			parent.removeChild(g[i]);
		}
		var l = document.getElementsByTagName("li");
		l[0].style.backgroundColor = "gray";
		for (var i = 1; i < l.length; i++) {
			l[i].style.backgroundColor = "blue";
		}
	}
}

function getAjax(idName) {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			document.getElementById(idName).childNodes[1].innerHTML = xmlhttp.responseText;
			document.getElementById(idName).style.backgroundColor = "gray";
			enableLi();
			bigButton();
			handle(idName);
		}
	}
	xmlhttp.open("GET","/",true);
	xmlhttp.send();
}

function enableLi() {
	var li = document.getElementsByTagName("li");
	for (var i = 1; i < li.length; i++) {
		if (li[i].childNodes.length == 1) {
			li[i].style.backgroundColor = "blue";
		}
	}
}
function unableLi(idName) {
	var li = document.getElementsByTagName("li");
	for (var i = 1; i < li.length; i++) {
		if (li[i].id != idName) {
			li[i].style.backgroundColor = "gray";
		}
	}
}

function handle(idName) {
	var li = document.getElementsByTagName("li");
	var button = document.getElementById("x");
	if (li[1].childNodes.length == 1) {
		li[1].click();
	}
	var i = 0;
	for (; i < li.length; i++) {
		if (li[i].id == idName) {
			break;
		}
	}
	if (i == li.length - 1) {
		li[0].click();
	} else {
		li[i+1].click();
	}
}

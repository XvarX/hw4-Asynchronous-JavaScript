$ = function(id) { return document.getElementById(id); };
$$ = function(tag) { return document.getElementsByTagName(tag) };

/*
* My English is poor, so...
* 我不是很明白S3这一问，毕竟JavaScript是单线程，我不太清楚该如何同时触发函数。
* 所以我“扭曲”了一下题意，当且仅当所有Button都接收到随机数时才显示全部的随机数。
* 全程等待时间为5-15秒。
*/


var req = [], 
	ans = 0, 
	record = 0,
	str = [];

window.onload = function() {
	$('button').onmouseover = function(e) {
		if(!e) e = window.event;  
    	var reltg = e.relatedTarget ? e.relatedTarget : e.toElement;  

    	while( reltg && reltg != this ) reltg = reltg.parentNode;  
    	if( reltg != this ) getStarted();
	};

	$('button').onmouseout = function(e) {
		if(!e) e = window.event;  
    	var reltg = e.relatedTarget ? e.relatedTarget : e.toElement;  

    	while( reltg && reltg != this ) reltg = reltg.parentNode;  
    	if( reltg != this ) reset();
	}
};

function getStarted() {
	var arr = $$('button');
	for (var i = 0; i < arr.length; i++) {
		arr[i].disabled = '';
		arr[i].className = 'active';
		arr[i].innerHTML = arr[i].innerHTML + "<span class='unread'>...</span>";
	}
	makeReq();
}

function reset() {
	$('info-bar').className = '';
	$('info-bar').innerHTML = '';
	var arr = $$('button');

	if (req[record]) req[record].abort();
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].getElementsByTagName('span')[0])
			arr[i].removeChild(arr[i].getElementsByTagName('span')[0]);
	}

	str = [];
	req = [];
	ans = 0;
	record = 0;
}

function loading(result) {
	ans += result;
	record++;
	if (record === $$('button').length) displayResult();
}

function displayResult() {
	var bload = $('info-bar'),
		arr = $$('button');

	bload.disabled = '';
	bload.innerHTML = ans;
	bload.style.backgroundColor = '#7F7E7E';
	bload.style.cursor = 'default';

	for (var i = 0; i < arr.length; i++) {
		arr[i].innerHTML = arr[i].innerHTML.replace("...", str[i]);
	}
}

function makeReq() {
	for (var i = 0; i < $$('button').length; i++) {
		req[i] = new XMLHttpRequest();

		req[i].onreadystatechange = function(i) {
			return function() {
				var arr = $$('button');
				var init = arr[i].innerHTML;
				if (req[i].readyState === 4 && req[i].status === 200) {
					str[i] = parseInt(req[i].responseText);
					loading(parseInt(req[i].responseText));
				} 
			}
		}(i);

		req[i].open('get', '/', true);
		req[i].send();
	}
}

$ = function(id) { return document.getElementById(id); };
$$ = function(tag) { return document.getElementsByTagName(tag) };

var flags = [0, 0, 0, 0, 0]; //returned the random num or not
var req = []; // the arr of Requests

window.onload = function() {
	changeLook();
	$('button').onmouseout = function(e) {
		if(!e) e = window.event;  
    	var reltg = e.relatedTarget ? e.relatedTarget : e.toElement;  

    	while( reltg && reltg != this ) reltg = reltg.parentNode;  
    	if( reltg != this ) reset();
	}
};

function reset() {
	flags = [0, 0, 0, 0, 0];
	$('info-bar').className = '';
	$('info-bar').innerHTML = '';
	var arr = $$('button');

	for (var i = 0; i < arr.length; i++) {
		if (req[i]) req[i].abort();
	}

	for (var i = 0; i < arr.length; i++) {
		if (arr[i].getElementsByTagName('span')[0])
			arr[i].removeChild(arr[i].getElementsByTagName('span')[0]);

		arr[i].className = 'active';
		arr[i].disabled = '';
	}

	$('info-bar').onclick = function() {};
}

function changeLook() {
	var arr = $$('button');
	var i;
	for (i = 0; i < arr.length; i++) {
		if (!flags[i]) {
			arr[i].onclick = function(i) {
				return function() {
					makeReq(i);
				};
			}(i);
		}
	}
	for (i = 0; i < flags.length; i++) {
		if (!flags[i]) break;
	}
	if (i === flags.length) displayResult();
}

function displayResult() {
	var ans = 0;
	for (var i = 0; i < flags.length; i++) {
		ans += flags[i];
	}

	var bload = $('info-bar');
	bload.disabled = '';
	bload.className = 'active';
	bload.style.cursor = 'pointer';
	bload.style.backgroundColor = 'rgba(48, 63, 159, 1)';
	bload.onclick = function() {
		bload.innerHTML = ans;
		bload.style.backgroundColor = '#7F7E7E';
		bload.style.cursor = 'default';
	};
}

function makeReq(index) {
	var arr = $$('button');
	var init = arr[index].innerHTML;
	req[index] = new XMLHttpRequest();
	flags[index] = 1;

	req[index].onreadystatechange = function() {
		if (req[index].readyState === 4 && req[index].status === 200) {
			arr[index].innerHTML = init + "<span class='unread'>" + req[index].responseText + "</span>";
			flags[index] = parseInt(req[index].responseText);

			for (var i = 0; i < arr.length; i++) {
				if (!flags[i]) {
					arr[i].className = 'active';
					arr[i].disabled = '';	
				}
			}
			arr[index].className = 'disable';
			arr[index].disabled = 'disabled';
			changeLook();
		} else {
			arr[index].innerHTML = init + "<span class='unread'>...</span>";
			for (var i = 0; i < arr.length; i++) {
				if (!flags[i]) {
					arr[i].className = 'disable';
					arr[i].disabled = 'disabled';
				}
			}

		}
	};
	
	req[index].open('get', '/', true);
	req[index].send();
}

$ = function(id) { return document.getElementById(id); };
$$ = function(tag) { return document.getElementsByTagName(tag) };

var req = [], //the arr of Requests
	ans = 0, //the num to be shown on big bubble
	record = 0; //how many Requests have been returned random nums

window.onload = function() {
	$('button').onmouseover = function(e) {
		if(!e) e = window.event;  
    	var reltg = e.relatedTarget ? e.relatedTarget : e.toElement;  

    	while( reltg && reltg != this ) reltg = reltg.parentNode;  
    	if( reltg != this ) makeReq(0);
	}

	$('button').onmouseout = function(e) {
		if(!e) e = window.event;  
    	var reltg = e.relatedTarget ? e.relatedTarget : e.toElement;  

    	while( reltg && reltg != this ) reltg = reltg.parentNode;  
    	if( reltg != this ) reset();
	}
};

function reset() {
	$('info-bar').className = '';
	$('info-bar').innerHTML = '';
	var arr = $$('button');

	if (req[record]) req[record].abort();

	for (var i = 0; i < arr.length; i++) {
		if (arr[i].getElementsByTagName('span')[0])
			arr[i].removeChild(arr[i].getElementsByTagName('span')[0]);
	}

	req = [];
	record = 0;
	ans = 0;
}

function loading(result) {
	ans += result;
	record++;
	record === $$('button').length? displayResult() : makeReq(record);
}

function displayResult() {
	var bload = $('info-bar');
	bload.disabled = '';
	bload.className = 'active';
	bload.style.backgroundColor = 'rgba(48, 63, 159, 1)';

	bload.innerHTML = ans;
	bload.style.backgroundColor = '#7F7E7E';
	bload.style.cursor = 'default';
}

function makeReq(index) {
	var arr = $$('button');
	var init = arr[index].innerHTML;
	req[index] = new XMLHttpRequest();

	req[index].onreadystatechange = function() {
		if (req[index].readyState === 4 && req[index].status === 200) {
			arr[index].innerHTML = init + "<span class='unread'>" + req[index].responseText + "</span>";

			if (index != arr.length - 1) {
				for (var i = 0; i < arr.length; i++) {
					arr[i].className = 'active';
					arr[i].disabled = '';	
				}
			}
			arr[index].className = 'disable';
			arr[index].disabled = 'disabled';

			loading(parseInt(req[index].responseText));
		} else {
			arr[index].innerHTML = init + "<span class='unread'>...</span>";
			for (var i = 0; i < arr.length; i++) {
				arr[i].className = 'disable';
				arr[i].disabled = 'disabled';
			}
			arr[index].className = 'active';
		}
	};
	
	req[index].open('get', '/', true);
	req[index].send();
}

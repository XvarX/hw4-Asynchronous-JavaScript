$ = function(id) { return document.getElementById(id); };
$$ = function(tag) { return document.getElementsByTagName(tag) };

var req = [], //the arr for Requests
	ans = 0, //the num to be shown on big bubble
	reqNow = -1; //the index of Request in req[] now
	record = 0, //how many Requests have been returned random nums
	rand = []; //record the random order of buttons

window.onload = function() {
	$('button').onmouseover = function(e) {
		if(!e) e = window.event;  
    	var reltg = e.relatedTarget ? e.relatedTarget : e.toElement;  

    	while( reltg && reltg != this ) reltg = reltg.parentNode;  
    	if( reltg != this ) randomArr();
	}

	$('button').onmouseout = function(e) {
		if(!e) e = window.event;  
    	var reltg = e.relatedTarget ? e.relatedTarget : e.toElement;  

    	while( reltg && reltg != this ) reltg = reltg.parentNode;  
    	if( reltg != this ) reset();
	}
};

function displayRandom() {
	var str = '';

	for (var i = 0; i < rand.length; i++) {
		switch(rand[i]) {
			case 0:
				str += 'A';
				break;
			case 1:
				str += 'B';
				break;
			case 2:
				str += 'C';
				break;
			case 3:
				str += 'D';
				break;
			case 4:
				str += 'E';
				break;
			default:
				console.log('Random error!\n');
				break;
		}
	}

	$('info-bar').innerHTML = str;
	makeReq(rand[0]);
}

function randomArr() {
    for(var i = 0; i < 5; i++){
        var val =  Math.floor(Math.random() * 5),
        	j = 0,
        	temp = rand.length;
        for (; j < rand.length; j++) {
        	if (rand[j] == val) break;
        }
        if (j == temp) rand[j] = val;
        else i--;
    }

    displayRandom();
}

function reset() {
	$('info-bar').className = '';
	$('info-bar').innerHTML = '';
	var arr = $$('button');

	if (reqNow > 0) req[reqNow].abort();
	for (var i = 0; i < arr.length; i++) {
		arr[i].className = 'active';
		arr[i].disabled = '';
		if (arr[i].getElementsByTagName('span')[0])
			arr[i].removeChild(arr[i].getElementsByTagName('span')[0]);
	}

	rand = [];
	req = [];
	record = 0;
	ans = 0;
	reqNow = -1;
}

function loading(result, index) {
	reqNow = index;
	ans += result;
	record++;
	record === $$('button').length? displayResult() : makeReq(rand[record]);
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
	if (index >= 0 && index < 5) {
		var arr = $$('button');
		var init = arr[index].innerHTML;
		req[index] = new XMLHttpRequest();

		req[index].onreadystatechange = function() {
			if (req[index].readyState === 4 && req[index].status === 200) {
				arr[index].innerHTML = init + "<span class='unread'>" + req[index].responseText + "</span>";

				if (record != arr.length - 1) {
					for (var i = 0; i < arr.length; i++) {
						arr[i].className = 'active';
						arr[i].disabled = '';	
					}
				}
				arr[index].className = 'disable';
				arr[index].disabled = 'disabled';

				loading(parseInt(req[index].responseText), index);
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
}


function hasClass(object, className) {
    if (!object.className) return false;
    return (object.className.search('(^|\\s)' + className + '(\\s|$)') != -1);
};

function removeClass(object,className) {
    if (!object) return;
    object.className = object.className.replace(new RegExp('(^|\\s)'+className+'(\\s|$)'), RegExp.$1+RegExp.$2);
};

function addClass(object,className) {
    if (!object || hasClass(object, className)) return;
    if (object.className) {
        object.className += ' '+className;
    } else {
        object.className = className;
    }
};

function getElementsByClassName(elementName, className) {
    var allElements = document.getElementsByTagName(elementName);
    var elemColl = new Array();
    for (var i = 0; i< allElements.length; i++) {
        if (hasClass(allElements[i], className)) {
            elemColl[elemColl.length] = allElements[i];
        }
    }
    return elemColl;
};

function ajax (url, callback, data, random) {
    var xhr;
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    } else {   // for IE6
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    if (url.indexOf("?") > 0) { 
        url += "&randnum=" + Math.random(); 
    } 
    else { 
        url += "?randnum=" + Math.random(); 
    }
    xhr.open('GET', url, true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                callback(xhr.responseText+'-'+data+'-'+random);
            }
        }
    };
};

function makeDisable(obj) {
    removeClass(obj, 'enable');
    addClass(obj, 'disable');
};

function makeEnable(obj) {
    removeClass(obj, 'disable');
    addClass(obj, 'enable');
};

window.onload = function() {
    var main = document.getElementById('button');
    var info = getElementsByClassName('div', 'info')[0];
    var buttons = getElementsByClassName('li', 'button');
    var apb = getElementsByClassName('div', 'apb')[0];
    var unreads = getElementsByClassName('span', 'unread');
    var random;
    var status = new Array();
    for (var i = 0; i < buttons.length; i++) {
        status[i] = -1; 
    }

    main.onmouseout = function(e) {
        var e = window.event || e;     // 阻止事件冒泡
        var relateTarget = e.toElement || e.relateTarget;
        while (relateTarget && relateTarget != this)
            relateTarget = relateTarget.parentNode;

        if (!relateTarget) {
            reset();
        }
    }

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function(i) {
            return function() {
                clickEvent(i);
            }
        }(i);
    };

    info.onclick = function() {
        if (hasClass(info, 'disable')) {
            return;
        }
        var sum = 0;
        for (var i = 0; i < unreads.length; i++) {
            sum += parseInt(unreads[i].innerText);
        }
        getElementsByClassName('span', 'sum')[0].innerText = sum.toString();
        makeDisable(info);
    };

    apb.onclick = function() {
        for (var i in status) {
            if (status[i] == 0) {
                return;
            }
        }
        reset();
        return autoClick();
    };

    function clickEvent(i) {
        if (status[i] == 1) {
            return;
        }
        for (var item in status) {
            if (status[item] == 0) {
                return;
            }
        }
        status[i] = 0;
        unreads[i].style.opacity = '1';
        ajax('http://localhost:3000', function(response) {
            if (status[i] == 0) {
                unreads[i].innerText = parseInt(response.split('-')[0]);
                status[i] = 1;
                setStyle();
            }
        });
        setStyle();
    }

    function autoClick() {
        var counter = 0;
        random = Math.random();
        for (var i = 0;  i < buttons.length; i++) {
            status[i] = 0;
            unreads[i].style.opacity = '1';
            ajax('http://localhost:3000', function(response) {
                index = parseInt(response.split('-')[1]);
                r = parseFloat(response.split('-')[2]);
                if (status[index] == 0 && r == random) {
                    unreads[index].innerText = parseInt(response.split('-')[0]);
                    status[index] = 1;
                    setStyle();
                    counter++;
                }
                if (counter == buttons.length) {
                    var sum = 0;
                    for (var i = 0; i < unreads.length; i++) {
                        sum += parseInt(unreads[i].innerText);
                    }
                    getElementsByClassName('span', 'sum')[0].innerText = sum.toString();
                    makeDisable(info);
                }
            }, i, random);
        }
        setStyle();
    };

    function reset() {    // 重置函数
        for (var i = 0; i < buttons.length; i++) {
            makeEnable(buttons[i]);
            unreads[i].innerText = '...';
            unreads[i].style.opacity = '0';
            status[i] = -1;
        };
        makeDisable(info);
        getElementsByClassName('span', 'sum')[0].innerText = "";
    };

    function setStyle() {
        var length = status.length;
        var count = 0;
        for (var i = 0; i < length; i++) {
            if (status[i] == -1) {
                makeEnable(buttons[i]);
            } else if (status[i] == 1) {
                count++;
                makeDisable(buttons[i]);
            }
        }
        if (count == length) {
            makeEnable(info);
        } else {
            makeDisable(info);
        }
    };
};

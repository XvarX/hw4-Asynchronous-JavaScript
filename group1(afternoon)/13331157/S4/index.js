
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

function ajax (url, callback) {
    var xhr;
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    } else {   // for IE6
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    xhr.open('GET', url, true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                callback(xhr.responseText);
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

function generRandom() {
    var letter = ['A', 'B', 'C', 'D', 'E'];
    var arr = new Array();
    while (arr.length < 5) {
        var r = parseInt(Math.random()*10)%5;
        var exit = false;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == letter[r]) {
                exit = true;
                break;
            }
        }
        if (!exit) {
            arr[arr.length] = letter[r];
        }
    }
    return arr;
};

function showRandom(sequence) {
    var newDiv = document.createElement('div');
    for (var i in sequence) {
        newDiv.innerHTML += sequence[i]+' ';
    }
    newDiv.className += 'sequence';
    var infoBar = document.getElementById('info-bar');
    infoBar.appendChild(newDiv);
};

window.onload = function() {
    var main = document.getElementById('button');
    var info = getElementsByClassName('div', 'info')[0];
    var buttons = getElementsByClassName('li', 'button');
    var apb = getElementsByClassName('div', 'apb')[0];
    var unreads = getElementsByClassName('span', 'unread');
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
    };

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function(i) {
            return function() {
                clickEvent(i);
            }
        }(i);
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
        console.log("button " + i + " clicked.");
        status[i] = 0;
        unreads[i].style.opacity = '1';
        ajax('http://localhost:3000', function(response) {
            if (status[i] == 0) {
                unreads[i].innerText = response;
                status[i] = 1;
                setStyle();
            }
        });
        setStyle();
    }

    info.onclick = function() {
        if (hasClass(info, 'disable')) {
            return;
        }
        console.log("info clicked.");
        var sum = 0;
        for (var i = 0; i < unreads.length; i++) {
            sum += parseInt(unreads[i].innerText);
        }
        getElementsByClassName('span', 'sum')[0].innerText = sum.toString();
        makeDisable(info);
    };

    function reset() {
        for (var i = 0; i < buttons.length; i++) {
            makeEnable(buttons[i]);
            unreads[i].innerText = '...';
            unreads[i].style.opacity = '0';
            status[i] = -1;
        };
        makeDisable(info);
        getElementsByClassName('span', 'sum')[0].innerText = "";
        var sequence = getElementsByClassName('div','sequence')[0];
        if (sequence) {
            sequence.parentNode.removeChild(sequence);
        }
    };

    apb.onclick = function() {
        for (var i in status) {
            if (status[i] == 0) {
                return;
            }
        }
        reset();
        var sequence = generRandom();
        showRandom(sequence);
        return autoClick(0, sequence);
    };

    function autoClick(i, sequence) {
        if (i >= buttons.length) {
            var sum = 0;
            for (var i = 0; i < unreads.length; i++) {
                sum += parseInt(unreads[i].innerText);
            }
            getElementsByClassName('span', 'sum')[0].innerText = sum.toString();
            makeDisable(info);
            return;
        }
        var index = sequence[i].charCodeAt(0)-'A'.charCodeAt(0);
        status[index] = 0;
        unreads[index].style.opacity = '1';
        ajax('http://localhost:3000', function(response) {
            if (status[index] == 0) {
                unreads[index].innerText = response;
                status[index] = 1;
                setStyle();
                autoClick(i+1, sequence);
            }
        });
        setStyle();
    };

    function setStyle() {
        var length = status.length;
        for (var i = 0; i < length; i++) {
            if (status[i] == 0) {
                for (var j = 0; j < length; j++) {
                    if (j != i) makeDisable(buttons[j]);
                }
                return;
            }
        }
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

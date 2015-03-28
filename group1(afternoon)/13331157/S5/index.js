
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

function showMessage(message) {
    var oMessage = getElementsByClassName('div','_message')[0];
    if (oMessage) {
        oMessage.parentNode.removeChild(oMessage);
    }
    var newDiv = document.createElement('div');
    newDiv.innerHTML = message;
    newDiv.className += '_message';
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
    
    function aHandler(currentSum, callback) {
        try {
            var random = Math.random();
            if (random < 0.3) {
                throw({message: '这不是个天大的秘密', currentSum:currentSum});
            } else {
                status[0] = 0;
                unreads[0].style.opacity = '1';
                ajax("http://localhost:3000", function(response) {
                    if (status[0] == 0) {
                        unreads[0].innerText = response;
                        status[0] = 1;
                        setStyle();
                        showMessage("这是个天大的秘密");
                        if (callback) {
                            callback(currentSum+parseInt(response), callback.next);
                        }
                    }
                });
                setStyle();
            }
        } catch (error) {
            showMessage(error['message']);
            if (callback.next) {
                ajax("http://localhost:3000", function(response) {
                    callback.next(currentSum, callback.next.next);
                });
            } else {
                ajax("http://localhost:3000", function(response) {
                    bubbleHandler(currentSum);
                });   
            }
        }
    };

    function bHandler(currentSum, callback) {
        try {
            var random = Math.random();
            if (random < 0.3) {
                throw({message: '我知道', currentSum:currentSum});
            } else {
                status[1] = 0;
                unreads[1].style.opacity = '1';
                ajax("http://localhost:3000", function(response) {
                    if (status[1] == 0) {
                        unreads[1].innerText = response;
                        status[1] = 1;
                        setStyle();
                        showMessage("我不知道");
                        if (callback) {
                            callback(currentSum+parseInt(response), callback.next);
                        }
                    }
                });
                setStyle();
            }
        } catch(error) {
            showMessage(error['message']);
            if (callback.next) {
                ajax("http://localhost:3000", function(response) {
                    callback.next(currentSum, callback.next.next);
                });
            } else {
                ajax("http://localhost:3000", function(response) {
                    bubbleHandler(currentSum);
                });   
            }
        }
    };

    function cHandler(currentSum, callback) {
        try {
            var random = Math.random();
            if (random < 0.3) {
                throw({message: '你知道', currentSum:currentSum});
            } else {
                status[2] = 0;
                unreads[2].style.opacity = '1';
                ajax("http://localhost:3000", function(response) {
                    if (status[2] == 0) {
                        unreads[2].innerText = response;
                        status[2] = 1;
                        setStyle();
                        showMessage("你不知道");
                        if (callback) {
                            callback(currentSum+parseInt(response), callback.next);
                        }
                    }
                });
                setStyle();
            }
        } catch (error) {
            showMessage(error['message']);
            if (callback.next) {
                ajax("http://localhost:3000", function(response) {
                    callback.next(currentSum, callback.next.next);
                });
            } else {
                ajax("http://localhost:3000", function(response) {
                    bubbleHandler(currentSum);
                });   
            }
        }
    };

    function dHandler(currentSum, callback) {
        try {
            var random = Math.random();
            if (random < 0.3) {
                throw({message: '他知道', currentSum:currentSum});
            } else {
                status[3] = 0;
                unreads[3].style.opacity = '1'
                ajax("http://localhost:3000", function(response) {
                    if (status[3] == 0) {
                        unreads[3].innerText = response;
                        status[3] = 1;
                        setStyle();
                        showMessage("他不知道");
                        if (callback) {
                            callback(currentSum+parseInt(response), callback.next);
                        }
                    }
                });
                setStyle();
            }
        } catch (error) {
            showMessage(error['message']);
            if (callback.next) {
                ajax("http://localhost:3000", function(response) {
                    callback.next(currentSum, callback.next.next);
                });
            } else {
                ajax("http://localhost:3000", function(response) {
                    bubbleHandler(currentSum);
                });   
            }
        }
    };

    function eHandler(currentSum, callback) {
        try {
            var random = Math.random();
            if (random < 0.3) {
                throw({message: '不怪不怪', currentSum:currentSum});
            } else {
                status[4] = 0;
                unreads[4].style.opacity = '1'
                ajax("http://localhost:3000", function(response) {
                    if (status[4] == 0) {
                        unreads[4].innerText = response;
                        status[4] = 1;
                        setStyle();
                        showMessage("才怪");
                        if (callback) {
                            callback(currentSum+parseInt(response), callback.next);
                        }
                    }
                });
                setStyle();
            }
        } catch (error) {
            showMessage(error['message']);
            if (callback.next) {
                ajax("http://localhost:3000", function(response) {
                    callback.next(currentSum, callback.next.next);
                });
            } else {
                ajax("http://localhost:3000", function(response) {
                    bubbleHandler(currentSum);
                });   
            }
        }
    };
    
    function bubbleHandler(currentSum, callback) {
        getElementsByClassName('span', 'sum')[0].innerText = currentSum.toString();
        makeDisable(info);
        for (var i = 0; i < buttons.length; i++) {
            makeDisable(buttons[i]);
        }
        showMessage("楼主异步调用战斗力感人，目测不超过"+currentSum.toString());
    };

    var map = new Map();
    map.set('A', aHandler);
    map.set('B', bHandler);
    map.set('C', cHandler);
    map.set('D', dHandler);
    map.set('E', eHandler);

    apb.onclick = function() {
        for (var i in status) {
            if (status[i] == 0) {
                return;
            }
        }
        reset();
        var sequence = generRandom();
        showRandom(sequence);
        return autoClick(sequence);
    };

    function autoClick(sequence) {
        for (var i = 0; i < sequence.length; i++) {   //根据sequence确定执行顺序
            if (i+1 < sequence.length) {
                map.get(sequence[i]).next = map.get(sequence[i+1]);
            }
        }
        map.get(sequence[sequence.length-1]).next = bubbleHandler;
        map.get(sequence[0])(0, map.get(sequence[1]));
    };

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
        var message = getElementsByClassName('div','_message')[0];
        if (message) {
            message.parentNode.removeChild(message);
        }
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
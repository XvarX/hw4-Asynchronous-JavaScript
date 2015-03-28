function getByClass(oParent, sClass) {  // getElementsByClassName
    var aEle = oParent.getElementsByTagName('*');
    var aResult = [];
    var re = new RegExp('\\b' + sClass + '\\b', 'i');
    for(var i = 0; i < aEle.length; i++) {
        if (re.test(aEle[i].className)) {
            aResult.push(aEle[i]);
        }
    }
    return aResult;
}

function ajax(url, Succ) {  // to encapsulate the ajax function
    var oAjax = new XMLHttpRequest();
    oAjax.open('GET', url, true);
    oAjax.send();
    oAjax.onreadystatechange = function() {
        if (oAjax.readyState == 4 && oAjax.status == 200) {
            Succ(oAjax.responseText);
        }
    }
}

function wait(li) {
    var unread_span = document.createElement("span");
    unread_span.className = "unread";
    unread_span.innerHTML = "...";
    li.appendChild(unread_span);
}

function disable_buttons(i, buttons, button) {
    buttons[i].disabled = true;
    button.disabled = true;
    for (var j = 0; j < buttons.length; ++j) {
        if (i != j) {
            buttons[j].disabled = true;
            buttons[j].style.backgroundColor = "rgb(126, 126, 126)";
        }
    }
}

function enable_buttons(i, buttons, info_bar) {
    if (i != buttons.length) {
        buttons[i].disabled = true;
        buttons[i].style.backgroundColor = "rgb(126, 126, 126)";
    }
    info_bar.getElementsByTagName("li")[0].innerHTML = "";
    var is_all_disabled = true;
    for (var j = 0; j < buttons.length; ++j) {
        if (i != j && buttons[j].getElementsByTagName("span").length == 0) {
            buttons[j].disabled = false;
            buttons[j].style.backgroundColor = "rgb(48, 63, 159)";
            is_all_disabled = false;
        }
        if (buttons[j].getElementsByTagName("span").length != 0 && buttons[j].getElementsByTagName("span")[0].innerHTML == "...") {
            is_all_disabled = false;
        }
    }
    if (is_all_disabled) {
        info_bar.disabled = false;
        info_bar.style.backgroundColor = "rgb(48, 63, 159)";
    }
}

function callback(i, buttons, info_bar) {
    if (i == buttons.length) return;
    wait(buttons[i]);
    ajax('/RandomNumber'+i, function(str) {
        buttons[i].getElementsByTagName("span")[0].innerHTML = str;
        enable_buttons(i, buttons, info_bar);
        for (var j = 0; j < buttons.length; ++j) {
            if (buttons[j].disabled == false) {
                return;
            }
        }
        info_bar.click();
    });
    callback(i+1, buttons, info_bar);
}

window.onload = function() {
    var buttons = document.getElementById("control-ring").getElementsByTagName("li");
    var info_bar = document.getElementById("info-bar");
    info_bar.disabled = true;  // add 'disabled' attribute to the info_bar
    var button = getByClass(document, "icon")[0];
    button.disabled = true;
    for (var i = 0; i < buttons.length; ++i) {
        buttons[i].onclick =  function(i) {
            return function() {
                if (buttons[i].disabled == true) return;  // add 'disabled' attribute to the buttons
                disable_buttons(i, buttons, button);
                wait(this);
                ajax('/', function(str) {
                    buttons[i].getElementsByTagName("span")[0].innerHTML = str;
                    enable_buttons(i, buttons, info_bar);
                });
            };
        }(i);
    }
    info_bar.onclick = function() {
        if (info_bar.disabled == true) return;
        var sum = 0;
        for (var i = 0; i < buttons.length; ++i) {
            sum += parseInt(buttons[i].getElementsByTagName("span")[0].innerHTML);  // to calculate the sum
        }
        info_bar.getElementsByTagName("li")[0].innerHTML = sum;
        info_bar.disabled = true;
        info_bar.style.backgroundColor = "rgb(126, 126, 126)";
    };
    button.addEventListener("transitionend", function() {  // to add a listener to the icon's transition
        for (var i = 0; i < buttons.length; ++i) {
            if (buttons[i].getElementsByTagName("span").length != 0) {
                buttons[i].removeChild(buttons[i].getElementsByTagName("span")[0]); // refresh the buttons
            }
        }
        enable_buttons(buttons.length, buttons, info_bar);  // to enable the buttons
        button.disabled = false;
    });
    button.onclick = function() {
        if (button.disabled == true) return;
        callback(0, buttons, info_bar);
        button.disabled = true;
    };
}

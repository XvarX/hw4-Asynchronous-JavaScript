window.onload = function() {
    getnumber = 0;
    lecturegetnumber();
    addallnum();
    autorobots();
    clearall();
}
function clearall() {
    document.getElementById('at-plus-container').onmouseleave = function () {
        setTimeout('location.reload()', 800);
    };
}
//机器人
function autorobots() {
    var atplus = document.getElementsByClassName("apb");
    atplus[0].onclick = function () {
        if (atplus[0].success != "false") {
            atplus[0].success = "false";
            atplus[0].style.backgroundColor = "gray";
            fivedragon();
        }
    }
}
function fivedragon() {
    var lectures = document.getElementsByTagName("li");
    for (var i = 0; i < lectures.length; i++) {
        lectures[i].success = "after";
        getajax(lectures[i], lectures, i, "click");
    }
}
function fingerround() {
    var lectures = document.getElementsByTagName("li");
    clickli(lectures, 0, lectures[0], "auto");
}
function nextclick(lectures, i) {
    if (i < lectures.length-1) {
        clickli(lectures, i + 1, lectures[i + 1], "auto");
    } else {
        var icon_ = document.getElementById("info-bar")
        var unread_ = document.getElementsByClassName("unread");
        getsum(unread_, icon_);
    }
}
function lecturegetnumber() {
    var lecture_ = document.getElementsByTagName("li");
    for (var i = 0; i < lecture_.length; i++) {
        lecture_[i].onclick = function (i) {
            return function () {
                if (lecture_[i].success != "false" && lecture_[i].success != "after") {
                    clickli(lecture_, i, lecture_[i],"click");
                }
            }
        }(i);
    }
}
//autoorclick to adjust is auto or click one by one
function clickli(lectures, i ,lecture, autoorclick) {
        lecture.success = "after";
        disableotherli(lectures);
        getRandomnumber(lecture, i, lectures, autoorclick);
}
function disableotherli(lectures) {
    for (var i = 0; i < lectures.length; i++) {
        if (lectures[i].success != "after") {
            lectures[i].style.backgroundColor = "gray";
            lectures[i].success = "false";
        }
    }
}
function addallnum() {
    var icon_ = document.getElementById("info-bar")
    var unread_ = document.getElementsByClassName("unread");
    //判断是否可点
    icon_.onclick = function () {
        getsum(unread_, icon_);
    }
}
function getsum(unread_,icon_) {
    var sum = 0;
    var success = true;
    for (var i = 0; i < unread_.length; i++) {
        if (unread_[i].innerHTML == "" || unread_[i].innerHTML == "...") {
            success = false;
        }
        sum += Number(unread_[i].innerHTML);
    }
    var show = document.getElementsByClassName("data");
    if (success && icon_.success != "false") {
        show[0].innerHTML = String(sum);
        icon_.style.backgroundColor = "gray";
        icon_.success = "false";
    }
}
function getRandomnumber(lecture, i, lectures,autoorclick) {
    getajax(lecture, lectures, i, autoorclick);
}
function getajax(lecture, lectures, i, clickorauto) {
    var xmlHttpReg = null;
    xmlHttpReg = new XMLHttpRequest();
    var text = lecture.getElementsByTagName("span");
    text[0].innerHTML = "..."
    text[0].style.display = "block";
    if (xmlHttpReg != null) {
        xmlHttpReg.open("get", "/"+String(i), true);
        xmlHttpReg.send(null);
        xmlHttpReg.onreadystatechange = function () {
            if (xmlHttpReg.readyState == 4) {
                text[0].innerHTML = String(xmlHttpReg.responseText);
                lecture.style.backgroundColor = "gray";
                enableli(lectures);
                enablebigboom();
                if (getnumber == 4) {
                    var icon_ = document.getElementById("info-bar")
                    var unread_ = document.getElementsByClassName("unread");
                    getsum(unread_,icon_);
                } else {
                    getnumber++;
                }
            }
        };
    }
}
//enable the li
function enableli(lectures) {
    for (var i = 0; i < lectures.length; i++) {
        if (lectures[i].success == "false") {
            lectures[i].style.backgroundColor = "#21479D";
            lectures[i].success = true;
        }
    }
} function enablebigboom() {
    var icon_ = document.getElementById("info-bar")
    var unread_ = document.getElementsByClassName("unread");
    var success = true;
    for (var i = 0; i < unread_.length; i++) {
        if (unread_[i].innerHTML == ""||unread_[i].innerHTML=="...") {
            success = false;
        }
    }
    if (success) {
        icon_.style.backgroundColor = "#21479D";
    }
}
window.onload = function() {
    lecturegetnumber();
    addallnum();
    clearall();
}
function clearall() {
    document.getElementById('at-plus-container').onmouseleave = function () {
        setTimeout('location.reload()', 800);
    };
}
function lecturegetnumber() {
    var lecture_ = document.getElementsByTagName("li");
    for (var i = 0; i < lecture_.length; i++) {
        lecture_[i].onclick = function (i) {
            return function () {
                //判断是否可点
                if (lecture_[i].success != "false" && lecture_[i].success != "after") {
                    lecture_[i].success = "after";
                    disableotherli(lecture_);
                    getRandomnumber(lecture_[i], i, lecture_);
                }
            }
        }(i);
    }
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
    //判断大气泡是否可点
    icon_.onclick = function () {
        var sum = 0;
        var success = true;
        for (var i = 0; i < unread_.length; i++) {
            if (unread_[i].innerHTML == "") {
                success = false;
            }
            sum += Number(unread_[i].innerHTML);
        }
        var show = document.getElementsByClassName("data");
        if (success&&icon_.success != "false") {
            show[0].innerHTML = String(sum);
            icon_.style.backgroundColor = "gray";
            icon_.success = "false";
        }
    }
}
function getRandomnumber(lecture, i, lectures) {
    getajax(lecture, lectures);
}
function getajax(lecture, lectures) {
    var xmlHttpReg = null;
    xmlHttpReg = new XMLHttpRequest();
    var text = lecture.getElementsByTagName("span");
    text[0].innerHTML = "..."
    text[0].style.display = "block";
    if (xmlHttpReg != null) {
        xmlHttpReg.open("get", "/", true);
        xmlHttpReg.send(null);
        xmlHttpReg.onreadystatechange = function () {
            if (xmlHttpReg.readyState == 4) {
                text[0].innerHTML = String(xmlHttpReg.responseText);
                lecture.style.backgroundColor = "gray";
                enableli(lectures);
                enablebigboom();
            }
        };
    }
}
//to enable the bigboom when all number get
function enablebigboom() {
    var icon_ = document.getElementById("info-bar")
    var unread_ = document.getElementsByClassName("unread");
    var success = true;
    for (var i = 0; i < unread_.length; i++) {
        if (unread_[i].innerHTML == "") {
            success = false;
        }
    }
    if (success) {
        icon_.style.backgroundColor = "#21479D";
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
}
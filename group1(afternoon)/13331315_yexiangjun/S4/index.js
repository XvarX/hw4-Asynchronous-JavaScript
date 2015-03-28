window.onload = function() {
    lecturegetnumber();
    addallnum();
    autorobots();
}
//机器人
function autorobots() {
    var atplus = document.getElementsByClassName("apb");
    //fingerround happen
    atplus[0].onclick = function () {
        if (atplus[0].success != "false") {
            atplus[0].success = "false";
            atplus[0].style.backgroundColor = "gray";
            fingerround();
        }
    }
}
function fingerround() {
    randomnum_ = new Array;
    randomnum_ = getrandom();
    var show = document.getElementsByClassName("data");
    var string = "";
    for (var i = 0; i < randomnum_.length; i++) {
        if (randomnum_[i] == 0) {
            string += 'A';
        } else if (randomnum_[i] == 1) {
            string += 'B';
        } else if (randomnum_[i] == 2) {
            string += 'C';
        } else if (randomnum_[i] == 3) {
            string += 'D';
        } else if (randomnum_[i] == 4) {
            string += 'E';
        }
    }
    show[0].innerHTML = string;
    indexnum = 0;
    var lectures = document.getElementsByTagName("li");
    clickli(lectures, indexnum, lectures[randomnum_[indexnum]], "auto");
}
//get random number
function getrandom() {
    var initial = new Array;
    var result = new Array;
    for (var i = 0; i < 5; i++) {
        initial[i] = i;
    }
    for (var i = 0; i < 5; i++) {
        var j = Math.floor(Math.random() * 5);
        while (initial[j] == null) {
            j = Math.floor(Math.random() * 5);
        }
        result[i] = initial[j];
        initial[j] = null;
    }
    return result;
}
function nextclick(lectures, i) {
    if (indexnum < lectures.length-1) {
        indexnum = indexnum + 1;
        clickli(lectures, randomnum_[indexnum], lectures[randomnum_[indexnum]], "auto");
    } else {
        var icon_ = document.getElementById("info-bar")
        var unread_ = document.getElementsByClassName("unread");
        getsum(unread_, icon_);
    }
}
function clearall() {
    document.getElementById('at-plus-container').onmouseleave = function () {
        location.reload();
    };
}
function lecturegetnumber() {
    var lecture_ = document.getElementsByTagName("li");
    for (var i = 0; i < lecture_.length; i++) {
        lecture_[i].onclick = function (i) {
            return function () {
                clickli(lecture_, i, lecture_[i],"click");
            }
        }(i);
    }
}
//autoorclick to adjust is auto or click one by one
function clickli(lectures, i ,lecture, autoorclick) {
     if (lecture.success != "false" && lecture.success != "after") {
        lecture.success = "after";
        disableotherli(lectures);
        getRandomnumber(lecture, i, lectures, autoorclick);
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
    //判断是否可点
    icon_.onclick = function () {
        getsum(unread_, icon_);
    }
}
function getsum(unread_,icon_) {
    var sum = 0;
    var success = true;
    for (var i = 0; i < unread_.length; i++) {
        if (unread_[i].innerHTML == "") {
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
        xmlHttpReg.open("get", "/", true);
        xmlHttpReg.send(null);
        xmlHttpReg.onreadystatechange = function () {
            if (xmlHttpReg.readyState == 4) {
                text[0].innerHTML = String(xmlHttpReg.responseText);
                lecture.style.backgroundColor = "gray";
                enablebigboom();
                enableli(lectures);
                if (clickorauto == "auto") {
                    nextclick(lectures, i);
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
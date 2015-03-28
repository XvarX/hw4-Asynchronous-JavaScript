window.onload = function() {
    var btnState = new Array();//标记A-E按钮是否发送了请求的数组
    var main_btn = document.getElementById("main_btn");
    main_btn.onclick = function() {
        orderClick(btnState);
    }
    var main_container = document.getElementById("button");
    main_container.onmouseleave = function() {
        resetCounter(btnState);//重设计数器
    };
};
function orderClick(btnState) {//按顺序点击按钮
    var num_btns = document.getElementsByName("num_btn");
    function A_btn_beginClick() {
        btnClick(num_btns[0], btnState, B_btn_beginClick);
    }
    function B_btn_beginClick() {
        btnClick(num_btns[1], btnState, C_btn_beginClick);
    }
    function C_btn_beginClick() {
        btnClick(num_btns[2], btnState, D_btn_beginClick);
    }
    function D_btn_beginClick() {
        btnClick(num_btns[3], btnState, E_btn_beginClick);
    }
    function E_btn_beginClick() {
        btnClick(num_btns[4], btnState, Big_btn_beginClick);
    }
    function Big_btn_beginClick() {
        checkSum(btnState);
    }
    A_btn_beginClick();
}
function resetCounter(btnState) {
    var num_btns = document.getElementsByName("num_btn");
    for (var i = 0; i < num_btns.length; ++i) {
        num_btns[i].style.backgroundColor = "rgba(48, 63, 200, 1)";
        if (btnState[num_btns[i].id] && btnState[num_btns[i].id].readyState != 4) {
            btnState[num_btns[i].id].abort();
        }
        btnState[num_btns[i].id] = undefined
        var span_node = num_btns[i].getElementsByTagName("span")[0];
        if (span_node) {
            num_btns[i].removeChild(span_node);
        }
    }
    btnState.splice(0,btnState.length);
    document.getElementById("info-bar").innerHTML = "";
}

function btnClick(num_btn, btnState, callback) {
    if (btnState[num_btn.id]) return;
    disableOtherBtn(num_btn, btnState);//灭活其它按钮
    var ajax = $.ajax({
        url:"http://localhost:3000/S1/",
        ataType:"jsonp"
    });
    btnState[num_btn.id] = ajax;
    var num_span = document.createElement("span");
    num_span.className = "num_span";
    num_span.innerHTML = "...";
    num_btn.appendChild(num_span);
    ajax.done(function(random_num) {
        num_span.innerHTML = random_num;
        enableOtherBtn(num_btn, btnState);//激活其余按钮
        window.request_command = false;
        callback();
    });
    ajax.fail(function(errData) {
        console.log("got an error", errData);
        window.request_command = false;
    });
}

function disableOtherBtn(choose_btn, btnState) {
    var allbtn = document.getElementsByName("num_btn");
    for (var i = 0; i < allbtn.length; ++i) {
        if (allbtn[i] != choose_btn || btnState[allbtn[i].id]) {
            allbtn[i].style.backgroundColor = "#909090";
        } else {
            allbtn[i].style.backgroundColor = "rgba(48, 63, 200, 1)";
        }
    }
}

function enableOtherBtn(choose_btn, btnState) {
    var allbtn = document.getElementsByName("num_btn");
    for (var i = 0; i < allbtn.length; ++i) {
        if (btnState[allbtn[i].id]) {
            allbtn[i].style.backgroundColor = "#909090";
        } else {
            allbtn[i].style.backgroundColor = "rgba(48, 63, 200, 1)";
        }
    }
}

function checkSum(btnState) {
    var num_btns = document.getElementsByName("num_btn");
    var flag = true;
    var sum = 0;
    for (var i = 0; i < num_btns.length; ++i) {
        if (btnState[num_btns[i].id] == false) {
            flag = false;
            break;
        }
        sum += parseInt(num_btns[i].getElementsByTagName("span")[0].innerHTML);
    }
    if (flag == true && sum) {
        document.getElementById("info-bar").innerHTML = sum;
    }
}
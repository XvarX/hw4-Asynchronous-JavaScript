window.onload = function() {
   var btnState = new Array();//标记A-E按钮是否发送了请求的数组
    var main_btn = document.getElementById("main_btn");
    main_btn.onclick = function() {
        allClick(btnState);
    }
    var main_container = document.getElementById("button");
    main_container.onmouseleave = function() {
        resetCounter(btnState);//重设计数器
    };
};
function allClick(btnState) {//点击全部按钮
    var num_btns = document.getElementsByName("num_btn");
    function A_btn_beginClick() {
        btnClick(num_btns[0], btnState, Big_btn_beginClick);
    }
    function B_btn_beginClick() {
        btnClick(num_btns[1], btnState, Big_btn_beginClick);
    }
    function C_btn_beginClick() {
        btnClick(num_btns[2], btnState, Big_btn_beginClick);
    }
    function D_btn_beginClick() {
        btnClick(num_btns[3], btnState, Big_btn_beginClick);
    }
    function E_btn_beginClick() {
        btnClick(num_btns[4], btnState, Big_btn_beginClick);
    }
    function Big_btn_beginClick() {
        checkSum(btnState);
    }
    A_btn_beginClick();
    B_btn_beginClick();
    C_btn_beginClick();
    D_btn_beginClick();
    E_btn_beginClick();
}
function resetCounter(btnState) {
    var num_btns = document.getElementsByName("num_btn");
    for (var i = 0; i < num_btns.length; ++i) {
        num_btns[i].style.backgroundColor = "rgba(48, 63, 200, 1)";
        btnState[num_btns[i].id] = false;
        var span_node = num_btns[i].getElementsByTagName("span")[0];
        if (span_node) {
            num_btns[i].removeChild(span_node);
        }
    }
    btnState.splice(0,btnState.length);
    document.getElementById("info-bar").innerHTML = "";
}

function btnClick(num_btn, btnState, callback) {
    if (btnState[num_btn.id] == true) return;
    btnState[num_btn.id] = true;
    var num_span = document.createElement("span");
    num_span.className = "num_span";
    num_span.innerHTML = "...";
    num_btn.appendChild(num_span);
    XMLHttp.sendReq('GET', "http://localhost:3000/S3/", '', function(random_num) {
        num_span.innerHTML = random_num;
        disableBtn(num_btn, btnState);
        callback();
    });
}
function disableBtn(choose_btn, btnState) {
    if (btnState[choose_btn.id] == true) {
        choose_btn.style.backgroundColor = "#909090";
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
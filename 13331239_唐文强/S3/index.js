window.onload = function() {
    var buttons = document.getElementsByClassName('button');
    var bigButton = document.getElementById('big-bar');
    var at_plus = document.getElementById('clickBar');
    var hover_area = document.getElementById('bottom-positioner');

    ResetCalculator();
    bigButton.disabled = 1;
    bigButton.onclick = calculateSum;
    hover_area.onmouseleave = ResetCalculator;
    at_plus.onclick = simulateRobert;
    everyButtonClick(buttons, bigButton);
}

function simulateRobert() {
    ResetCalculator();
    document.getElementById('clickBar').disabled = 1;
    var buttons = document.getElementsByClassName('button');

    for (var i = 0; i < buttons.length; i++) {
        getRandomNumber(buttons, buttons[i]);
    }
}

function getRandomNumber(buttons, button) {
    button.childNodes[1].classList.add('waiting');
    button.childNodes[1].innerHTML = "...";
    disableOtherButtons(buttons, button);

    XMLHttp.sendRequest('GET', '../server', function(number) {
        button.childNodes[1].innerHTML = number;
        button.classList.add('inactive');
        button.disabled = 1;
        enableOtherButtons(buttons, button);
        ifActivateBigButton(buttons);
    });
}

function disableOtherButtons(buttons, abled_button) {
    for (var i = 0; i < buttons.length; i++) {
        if (abled_button != buttons[i]) {
            buttons[i].classList.add('inactive');
            buttons[i].disabled = 1;
        }
    }
}

function enableOtherButtons(buttons, disabled_button) {
    for (var i = 0; i < buttons.length; i++) {
        if (disabled_button != buttons[i] &&
            !buttons[i].childNodes[1].classList.contains('waiting')) {
            buttons[i].classList.remove('inactive');
            buttons[i].disabled = 0;
        }
    }
}

function ResetCalculator() {
    XMLHttp.abortALLRequest();
    var buttons = document.getElementsByClassName('button');
    var bigButton = document.getElementById('big-bar');
    //var order = $('bubble-order');
    var at_plus = document.getElementById('clickBar');

    //order.innerHTML = '';
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = 0;
        buttons[i].classList.toggle('inactive', false);
        buttons[i].childNodes[1].classList.toggle('waiting', false);
    }

    at_plus.disabled = 0;
    bigButton.disabled = 1;
    bigButton.innerHTML = '';
    bigButton.classList.toggle('inactive', true);
}

function everyButtonClick(buttons, bigButton) {
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function(i) {
            return function() {
                getRandomNumber(buttons, buttons[i]);
            }
        }(i)
    }
}

function ifActivateBigButton(buttons) {
    var bigButton = document.getElementById('big-bar');
    var at_plus = document.getElementById('clickBar');
    for (var i = 0; i < buttons.length; i++) {
        if (!buttons[i].childNodes[1].classList.contains('waiting')
            || buttons[i].childNodes[1].innerHTML == '...') {
            return;
        }
    }
    bigButton.disabled = 0;
    bigButton.classList.remove('inactive');
    if (at_plus.disabled) {
        calculateSum();
    }
}

function calculateSum() {
    var at_plus = document.getElementById('clickBar');
    var bigButton = document.getElementById('big-bar');
    var buttons = document.getElementsByClassName('button');
    var sum = 0;

    for (var i = 0; i < buttons.length; i++) {
        sum += parseInt(buttons[i].childNodes[1].innerHTML);
    }

    at_plus.disabled = 0;
    bigButton.innerHTML = sum;
    bigButton.disabled = 1;
    bigButton.classList.add('inactive');
}
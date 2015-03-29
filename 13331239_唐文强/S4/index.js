window.onload = function()
{
	var buttons = document.getElementsByClassName('button');
	var bigButton = document.getElementById('big-bar');
	var hoverArea = document.getElementById('bottom-positioner');
    var at_plus = document.getElementById('clickBar');
    xmlhttp = new XMLHttpRequest();

	bigButton.disabled = 1;
    resetCalculator();
	bigButton.onclick = calculateSum;
	hoverArea.onmouseleave = resetCalculator;
    at_plus.onclick = simulateRobert;
    everyButtonClick(buttons, bigButton);
}

function connectServer(callback)
{
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if (typeof callback === 'function') {
                callback(xmlhttp.responseText);
            }
        }
    }

    xmlhttp.open('GET', '../server', true);
    xmlhttp.send();
}

function simulateRobert() {
    resetCalculator();
    var buttons = document.getElementsByClassName('button');
    var orderText = document.getElementById('order');
    document.getElementById('clickBar').disabled = 1;

    var orderIndex = new Array;
    for (var i = 0; i < 5; i++) {
        orderIndex[i] = i;
    };
    orderIndex.sort(function()
    {
        return Math.random() - 0.5;
    });
    for (var i = 0; i < 5; i++) {
        orderText.innerHTML += String.fromCharCode(orderIndex[i] + 65);
    };
    getRandomNumber(buttons, buttons[orderIndex[0]], function() {
        getRandomNumber(buttons, buttons[orderIndex[1]], function() {
            getRandomNumber(buttons, buttons[orderIndex[2]], function() {
                getRandomNumber(buttons, buttons[orderIndex[3]], function() {
                    getRandomNumber(buttons, buttons[orderIndex[4]], function() {
                        calculateSum();
                    });
                });
            });
        });
    });
}

function getRandomNumber(buttons, button, callback)
{
    button.childNodes[1].classList.add('waiting');
    button.childNodes[1].innerHTML = "...";
    disableOtherButtons(buttons, button);

    connectServer(function(number) {
        button.childNodes[1].innerHTML = number;
        button.classList.add('inactive');
        button.disabled = 1;
        enableOtherButtons(buttons, button);
        ifActivateBigButton(buttons);
        if (typeof callback === "function") {
            callback();
        }
    })
}

function disableOtherButtons(buttons, abled_button)
{
    for (var i = 0; i < buttons.length; i++) {
        if (abled_button != buttons[i]) {
            buttons[i].classList.add('inactive');
            buttons[i].disabled = 1;
        }
    }
}

function enableOtherButtons(buttons, disabled_button)
{
    for (var i = 0; i < buttons.length; i++) {
        if (disabled_button != buttons[i] &&
            !buttons[i].childNodes[1].classList.contains('waiting')) {
            buttons[i].classList.remove('inactive');
            buttons[i].disabled = 0;
        }
    }
}

function calculateSum()
{
    var at_plus = document.getElementById('clickBar');
    var buttons = document.getElementsByClassName('button');
    var bigButton = document.getElementById('big-bar');
    var sum = 0;

    for (var i = 0; i < buttons.length; i++)
    {
        sum += parseInt(buttons[i].childNodes[1].innerHTML);
    }

    at_plus.disabled = 0;
    bigButton.innerHTML = sum;
    bigButton.disabled = 1;
    bigButton.classList.add('inactive');
}

function resetCalculator()
{
    xmlhttp.abort();
    var at_plus = document.getElementById('clickBar');
    var buttons = document.getElementsByClassName('button');
    var bigButton = document.getElementById('big-bar');
    var orderIndex = document.getElementById('order');

    orderIndex.innerHTML = '';
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

function everyButtonClick(buttons, big_button)
{
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function(i) {
            return function() {
                getRandomNumber(buttons, buttons[i]);
            }
        }(i)
    }
}

function ifActivateBigButton(buttons)
{
    var bigButton = document.getElementById('big-bar');
    for (var i = 0; i < buttons.length; i++) {
        if (!buttons[i].childNodes[1].classList.contains('waiting')) {
            return;
        }
    }
    bigButton.disabled = 0;
    bigButton.classList.remove('inactive');
}


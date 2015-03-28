window.onload = function()
{
	var buttons = document.getElementsByClassName('button');
	var bigButton = document.getElementById('big-bar');
	var hoverArea = document.getElementById('bottom-positioner');

	bigButton.disabled = 1;
	bigButton.onclick = calculateSum;
	hoverArea.onmouseleave = resetCalculator;
	getRandomNumber(bigButton, buttons);
}

function connectServer(callback)
{
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new XMLHttpRequest('Microsoft.XMLHTTP');
    }

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if (typeof callback === 'function') {
                callback(xmlhttp.responseText);
            }
        }
    }

    xmlhttp.open('GET', 'server', true);
    xmlhttp.send();
}

function getRandomNumber(bigButton, buttons)
{
	for (var i = 0; i < buttons.length; i++)
	{
		buttons[i].onclick = function(i)
		{
			return function()
			{
				buttons[i].childNodes[1].classList.add('waiting');
				buttons[i].childNodes[1].innerHTML = '...';
				disableOtherButtons(buttons, buttons[i]);

				connectServer(function(number)
					{
						 buttons[i].childNodes[1].innerHTML = number;
						 buttons[i].classList.add('inactive');
						 buttons[i].disabled = 1;
						 enableOtherButtons(buttons, buttons[i]);
						 ifActivateBigButton(bigButton, buttons);
					});
			}
		}(i);
	}
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

function ifActivateBigButton(bigButton, buttons)
{
    for (var i = 0; i < buttons.length; i++) {
        if (!buttons[i].childNodes[1].classList.contains('waiting')) {
            return;
        }
    }
    bigButton.disabled = 0;
    bigButton.classList.remove('inactive');
}

function calculateSum()
{
    var buttons = document.getElementsByClassName('button');
    var sum = 0;

    for (var i = 0; i < buttons.length; i++)
    {
        sum += parseInt(buttons[i].childNodes[1].innerHTML);
    }

    this.innerHTML = sum;
    this.disabled = 1;
    this.classList.add('inactive');
}

function resetCalculator()
{
    var buttons = document.getElementsByClassName('button');
    var bigButton = document.getElementById('big-bar');

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = 0;
        buttons[i].classList.toggle('inactive', false);
        buttons[i].childNodes[1].classList.toggle('waiting', false);
    }

    bigButton.disabled = 1;
    bigButton.innerHTML = '';
    bigButton.classList.toggle('inactive', true);
}
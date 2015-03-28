;var util = (function _util(d) {
"use strict";

function addEvent(element, event, handler) {
    if (element.addEventListener) {
        element.addEventListener(event, handler, false);
    } else {
        element['e' + event + handler] = handler;
        element[event + handler] = function(e) {
            e.currentTarget = element;
            element['e' + event + handler](e || window.event);
        }
        element.attachEvent('on' + event,   // for IE8-
                             element[event + handler]);
    }
}

function removeEvent(element, event, handler) {
    if (element.removeEventListener)
        element.removeEventListener(event, handler);
    else {
        element.detachEvent('on' + event, element[event + handler]);
        element[event + handler] = null;
    }
}

function getTarget(event) {
    return event.target || event.srcElement;
}

function hasClass(element, className) {
    if (element.classList) {
        return element.classList.contains(className);
    } else {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)', 'g');
        return !!element.className.match(reg);
    }
}

function addClass(element, className) {
    if (element.classList) {
        element.classList.add(className);
    } else if (!hasClass(element, className)) {
        element.className += " " + className;
    }
}

function removeClass(element, className) {
    if (element.classList) {
        element.classList.remove(className);
    } else if (hasClass(element, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)', 'g');
        element.className = element.className.replace(reg, ' ');
    }
}

function nthOfType(element, type) {
    var children = element.parentNode.getElementsByTagName(type);
    for (var i = 0, len = children.length; i < len; ++i) {
        if (children[i] === element) return i;
    }
    return null;
}

function getText(node) {
    return node.textContent || node.innerText;
}

function getParentUntil(node, tag) {
    var parent = node.parentNode;
    while (parent.nodeName.toLowerCase() !== tag && parent !== null) {
        parent = parent.parentNode;
    }
    return parent;
}

function getDataRows(table) {
    var rowArray = [];
    var rows = table.getElementsByTagName('tr');
    var headRow = table.getElementsByTagName('th')[0].parentNode;
    for (var i = 0, len = rows.length; i < len; ++i) {
        var row = rows[i];
        if (row !== headRow) {
            rowArray.push(row);
        }
    }
    return rowArray;
}

function createElement(tag, text, className) {
    var element = d.createElement(tag);
    if (text) {
        var textNode = d.createTextNode(text);
        element.appendChild(textNode);
    }

    if (className) {
        addClass(element, className);
    }

    return element;
}

function removeElement(element) {
    return element.parentNode.removeChild(element);
}

function toArray(iterable) {
    var arr = [];
    for (var i = 0, len = iterable.length; i < len; ++i) {
        arr.push(iterable[i]);
    }
    return arr;
}

function traverseTextNode(node, callback) {
    var next = node;
    var ELEMENT_NODE = 1, TEXT_NODE = 3;
 
    if (node && node.nodeType === ELEMENT_NODE) {
        do {
            traverseTextNode(next.firstChild, callback);
            next = next.nextSibling;
        } while(next);
    } else if (node && node.nodeType === TEXT_NODE) {
        if (!/^\s+$/.test(node.nodeValue))
            callback(node);
        if (node.nextSibling)
            traverseTextNode(node.nextSibling, callback);
    }
}

function shuffle(arr) {
  return arr.sort(function () {
    return Math.random() - 0.5;
  });
}

return {
    addEvent: addEvent,
    removeEvent: removeEvent,
    getTarget: getTarget,
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    nthOfType: nthOfType,
    getText: getText,
    getParentUntil: getParentUntil,
    getDataRows: getDataRows,
    createElement: createElement,
    removeElement: removeElement,
    toArray: toArray,
    traverseTextNode: traverseTextNode,
    shuffle: shuffle
};
})(document);

/**
 * Promise/A+ polyfill for the browser and node.
 * Tested by https://github.com/promises-aplus/promises-tests
 */
(function() {
  'use strict';

  var root;
  if (typeof window === 'object' && window) {
    root = window; // browser
  } else {
    root = global; // node, .etc.
  }

  // Polyfill for Function.prototype.bind
  function bind(fn, thisArg) {
    return function() {
      fn.apply(thisArg, arguments);
    };
  }

  // Polyfill for isArray
  var isArray = Array.isArray || function(value) {
    return Object.prototype.toString.call(value) === "[object Array]";
  };

  // Polyfill for setImmediate for performance
  var asap = Promise.immediateFn || root.setImmediate || function(fn) {
    setTimeout(fn, 1);
  };

  var FULLFILLED = true,
      REJECTED = false;

  function handle(deferred) {
    var that = this;

    if (this._state === null) {
      this._deferreds.push(deferred);
      return;
    }

    asap(function() {
      var cb = that._state ? deferred.onFulfilled : deferred.onRejected;
      if (cb === null) {
        // pass down
        (that._state ? deferred.resolve : deferred.reject)(that._value);
        return;
      }

      var ret;
      try {
        ret = cb(that._value);
      } catch (e) {
        deferred.reject(e);
        return;
      }

      // pass down
      deferred.resolve(ret);
    });
  }

  function resolve(newValue) {
    try {
      if (newValue === this)
        throw new TypeError('A promise cannot be resolved with itself.');
      if (newValue && (typeof newValue === 'object' ||
                       typeof newValue === 'function')) {
        var then = newValue.then;
        if (typeof then === 'function') { // thenable
          doResolve(bind(then, newValue),
                    bind(resolve, this),
                    bind(reject, this));
          return;
        }
      }

      this._state = FULLFILLED;
      this._value = newValue;
      finalize.call(this);
    } catch (e) {
      reject.call(this, e);
    }
  }

  function reject(newValue) {
    this._state = REJECTED;
    this._value = newValue;
    finalize.call(this);
  }

  function finalize() {
    for (var i = 0, len = this._deferreds.length; i < len; i++) {
      handle.call(this, this._deferreds[i]);
    }
    this._deferreds = null;
  }

  function Deferred(onFulfilled, onRejected, resolve, reject) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.resolve = resolve;
    this.reject = reject;
  }

  function doResolve(fn, onFulfilled, onRejected) {
    // Make sure onFulfilled and onRejected are only called once
    var done = false;
    try {
      fn(function(value) {
        if (done) return;
        done = true;
        onFulfilled(value);
      }, function(reason) {
        if (done) return;
        done = true;
        onRejected(reason);
      });
    } catch (e) {
      if (done) return;
      done = true;
      onRejected(e);
    }
  }

  function Promise(fn) {
    if (typeof this !== 'object')
      throw new TypeError('Promises must be constructed via new');
    if (typeof fn !== 'function')
      throw new TypeError('Argument is not callable');

    this._state = null;
    this._value = null;
    this._deferreds = [];

    doResolve(fn, bind(resolve, this), bind(reject, this));
  }

  // avoid explicit catch here since it is reserved in IE9-
  Promise.prototype['catch'] = function(onRejected) {
    return this.then(null, onRejected);
  };

  Promise.prototype.then = function(onFulfilled, onRejected) {
    var that = this;
    return new Promise(function(resolve, reject) {
      // attach a new Deferred
      handle.call(that, new Deferred(onFulfilled, onRejected, resolve, reject));
    });
  };

  Promise.all = function() {
    var toSlice;
    if (arguments.length === 1 && isArray(arguments[0]))
      toSlice = arguments[0];
    else
      toSlice = arguments;
    var args = Array.prototype.slice.call(toSlice);

    return new Promise(function(resolve, reject) {
      if (args.length === 0)
        return resolve([]);  // empty promise
      var remaining = args.length;

      function start(i, value) {
        try {
          if (value && (typeof value === 'object' ||
                        typeof value === 'function')) {
            var then = value.then;
            if (typeof then === 'function') {  // thenable
              then.call(value, function(nextValue) {
                start(i, nextValue);  // then until not thenable
              }, reject);
              return;
            }
          }
          args[i] = value;  // replace with return values
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (e) {
          reject(e);
        }
      }

      // test all promises
      for (var i = 0; i < args.length; i++) {
        start(i, args[i]);
      }
    });
  };

  Promise.resolve = function(value) {
    if (value && typeof value === 'object' &&
        value.constructor === Promise) {
      return value;
    }

    return new Promise(function(resolve) {
      resolve(value);
    });
  };

  Promise.reject = function(value) {
    return new Promise(function(resolve, reject) {
      reject(value);
    });
  };

  Promise.race = function(values) {
    return new Promise(function(resolve, reject) {
      for (var i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  };

  // fill
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Promise;
  } else if (!root.Promise) {
    root.Promise = Promise;
  }
})();

;util.ajax = (function() {
  'use strict';
  var DONE = 4,
      OK = 200;

  function core(method, url, args) {
    url = url + '?ts=' + Date.now();  // add time stamp to avoid cache
    // Establishing a promise in return
    return new Promise(function(resolve, reject) {
      // Instantiates the XMLHttpRequest
      var client = new XMLHttpRequest();
      client.open(method, url, true);
      client.setRequestHeader("Cache-Control", "no-cache, no-store");
      util.addEvent(client, 'readystatechange', function(e) {
        var me = e.target;
        if (me.readyState === DONE) {
          if (me.status === OK) {
            resolve(me.responseText);
          } else {
            reject({
              "error": me.statusText
            });
          }
        }
      });

      client.send(url);
    });
  }

  return {
    'get': function(url, args) {
      return core('GET', url, args);
    },
    'post': function(url, args) {
      return core('POST', url, args);
    },
    'put': function(url, args) {
      return core('PUT', url, args);
    },
    'delete': function(url, args) {
      return core('DELETE', url, args);
    }
  };

}());

;
(function(d) {
  'use strict';
  var atplus = d.getElementById('at-plus-container');
  var apb = d.getElementsByClassName('apb')[0];
  var buttons = atplus.getElementsByClassName('button');
  var msgtext = d.getElementById('message');
  var info = d.getElementById('info-bar');
  var total = d.getElementById('total');
  var seqtext = d.getElementById('sequence');
  var marks = {};  // for non-auto calls

  var numButtons = buttons.length;
  var AUTO = true;
  var FAIL_RATE = 0.3;

  function startPending(button, auto) {
    // check if it is disabled
    if (util.hasClass(button, 'disabled'))
      return;
    // show ... in button
    var random = button.getElementsByClassName('random')[0];
    random.innerHTML = '...'
    util.addClass(random, 'show');

    // disable other buttons
    for (var i = 0; i < numButtons; ++i) {
      util.removeEvent(buttons[i], 'click', handleButton);
      if (buttons[i] !== button) {
        util.addClass(buttons[i], 'disabled');
      }
    }
  }

  function stopPending(button, number, auto) {
    // show the number
    var random = button.getElementsByClassName('random')[0];
    random.innerHTML = number;

    // disable this button
    util.addClass(button, 'disabled');

    // enable other buttons
    for (var i = 0; i < numButtons; ++i) {
      var rand = buttons[i].getElementsByClassName('random')[0];
      if (buttons[i] !== button && !util.hasClass(rand, 'show')) {
        if (!auto)
          util.addEvent(buttons[i], 'click', handleButton);
        util.removeClass(buttons[i], 'disabled');
      }
    }
  }

  function checkInfo() {
    // See if there is anyone without number
    for (var i = 0; i < numButtons; ++i) {
      if (!util.hasClass(buttons[i], 'disabled')) return;
    }
    // attach event hanlder
    util.addEvent(info, 'click', calculate);
    util.removeClass(info, 'disabled');
  }

  function sum(obj) {
    var ret = 0;
    for (var i in obj) {
      ret += parseInt(obj[i]);
    }
    return ret;
  }

  // for manual calls
  function calculate() {
    for (var i in marks) {
      if (marks[i] === null) return;
    }

    total.innerHTML = sum(marks);
    util.removeEvent(info, 'click', calculate);
    util.addClass(info, 'disabled');
  }

  // for manual calls
  function handleButton(e) {
    var currentSum = 0;

    var button = e.currentTarget;

    startPending(button);
    var promise = util.ajax.get('/').then(function(number) {
      stopPending(button, number);
      util.removeEvent(button, handleButton);
      marks[button.id] = number;
    }).then(checkInfo);
  }

  // for auto calls
  function autoCalculate(currentSum) {
    total.innerHTML = currentSum;
    util.addClass(info, 'disabled');
  }

  // for auto calls
  function clickButton(button, currentSum, auto) {
    startPending(button, auto);
    return util.ajax.get('/').then(function(number) {
      stopPending(button, number);
      return currentSum + parseInt(number);
    });
  }

  function randomBreak(i, message, currentSum) {
    if (Math.random() < FAIL_RATE) {
      return Promise.reject({message: message, currentSum: currentSum});
    } else {
      msgtext.innerHTML = message;
      if (i < 5)
        return clickButton(buttons[i], currentSum, AUTO);
      else
        return Promise.resolve(currentSum);
    }
  }

  function aHandler(currentSum) {
    return randomBreak(0, "这是个天大的秘密", currentSum);
  }

  function bHandler(currentSum) {
    return randomBreak(1, "我不知道", currentSum);
  }

  function cHandler(currentSum) {
    return randomBreak(2, "你不知道", currentSum);
  }

  function dHandler(currentSum) {
    return randomBreak(3, "他不知道", currentSum);
  }

  function eHandler(currentSum) {
    return randomBreak(4, "才怪", currentSum);
  }

  function bubbleHandler(currentSum) {
    return randomBreak(5, "楼主异步调用战斗力感人, 目测不超过" + currentSum,
                       currentSum)
           .then(autoCalculate)
           .then(function() {
              util.addEvent(apb, 'click', autoload);
              util.removeClass(apb, 'disabled');
            });
  }

  function errorHandler(reason) {
    var negation = {
      "这是个天大的秘密": "这不是个天大的秘密",
      "我不知道": "我知道",
      "你不知道": "你知道",
      "他不知道": "他知道",
      "才怪": "才不怪"
    };

    if (negation[reason.message]) {
      msgtext.innerHTML = negation[reason.message];
    } else {
      msgtext.innerHTML = reason.message.replace("目测不超过", "目测超过");
      autoCalculate(reason.currentSum);
    }

    util.addClass(msgtext, 'failed');
    util.addEvent(apb, 'click', autoload);
    util.removeClass(apb, 'disabled');

    return reason.currentSum;
  }

  function autoload(e) {
    init(e, AUTO);
    util.removeEvent(apb, 'click', autoload);  // stop racing
    util.addClass(apb, 'disabled');

    var seq = [];
    for (i = 0; i < numButtons; ++i) {
      seq.push(i);
    }
    
    var dict = ['A', 'B', 'C', 'D', 'E'];
    seq = util.shuffle(seq);

    var text = seq.map(function(i){ return dict[i]; }).join(', ');
    seqtext.innerHTML = text;

    var handlers = [aHandler, bHandler, cHandler, dHandler, eHandler];

    var promise;
    for (var i = 0; i < numButtons; ++i) {
      if (typeof promise === 'undefined') {
        promise = handlers[seq[i]](0);
      } else {
        promise = promise.then(handlers[seq[i]]);
      }
    }

    promise.then(bubbleHandler)["catch"](errorHandler);
  }

  function init(e, auto) {
    if (!auto)
      marks = {};

    // remove sum
    total.innerHTML = '';
    seqtext.innerHTML = '';
    msgtext.innerHTML = '';
    util.removeClass(msgtext, 'failed');

    // remove handler
    util.removeEvent(info, 'click', calculate);
    util.addClass(info, 'disabled');

    // attach handlers
    for (var i = 0; i < numButtons; ++i) {
      // remove number
      var random = buttons[i].getElementsByClassName('random')[0];
      if (util.hasClass(random, 'show'))
        util.removeClass(random, 'show');

      if (!auto) {
        util.addEvent(buttons[i], 'click', handleButton);
        marks[buttons[i].id] = null;
      } else {
        util.removeEvent(buttons[i], 'click', handleButton);
      }

      util.removeClass(buttons[i], 'disabled');
    }
  }

  util.addEvent(window, 'load', function() {
    util.addEvent(atplus, 'mouseenter', init);
    util.addEvent(apb, 'click', autoload);
  });

}(document));

keyValuePair = function(key, value) {
  return "\"" + key + "\":" + value;
};

keyValueOfStringPair = function(key, value) {
  return keyValuePair(key, "\"" + value + "\"");
};

listToString = function(list) {
  return "[" + list.join(",") + "]";
};

listOfStringToString = function(list) {
  stringedList = [];
  for (var i = 0; i < list.length; i++) {
    stringedList.push("\"" +  list[i] + "\"");
  }
  return "[" + stringedList.join(",") + "]";
};

sendMessage = function(port, address, types, arguments) {
  json = "{" + [keyValueOfStringPair("address", address), 
		keyValuePair("types", listOfStringToString(types)),
		keyValuePair("args", listOfStringToString(arguments)), 
		keyValuePair("port", port)].join(",") + "}"
  xhttp = new XMLHttpRequest();
  xhttp.open("POST", "osc.cgi");
  xhttp.send(json);
};

ongesture = function(event) {
  event.preventDefault();
}

renderUi = function (ui) {
  var port = ui.port
  var elements = ui.elements
  var numElements = elements.length;
  for (var i = 0; i < numElements; i++) {
    var f = function (element) {
      element.port = element.port || port;
      if (element.type == "button") {
	Button(element).add();
      } else if (element.type == "toggle") {
	Toggle(element).add();
      } else if (element.type == "hslider") {
	HSlider(element).add();
      } else if (element.type == "vslider") {
	VSlider(element).add();
      } else if (element.type == "selection") {
	Selection(element).add();
      } else if (element.type == "touchpad") {
	TouchPad(element).add();
      }
    }
    f(elements[i]);
  }
};

Button = function(spec) {
  var that = {};
  var name = spec.name;
  var id = spec.id;
  var x = spec.x || null;
  var y = spec.y || null;
  var width = spec.width || 50;
  var height = spec.height || 50;
  var port = spec.port;
  var newDiv = null;
  var sendOsc = function(val) {
    sendMessage(port, "/button/" + id, ["i"], [val]);
  }
  var onclick = function() {
    sendOsc(1);
  };
  var ontouchstart = function(event) {
    event.preventDefault();
    if (event.targetTouches.length == 1) {
      newDiv.style.backgroundColor = "white";
      sendOsc(1);
    }
  };
  var ontouchend = function(event) {
    event.preventDefault();
    if (event.targetTouches.length == 0) {
      newDiv.style.backgroundColor = "green";
      sendOsc(0);
    }
  }
  that.add = function() {
    var body = document.getElementsByTagName('body')[0];
    newDiv = document.createElement('div');
    newDiv.innerHTML = '<p>' + name + '<p>';
    newDiv.style.width = width;
    newDiv.style.height = height;
    if ((x != null) && (y != null)) {
      newDiv.style.position = "absolute";
      newDiv.style.left = "" + x + "px";
      newDiv.style.top = "" + y + "px";
    }
    newDiv.style.backgroundColor = "green";
    newDiv.addEventListener("touchstart", ontouchstart, false);
    newDiv.addEventListener("touchend", ontouchend, false);
    newDiv.addEventListener("touchcancel", ontouchend, false);
    newDiv.addEventListener("gesturestart", ongesture, false);
    newDiv.addEventListener("gestureend", ongesture, false);
    body.appendChild(newDiv);
  };
  return that;
};

Toggle = function(spec) {
  var that = {};
  var name = spec.name;
  var id = spec.id;
  var x = spec.x || null;
  var y = spec.y || null;
  var width = spec.width || 50;
  var height = spec.height || 50;
  var port = spec.port;
  var newDiv = null;
  var state = 0;
  var sendOsc = function(val) {
    sendMessage(port, "/toggle/" + id, ["i"], [val]);
  }
  var updateStyle = function() {
    if (state == 0) {
      newDiv.style.backgroundColor = "red";
    } else {
      newDiv.style.backgroundColor = "blue";
    }
  }
  var ontouchstart = function(event) {
    event.preventDefault();
    if (event.targetTouches.length == 1) {
      state = !(state);
      sendOsc(state ? 1 : 0);
      updateStyle();
    }
  }
  that.add = function() {
    var body = document.getElementsByTagName('body')[0];
    newDiv = document.createElement('div');
    newDiv.innerHTML = '<p>' + name + '<p>';
    newDiv.style.width = width;
    newDiv.style.height = height;
    if ((x != null) && (y != null)) {
      newDiv.style.position = "absolute";
      newDiv.style.left = "" + x + "px";
      newDiv.style.top = "" + y + "px";
    }
    newDiv.addEventListener("touchstart", ontouchstart, false);
    newDiv.addEventListener("touchend", function(event) {event.preventDefault();}, false);
    newDiv.addEventListener("touchcancel", function(event) {event.preventDefault();}, false);
    newDiv.addEventListener("gesturestart", ongesture, false);
    newDiv.addEventListener("gestureend", ongesture, false);
    updateStyle();
    body.appendChild(newDiv);
  };
  return that;
};

Selection = function(spec) {
  var that = {};
  var name = spec.name;
  var id = spec.id;
  var x = spec.x || null;
  var y = spec.y || null;
  var width = spec.width || 100;
  var height = spec.height || 20;
  var port = spec.port;
  var newDiv = null;
  var selectionDivs = [];
  var selected = null;
  var lastSelected = null;
  var updateStyle = function() {
    for (var i = 0; i < selectionDivs.length; i++) {
      if (selected != null && selected == i) {
	selectionDivs[selected].style.backgroundColor = "green";
      } else {
	selectionDivs[i].style.backgroundColor = "yellow";
      }
    }
  }
  var createOntouchstart = function(idx) {
    var ontouchstart = function(event) {
      event.preventDefault();
      lastSelected = selected;
      selected = idx;
      sendMessage(port, "/selection/" + id, ["i"], [idx]);
      updateStyle();
    }
    return ontouchstart;
  }
  that.add = function() {
    var body = document.getElementsByTagName('body')[0];
    newDiv = document.createElement('div');
    newDiv.innerHTML = '<p>' + name + '<p>';
    newDiv.style.width = width;
    // newDiv.style.height = height;
    if ((x != null) && (y != null)) {
      newDiv.style.position = "absolute";
      newDiv.style.left = "" + x + "px";
      newDiv.style.top = "" + y + "px";
    }
    newDiv.style.backgroundColor = "blue";
    body.appendChild(newDiv);

    var addNewSelection = function (selectionName, idx) {
      var selectionDiv = document.createElement('div');
      selectionDiv.style.width = width - 20;
      selectionDiv.style.height = height;
      selectionDiv.innerHTML = '<p>' + selectionName + '</p>'
      selectionDiv.addEventListener("touchstart", createOntouchstart(idx), false);
      selectionDivs.push(selectionDiv);
      newDiv.appendChild(selectionDiv);
    }

    for (var i = 0; i < spec.labels.length; i++) {
      addNewSelection(spec.labels[i], i);
    }

    updateStyle();
  };
  return that;
};

HSlider = function(spec) {
  var that = {};
  var name = spec.name;
  var id = spec.id;
  var x = spec.x || null;
  var y = spec.y || null;
  var port = spec.port;
  var pathWidth = 120;
  var pathHeight = 20;
  var sliderWidth = 20;
  var sliderHeight = 20;
  var pathDiv = null;
  var sliderDiv = null;
  var offsetDiv = null;
  var pos = 50;
  var minPos = 0;
  var maxPos = 100;
  var sendOsc = function(val) {
    sendMessage(port, "/slider/" + id, ["f"], [val]);
  }
  var updateStyle = function() {
    offsetDiv.style.width = "" + (pos + sliderWidth) + "px";
  }
  var ontouchmove = function(event) {
    event.preventDefault();
    var newPos = event.targetTouches[0].pageX - x;
    if ((newPos >= minPos) && (newPos <= maxPos)) {
      pos = newPos;
      updateStyle();
      // sendOsc(pos / maxPos);
    }
  }
  var ontouchend = function(event) {
    event.preventDefault();
    sendOsc(pos / maxPos);
  }
  that.add = function() {
    var body = document.getElementsByTagName('body')[0];
    pathDiv = document.createElement('div');
    pathDiv.style.width = pathWidth;
    pathDiv.innerHTML = '<p>' + name + '</p>';
    pathDiv.style.backgroundColor = "yellow";

    offsetDiv = document.createElement('div');
    offsetDiv.style.height = sliderHeight;
    offsetDiv.style.backgroundColor = "black";
    // offsetDiv.style.float = "left";

    sliderDiv = document.createElement('div');
    sliderDiv.style.width = sliderWidth;
    sliderDiv.style.height = sliderHeight;
    sliderDiv.style.backgroundColor = "blue";
    sliderDiv.style.float = "right";
    sliderDiv.addEventListener("touchmove", ontouchmove, false);
    sliderDiv.addEventListener("touchend", ontouchend, false);
    sliderDiv.addEventListener("touchcancel", ontouchend, false);

    body.appendChild(pathDiv);
    pathDiv.appendChild(offsetDiv);
    offsetDiv.appendChild(sliderDiv);
    updateStyle();
  };
  return that;
};

VSlider = function(spec) {
  var that = {};
  var name = spec.name;
  var id = spec.id;
  var x = spec.x || null;
  var y = spec.y || null;
  var port = spec.port;
  var pathWidth = 20;
  var pathHeight = 200;
  var sliderWidth = 20;
  var sliderHeight = 20;
  var pathDiv = null;
  var sliderDiv = null;
  var offsetDiv = null;
  var pos = 50;
  var minPos = -20;
  var maxPos = 80;
  var sendOsc = function(val) {
    sendMessage(port, "/slider/" + id, ["f"], [val]);
  }
  var updateStyle = function() {
    offsetDiv.style.height = "" + (pos + sliderHeight) + "px";
  }
  var ontouchmove = function(event) {
    event.preventDefault();
    var newPos = event.targetTouches[0].pageY - y;
    if ((newPos >= minPos) && (newPos <= maxPos)) {
      pos = newPos;
      updateStyle();
      // sendOsc(pos / maxPos);
    }
  }
  var ontouchend = function(event) {
    event.preventDefault();
    sendOsc(pos / maxPos);
  }
  that.add = function() {
    var body = document.getElementsByTagName('body')[0];
    pathDiv = document.createElement('div');
    pathDiv.style.width = pathWidth;
    pathDiv.style.height = pathHeight;
    pathDiv.innerHTML = '<p>' + name + '</p>';
    pathDiv.style.backgroundColor = "yellow";

    offsetDiv = document.createElement('div');
    offsetDiv.style.width = sliderWidth;
    offsetDiv.style.backgroundColor = "black";
    // offsetDiv.style.float = "bottom";

    sliderDiv = document.createElement('div');
    sliderDiv.style.width = sliderWidth;
    sliderDiv.style.height = sliderHeight;
    sliderDiv.style.backgroundColor = "blue";
    sliderDiv.style.float = "bottom";
    sliderDiv.addEventListener("touchmove", ontouchmove, false);
    sliderDiv.addEventListener("touchend", ontouchend, false);
    sliderDiv.addEventListener("touchcancel", ontouchend, false);

    body.appendChild(pathDiv);
    pathDiv.appendChild(offsetDiv);
    pathDiv.appendChild(sliderDiv);

    x = sliderDiv.offsetLeft;
    y = sliderDiv.offsetTop;

    updateStyle();
  };
  return that;
};

TouchPad = function(spec) {
  var that = {};
  var name = spec.name;
  var id = spec.id;
  var x = spec.x || null;
  var y = spec.y || null;
  var width = spec.width || 1000;
  var height = spec.height || 1000;
  var port = spec.port;
  var newDiv = null;
  var sendOsc = function(val) {
    sendMessage(port, "/touchpad/" + id, ["i", "i", "i", "i", "i", "i", "i", "i", "i", "i", "i"], val);
  }

  var handleTouches = function(touches) {
    var touchCoords = new Array(11);
    touchCoords[0] = touches.length;
    for (var i = 0; i < touches.length; i++) {
      touchCoords[i * 2 + 1] = (touches[i].pageX - x);
      touchCoords[i * 2 + 2] = (touches[i].pageY - y);
    }
    for (; i < 5; i++) {
      touchCoords[i * 2 + 1] = 0;
      touchCoords[i * 2 + 2] = 0;
    }
    sendOsc(touchCoords);
  };

  var ontouchstart = function(event) {
    event.preventDefault();
    handleTouches(event.targetTouches);
  };
  var ontouchmove = function(event) {
    event.preventDefault();
    handleTouches(event.targetTouches);
  };
  var ontouchend = function(event) {
    event.preventDefault();
    handleTouches(event.targetTouches);
  };
  that.add = function() {
    var body = document.getElementsByTagName('body')[0];
    newDiv = document.createElement('div');
    newDiv.innerHTML = '<p>' + name + '<p>';
    newDiv.style.width = width;
    newDiv.style.height = height;
    if ((x != null) && (y != null)) {
      newDiv.style.position = "absolute";
      newDiv.style.left = "" + x + "px";
      newDiv.style.top = "" + y + "px";
    }
    newDiv.style.backgroundColor = "blue";
    newDiv.addEventListener("touchstart", ontouchstart, false);
    newDiv.addEventListener("touchmove", ontouchmove, false);
    newDiv.addEventListener("touchend", ontouchend, false);
    newDiv.addEventListener("touchcancel", ontouchend, false);
    newDiv.addEventListener("gesturestart", ongesture, false);
    newDiv.addEventListener("gestureend", ongesture, false);
    body.appendChild(newDiv);
    x = newDiv.offsetLeft;
    y = newDiv.offsetTop;
  };
  return that;
};

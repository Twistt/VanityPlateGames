/* Base Event - All events will inherit from this event - so that we dont have to loop through thousands of events to find the one. */
/* Events */

function Event() {
	var e = this;
	this.handlers = [];
	this.isSubscribed = function (handle) {
		for (var i = 0; i < e.handlers.length; i++){
			var item = e.handlers[i];
			if (item.toString() === handle.toString()) return true;
		}
		return false;
	}
	this.subscribe = function (handle) {
		//alert("adding handler");
		e.handlers.push(handle);
	}
	this.unSubscribe = function (handle) {
		e.handlers.remove(e.handlers.first('handle', handle));
	}
	this.raiseEvent = function (data) {
		for (var i = 0; i < e.handlers.length; i++) {
			//alert("raising event #" + i);
			e.handlers[i](data);
		}
	}
}

/* use for when you want to only fire a subset of lists in the collection (ie by page/module name)*/
function NamedEvent() {
	this.handlers = [];
	this.subscribe = function (name, handle) {
		var obj = { 'name': name, 'handle': handle }
		this.handlers.push(obj);
	}
	this.unSubscribe = function (name, handle) {
		handlers.remove(handlers.where('name', name).first('handle', handle));
	}
	this.raiseEvent = function (name, data) {
		for (var i = 0; i < this.handlers.length; i++) {
			if (this.handlers[i].name == name) this.handlers[i].handle(data);
		}
	}
}


/* Prototypes */
String.prototype.replaceAll = function (str1, str2) {
    var str = this;
    while (str.indexOf(str1) !== -1) {
        str = str.replace(str1, str2);
    }
    return str;
};
String.prototype.contains = function (data) {
    if (this.indexOf(data) !== -1) return true;
    else return false;
}
Array.prototype.contains = function (value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === value) return true;
    }
    return false;
}
Array.prototype.whereDate = function (propName, value) {
    var ar = [];
    for (var i = 0; i < this.length; i++) {
        obj = this[i];
        if (obj.hasOwnProperty(propName)) {
            var prop = new Date(obj[propName]).setHours(0, 0, 0, 0);
            var val = new Date(value).setHours(0, 0, 0, 0);
            if (prop === val) ar.push(obj);
        }
    }
    return ar;
}
Array.prototype.where = function (propName, value) {
    var ar = [];
    for (var i = 0; i < this.length; i++) {
        obj = this[i];
        if (obj.hasOwnProperty(propName)) {
            if (obj[propName] === value) ar.push(obj);
        }
    }
    return ar;
}
Array.prototype.count = function (propName, value) {
    var count = 0;
    for (var i = 0; i < this.length; i++) {
        obj = this[i];
        if (obj.hasOwnProperty(propName)) {
            if (obj[propName] === value) count++;
        }
    }
    return count;
}

Array.prototype.whereContains = function (propName, value) {
    var ar = [];
    for (var i = 0; i < this.length; i++) {
        obj = this[i];
        if (obj.hasOwnProperty(propName)) {
            if (obj[propName].toString().contains(value.toString())) ar.push(obj);
        }
    }
    return ar;
}
Array.prototype.first = function (propName, value) {
    for (var i = 0; i < this.length; i++) {
        var obj = this[i];
        if (obj.hasOwnProperty(propName)) {
            if (obj[propName] === value) return obj;
        }
    }
    return null;
}
Array.prototype.take = function (amount) {
    var returnArray = [];
    for (var i = 0; i < this.length; i++) {
        var obj = this[i];
        returnArray.push(obj);
        if (i === amount) return returnArray;
    }
    return returnArray;
}
Array.prototype.skip = function (amount) {
    var returnArray = [];
    for (var i = 0; i < this.length; i++) {
        var obj = this[i];
        if (i >= amount) returnArray.push(obj);
    }
    return returnArray;
}
Array.prototype.position = function (propName, value) {
    for (var i = 0; i < this.length; i++) {
        obj = this[i];
        if (obj.hasOwnProperty(propName)) {
            if (obj[propName] === value) return i;
        }
    }
    return null;
}

Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
}
Date.prototype.subtractHours = function (h) {
    this.setHours(this.getHours() - h);
    return this;
}
Date.prototype.formatMMDDYYYY = function () {
    return (this.getMonth() + 1) +
    "/" + this.getDate() +
    "/" + this.getFullYear();
}
Date.prototype.Dotnet = function () {
    var date = new Date();
    var day = date.getDay();        // yields day
    var month = date.getMonth();    // yields month
    var year = date.getFullYear();  // yields year
    var hour = date.getHours();     // yields hours 
    var minute = date.getMinutes(); // yields minutes
    var second = date.getSeconds(); // yields seconds

    // After this construct a string with the above results as below
    return day + "/" + month + "/" + year + " " + hour + ':' + minute + ':' + second;

}


/*example event

document.addEventListener("keypress", myFunction);
function myFunction(e) {
	var key = e.keyCode;
	console.log(key);
	if (key === 101) //"e"
		FilterEvents.FlyOut.raiseEvent();
}
*/
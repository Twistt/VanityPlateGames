function Uploader(uploadLocation) {
	var me = this;
	this.UploadLocation = uploadLocation;
	this.Queue = [];
	this.FileQueued = new Event();
	this.UploadStart = new Event();
	this.UploadCanceled = new Event();
	this.UploadFinished = new Event();
	this.UploadFailed = new Event();
	this.UploadSuccees = new Event();
	this.ProgressChanged = new Event();

	this.QueueFile = function (inputElement) {
		for (var i = 0; i < inputElement.files.length; i++) {
			var _file = new File();
			me.Queue.push(_file);
			me.FileQueued.raiseEvent(_file);
		}
	}
	this.StartUpload = function (file) {
		var xhr = file.Xhr;
		xhr.open("post", me.UploadLocation, true);

		xhr.setRequestHeader("Content-Type", "multipart/form-data");
		xhr.setRequestHeader("X-File-Name", file.Name);
		xhr.setRequestHeader("X-File-Size", file.Size);
		xhr.setRequestHeader("X-File-Type", file.Type);

		xhr.upload.addEventListener("progress", function (e) {
			file.Progress = (e.progress / file.size) * 100;
			me.ProgressChanged.raiseEvent(file);
		}, false);
		xhr.upload.addEventListener("load", function (e) {
			me.FileUploaded.raiseEvent(file);
		}, false);
		xhr.upload.addEventListener("error", function (e) {
			me.UploadFailed.raiseEvent(file);
		}, false);
		xhr.upload.addEventListener("abort", function (e) {
			me.UploadCanceled.raiseEvent(file);
		}, false);

	}
	this.UploadAll = function() {
		for (var i = 0; i < me.Queue.length; i++) {
			me.StartUpload(me.Queue[i]);
		}
	}
}

function File(elem, i) {
	var me = this;
	var _oElement = elem.files[i];
	this.Name = _oElement.name;
	this.Size = _oElement.size;
	this.UserFile = _oElement;
	this.Element = elem;
	this.ProgressPercent = 0;
	this.FileType = _oElement.type;
	this.Xhr = new XMLHttpRequest();
}

function Event() {
	var e = this;
	this.handlers = [];
	this.isSubscribed = function (handle) {
		for (var i = 0; i < e.handlers.length; i++) {
			var item = e.handlers[i];
			if (item.toString() === handle.toString()) return true;
		}
		return false;
	}
	this.subscribe = function (handle) {
		e.handlers.push(handle);
	}
	this.unSubscribe = function (handle) {
		e.handlers.remove(e.handlers.first('handle', handle));
	}
	this.raiseEvent = function (data) {
		for (var i = 0; i < e.handlers.length; i++) {
			e.handlers[i](data);
		}
	}
}
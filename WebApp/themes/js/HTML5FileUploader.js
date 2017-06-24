function FileUploader() {
	var me = this;
	this.UploadLocation = "";
	this.Files = [];
	this.FileQueued = new Event();
	this.UploadStarted = new Event();
	this.UploadFinished = new Event();
	this.UploadCanceled = new Event();
	this.FileUploadFailed = new Event();
	this.FileUploadCanceled = new Event();
	this.FileUploadProgressChanged = new Event();
	this.CancelUpload = function (file) {
		me.UploadCanceled.raiseEvent(file);
	}
	this.QueueFile = function (elem) {
		for (var i = 0; i < elem.files.length; i++) {
			var _file = new File(elem, i);
			me.Files.push(_file);
			me.FileQueued.raiseEvent(_file);
		}
	}
	this.UploadAll = function () {
		for (var i = 0; i < me.Files.length; i++) {
			me.StartUpload(me.Files[i]);
		}
	}
	this.StartUpload = function (file) {
		var xhr = file.xhr;
		xhr.open("post", me.UploadLocation, true);

		xhr.setRequestHeader("Content-Type", "multipart/form-data");
		xhr.setRequestHeader("enctype", "multipart/form-data");
		xhr.setRequestHeader('Accept', 'application/json');
		

		xhr.upload.addEventListener("progress", function (e) {
			file.ProgressPercent = (e.loaded / e.total) * 100;
			me.FileUploadProgressChanged.raiseEvent(file);
		}, false);
		xhr.upload.addEventListener("load", function (e) {
			me.UploadFinished.raiseEvent(file);
		}, false);
		xhr.upload.addEventListener("error", function (e) {
			me.FileUploadFailed.raiseEvent(file);
		}, false);
		xhr.upload.addEventListener("abort", function (e) {
			me.FileUploadCanceled.raiseEvent(file)
		}, false);
		me.FileUploadCanceled.subscribe(function (file) {
			console.log("cancelling upload");
			file.xhr.abort();
		});
		var formData = new FormData();
		formData.append('file', file.File);
		xhr.send(formData);
		me.UploadStarted.raiseEvent(file);
	}
	this.CancelUpload = function (fileName) {
		me.FileUploadCanceled.raiseEvent(fileName);
	}

	function File(elem, i) {
		var me = this;
		var GetFileName = function (val) {
			var _splitvals = val.split("\\");
			var _item = _splitvals[_splitvals.length - 1];
			return _item;
		}
		this.xhr = new XMLHttpRequest();
		this.Type = elem.files[i].type;
		this.Name = GetFileName(elem.files[i].name);
		this.Size = elem.files[i].size;
		this.File = elem.files[i];
		this.ProgressPercent = 0.00;
		this.Element = elem;
	}
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
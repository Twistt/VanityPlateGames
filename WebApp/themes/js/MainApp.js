//localStorage.setItem("FlashNLearn", "");
var token = "";
var apiep = "";
function ApplicationBase() {
    this.Pages = [{ Name: "login", Active: true }];
    this.ActivePage = "login";
    this.Machines = [];
    this.WorkoutList = [];
    this.ApiRoot = "http://localhost:53322/api/";
    this.FacebookUser = null;
    this.AuthResponse = null;
}
var Application = new ApplicationBase();
var Vanity = localStorage.getItem("Vanity");
if (Vanity !== null && Vanity.length > 0) {
    Application = JSON.parse(Vanity);
    console.log(Application);
}
function SaveApplication() {
    console.log("saving application...");

    localStorage.setItem("Vanity", JSON.stringify(Application));
}
var AppEvents = {
    OnNav: new Event(),
    UploadSelection: new Event(),
    OnCommentSent: new Event(),
    OnCommentRecieved: new Event(),
    OnFacebookLogin: new Event(),
    OnFacebookLogout: new Event(),
    StartUpload: new Event()
}
function Page() {
    this.Name = "NA";
    this.Active = false;
}

var service = function () {
    Object.defineProperty(this, "ActivePage", {
        get: function () { return Application.ActivePage; },
        set: function (y) { Application.ActivePage = y }
    });
}
function Main(service, $scope) {
    var me = this;
    this.ActivePage = function () {
        return service.ActivePage;
    }
    this.Application = Application;
    this.ChangePage = function (page) {
        service.ActivePage = Application.Pages.first("Name", page);
        Application.ActivePage = page;
        SaveApplication();
        AppEvents.OnNav.raiseEvent(page);
        return service.ActivePage;

    }
    AppEvents.OnFacebookLogout.subscribe(function () {
        Application.FacebookUser = null;
        alert("Logged out of fb");

    });
    this.LogoutOfFacebook = function () {
        Application.FacebookUser = null;
        try {
            FB.logout(function (response) {
                AppEvents.OnFacebookLogout.raiseEvent(response);
            });
        } catch (exc) { }
        localStorage.setItem("Vanity",'');
    }
    this.init = function () {

    }
    this.init();


}
function PlayGame(service, $scope) {
    var me = this;
    this.inheritFrom = Main;
    this.inheritFrom(service);
    AppEvents.OnNav.subscribe(function (page) {

       // if (page === "play") var data = HydraUtils.GetData(ApplicationAPIRoot + "CacheData/GetDataDiff?LastUpdate=" + Application.LastUpdate.Dotnet(), "GET");
    });
    this.init = function () { }
    this.init();
}
function Uploads(service, $scope) {
    var me = this;
    this.addnew = false;
    this.inheritFrom = Main;
    this.inheritFrom(service);

    this.ToggleAddNew = function () {
        //Application.Machines.push(me.ActiveMachine);
        me.addnew = true;
        //SaveApplication();
    }
    this.ChoosePhoto = function () {
        $("#UploadPhotoFileSelection").trigger("click");
    }
    this.readURL = function (input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#PreviewImage').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    this.StartUpload = function () {
        AppEvents.StartUpload.raiseEvent();

        SaveApplication();
    }
    AppEvents.UploadSelection.subscribe(me.readURL);
    AppEvents.StartUpload.subscribe(function () {
        var form = document.getElementById('uploadForm');
        var fileSelect = document.getElementById('UploadPhotoFileSelection');
        var uploadButton = document.getElementById('fileUploadButton');
        var files = fileSelect.files;
        // Create a new FormData object.
        var formData = new FormData();
        formData.append("fileid", $("#ParentFileId").val());
        // Loop through each of the selected files.
        for (var i = 0; i < files.length; i++) {
            var file = files[i];

            console.log(file);
            // Add the file to the request.
            // Files
            formData.append(name, file, file.name);
        }
        // Set up the request.
        var xhr = new XMLHttpRequest();
        // Open the connection.
        xhr.upload.onprogress = me.onProgress;
        //xhr.addEventListener("progress", me.onProgress);
        //xhr.onprogress = me.onProgress;
        xhr.upload.addEventListener("progress", me.onProgress);
        xhr.addEventListener("load", me.onLoad);
        xhr.addEventListener("error", me.transferFailed);
        xhr.addEventListener("abort", me.transferCanceled);
        alert(Application.ApiRoot);
        xhr.open('POST', Application.ApiRoot + 'api/Game/PostFormData', true);
        xhr.setRequestHeader("Token", Application.AuthResponse.accessToken);

        // Send the Data.
        xhr.send(formData);
        uploadButton.innerHTML = 'Uploading...';
    });
    this.ClickedOnUpload = function (machine) {
        machine.ShowOptions = true;
    }
    this.DeleteUploads = function (machine) {
        var pos = Application.Machines.position("id", machine.id);
        Application.Machines.splice(pos, 1);
        SaveApplication();
    }
    this.Edits = function (machine) {
        me.ActiveMachine = machine;
        window.setTimeout(function () { $('#PreviewImage').attr('src', machine.ImageUrl); }, 200)
        me.addnew = true;

    }
    
}
function Login(service, $scope) {
    var me = this;
    this.inheritFrom = Main;
    this.inheritFrom(service);
    this.DoLogin = function () {
        HydraUtils.GetData("", "GET");
    }
    this.LoginWithFacebook = function () {
        FB.login(function (response) {
            console.log(response);
            if (response.status === "connected") {
                AppEvents.OnFacebookLogin.raiseEvent(response);
                $scope.$apply();
            }
            
        }, { scope: 'email' });
    }
    AppEvents.OnFacebookLogin.subscribe(function (resp) {
        Application.AuthResponse = resp.authResponse;
        FB.api('/me', function (response) {
            console.log(JSON.stringify(response));
            Application.FacebookUser = response;
            FB.api(
                "/" + Application.FacebookUser.id + "/picture",
                function (response) {
                    if (response && !response.error) {
                        /* handle the result */
                        console.log(response);
                        $("#fbImage").attr("src", response.data.url);
                        me.ChangePage("play");
                        $scope.$apply();
                    }
                }
            );
        });
    });
    this.init = function () {
        window.setTimeout(function () {
            try {
                
                FB.getLoginStatus(function (response) {
                    console.log(response);
                    if (response.status !== "unknown") AppEvents.OnFacebookLogin.raiseEvent(response);
                    else Application.FacebookUser = null;
                });
                $scope.$apply();
            }
            catch (exp){
                window.setTimeout(function () { me.init(); }, 100);
            }
                
            
        }, 300);
    }
    this.init();
}
function Menu(service, $scope) {
    var me = this;
    this.inheritFrom = Main;
    this.inheritFrom(service);
}
function trimFileName(ele) { //File selected EVENT
    var val = $(ele).val();
    var s = val.split('\\');
    var item = s[s.length - 1];

    $("#FileName").html(item);
    $("#fileUploadButton").removeClass("disabled");
    $("#fileUploadButton").addClass("bgm-green");
}

document.addEventListener('DOMContentLoaded', function () {
    var PublicViewDependancies = ['Application', 'LogoutOfFacebook', 'DeleteUploads', 'EditUploads', 'ClickedOnUpload', 'ClickedOnWorkout', 'showWorkoutDetails', 'CancelNewWorkout', 'SaveWorkout', 'ActiveWorkout', 'ChooseMachine', 'showAddWorkout', 'ToggleAddWorkout', 'SaveExercise', 'ChoosePhoto', 'addnew', 'ActiveMachine', 'WorkoutList', 'Machines', 'ToggleAddNew', 'ActivePage', 'ChangePage'];
    var LoginDependancies = PublicViewDependancies.slice(0).concat(['LoginWithFacebook']);
    var UploadDependances = PublicViewDependancies.slice(0).concat(['StartUpload']);
    
    var mainpage = new AngularHydra("mainpage", [angular.NgFor, angular.NgIf], service)
	.View("/themes/MainPage.html")
	.Class("mainControl", Main, PublicViewDependancies)
        .AddView("/themes/login.html", "login", "loginControl", Login, LoginDependancies, service, "E")
        .AddView("/themes/uploads.html", "uploads", "uploadsControl", Uploads, UploadDependances, service, "E")
    .AddView("/themes/play.html", "play", "playControl", PlayGame, PublicViewDependancies, service, "E")
    .AddView("/themes/nav.html", "menu", "menuControl", Menu, PublicViewDependancies, service, "E")
	.Create("MainPage");

});

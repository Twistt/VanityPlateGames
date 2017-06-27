//localStorage.setItem("FlashNLearn", "");
var token = "";
var apiep = "";
function ApplicationBase() {
    this.Pages = [{ Name: "login", Active: true }];
    this.ActivePage = "login";
    this.ApiRoot = "http://www.vanityplategames.com/api/";
    //this.ApiRoot = "http://localhost:53322/api/";
    this.FacebookUser = null;
    this.AuthResponse = null;
    this.User = null;
}

function Comment() {
    this.Id = 0;
    this.Message = "";
    this.UserId = Application.FacebookUser.id;
    this.TimeStamp = new Date();
    this.ImageId = 0;
    this.IsReplyTo = 0;

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
    StartUpload: new Event(),
    GetUploadList: new Event(),
    NewPlateImage: new Event(),
    EnteredPlayMode: new Event()

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
    this.LogoutOfFacebook = function () {
        me.ChangePage("login");
        Application.FacebookUser = null;
        Application.AuthResponse = null;
        localStorage.setItem("Vanity", '');
    }
    this.init = function () {

    }
    this.init();


}
function PlayGame(service, $scope) {
    var me = this;
    this.inheritFrom = Main;
    this.inheritFrom(service);
    this.ActivePlateImage = null;
    this.ShowComments = false;
    this.ActiveComment = new Comment();
    this.ToggleShowComments = function () {
        me.ShowActivePlateComments = !me.ShowActivePlateComments;
    }
    this.PostComment = function () {
        me.ActiveComment.ImageId = me.ActivePlateImage.Id;
        var data = HydraUtils.GetData(Application.ApiRoot + "Game/CreateNewComment", "POST", me.ActiveComment);
        me.ActivePlateImage.Comments.push(data);
    }
    this.GetRandomImage = function () {
        var data = HydraUtils.GetData(Application.ApiRoot + "Game/GetRandomImage", "GET");
        if (data !== null) {
            me.ActivePlateImage = data;
            console.log(data);
            window.setTimeout(function () {
                $("#MainPlateImage").attr("src", "/play/ShowImage?width=500&height=400&quality=50&imageid=" + data.Id);
            }, 200);
            AppEvents.NewPlateImage.raiseEvent();
        }
    }
    AppEvents.EnteredPlayMode.subscribe(function () {
        window.setTimeout(function () {
            alert("gettin' the random image arg");
            me.GetRandomImage();
            $scope.$apply();
        }, 500);
    });
    AppEvents.OnNav.subscribe(function (page) {
        if (me.ActivePage() === "play") {
            window.setTimeout(function () {
                me.GetRandomImage();
                $scope.$apply();
            }, 500);

        }

    });
    AppEvents.NewPlateImage.subscribe(function () {


    });
    this.init = function () { }
    this.init();
}
function Uploads(service, $scope) {
    var me = this;
    this.addnew = false;
    this.inheritFrom = Main;
    this.inheritFrom(service);
    this.UploadList = [];
    this.GetFilesByUser = function () {
        //C:\Users\twist\Downloads
        var data = HydraUtils.GetData(Application.ApiRoot + "Game/GetFilesByUser/?facebookid=" + Application.FacebookUser.id, "GET");
        if (data !== null) {
            me.UploadList = data;
        }
    }
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
    AppEvents.GetUploadList.subscribe(function () {
        me.GetFilesByUser();
    });
    AppEvents.UploadSelection.subscribe(me.readURL);
    AppEvents.StartUpload.subscribe(function () {
        var form = document.getElementById('uploadForm');
        var fileSelect = document.getElementById('UploadPhotoFileSelection');
        var uploadButton = document.getElementById('fileUploadButton');
        var files = fileSelect.files;
        // Create a new FormData object.
        var formData = new FormData();
        formData.append("Name", $("#Name").val());
        formData.append("Description", $("#Description").val());
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
        xhr.addEventListener("load", function () {
            uploadButton.innerHTML = 'Save';
            me.addnew = false;
            AppEvents.GetUploadList.raiseEvent();
            $scope.$apply();
        });
        xhr.addEventListener("error", me.transferFailed);
        xhr.addEventListener("abort", me.transferCanceled);
        xhr.open('POST', Application.ApiRoot + 'Game/PostFormData', true);
        xhr.setRequestHeader("Token", Application.AuthResponse.accessToken);

        // Send the Data.
        xhr.send(formData);
        uploadButton.innerHTML = 'Uploading...';
    });
    AppEvents.OnNav.subscribe(function () {
        if (me.ActivePage() === "uploads") me.GetFilesByUser();
    });
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
    this.init = function () {
        me.GetFilesByUser();
    }
    this.init();
}
function Login(service, $scope) {
    var me = this;
    this.inheritFrom = Main;
    this.inheritFrom(service);
    this.DoLogin = function () {
        HydraUtils.GetData("", "GET");
    }
    this.LoginWithFacebook = function () {

        url = window.location.href;
        url = url.replace("#", "").replace("?", "&");

        var res = url.split("&");
        var token = res[1].replace("access_token=", "");
        console.log(token);
        Application.GBAccessToken = token;
        var fbme = HydraUtils.GetData("https://graph.facebook.com/v2.9/me/?client_id=1944171745861386&access_token=" + token, "GET", null, undefined, true);
        Application.FacebookUser = fbme;
        AppEvents.OnFacebookLogin.raiseEvent(fbme);



        //FB.login(function (response) {
        //    console.log(response);
        //    if (response.status === "connected") {
        //        AppEvents.OnFacebookLogin.raiseEvent(response);
        //        $scope.$apply();
        //    }
        //}, { scope: 'email' });
    }
    AppEvents.OnFacebookLogin.subscribe(function (resp) {
        var data = HydraUtils.GetData(Application.ApiRoot + "Account/AuthenticateAsFacebookUser/?userid=" + resp.id + "&name=" + resp.name, "GET");
        Application.User = data;
        console.log("UserData", data);
        if (data !== null && data.Id !== 0) {
            console.log("should be going to play mode...");
            me.ChangePage('play');
            AppEvents.EnteredPlayMode.raiseEvent();
            $scope.$apply();
        }
    });
    this.init = function () {
        window.setTimeout(function () {

            var url = window.location.href;
            if (url.contains("access_token")) {
                //alert("DUDE we got a token!");
                me.LoginWithFacebook();
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
    var UploadDependances = PublicViewDependancies.slice(0).concat(['UploadList', 'StartUpload']);
    var PlayDependances = PublicViewDependancies.slice(0).concat(['ActivePlateImage', 'GetRandomImage', 'ShowActivePlateComments', 'ToggleShowComments', 'ActiveComment', 'PostComment']);


    var mainpage = new AngularHydra("mainpage", [angular.NgFor, angular.NgIf], service)
	.View("MainPage.html")
	.Class("mainControl", Main, PublicViewDependancies)
        .AddView("login.html", "login", "loginControl", Login, LoginDependancies, service, "E")
        .AddView("uploads.html", "uploads", "uploadsControl", Uploads, UploadDependances, service, "E")
    .AddView("play.html", "play", "playControl", PlayGame, PlayDependances, service, "E")
    .AddView("nav.html", "menu", "menuControl", Menu, PublicViewDependancies, service, "E")
	.Create("MainPage");

});



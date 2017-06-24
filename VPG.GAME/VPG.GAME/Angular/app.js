function Application() {
    this.loggedinStatus = false;
    this.fbUser = {};
    this.authResponse = {};
}
var VPG = new Application();
(function (app) {
    app.AppComponent = ng.core
        .Component({
            selector: 'my-app',
            templateUrl: '/Angular/GameTemplate.html'
        })
        .Class({
            constructor: function () {

                $("#FBLoginButton").append($("#LoginButtonContainer"));
                this.checkLoginStatus(this.handleLoginCallback);
                
            },
            handleLoginCallback: function (response) {
                console.log("REAL response", response);
                alert(response.status);
                if (response.status === 'connected') {
                    // Logged into your app and Facebook.
                    VPG.loggedinStatus = true;

                } else {
                    // The person is not logged into this app or we are unable to tell. 
                    VPG.loggedinStatus = false;
                }
                alert(VPG.loggedinStatus);
            },
            getMyFacebookInfo: function(){
                FB.api('/me', function(response) {
                    console.log(JSON.stringify(response));
                });
            },
            checkLoginStatus: function (callback) {
                FB.getLoginStatus(function (response) {
                    callback(response);

                });
            },
            loginToFacebook: function(){
                FB.login(function (response) {
                    console.log(response);
                    if (response.status === 'connected') {
                        // Logged into your app and Facebook.
                        VPG.loggedinStatus = true;
                        
                    } else {
                        // The person is not logged into this app or we are unable to tell. 
                        VPG.loggedinStatus = false;
                    }
                });
            },
            getLoggedInStatus: function () {
                return VPG.loggedinStatus;
            }
            
        });
})(window.app || (window.app = {}));

/*
Original tutorial from https://angular.io, licensed by Google Inc.
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
***
Modifications under MIT license that can be found at
https://opensource.org/licenses/MIT
*/

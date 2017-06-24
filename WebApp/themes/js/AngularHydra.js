//me.Version=1|2
//moduleName="MyAngularModule"
//dependancies=[NgFor, MyOtherModule]
//service=service to inject
function AngularHydra(moduleName, dependencies, service) {
    this.Version = 2;
    var app = null;
    var comp = null;
    var me = this;
    me.UIRendered = new Event();
    function Angular2view() {
        this.viewTemplate = "";
        this.viewName = "";
        this.viewControllerName = "";
        this.viewController = {};
        this.viewScopeList = [];
        this.viewService = {};
        this.viewRestrict = "";
    }
    function replaceAll(str, str1, str2) {
        return str.split(str1).join(str2); //20% faster than regex ref=https://javascriptweblog.wordpress.com/2010/11/08/javascripts-dream-team-in-praise-of-split-and-join/
    }
    function MassageHtml(html, scopeList, contName) {
        if (contName === null || contName === undefined) contName = me.ControllerName;
        html = replaceAll(html, "*ng-for", "ng-repeat");
        html = replaceAll(html, "*ng-if", "ng-if");
        html = replaceAll(html, " of ", " in ");
        html = replaceAll(html, "(change)", "ng-change");
        html = replaceAll(html, "(submit)", "ng-submit");
        html = replaceAll(html, "(blur)", "ng-blur");
        html = replaceAll(html, "(click)", "ng-click");
        html = replaceAll(html, "(drag)", "ondragstart");
        html = replaceAll(html, "SelfReference", contName);
        if (scopeList !== null && scopeList.length > 0) {
            for (i = 0; i < scopeList.length; i++) {
                while (html.contains("#" + scopeList[i])) { //we found an inline reference to our scope list that looks like angular2 model binding
                    var start = html.indexOf("#" + scopeList[i]);
                    var end = html.indexOf(">", start);
                    var oldstr = html.substring(start, end);
                    newstr = replaceAll(oldstr, "#" + scopeList[i], contName + "." + scopeList[i]);
                    newstr = replaceAll(newstr, "/", "");
                    newstr = 'ng-model="' + newstr + '"';
                    html = replaceAll(html, oldstr, newstr);
                }
                html = replaceAll(html, scopeList[i], contName + "." + scopeList[i]);
            }
            html = replaceAll(html, contName + "." + contName, contName);
            html = replaceAll(html, contName + "." + contName, contName);
        }

        html = replaceAll(html, 'href="#', 'href="$%$'); //convert intra-page links to something else so they are not replaced
        html = replaceAll(html, '"#', '"'); //locally declared variables will work in angular 1 without being marked as such but a2 variables will break a1.
        html = replaceAll(html, '$%$', '#'); //convert intra-page back
        return html;
    }
    function LoadHtml(htmlTemplate) {
        var request = new XMLHttpRequest();
        request.open('GET', htmlTemplate, false);  // `false` makes the request synchronous (which we need for the code to work properly)
        request.send(null);
        //console.log(request.status);
        var _content = request.responseText;
        //console.log(_content);
        return _content;
    }
    this.ModuleName = "AngularHydra";
    this.ControllerName = "hydraCntrl";
    this.Version = 2;
    this.ServiceInjectable = service;
    this.Template = "";
    this.ControllerClass = function () { };
    this.TemplateHtml = "";
    this.ConvertHtml = true;
    this.ScopeList = [];
    this.Views = [];
    this.View = function (template) {
        me.Template = template;
        me.TemplateHtml = LoadHtml(me.Template);
        return me;
    }
    this.AddView = function (viewTemplate, viewName, viewControllerName, viewController, viewScopeList, viewService, viewRestrict) {
        var _viewservice = null;
        if (viewService !== null && viewService !== undefined) _viewservice = viewService;
        if (viewRestrict === null || viewRestrict === undefined) viewRestrict = 'E';
        else _viewservice = me.ServiceInjectable;
        if (me.Version === 1) {
            if (me.ConvertHtml) viewTemplate = MassageHtml(LoadHtml(viewTemplate), viewScopeList, viewControllerName);
            else viewTemplate = LoadHtml(viewTemplate);
            app.directive(viewName, function () {
                return {
                    restrict: 'E', //E-lement, A-ttribute, C-omment
                    template: viewTemplate,
                    controllerAs: viewControllerName,
                    controller: ['Service', '$scope', viewController]
                };
            });
        }
        else {
            var _a2view = new Angular2view();
            _a2view.viewController = viewController;
            _a2view.viewTemplate = viewTemplate;
            _a2view.viewName = viewName;
            _a2view.viewControllerName = viewControllerName;
            _a2view.viewScopeList = viewScopeList;
            _a2view.viewRestrict = viewRestrict;
            me.Views.push(_a2view);
        }
        return me;
    }
    this.AddLinkView = function (viewName, viewRestrict, viewLinkControl) {
        if (me.Version === 1) {
            app.directive(viewName, function () {
                return {
                    restrict: viewRestrict, //attribute only
                    link: viewLinkControl,
                    require: "^" + me.ModuleName
                };
            });
        }
        else {

        }
        return me;
    }
    this.AddModule = function (name, directive, func) {
        angular.module(name).directive(directive, func);
        return me;
    }
    this.Class = function (cntrlName, controller, scopeList) {
        me.ControllerClass = controller;
        if (service !== null && service !== undefined) me.ServiceInjectable = service;
        else me.ServiceInjectable = function () { }
        me.ControllerClass = controller;
        me.ControllerName = cntrlName;
        if (me.Version === 1) {
            me.ScopeList = scopeList;
            if (me.ConvertHtml) me.TemplateHtml = MassageHtml(me.TemplateHtml, me.ScopeList);
            app.directive(me.ModuleName, function () {
                return {
                    restrict: 'E', //E-lement, A-ttribute, C-omment
                    template: me.TemplateHtml,
                    controllerAs: me.ControllerName,
                    controller: ['Service', '$scope', me.ControllerClass]
                };
            });
        }
        return me;
    }
    this.init = function () {
        if (typeof angular === 'undefined') {
            alert("Angular is not loaded....");
            return;
        }
        if (angular.version !== undefined) {
            me.Version = angular.version.major;
        }
        me.ModuleName = moduleName;
        if (me.Version === 1) {
            app = angular.module(moduleName, []);
            app.service('Service', me.ServiceInjectable);
        }
        return me;
    }
    this.Create = function (elementId) {
        var bootstrapElement = document.getElementById(elementId);
        if (bootstrapElement === undefined || bootstrapElement === null) bootstrapElement = document;
        if (me.Version === 1) {
            angular.bootstrap(bootstrapElement, [me.ModuleName]);
        }
        if (me.Version === 2) {
            console.log("adding views to a2");
            if (me.Views.length > 0) {
                //Nested Directives. (A1 nested directives are handled in "add view".
                //If this collection has members than it will set all these views as dependancies for the main view.
                for (var i = 0; i < me.Views.length; i++) {
                    var view = me.Views[i];
                    var _hydraNestedDirective = angular.
					Component({
					    selector: view.viewName,
					    appInjector: [me.ServiceInjectable]
					}).
					View({
					    templateUrl: view.viewTemplate,
					    directives: [view.viewScopeList]
					}).
					Class({
					    constructor: [me.ServiceInjectable, view.viewController]
					});
                    if (dependencies !== undefined && dependencies !== null) dependencies.push(_hydraNestedDirective);
                    else {
                        dependencies = [];
                        dependencies.push(_hydraNestedDirective);
                    }
                }

                //console.log(dependencies);
            }

            comp = angular.
			Component({
			    selector: me.ModuleName,
			    appInjector: [me.ServiceInjectable]
			}).
			View({
			    templateUrl: me.Template,
			    directives: dependencies
			}).
			Class({
			    constructor: [me.ServiceInjectable, me.ControllerClass]
			});

            angular.bootstrap(comp);
        }
        me.UIRendered.raiseEvent();
        return me;
    }
    this.init();

}

function HydraUtilities() {
    var me = this;
    this.PreRequest = new Event();
    this.PostRequest = new Event();
    this.Response200 = new Event();
    this.Response401 = new Event();
    this.GetData = function (ep, type, content, callback) {
        //www.myapi.com/api/controller/method/id, "GET" 
        me.PreRequest.raiseEvent();
        if (type === undefined) type = "GET";
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function (data) {
            if (data.currentTarget.status === 401) me.Response401.raiseEvent(data.currentTarget.statusText);
        }
        xmlhttp.open(type, ep, false);
        xmlhttp.setRequestHeader("Token", Application.User.Token);
        if (type === "POST" && content !== null) {
            xmlhttp.setRequestHeader("Content-Type", "application/json");
            xmlhttp.send(JSON.stringify(content));
        }
        else
            xmlhttp.send();
        me.PostRequest.raiseEvent(xmlhttp.responseText);
        //console.log(xmlhttp.responseText);
        if (callback !== undefined) callback(xmlhttp.responseText);
        var json = JSON.parse(xmlhttp.responseText);
        return json;
    }
}

var HydraUtils = new HydraUtilities();


Array.prototype.clone = function () {
    return this.slice(0);
};
Array.prototype.remove = function (index) {
    return this.splice(index, 1);
};
Array.prototype.insert = function (index, item) {
    return this.splice(index, 0, item);
};
Array.prototype.position = function (propName, value) {
    for (var i = 0; i < this.length; i++) {
        obj = this[i];
        if (obj.hasOwnProperty(propName)) {
            if (obj[propName] === value) return i;
        }
    }
    return null;
}
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
Array.prototype.last = function (amt) {
    console.log(amt);
    if (amt === undefined || amt === null) return this[this.length - 1];
    var sliceamt = (this.length - amt);
    if (sliceamt < 0) return this;
    else {
        return this.slice(sliceamt, this.length);
    }
}
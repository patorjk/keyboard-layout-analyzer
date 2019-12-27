/*
    sets up the app

    TODO:
    - fix mouse hover for editor and heatmap
    - fix side dialog spacing
*/

var app = angular.module('kla', [
    'ngAnimate',
    'ngRoute',
    'kla.services', 'kla.controllers', 'kla.filters', 'kla.directives']);

var appVer = '34local';//(new Date()).getTime())
app.constant('cacheBustSuffix', '?v='+appVer);

app.config(function ($routeProvider, cacheBustSuffix) {
    $routeProvider
        .when('/', 
            {
                redirectTo: '/main'
            })
        .when('/main', 
            {
                templateUrl: 'partials/main.htm',
                controller: 'MainCtrl'
            })
        .when('/load/:textKey',
            {
                templateUrl: 'partials/load.htm',
                controller: 'LoadCtrl'
            })
        .when('/load',
            {
                templateUrl: 'partials/load.htm',
                controller: 'LoadCtrl'
            })
        .when('/results', 
            {
                templateUrl: 'partials/results.htm',
                controller: 'ResultsCtrl'
            })
        .when('/config', 
            {
                templateUrl: 'partials/config.htm',
                controller: 'ConfigCtrl'
            })
        .when('/about', 
            {
                templateUrl: 'partials/about.htm'
            })
        .otherwise(
            { 
                redirectTo: '/' 
            })
        ;
});

app.run(function() {
    
});

// ok-ing console usage
if (typeof console === 'undefined') {
    var console = {};
    console.log = function(){};
    console.dir = function(){};
}

// email plugin
jQuery.fn.mailto = function() {
    return this.each(function(){
        var email = $(this).attr('href').replace(/\s*\(.+\)\s*/, "@");
        $(this).attr('href', 'mailto:'+email);
    });
};

$('#showNews').click(function() {
    $('#newsModal').modal('show');
});

$('#showAbout').click(function() {
    $('#aboutModal').modal('show');
});

$('.email').mailto(); // setup email link
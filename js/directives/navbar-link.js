'use strict';

var appDirectives = appDirectives || angular.module('kla.directives', []);

appDirectives.directive('navbarLink', ['$location', 
    function($location) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs, controller) {
                // Watch for the $location
                scope.$watch(function() {
                    return $location.path();
                }, function(newValue, oldValue) {
                    $('li[navbar-link]').each(function(k, li) {
                        var $li = $(this).find('a'),
                            pattern = $li.attr('href').replace('#','#?'),
                            regexp = new RegExp('^' + pattern + '$', ['i']);

                        if (regexp.test(newValue)) {
                            $(this).addClass('active');
                        } else {
                            $(this).removeClass('active');
                        }
                    });
                });
            }
        };
    }
]);
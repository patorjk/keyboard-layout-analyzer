(function() {

    var duration = 500;
    
    app.animation('page-enter', ['$rootScope', function($rootScope) {
        return { 
            setup : function(element) {
                $(element).css({
                    opacity: '0',
                    /*left: '0px',*/
                    position:'relative'
                }); 
            },
            start : function(element, done, memo) {
                $(element).animate({
                    opacity: 1.0/*,
                    left: '+=50'*/
                }, duration, function() {
                    done();
                });
            }
        };
    }]);

    app.animation('page-leave', ['$rootScope', function($rootScope) {
        return { 
            setup : function(element) {

                var height = $(element).height();
                var width = $(element).width();

                $(element).css({
                    width: width + 'px'
                })

                $(element).css({
                    position:'absolute'
                });
                /*$('#view-container').css({
                    'min-height': height + 'px'
                })*/
            },
            start : function(element, done, memo) {
                $(element).css({
                    opacity:0
                })
                done();
                return;

                $(element).animate({
                    opacity: 0.0, 
                    left:'0px'
                }, duration, function () {
                    $(element).css({
                        display:'none'
                    });
                    $('#view-container').css({
                        'min-height': 'auto'
                    });
                    $(element).find('.input-block-level').each(function() {
                        $(this).css({
                            width: 'auto'
                        })
                    });
                    done();
                });
            }
        };
    }]);

})();
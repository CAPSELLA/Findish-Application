(function() {
    'use strict';
   
    angular
        .module('app.core')
        .factory('appConfig', appConfig);

    appConfig.$inject = [];

    function appConfig() {

        var pageTransitionOpts = [
            {
                name: 'Fade up',
               'class': 'animate-fade-up'
            }, {
                name: 'Scale up',
               'class': 'ainmate-scale-up'
            }, {
                name: 'Slide in from right',
               'class': 'ainmate-slide-in-right'
            }, {
                name: 'Flip Y',
               'class': 'animate-flip-y'
            }
        ];
        var date = new Date();
        var year = date.getFullYear();
        var main = {
            brand: 'Material',
            name: 'Lisa',
            year: year,
            layout: 'wide',                                 // String: 'boxed', 'wide'
            menu: 'vertical',                               // String: 'horizontal', 'vertical'
            isMenuCollapsed: false,                         // Boolean: true, false
            fixedHeader: true,                              // Boolean: true, false
            fixedSidebar: true,                             // Boolean: true, false
            pageTransition: pageTransitionOpts[0],          // Object: 0, 1, 2, 3 and build your own
            skin: '12'                                    // String: 11,12,13,14,15,16; 21,22,23,24,25,26; 31,32,33,34,35,36
        };
        var color = {
            primary:    '#009688',
            success:    '#8BC34A',
            info:       '#00BCD4',
            infoAlt:    '#7E57C2',
            warning:    '#FFCA28',
            danger:     '#F44336',
            text:       '#3D4051',
            gray:       '#EDF0F1'
        };

        return {
            pageTransitionOpts: pageTransitionOpts,
            main: main,
            color: color
        };
    }

})();

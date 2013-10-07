/*global music, $*/


window.music = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    Providers: [],
    Services: [],
    Layout: new Backbone.Layout({
        el: '#main',
        keep: true
    }),
    init: function () {
        'use strict';

        var songsview = new this.Views.SongsView({
            services: this.Services,
            providers: this.Providers
        });

        this.Layout.setViews({
            '#songs': songsview,
            '.pager': songsview.pagination,
            '#player': songsview.player
        }).on('ready', function() {
            Backbone.history.start();
        });

        music.Routers.app = new Backbone.Router({
            routes: {
                '': function() {
                    this.navigate("page/0", {trigger: true, replace: true});
                },
                'page/:n': function(n) {
                    songsview.gotoPage(n);
                },
                'play/:url': function(url) {
                    console.log(url);
                }
            }
        });

        var opts = {
          lines: 9, // The number of lines to draw
          length: 2, // The length of each line
          width: 2, // The line thickness
          radius: 7, // The radius of the inner circle
          corners: 1, // Corner roundness (0..1)
          rotate: 0, // The rotation offset
          direction: 1, // 1: clockwise, -1: counterclockwise
          color: '#2a6496', // #rgb or #rrggbb or array of colors
          speed: 1, // Rounds per second
          trail: 60, // Afterglow percentage
          shadow: false, // Whether to render a shadow
          hwaccel: true, // Whether to use hardware acceleration
          className: 'spinner', // The CSS class to assign to the spinner
          zIndex: 2e9, // The z-index (defaults to 2000000000)
          top: 'auto', // Top position relative to parent in px
          left: 'auto' // Left position relative to parent in px
        };
        var target = document.getElementById('loader');
        var spinner = new Spinner(opts);

        $(document).ajaxStart(function() {
            spinner.spin(target);
        });
        $(document).ajaxComplete(function() {
            spinner.stop();
        });
    }
};

$(document).ready(function () {
    'use strict';
    Backbone.Layout.configure({
        manage: true,
        keep: true
    });
    music.init();
});

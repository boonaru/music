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

        this.Layout.on('ready', function() {
            Backbone.history.start();
            songsview.render();
        });

        this.Layout.setViews({
            '.songs': songsview
        });

        new Backbone.Router({
            routes: {
                '': function() {
                    // songsview.gotoPage(0);
                },
                'page/:n': function(n) {
                    songsview.gotoPage(n);
                }
            }
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

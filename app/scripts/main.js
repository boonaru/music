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
            '.songs': songsview
        }).on('ready', function() {
            Backbone.history.start();
        });

        new Backbone.Router({
            routes: {
                '': function() {
                    this.navigate("page/0", {trigger: true, replace: true});
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

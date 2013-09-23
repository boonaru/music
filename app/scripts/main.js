/*global music, $*/


window.music = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    Providers: [],
    Services: [],
    init: function () {
        'use strict';
        console.log(music.Providers);

        var layout = new Backbone.Layout({
            el: '#main'
        });

        var songsview = new this.Views.SongsView();

        var song_collection, valid_domains = [];
        _.each(this.Services, function(service) {
            valid_domains = _.union(valid_domains, service.domains);
        });
        _.each(this.Providers, function(provider){ 
            song_collection = new music.Collections.SongsCollection();
            _.extend(song_collection, {domains: valid_domains}, provider, {model: music.Models.SongsModel.extend(provider.model)});
            song_collection.fetch({
                success: function(m){
                    songsview.render();
                    song_collection.trigger('ready');
                    console.log(m);
                }
            });
        });

        // var songs = new this.Collections.SongsCollection();
        // songs.fetch({
        //     success: function(collection, response, options) {
        //         songsview.render();
        //         songs.trigger('ready');
        //     }
        // });
        song_collection.on('add', function(m) {
            songsview.insertView(new this.Views.SongView({ model: m }));
        }, this);
        song_collection.on('ready', function() {
            Backbone.history.start();
        });

        layout.setViews({
            '.songs': songsview
        });

        new Backbone.Router({
            routes: {
                '': function() {
                    // songsview.gotoPage(0);

                },
                // 'page/:n': function(n) {
                //     songsview.gotoPage(n);
                // }
            }
        });
    }
};

$(document).ready(function () {
    'use strict';
    Backbone.Layout.configure({
        manage: true
    });
    music.init();
});

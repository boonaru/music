/*global music, $*/


window.music = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    Providers: [],
    Services: [],
    _collections: [], // keep track of collections we create, for debugging purposes
    init: function () {
        'use strict';

        var layout = new Backbone.Layout({
            el: '#main'
        });

        var songsview = new this.Views.SongsView();

        var song_collection, valid_domains = [];
        _.each(this.Services, function(service) {
            valid_domains = _.union(valid_domains, service.domains);
        });
        _.each(this.Providers, function(provider, i) { 
            song_collection = new music.Collections.SongsCollection();
            _.extend(song_collection, {domains: valid_domains}, provider, {model: music.Models.SongsModel.extend(provider.model)});
            song_collection.fetch({
                success: function(m){
                    if (i == music.Providers.length-1)
                        layout.trigger('ready');
                }
            });
            song_collection.on('add', function(m) {
                songsview.insertView(new music.Views.SongView({ model: m }));
            }, this);
            song_collection.on('remove', function(m) {
                songsview.removeView({model: m});
            });
            music._collections.push(song_collection);
        });

        layout.on('ready', function() {
            Backbone.history.start();
            songsview.render();
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

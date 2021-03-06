/*global music, Backbone, JST*/

music.Views = music.Views || {};

(function () {
    'use strict';

    music.Views.SongsView = Backbone.View.extend({
        template: JST['app/scripts/templates/songs.ejs'],
        collections: [],
        songs: [],
        index: 0,
        pagination: new music.Views.SongsPaginationView({
            page: 0
        }),
        player: null,
        initialize: function() {
            var song_collection, valid_domains = [], parent = this;

            // create player
            this.player = new music.Views.PlayerView({services: this.options.services});

            // create list of valid domains to fetch from
            _.each(this.options.services, function(service) {
                valid_domains = _.union(valid_domains, service.domains);
            });

            // fetch songs from providers
            _.each(this.options.providers, function(provider, i) {
                song_collection = new music.Collections.SongsCollection();
                _.extend(song_collection, {domains: valid_domains}, provider, {model: music.Models.SongsModel.extend(provider.model)});

                // fetch
                song_collection.fetch({
                    success: function(m){
                        parent.songs.push.apply(parent.songs, m.models);
                        if (i == parent.options.providers.length-1)
                            music.Layout.trigger('ready');
                    }
                });

                // add
                song_collection.on('add', function(m) {
                    parent.add(new music.Views.SongView({ model: m }));
                    parent.songs.push(m);
                }, this);

                // remove
                song_collection.on('remove', function(m) {
                    parent.remove({model: m});
                    parent.songs.without(m);
                }, this);

                parent.collections.push(song_collection);
            }, this);

            // player events
            this.player.on('refresh', function(){
                this.refresh();
            }, this);
            
            this.player.on('next', function(){
                if (this.index == this.songs.length)
                    return;
                // console.log(this.index);
                var target = this.songs[++this.index];
                console.log(this);
                this.getView({ model: target }).trigger("click");
                target.trigger("play");
                window.location = "#play/" + target.get("url"); // can't use navigate because query params get stripped
            }, this);

            this.player.on('prev', function(){
                if (this.index == 0)
                    return;
                var target = this.songs[--this.index];
                this.views.getView({ model: target }).trigger("click");
                window.location = "#play/" + target.get("url"); // can't use navigate because query params get stripped
            }, this);

            //this.player.play("http://www.youtube.com/watch?v=iZvm9NhRUHk");
        },
        render: function() {
          return this.$el.html(this.template);
        },
        afterRender: function() {
            this.pagination.options.page = this.page;
            this.pagination.render();
        },
        add: function(view) {
          if (this.current++ < this.count) 
            this.insertView(view);
          this.children.push(view);
        },
        remove: function(view) {
            this.children = _.without(this.children, view.model.cid);
            this.removeView(view);
        },
        removeAll: function() {
            this.removeView();
            this.children = [];
        },
        gotoPage: function(n) {
            this.removeView();
            var parent = this;
            var load = function() {
                for (var i = n*parent.count; i < n*parent.count+parent.count; i++)
                    parent.insertView(parent.children[i]);
                parent.page = n;
                parent.render();
            };
            if (n < 0) {
                console.log("Page does not exist.");
                return;
            }
            else if (n*this.count+this.count > this.children.length) {
                $.when.apply($, this.loadMore()).done(function(){
                    load();
                });
            }
            else load();
        },
        loadMore: function() {
            var deferreds = [];
            _.each(this.collections, function(collection){
                // collection.pagination.next_url();
                deferreds.push(collection.fetch());
            })
            return deferreds;
        },
        refresh: function() {
            // TODO
            // clear all collections and child views.
            console.log('refresh');
            music.Routers.app.navigate("page/0", {trigger: true, replace: true});
            _.each(this.collections, function(collection){
                collection.fetch({reset: true});
            });
        },
        tagName: 'table',
        className: 'table table-striped',
        page: 0,
        count: 10,
        current: 0,
        children: [],
        manage: true
    });

})();

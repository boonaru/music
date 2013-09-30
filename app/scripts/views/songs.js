/*global music, Backbone, JST*/

music.Views = music.Views || {};

(function () {
    'use strict';

    var pagination = new music.Views.SongsPaginationView({
        page: 0
    });

    music.Views.SongsView = Backbone.View.extend({
        template: JST['app/scripts/templates/songs.ejs'],
        collections: [],
        initialize: function() {
            var song_collection, valid_domains = [], parent = this;
            _.each(this.options.services, function(service) {
                valid_domains = _.union(valid_domains, service.domains);
            });
            _.each(this.options.providers, function(provider, i) {
                song_collection = new music.Collections.SongsCollection();
                _.extend(song_collection, {domains: valid_domains}, provider, {model: music.Models.SongsModel.extend(provider.model)});
                song_collection.fetch({
                    success: function(m){
                        if (i == parent.options.providers.length-1)
                            music.Layout.trigger('ready');
                    }
                });
                song_collection.on('add', function(m) {
                    parent.add(new music.Views.SongView({ model: m }));
                }, this);
                song_collection.on('remove', function(m) {
                    parent.remove({model: m});
                }, this);
                parent.collections.push(song_collection);
            });
        },
        render: function() {
          return this.$el.html(this.template);
        },
        afterRender: function() {
            pagination.options.page = this.page;
            pagination.render();
            this.$el.after(pagination.$el);
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
            this.page = n;
            this.render();
        },
        loadMore: function() {
            var deferreds = [];
            _.each(this.collections, function(collection){
                collection.pagination.next_url();
                deferreds.push(collection.fetch());
            })
            return deferreds;
        },
        tagName: 'ul',
        page: 0,
        count: 5,
        current: 0,
        children: []
    });

})();

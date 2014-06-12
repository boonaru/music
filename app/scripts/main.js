/*global Music, $*/

Backbone.Layout.configure({
  manage: true,
  keep: true
});

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
  init: function() {
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
    }).render();

    music.Routers.app = new Backbone.Router({
      routes: {
        '': function() {
          this.navigate("explore/page/0", {
            trigger: true,
            replace: true
          });
        },
        'explore': function() {
          this.navigate("explore/page/0", {
            trigger: true,
            replace: true
          });
        },
        'explore/page/:n': function(n) {
          songsview.gotoPage(n);
        }
        /*,
        'play/*url': function(url) {
          console.log(url);
          songsview.player.play(url);
        }*/
      }
    });
    music.Routers.app.route(/play\/(.*)/i, function(url) {
      songsview.player.play(url);
    });
  }
};
$(document).ready(function() {
  'use strict';
  music.init();
});

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
        }
        /*,
        'explore/page/:n': function(n) {
          songsview.gotoPage(n);
        }*/
      }
    });
    music.Routers.app.route(/play\/(.*)/i, function(url) {
      songsview.player.play(url);
    });
    music.Routers.app.route(/(.*)/i, function(path) {
      path = path.split(/\b\/{1}\b/);
      console.log(path);
      var i, updated = false;
      for (i = 0; i < path.length; i++) {
        if (path[i] === "explore") {
          if (path[i + 1] !== "page" || isNaN(path[i + 2])) {
            path.splice(1, 0, "page");
            path.splice(2, 0, "0");
            updated = true;
            i = 2;
          } else if (path[i] === "play") {
            console.log(path[i + 1]);
          }
        }
      }
      if (updated)
        this.navigate(path.join('/'), {
          trigger: true,
          replace: true
        });
    });


  }
};
$(document).ready(function() {
  'use strict';
  music.init();
});

/*global music, Backbone*/

music.Routers = music.Routers || {};

(function () {
    'use strict';

    music.Routers.SongsRouter = Backbone.Router.extend({
      routes: {
        '': 'index'
      },
      index: function() {
        console.log("index");
      }
    });

})();

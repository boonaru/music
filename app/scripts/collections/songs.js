/*global music, Backbone*/

music.Collections = music.Collections || {};

(function () {
  'use strict';

  music.Collections.SongsCollection = Backbone.Collection.extend({
    initialize: function() {

    }
    // url: 'http://reddit.com/r/listentothis.json?jsonp=?',
    // parse: function(response) {
    //   return response.data.children;
    // },
    // at: 0
  });

})();

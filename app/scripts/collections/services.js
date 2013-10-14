/*global music, Backbone*/

music.Collections = music.Collections || {};

(function () {
  'use strict';

  music.Collections.ServicesCollection = Backbone.Collection.extend({
    initialize: function() {

    },
    model: music.Models.ServiceModel
  });

})();
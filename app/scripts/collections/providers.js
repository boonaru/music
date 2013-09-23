/*global music, Backbone*/

music.Collections = music.Collections || {};

(function () {
  'use strict';

  music.Collections.ProvidersCollection = Backbone.Collection.extend({
    initialize: function() {

    },
    model: music.Models.ProviderModel
  });

})();
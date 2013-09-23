/*global music, Backbone, JST*/

music.Views = music.Views || {};

(function () {
    'use strict';

    music.Views.SongView = Backbone.View.extend({
        template: JST['app/scripts/templates/song.ejs'],
        initialize: function() {
        },
        serialize: function() {
            return this.model.toJSON();
        },
        tagName: 'li'
    });

})();

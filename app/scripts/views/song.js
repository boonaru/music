/*global music, Backbone, JST*/

music.Views = music.Views || {};

(function () {
    'use strict';

    music.Views.SongView = Backbone.View.extend({
        template: JST['app/scripts/templates/song.ejs'],
        initialize: function() {
            this.on("play", function() {
                console.log("playing");
            });
        },
        serialize: function() {
            return this.model.toJSON();
        },
        events: {
            "click": "setActive"
        },
        setActive: function() {
            this.$el.addClass("active").siblings("tr").removeClass("active");
        },
        tagName: 'tr'
    });

})();

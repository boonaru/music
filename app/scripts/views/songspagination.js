/*global music, Backbone, JST*/

music.Views = music.Views || {};

(function () {
    'use strict';

    music.Views.SongsPaginationView = Backbone.View.extend({
        template: JST['app/scripts/templates/songspagination.ejs'],
        serialize: function() {
          return {
              page: this.options.page
          };
        },
        render: function() {
          return this.$el.html(this.template(this.options));
        },
    });

})();

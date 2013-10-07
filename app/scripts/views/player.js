/*global music, Backbone, JST*/

music.Views = music.Views || {};

(function () {
    'use strict';

    music.Views.PlayerView = Backbone.View.extend({
      template: JST['app/scripts/templates/player.ejs'],
      initialize: function() {
        this.render();
      },
      afterRender: function() {
        var that = this;

        this.$el.children('#volumeprogress').hover(function(){
          $(this).children('.volumebar').show("slide", { direction: "left" }, 100);
        }, function(){
          $(this).children('.volumebar').hide("slide", { direction: "left" }, 100);
        }).click(function(){
          if ($(this).children('.volumebar').is(':visible'))
            $(this).children('.volumebar').hide("slide", { direction: "left" }, 100);
          else
            $(this).children('.volumebar').show("slide", { direction: "left" }, 100);
        });
        this.$el.children('#timeprogress').children('.progress-container').children('.progress').slider();

        this.$el.find('button.refresh').click(function(){
          that.trigger('refresh');
        })
      },
      manage: true,
      className: 'controls'
    });

})();

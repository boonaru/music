/*global music, Backbone, JST*/

music.Views = music.Views || {};

(function () {
    'use strict';

    music.Views.PlayerView = Backbone.View.extend({
      template: JST['app/scripts/templates/player.ejs'],
      active_service: null,
      initialize: function() {
        _.each(this.options.services, function(service) {
          service.initialize(this);
        }, this);
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
        });
      },
      manage: true,
      className: 'controls',
      play: function(toPlay) {
        if (typeof toPlay == "string") {
          this.playSingle(toPlay);
        }
        else if (typeof toPlay == "array") {
          // _.each(toPlay)
        }
      },
      playSingle: function(url) {
        this.trigger("load", new URI(url));
      }
    });

})();

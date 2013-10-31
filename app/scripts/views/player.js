/*global music, Backbone, JST*/

music.Views = music.Views || {};
var printTime = function(time) {
  var minutes = Math.floor(time / 60);
  if (minutes < 10) minutes = '0'+minutes;
  var seconds = Math.round(time - minutes * 60);
  if (seconds < 10) seconds = '0'+seconds;
  return minutes+":"+seconds;
};

(function () {
    'use strict';

    music.Views.PlayerView = Backbone.View.extend({
      template: JST['app/scripts/templates/player.ejs'],
      active_service: null,
      current: {},
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

        this.on("play", function() {
          $('button.btn.play').removeClass('play').addClass('pause').children('span').removeClass('glyphicon-play').addClass('glyphicon-pause');
        });
        this.on("pause", function() {
          $('button.btn.pause').removeClass('pause').addClass('play').children('span').removeClass('glyphicon-pause').addClass('glyphicon-play');
        });
        this.on("initial_info", function(duration) {
          this.current.duration = duration;
          $('#timeprogress .timetotal').html(printTime(duration));
        });
        this.on("info", function(time, loaded) {
          $('#timeprogress .timecurrent').html(printTime(time));
          var f = time/this.current.duration;
          var $element = $('#timeprogress .progress-bar');
          var position = (f*100*$element.parent('.progress').width())/$element.parent('.progress').width();
          $element.attr('aria-valuenow', f).animate({width: position+'%'}, 0);
          $element.siblings('.ui-slider-handle').css('left', position+'%');
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
        // TODO: what happens when multiple services think they should play the media?
        // i.e. what happens when two or more services have the same domain?
        this.trigger("load", new URI(url));
      }
    });

})();

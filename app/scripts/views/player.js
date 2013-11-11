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
      domains: [],
      current: {},
      initialize: function() {
        var init;
        _.each(this.options.services, function(service) {
          init = true;
          _.each(service.domains, function(domain) {
            if (_.indexOf(this.domains, domain) > -1) {
              console.log("Domain "+domain+" has already been registered.");
              init = false;
              return;
            }
          }, this);
          if (init) {
            this.domains.push.apply(this.domains, service.domains);
            service.initialize(this);
          }
        }, this);
        this.render();
      },
      afterRender: function() {
        var that = this;

        var dir = "left";
        console.log($('#volumeprogress').children('.volumebar .progress').hasClass('vertical'));
        if ($('#volumeprogress').find('.progress').hasClass('vertical')) {
          dir = "top";
          console.log("vertical");
        }
        this.$el.children('#volumeprogress').hover(function(){
          $(this).children('.volumebar').show("slide", { direction: dir }, 100);
        }, function(){
          $(this).children('.volumebar').hide("slide", { direction: dir }, 100);
        }).children('button.volume').click(function(){
          if ($(this).next('.volumebar').is(':visible'))
            $(this).next('.volumebar').hide("slide", { direction: dir }, 100);
          else
            $(this).next('.volumebar').show("slide", { direction: dir }, 100);
        });

        this.$el.children('#timeprogress').children('.progress-container').children('.progress').slider();

        this.$el.find('button.play').click(function(){
          that.trigger('service:play');
        });
        this.$el.find('button.pause').click(function(){
          that.trigger('service:pause');
        });
        this.$el.find('button.refresh').click(function(){
          that.trigger('refresh');
        });

        this.on("play", function() {
          $('button.btn.play').hide().siblings('button.btn.pause').show();
        });
        this.on("pause", function() {
          $('button.btn.pause').hide().siblings('button.btn.play').show();
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

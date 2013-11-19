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

        this.$el.children('#volumeprogress').children('button.volume').click(function(){
          if ($(this).next('.volumebar').is(':visible'))
            $(this).next('.volumebar').animate({ height: "toggle" }, 200);
          else
            $(this).next('.volumebar').animate({ height: "toggle" }, 200);
        });

        this.$el.children('#timeprogress').children('.progress-container').children('.progress').slider({
          range: 'min',
          min: 0,
          max: 100,
          step: .25
        });
        this.$el.children('#volumeprogress').children('.progress-container').children('.progress').slider({
          orientation: 'vertical',
          range: 'max',
          min: 0,
          max: 100,
          value: 100, // needs to be 100 so handle appears at top
          slide: function(event, ui) {
            $(this).slider('value', 100-ui.value);
            console.log($(this).slider('value'));
          }
        });

        this.$el.find('button.play').click(function(){
          that.trigger('service:play');
        });
        this.$el.find('button.pause').click(function(){
          that.trigger('service:pause');
        });
        this.$el.find('button.refresh').click(function(){
          that.trigger('refresh');
        });

        this.$el.find('button.prev').click(function(){
          that.trigger('prev');
        });
        this.$el.find('button.next').click(function(){
          that.trigger('next');
        });

        var interval;
        this.on("play", function() {
          $('button.btn.play').hide().siblings('button.btn.pause').show();
          var that = this;
          interval = setInterval(function() {
            that.trigger('service:info');
          }, 500);
        }, this);
        this.on("pause", function() {
          $('button.btn.pause').hide().siblings('button.btn.play').show();
          clearInterval(interval);
        });
        this.on("initial_info", function(duration) {
          this.current.duration = duration;
          $('#timeprogress .timetotal').html(printTime(duration));
        });
        this.on("info", function(time, loaded) {
          $('#timeprogress .timecurrent').html(printTime(time));
          var f = time/this.current.duration;
          var $element = this.$el.children('#timeprogress').children('.progress-container').children('.progress');
          var position = (f*100*$element.width())/$element.width();
          $element.slider('value', position);
        }, this);
      },
      manage: true,
      className: 'controls',
      play: function(toPlay) {
        if (typeof toPlay == "string") {
          this.playSingle(toPlay);
        }
        else if(typeof toPlay == "object" && toPlay.get("url") != null) {
          this.playSingle(toPlay.get("url"));
        }
        else if (typeof toPlay == "array") {
          // _.each(toPlay)
        }
      },
      playSingle: function(url) {
        // TODO: what happens when multiple services think they should play the media?
        // i.e. what happens when two or more services have the same domain?
        console.log(url);
        this.trigger("load", new URI(url));
      }
    });

})();

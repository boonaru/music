music.Services = music.Services || [];

(function(){
	music.Services.push({
		name: 'YouTube',
		domains: ['youtube.com', 'youtu.be'],
    ytplayer: null,
    pending: "",
    initialize: function(player) {
      player.on("load", function(url) {
        if (_.indexOf(this.domains, url.domain()) > -1) {
          console.log('playing '+url.domain());
          this.play(url);
        }
      }, this);
      player.on("service:play", function() {
        this.ytplayer.playVideo();
      }, this);
      player.on("service:pause", function() {
        this.ytplayer.pauseVideo();
      }, this);

      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      var that = this;
      window.onYouTubeIframeAPIReady = function() {
        that.ytplayer = new YT.Player('playervideo', {
          playerVars: {
            modestbranding: 1,
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            rel: 0,
            showinfo: 0,
            enablejsapi: 1,
          },
          height: '390',
          width: '640',
          //videoId: 'M7lc1UVf-VE',
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      };

      window.onPlayerReady = function(event) {
        if (that.pending !== "") {
          event.target.loadVideoById(that.pending);
          event.target.stopVideo();
          pending = "";
        }
      };

      var done = false, timeout;
      window.onPlayerStateChange = function(event) {
        switch (event.data) {
          case YT.PlayerState.PLAYING:
            player.trigger("initial_info", event.target.getDuration());
            timeout = setInterval(function() {
              player.trigger("info", event.target.getCurrentTime());
            }, 100);
            player.trigger("play");
            break;
          case YT.PlayerState.PAUSED:
            console.log("pause");
            player.trigger("pause");
            clearInterval(timeout);
            break;
          // TODO: more states, trigger player
        }
        //event.target.stopVideo();
        // if (event.data == YT.PlayerState.PLAYING && !done) {
        //   setTimeout(stopVideo, 6000);
        //   done = true;
        // }
      };
    },
    load: function(id) {
      if (typeof id === "string") {
        if (this.ytplayer === null) {
          this.pending = id;
        } else {
          this.ytplayer.loadVideoById(id);
          this.ytplayer.playVideo();
        }
        return;
      }
    },
    play: function(str) {
      // str should be either the video id, url, or a URI object
      if (typeof str === "string") {
        if (str.indexOf("http") === -1) {
          return this.load(str);
        }
        else
          return this.play(new URI(str));
      } else if (typeof str === "object" && typeof str.query === "function") {
        if (str.domain() == this.domains[1]) {
          return this.play(str.path().replace('/', ''));
        }
        else {
          var query = str.query().split('&');
          _.each(query, function(q) {
            if (new RegExp("v=").test(q))
              return this.play(q.replace("v=", ""));
          }, this);
        }
      }
    },
    pause: function() {

    },
    next: function() {

    },
    previous: function() {

    },
	});
})();
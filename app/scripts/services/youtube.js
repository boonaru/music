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
          this.play(url);
        }
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
        //event.target.loadVideoById("mEGW1Xe9p14");
      };

      var done = false;
      window.onPlayerStateChange = function(event) {
        //event.target.stopVideo();
        // if (event.data == YT.PlayerState.PLAYING && !done) {
        //   setTimeout(stopVideo, 6000);
        //   done = true;
        // }
      };
    },
    load: function(id) {
      if (typeof id === "string") {
        console.log(id);
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
        console.log(str.indexOf("http"));
        if (str.indexOf("http") === -1) {
          return this.load(str);
        }
        else
          return this.play(new URI(str));
      } else if (typeof str === "object" && typeof str.query === "function") {
        var query = str.query();
        query = query.split('&');
        _.each(query, function(q) {
          console.log(q);
          if (new RegExp("v=").test(q))
            return this.play(q.replace("v=", ""));
        }, this);
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
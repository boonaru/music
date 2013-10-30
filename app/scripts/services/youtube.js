music.Services = music.Services || [];

(function(){
	music.Services.push({
		name: 'YouTube',
		domains: ['youtube.com', 'youtu.be'],
    ytplayer: null,
    pending: "",
    initialize: function() {
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var that = this;
      window.onYouTubeIframeAPIReady = function() {
        this.ytplayer = new YT.Player('playervideo', {
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
      }

      window.onPlayerReady = function(event) {
        if (this.pending !== "") {
          console.log('pending: '+this.pending);
          event.target.loadVideoById(this.pending);
          event.target.playVideo();
        }
        //event.target.loadVideoById("mEGW1Xe9p14");
      }

      var done = false;
      window.onPlayerStateChange = function(event) {
        //event.target.stopVideo();
        // if (event.data == YT.PlayerState.PLAYING && !done) {
        //   setTimeout(stopVideo, 6000);
        //   done = true;
        // }
      }
      function stopVideo() {
        player.stopVideo();
      }
    },
    load: function(id) {
      if (typeof id === "string") {
        console.log('1: '+id);
        console.log(typeof this.ytplayer);
        console.log(this.ytplayer);
        if (this.ytplayer === null) {
          console.log('set pending to '+id);
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
        var q = str.query();
        if (new RegExp("v=").test(q))
          return this.play(str.query().replace("v=", ""));
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
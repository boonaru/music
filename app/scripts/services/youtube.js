music.Services = music.Services || [];

(function(){
	music.Services.push({
		name: 'YouTube',
		domains: ['youtube.com', 'youtu.be'],
    initialize: function() {
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var ytplayer;
      window.onYouTubeIframeAPIReady = function() {
        ytplayer = new YT.Player('playervideo', {
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
        event.target.loadVideoById("mEGW1Xe9p14");
      }

      var done = false;
      window.onPlayerStateChange = function(event) {
        event.target.stopVideo();
        // if (event.data == YT.PlayerState.PLAYING && !done) {
        //   setTimeout(stopVideo, 6000);
        //   done = true;
        // }
      }
      function stopVideo() {
        player.stopVideo();
      }
    },
    play: function() {

    },
    pause: function() {

    },
    next: function() {

    },
    previous: function() {

    },
	});
})();
music.Providers = music.Providers || [];

(function(){
	music.Providers.push({
		name: 'Reddit - ListenToThis',
		url: 'http://reddit.com/r/listentothis.json?jsonp=?',
		parse: function(response) {
	      return response.data.children;
	    },
	    model: {
	    	parse: function(model) {
			  return model.data;
			}
	    }
	})
})();
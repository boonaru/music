music.Providers = music.Providers || [];

(function(){
	music.Providers.push({
		name: 'Reddit - ListenToThis',
		url: 'http://reddit.com/r/listentothis.json?jsonp=?',
		parse: function(response) {
      var o = response.data.children;
      var domains = this.domains;
      return _.filter(o, function(item){
        return _.indexOf(domains, item.data.domain) > -1;
      });
    },
    model: {
    	parse: function(model) {
    	  return {
          title: model.data.title,
          domain: model.data.domain,
          raw: model.data
        };
			}
    },
	})
})();
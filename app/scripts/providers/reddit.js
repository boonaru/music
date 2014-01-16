music.Providers = music.Providers || [];

(function(){
  var reddit = {
    name: 'Reddit',
    options: {
      count: 50,
      subreddits: ['listentothis', 'music']
    }
  };
  reddit.pagination = {
    first_item: null,
    last_item: null,
    update: function(first, last) {
      this.first_item = first;
      this.last_item = last;
    }
  };
  reddit.url = function(previous){
  	if (reddit.options.subreddits.length <= 0) {
  		console.log("At least one subreddit needs to be defined.");
  		return;
  	}
  	if (reddit.options.count <= 0) {
  		console.log("Invalid count specified.");
  		return;
  	}

  	var url = 'http://reddit.com/r/'+reddit.options.subreddits.join('+')+'.json?jsonp=?&count='+reddit.options.count;
  	// var url = '/listentothis.json';
    if (previous && reddit.pagination.first_item != null)
  		url += "&before="+reddit.pagination.first_item;
  	else if (reddit.pagination.last_item != null)
  		url += "&after="+reddit.pagination.last_item;
  	return url;
  }
  reddit.parse = function(response) {
    var o = response.data.children, domains = this.domains;
    // Only return results which a service can use, i.e. a result with a valid service domain.
    o = _.filter(o, function(item){
      return _.indexOf(domains, item.data.domain) > -1;
    });
    reddit.pagination.update(_.first(o).data.name, _.last(o).data.name);
    return o;
  };
  reddit.model = {
    parse: function(model) {
      return {
        title: model.data.title,
        domain: model.data.domain,
        url: model.data.url,
        raw: model.data
      };
    }
  };
	music.Providers.push(reddit);
})();
music.Providers = music.Providers || [];

(function(){
  var reddit = {
    name: 'Reddit',
    options: {
      count: 25,
      subreddits: ['listentothis', 'music']
    }
  };
  reddit.url = 'http://reddit.com/r/'+reddit.options.subreddits.join('+')+'.json?jsonp=?&count='+reddit.options.count;
  reddit.pagination = {
    first_item: null,
    last_item: null,
    prev_url: function() {
      reddit.url = reddit.url+'&before='+this.first_item;
    },
    next_url: function() {
      reddit.url = reddit.url+'&after='+this.last_item;
    },
    update: function(first, last) {
      this.first_item = first;
      this.last_item = last;
    }
  };
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
        raw: model.data
      };
    }
  };
	music.Providers.push(reddit);
})();
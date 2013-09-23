/*global music, Backbone, JST*/

music.Views = music.Views || {};

(function () {
    'use strict';

    music.Views.SongsView = Backbone.View.extend({
        template: JST['app/scripts/templates/songs.ejs'],
        initialize: function() {
          
        },
        render: function() {
          return this.$el.html(this.template);
        },
        afterRender: function() {
            // var pagination = $('.pagination');
            // if (pagination.length == 0) {
            //     pagination = $('<div/>', {class: 'pagination'});
            // }
            // pagination.html('<a href="/#page/'+(1*this.page-1)+'">Prev</a> | <a href="/#page/'+(1*this.page+1)+'">Next</a>');

            // var pagination = new music.Views.SongsPaginationView({
            //     page: this.page
            // });
            // pagination.render();
            // this.$el.after(pagination.$el);
        },
        // add: function(view) {
        //   // if (this.current++ < this.count) 
        //   //   this.insertView(view);
        //   this.children.push(view);
        // },
        // gotoPage: function(n) {
        //     this.removeView();
        //     if (n*this.count > this.children.length || n < 0) {
        //         console.log("Page does not exist.");
        //         return;
        //     }
        //     for (var i = n*this.count; i < n*this.count+this.count; i++) {
        //         // console.log(i);
        //         this.insertView(this.children[i]);
        //     }
        //     this.page = n;
        //     this.render();
        // },
        tagName: 'ul',
        // page: 0,
        // count: 5,
        // current: 0,
        // children: []
    });

})();

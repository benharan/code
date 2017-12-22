/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "utils",
    "./models/mainFrame/mainFrame"
], function (_, $, Backbone, utils) {
    var debug = function() { if (1) debugger; },
        innerEventBus = _.extend({}, Backbone.Events);

    return Backbone.Model.extend({
        trigNav: function (section, p1, p2) {
            this.trigger('navigation', section, p1, p2);
        },

        initialize: function () {
            var triggerNavigation = this.trigNav.bind(this),
                RouterClass = Backbone.Router.extend({
                    routes: {
                        '': 'index',
                        'news/:category/:article': 'news',
                        'indices/:instrument': 'indices'
                    },
                    index: function(){
                        triggerNavigation('index');
                    },
                    news: function(category, article){
                        triggerNavigation('news', category, article);
                    },
                    indices: function(indices){
                        triggerNavigation('indices', indices);
                    }
                });

            window.App.Router = new RouterClass();

            $(document).on("click", "a[href]:not([data-bypass])", function(evt) {
                var href = { prop: $(this).prop("href"), attr: $(this).attr("href") },
                    root = location.protocol + "//" + location.host + App.root;

                if (href.prop.slice(0, root.length) === root) { // Inner link
                    evt.preventDefault();
                    window.App.Router.navigate(href.attr, { trigger: true });
                }
            });
            return this;
        }
    })
});

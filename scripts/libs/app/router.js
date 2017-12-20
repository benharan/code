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
        trigNav: function (p1, p2, p3) {
            this.trigger('navigation', p1, p2, p3);
        },

        initialize: function () {
            var triggerNavigation = this.trigNav.bind(this),
                RouterClass = Backbone.Router.extend({
                    routes: {
                        '': 'index',
                        'news/:category/:article': 'news'
                    },
                    index: function(){
                        triggerNavigation('index');
                    },
                    news: function(category, article){
                        triggerNavigation('news', category, article);
                    }
                });

            window.App.Router = new RouterClass();

            $(document).on("click", "a[href]:not([data-bypass])", function(evt) {
                var href = { prop: $(this).prop("href"), attr: $(this).attr("href") },
                    root = location.protocol + "//" + location.host + App.root;

                // Ensure the root is part of the anchor href, meaning it's relative.
                if (href.prop.slice(0, root.length) === root) {
                    evt.preventDefault();
                    window.App.Router.navigate(href.attr, { trigger: true });
                }
            });
            return this;
        }
    })
});

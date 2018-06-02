/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "Modules/mainFrame/mainFrame"
], function (_, $, Backbone) {
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
                        'indices/:instrument': 'indices',
                        'portfolio/(:pId)': 'portfolio'
                    },
                    index: function(){
                        triggerNavigation('index');
                    },
                    news: function(category, article){
                        triggerNavigation('news', category, article);
                    },
                    indices: function(indices){
                        triggerNavigation('indices', indices);
                    },
                    portfolio: function(portfolioId){
                        triggerNavigation('portfolio', portfolioId);
                    }
                });

            window.InvestingApp.Router = new RouterClass();

			// window.InvestingApp.Router.on('route', () => {debugger;});

            $(document).on("click", "a[href]:not([data-bypass])", function(evt) {
                var href = { prop: $(this).prop("href"), attr: $(this).attr("href") },
                    root = location.protocol + "//" + location.host + window.InvestingApp.root;

                if (href.prop.slice(0, root.length) === root) { // Inner link
                    evt.preventDefault();
                    window.InvestingApp.Router.navigate(href.attr, { trigger: true });
                }
            });
            return this;
        }
    })
});

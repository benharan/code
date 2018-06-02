/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
	"Modules/tabs/tabs",
	"Modules/tab/portfolioTab",
	"Modules/portfolio/portfolio",
	"./portfoliosView"
], function (_, $, Backbone, Tabs, PortfolioTab, Portfolio, View) {
	return Backbone.Model.extend({

		initialize: function (pId) {
			this._reset(pId);
			this._view = new View();
			this._portfolioTabs = new Tabs(PortfolioTab);
			this._nameToId = {};
			_.each(window.serverData.portfolios, portfolioObj => {
				this._portfolios[portfolioObj.id] = new Portfolio(portfolioObj.name);
				this._portfolioTabs.addTab(portfolioObj.name, portfolioObj);
				this._nameToId[portfolioObj.name] = portfolioObj.id;
				this._order.push(portfolioObj.id);
			})
			this._portfolioTabs.on('tabSelected', this._loadPortfolio.bind(this))
		},

		render: function () {
			const lId = this._currentsId || this._order[0],
				loadedPortfolio = this._portfolios[lId];

			this._currentsId = lId;

			return this._view.render({
				$tabs: this._portfolioTabs.render(loadedPortfolio.getName()),
				$portfolio: loadedPortfolio.render()
			});
		},

		_loadPortfolio: function (pName) {
			const pId = this._nameToId[pName];
			this._currentsId = pId;
			this._view.loadPortfolio(this._portfolios[pId].render());

			window.InvestingApp.Router.navigate(`portfolio/${pId}`, { trigger: true });
		},

		_reset: function (pId) {
			this._portfolios = {};
			this._order = [];
			this._currentsId = pId;
		}
	})
});

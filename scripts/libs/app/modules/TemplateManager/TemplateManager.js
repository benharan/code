/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"underscore",
	"jquery",
	"Backbone",
	"Toolset/toolset",
	"text!./scheme1.json"
], function (_, $, Backbone, Toolset, scheme1) {

	let lcl = 0 ? cl : $.noop,
		scheme = JSON.parse(scheme1),
		views = {},
		data = {};

	function loadView(name, fullPath) {
		if (!views[name]) { // ToDo: Implement view fetching
			views[name] = fullPath;
		}
	}
	function loadData(name, dataObj) {
		if (!data[name]) { // ToDo: Implement view fetching
			data[name] = dataObj;
		}
	}

	return Backbone.Model.extend({
		initialize: function () {
			this._processor = new Toolset.TemplateCompiler();

			this.recursivelyLoadTemplates(scheme);
			cl(views);
			cl('@@@@');
			cl(data);
		},

		recursivelyLoadTemplates: function (templatesObj) {
			_.each(templatesObj, (templateDefinition, templateName) => {
				let { viewPath: path, view: viewName, nested = null, vars } = templateDefinition;

				lcl(`Doing ${templateName}`, templateDefinition);

				loadView(templateName, path + viewName);
				loadData(templateName, vars);

				nested && this.recursivelyLoadTemplates(nested);
			})
		}
	})
});

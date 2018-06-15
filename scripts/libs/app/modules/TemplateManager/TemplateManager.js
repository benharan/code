/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"underscore",
	"jquery",
	"Backbone",
	"Toolset/toolset",
	"Modules/DependencyLoader/DependencyLoader",
	"text!./views1.json"
], function (_, $, Backbone, Toolset, DependencyLoader, views1) {

	let lcl = 0 ? cl : $.noop,
		viewsMockup = JSON.parse(views1),
		data = {},
		promiseCollection = [],
		templateLoader = new DependencyLoader(),
		templateCompiler = new Toolset.TemplateCompiler(),
		templateManager;

	function fetchView(templateName, fullPath) {
		let tO = 100 * Math.random();
		return new Promise(resolve => {
			setTimeout(()=>{
				lcl(`Resolved after ${tO} ms`);
				resolve({ templateName, content: viewsMockup[fullPath] });
			}, tO)
		})
	}

	function addToRender(templateName, parentName, dataObj) {
		if (!data[templateName]) {
			data[templateName] = dataObj;
		}
	}

	function adaptDataObj(dataObj, extensionData) {
		return _.extend(_.reduce(dataObj.templateData, (acc, value, key) => {
			acc['$' + key] = value;
			return acc;
		}, {}), extensionData);
	}

	function isLoaded(templateName) {
		return !!templateLoader.get(templateName);
	}

	function templateValidation(templateName, content) {
		if (!content || !content.trim()) {
			throwError('Bad Template Content', templateName, content);
		}
	}

	function loadTemplate({ templateName, content = '' }) {
		templateValidation(templateName, content); // You shall not pass!
		let { deps, compiledContent } = templateCompiler.compile(content);

		templateLoader.load(templateName, deps, compiledContent);
		lcl('Compiled and loaded ', templateName);
		return this;
	}

	function attachToNestedData(result, templateName, renderedTemplate) {
		if (!result['$nestedData']) {
			result['$nestedData'] = {};
		}
		result['$nestedData'][templateName] = renderedTemplate;
	}

	templateManager = Backbone.Model.extend({
		initialize: function () {
			const lsTemplates = this._loadFromLS();

			if (lsTemplates) { // Import compiled templates from localStorage
				templateLoader.import(lsTemplates);
				lcl('Imported ', lsTemplates);
			}
		},

		recursivelyLoadScheme: function (templatesObj, dataContainer) {
			_.each(templatesObj, (templateDefinition, templateName) => {
				let { viewPath: path = '', view: viewName = '', nested = null, vars: templateData } = templateDefinition;

				if (!isLoaded(templateName)) {
					promiseCollection.push(fetchView(templateName, path + viewName));
				}

				dataContainer[templateName] = { templateData };

				if (nested) {
					dataContainer[templateName].nestedData = {};
					this.recursivelyLoadScheme(nested, dataContainer[templateName].nestedData);
				}
			})
		},

		// If needed, Recursively: fetch views, compile, save
		_loadScheme: function (schemeParam) {
			data = {};
			this.recursivelyLoadScheme(schemeParam, data); // Init according to scheme, loading what's not loaded

			return new Promise(resolve => {
				// Need to fetch views and finish asynchly
				if (_.isntEmpty(promiseCollection)) {
					Promise.all(promiseCollection).then(values => {
						lcl('Finished promises, loading', values);
						_.each(values, loadTemplate);
						this._saveToLS();
						resolve();
					});
				} else { // All needed templates already loaded, finish synchronously
					resolve();
				}
			})
		},

		// Attempt to load any unloaded templates, then recursively render
		render: function (schemeObj) {
			return new Promise(resolve => {
				this._loadScheme(schemeObj).then(() => {
					let res = _.reduce(this._recursivelyRenderTemplates(data).$nestedData,
						(acc, viewText) => acc + viewText, '');

					resolve(res);
				})
			})
		},

		_recursivelyRenderTemplates: function (dataObj) {
			var result = {};
			_.each(dataObj, (templateData, templateName) => {
				let templateObj = templateLoader.get(templateName),
					templateFunction = _.template(templateObj.definition),
					renderedTemplate, nestedData = {};

				if (_.isntEmpty(templateObj.deps)) {
					nestedData = this._recursivelyRenderTemplates(templateData.nestedData);
				}

				renderedTemplate = templateFunction(adaptDataObj(templateData, nestedData));
				attachToNestedData(result, templateName, renderedTemplate);
			})
			return result;
		},

		_saveToLS: function () {
			localStorage.setItem('templates', templateLoader.export());
		},

		_loadFromLS: function () {
			return localStorage.getItem('templates');
		}
	})

	return new templateManager();
});

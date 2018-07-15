/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"underscore",
	"jquery",
	"Backbone",
	"Toolset/Toolset",
	"EventBus",
	"Modules/DependencyLoader/DependencyLoader",
	"text!Modules/TemplateManager/_views1.json"
], function (_, $, Backbone, Toolset, EventBus, DependencyLoader, _views1) {

	let disableCache = 0,
		data = {},
		pendingTemplates = {},
		promiseCollection = [],
		freeToLazyLoad = true,
		viewsMockup = JSON.parse(_views1),
		templateLoader = new DependencyLoader(),
		templateManager,
		requestViewFromServer = _.memoize((fullPath) => {
			lcl(`Requesting View Resource '${fullPath}'`);
			return viewsMockup[fullPath];
		});

	disableCache && lcl('Template Cache Disabled');

	function fetchView(templateName, fullPath) {
		let tO = parseInt(100 * Math.random());
		freeToLazyLoad = false;
		return new Promise(resolve => {
			setTimeout(()=>{
				lcl(`Resolved after ${tO} ms`);
				// Memoized so saves server calls but need to avoid recompilation
				// Tricky since if you mark it as duplicate you need to compile the
				// other one first (as dependency)
				//     *** Solved when detached compilation ***
				resolve({ templateName, content: requestViewFromServer(fullPath) });
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

	function getLoadedTemplate(templateName) {
		return templateLoader.get(templateName);
	}

	window.InvestingApp.TemplateAccess = {
		isTemplateLoaded: isLoaded,
		getTemplate: getLoadedTemplate
	}


	function validateContent(templateName, content) {
		if (!content || !content.trim()) {
			throwError('Bad Template Content', templateName, content);
		}
	}

	function validateRecursiveDep(templateName, deps) {
		if (~deps.indexOf(templateName)) {
			throwError('Recursive Template Dependency', templateName, deps);
		}
	}

	function validateCompiledContent(templateName, compiledContent) {
		if (!compiledContent.trim()) {
			throwError('Major Template Error - Zerostring Output', templateName, compiledContent);
		}
	}

	function loadTemplate({ templateName, content = '' }) {
		validateContent(templateName, content); // You shall not pass!
		templateLoader.load(templateName, [], content);
		lcl('Loaded ', templateName);
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

			EventBus.on('dropTemplates', () => templateLoader.drop());
			EventBus.on('loadTemplate', this.loadTemplate.bind(this));

			if (lsTemplates) { // Import compiled templates from localStorage
				templateLoader.import(lsTemplates);
				0 && lcl('Imported ', lsTemplates);
			}
		},

		loadTemplate: function (templateName, path) {
			if (freeToLazyLoad) {
				if (!isLoaded(templateName)) {
					fetchView(templateName, path)
						.then(loadTemplate)
						.then(this._saveToLS)
						.then(this._attemptPending)
				}
			} else {
				pendingTemplates[templateName] = path;
			}
		},

		_recursivelyLoadScheme: function (templatesObj, dataContainer) {
			_.each(templatesObj, (templateDefinition, templateName) => {
				let { viewPath: path = '', view: viewName = '', nested = null, vars: templateData } = templateDefinition;

				if (!isLoaded(templateName)) {
					promiseCollection.push(fetchView(templateName, path + viewName));
				}

				dataContainer[templateName] = { templateData };

				if (nested) {
					dataContainer[templateName].nestedData = {};
					this._recursivelyLoadScheme(nested, dataContainer[templateName].nestedData);
				}
			})
		},

		// If needed, Recursively: fetch views, compile, save
		_loadScheme: function (schemeParam) {
			data = {};
			promiseCollection = [];
			this._recursivelyLoadScheme(schemeParam, data); // Init according to scheme, loading what's not loaded

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
					renderTemplate = _.template(templateObj.definition),
					adaptedDataObj, renderedTemplate, nestedData = {};

				if (templateData.nestedData) { // Rely on scheme, forgo deps
					nestedData = this._recursivelyRenderTemplates(templateData.nestedData);
				}

				adaptedDataObj = adaptDataObj(templateData, nestedData);
				renderedTemplate = renderTemplate(adaptedDataObj);
				attachToNestedData(result, templateName, renderedTemplate);
			})
			return result;
		},

		_attemptPending: function () {
			const templateNameIfAny = _.keys(pendingTemplates)[0];
			freeToLazyLoad = true;
			if (templateNameIfAny) {
				const path = pendingTemplates[templateNameIfAny];
				delete pendingTemplates[templateNameIfAny];
				this.loadTemplate(templateNameIfAny, path);
			}
		},

		_saveToLS: function () {
			if (!disableCache) {
				Toolset.ClientStorage.setVal('templates', templateLoader.export());
			}
		},

		_loadFromLS: function () {
			let result;
			if (!disableCache) {
				result = Toolset.ClientStorage.getVal('templates');
			}
			return result;
		}
	})

	return new templateManager();
});

/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"underscore",
	"jquery",
	"Backbone",
	"Toolset/toolset",
	"EventBus",
	"Modules/DependencyLoader/DependencyLoader",
	"text!./views1.json"
], function (_, $, Backbone, Toolset, EventBus, DependencyLoader, views1) {

	let useCompression = 1,
		viewsMockup = JSON.parse(views1),
		data = {},
		freeToLazyLoad = true,
		pendingTemplates = {},
		promiseCollection = [],
		templateLoader = new DependencyLoader(),
		templateCompiler = new Toolset.TemplateCompiler(),
		templateManager,
		requestViewFromServer = _.memoize((fullPath) => {
			lcl(`Requesting View Resource '${fullPath}'`);
			return viewsMockup[fullPath];
		});


	function fetchView(templateName, fullPath) {
		let tO = parseInt(100 * Math.random());
		freeToLazyLoad = false;
		return new Promise(resolve => {
			setTimeout(()=>{
				lcl(`Resolved after ${tO} ms`);
				// Memoized so saves server calls but need to avoid recompilation
				// Tricky since if you mark it as duplicate you need to compile the
				// other one first (as dependency)
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

	function loadTemplate({ templateName, content = '' }) {
		validateContent(templateName, content); // You shall not pass!
		let { deps, compiledContent } = templateCompiler.compile(content);
		validateRecursiveDep(templateName, deps);
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

				if (_.isntEmpty(templateObj.deps)) {
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
			const input = templateLoader.export(),
				_input_ = useCompression ? LZString.compress(input) : input;

			lcl(`Compression Stats\nBefore: ${input.length}\nAfter: ${_input_.length}\nRatio: ${_input_.length/input.length}`);

			localStorage.setItem('templates', _input_);
		},

		_loadFromLS: function () {
			const storedValue = localStorage.getItem('templates');
			return useCompression ? LZString.decompress(storedValue) : storedValue;
		}
	})

	return new templateManager();
});

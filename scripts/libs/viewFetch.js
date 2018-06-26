

define({
	load: function (name, req, onload, config) {
		//req has the same API as require().
		const [,chewed] = name.match(/([^\/]+)\.html/);
		if (window.InvestingApp && window.InvestingApp.TemplateAccess && window.InvestingApp.TemplateAccess.isTemplateLoaded(chewed)) {
			lcl('Fetched template already loaded, returning stored compile');
			onload(window.InvestingApp.TemplateAccess.getTemplate(chewed));
		} else {
			req(['text!' + name], function (value) {
				console.log('Loaded', name);
				onload(value);
			});
		}
	}
});
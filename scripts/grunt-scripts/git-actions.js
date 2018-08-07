(() => {
	const
		_ = require('../libs/underscore'),
		_git_status_ = 'git status',
		{exec} = require('child_process'),
		// javascriptAssetModifiedRow = /^\s*modified:\s*site\/public_html\/cdn\/(new_js|js)\/([^/]+)\/[\w\./\-]+\.js$/i,
		javascriptAssetModifiedRow = /^\s*modified:\s*scripts\/libs\/app\/(modules)\/([^/]+)\/[\w\./\-]+\.js$/i,
		git = {
			getModifiedScripts: function () {
				return new Promise((res, rej) => {
					let result = {};

					exec(_git_status_, (err, stdout) => {
						stdout.split('\n').forEach(row => {
							let [, assetType, assetFolder] = row.match(javascriptAssetModifiedRow) || [];
							if (assetType) {
								if (!result[assetType]) result[assetType] = {};
								result[assetType][assetFolder] = true;
							}
						})
						res(result);
					})
				})
			}
		}

	module.exports = git;
})()
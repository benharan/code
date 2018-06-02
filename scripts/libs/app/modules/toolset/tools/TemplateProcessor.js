/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"Toolset/tools/RecursiveLoader"
], function (RecursiveLoader) {
	return function () {
		var templateLoader = new RecursiveLoader();

		function StringAccumulator() {
			var result = [];
			return {
				add: function (str) {
					result.push(str);
					return this;
				},
				get: function () {
					return result.join('');
				}
			}
		}

		function testInjectionSyntax(text) {
			return text.match(/^\s*\$this\s*->\s*render\(\s*'([\s\w]+)'\s*\)\s*;?/);
		}

		function trimWrappers(text) {
			return text.substr(2, text.length - 4).trim();
		}

		function getAllIndices(needle, haystack) {
			var result = [], i = -1;
			while (~(i = haystack.indexOf(needle, i+1))) { result.push(i); }
			return result;
		}

		function chewChunk(chunk, resultPayload) {
			var result = trimWrappers(chunk),
				injection = testInjectionSyntax(result);

			if (injection) {
				result = `=$views.${injection[1]}`
				resultPayload.deps.push(injection[1]);
			}

			return `<%${result}%>`;
		}

		function processTemplate(templateString) {
			var result = { deps: [] }, resultText = new StringAccumulator(), lastHandledIndex = 0, closingIndex;
			getAllIndices('<?', templateString).forEach(function(openingIndex) {
				resultText.add(templateString.substr(lastHandledIndex, openingIndex - lastHandledIndex)); // Store all until current opening
				closingIndex = templateString.indexOf('?>', openingIndex);
				resultText.add(chewChunk(templateString.substr(openingIndex, closingIndex - openingIndex + 2), result));
				lastHandledIndex = closingIndex + 2;
			});
			result.text = resultText.add(templateString.substr(lastHandledIndex)).get();
			return result;
		}

		function loadTemplate(name, content) {
			var processedResult = processTemplate(content);
			templateLoader.load(name, processedResult.deps, processedResult.text);
			return this;
		}

		function getTemplate(name) {
			return templateLoader.getLoaded(name);
		}

		this.loadTemplate = loadTemplate;
		this.getTemplate = getTemplate;
	}
});

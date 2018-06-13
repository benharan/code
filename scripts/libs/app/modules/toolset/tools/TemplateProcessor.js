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
			return text.match(/^\s*\$this\s*->\s*renderNested\(\s*'([\s\w]+)'\s*\)\s*;?/);
		}

		function trimWrappers(text) {
			return text.replace(/\<\?\s*(php)?\s*|\s*\?\>/g, '');
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
				result = `=$views.${injection[1]}; `
				resultPayload.deps.push(injection[1]);
			}

			return `<%${result}%>`;
		}

		function compileTemplate(templateString) {
			var result = { deps: [] }, resultText = new StringAccumulator(), lastHandledIndex = 0, nextEnd, closingIndex, totalLength = templateString.length;
			getAllIndices('<?', templateString).forEach(function(openingIndex) {
				resultText.add(templateString.substr(lastHandledIndex, openingIndex - lastHandledIndex)); // Store all until current opening
				closingIndex = templateString.indexOf('?>', openingIndex);
				nextEnd = ~closingIndex ? closingIndex + 2 : undefined;
				resultText.add(chewChunk(templateString.substring(openingIndex, nextEnd), result));
				lastHandledIndex = closingIndex + 2;
			});
			if (nextEnd > totalLength) { // If anything remains after
				resultText.add(templateString.substr(lastHandledIndex));
			}
			result.text = resultText.get();
			return result;
		}

		function loadTemplate(name, content) {
			if (content && content.trim()) {
				let processedResult = compileTemplate(content);
				templateLoader.load(name, processedResult.deps, processedResult.text);
			} else {
				throwError('Bad Template Content', content);
			}
			return this;
		}

		function getTemplate(name) {
			return templateLoader.getLoaded(name);
		}

		this.loadTemplate = loadTemplate;
		this.getTemplate = getTemplate;
	}
});

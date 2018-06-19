/**
 * Created by Skeksify on 09/07/2016.
 */

define([

], function () {
	return function () {
		let scopeParsingInProcess = false;

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

		function getAllIndices(needle, haystack) {
			var result = [], i = -1;
			while (~(i = haystack.indexOf(needle, i+1))) { result.push(i); }
			return result;
		}

		function trimWrappers(input) {
			return input.replace(/\<\?\s*(php)?\s*|;?\s*\?\>/g, '');
		}

		function matchPrint(input) {
			let result, [, variableName] = input.match(/^\s*=\$(\w+);?/) || [];
			if (variableName) {
				result = input;
			}
			return result;
		}

		function matchInjection(input, resultPayload) {
			let result, [,, nestedTemplateName] = input.match(/^\s*\$this\s*->\s*render(Nested)?\(\s*'([\s\w]+)'\s*\)\s*;?/i) || [];
			if (nestedTemplateName) {
				scopeParsingInProcess && announceWarn('Template Parsing Error', 'Nested Templates detected inside iteration scope, currently not supported');
				result = `=$nestedData.${nestedTemplateName} `;
				resultPayload.deps.push(nestedTemplateName);
			}
			return result;
		}

		function matchIteration(input) {
			let result, [, collection, valueOrKey,, value] = input.match(/^\s*foreach\s*\(\s*\$(\w+)\s+as\s+\$(\w+)\s*(=>\s*\$(\w+)\s*)?\)\s*\{/i) || [];

			if (collection) {
				result = `_.each($${collection}, function($${!value ? valueOrKey : value}${value ? `, $${valueOrKey}` : ''}) {`;
				scopeParsingInProcess = true;
			}
			return result;
		}

		function matchScopeEnd(input) {
			let result, matchResult = input.match(/^\s*}\s*/)

			if (matchResult) {
				result = '});';
				!scopeParsingInProcess && announceWarn('Template Parsing Error', 'Scope end detected before scope beginning');
				scopeParsingInProcess = false;
			}
			return result;
		}

		function* matchGenerator(input, resultPayload) {
			if (scopeParsingInProcess) {
				yield matchScopeEnd(input);
			}
			yield matchPrint(input);
			yield matchInjection(input, resultPayload);
			yield matchIteration(input);
		}

		function chewChunk(input, resultPayload) {
			var matchResult, trimmedInput = trimWrappers(input);

			for (matchResult of matchGenerator(trimmedInput, resultPayload)) {
				if (matchResult) break;
			}

			!matchResult && throwError('Template Parsing Error', `Unrecognized Expression '${trimmedInput}'`);

			return `<%${matchResult}%>`;
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
			scopeParsingInProcess && throwError('Template Parsing Error', 'Scope opened but never closed');
			if (nextEnd < totalLength) { // If anything remains after
				resultText.add(templateString.substr(lastHandledIndex));
			}
			result.compiledContent = resultText.get();
			return result;
		}

		this.compile = compileTemplate;
	}
});

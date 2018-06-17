/**
 * Created by Skeksify on 09/07/2016.
 */

define([

], function () {
	return function () {
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

		function trimWrappers(text) {
			return text.replace(/\<\?\s*(php)?\s*|;?\s*\?\>/g, '');
		}

		function matchInjection(text, resultPayload) {
			let result, [,, injection] = text.match(/^\s*\$this\s*->\s*render(Nested)?\(\s*'([\s\w]+)'\s*\)\s*;?/) || [];
			if (injection) {
				result = `=$nestedData.${injection} `;
				resultPayload.deps.push(injection);
			}
			return result;
		}

		function matchIteration(text, resultPayload) {
			let result, [,, injection] = text.match(/^\s*\$that\s*->\s*render(Nested)?\(\s*'([\s\w]+)'\s*\)\s*;?/) || [];
			if (injection) {
				result = `=$nestedData.${injection} `;
				resultPayload.deps.push(injection);
			}
			return result;
		}

		function chewChunk(input, resultPayload) {
			var digest,
				trimmedInput = trimWrappers(input),
				digestMap = [matchInjection, matchIteration];

			for (digest of mapGenerator(digestMap, trimmedInput, resultPayload)) {
				if (digest) break;
			}

			return `<%${ digest || trimmedInput }%>`;
		}

		function* mapGenerator(funcs, input, resultPayload) {
			for (fuI in funcs) {
				yield funcs[fuI](input, resultPayload);
			}
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
			if (nextEnd < totalLength) { // If anything remains after
				resultText.add(templateString.substr(lastHandledIndex));
			}
			result.compiledContent = resultText.get();
			return result;
		}

		this.compile = compileTemplate;
	}
});

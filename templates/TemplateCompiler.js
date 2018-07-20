/**
 * Created by Skeksify on 09/07/2016.
 */

module.exports = function (grunt) {
	let openedIterationScopes = [];

	const rE = {
		scopeEnd: /^\s*}\s*/,
		oneString: /^\"([^\"]+)\"$/,
		for: /^\s*for\s*\((.*)\)\s*\{/i,
		isSet: /\s*isset\(([^\)]+)\)\s*/i,
		echo: /^(\s*)echo\s+([^;]+)\s*;?\s*$/,
		ternary: /^\s*=(.*)\?(.*):([^;]*);?/,
		curlyBracketsIterator: /\{([^\}]+)\}/g,
		equalsPrint: /^\s*=\s*([\$\w\[\]\'\-]+);?$/,
		switch: /^\s*=\s*([\$\w\[\]\'\-]+);?$/,
		phpWrappers: /\<\?\s*(php)?\s*|;?\s*\?\>/g,
		nestedTemplate: /^\s*\$this\s*->\s*render(Nested)?\(\s*'([\s\w]+)'\s*\)\s*;?/i,
		foreach: /^\s*foreach\s*\(\s*\$([\w\[\]']+)\s+as\s+\$(\w+)\s*(=>\s*\$(\w+)\s*)?\)\s*\{/i,
	}

	function amidstIteration() {
		return !!openedIterationScopes.length;
	}

	function throwError(...args) {
		// grunt.log.write('\n');
		args.forEach((arg, i) => {
			if (i === 2) {
				grunt.log.writeln(arg['white'])
			} else {
				grunt.log.error(arg);
			}
		})
		grunt.fail.warn('\nTerminating Task...\n');
		throw 'Template Terminated';
	}

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
		while (~(i = haystack.indexOf(needle, i + 1))) {
			result.push(i);
		}
		return result;
	}

	function trimWrappers(input) {
		return input.replace(rE.phpWrappers, '').trim();
	}

	function cleanISSET(input) {
		return input.replace(rE.isSet, '!_.isUn($1) ');
	}

	function compileExpression(input) {
		var result;
		if ('ANY expression' || input.trim().match(rE.oneString)) {
			result = '(' + input.replace(rE.curlyBracketsIterator, '" + $1 + "').trim() + ')';
		}
		return result || input;
	}

	function matchEqualsPrint(input) {
		let result, [, variableName] = input.match(rE.equalsPrint) || [];
		if (variableName) {
			result = input;
		}
		return result;
	}

	function matchTernaryPrint(input) {
		let result, [, condition, ifTrue, ifFalse] = input.match(rE.ternary) || [];
		if (condition) {
			result = `=${cleanISSET(condition)} ? ${compileExpression(ifTrue)} : ${compileExpression(ifFalse)}`;
		}
		return result;
	}

	function matchNestedTemplate(input, resultPayload) {
		let result, [, , nestedTemplateName] = input.match(rE.nestedTemplate) || [];
		if (nestedTemplateName) {
			amidstIteration() && throwError('Template Parsing Error', 'Nested Templates detected inside iteration scope, currently not supported');
			result = `=$nestedData['${nestedTemplateName}'] `;
			resultPayload.deps.push(nestedTemplateName);
		}
		return result;
	}

	function matchSwitch(input) {
		let result;

		if (input.startsWith('switch')) {
			let inputLines = input.split('\n');

			result = inputLines.map(line => {
				let [, indentation, expression] = line.match(rE.echo) || [];
				if (expression) {
					return `${indentation}print${compileExpression(expression)};`;
				} else {
					return line;
				}
			}).join('\n');

		}
		return result;
	}

	function matchIteration(input) {
		let result, [, collection, valueOrKey, , value] = input.match(rE.foreach) || [];

		if (collection) {
			result = `_.e($${collection}, function($${!value ? valueOrKey : value}${value ? `, $${valueOrKey}` : ''}) {`;
			openedIterationScopes.push(0);
		} else {
			let [, forExpressions] = input.match(rE.for) || [];
			if (forExpressions) {
				result = `for(var ${forExpressions}){`;
				openedIterationScopes.push(1);
			}
		}
		return result;
	}

	function matchScopeEnd(input) {
		let result, matchResult = input.match(rE.scopeEnd);
		if (matchResult) {
			!amidstIteration() && throwError('Template Parsing Error', 'Scope end detected before scope beginning');
			result = openedIterationScopes.pop() ? '}' : '});';
		}
		return result;
	}

	function* matchGenerator(input, resultPayload) {
		if (amidstIteration()) {
			yield matchScopeEnd(input);
		}
		yield matchEqualsPrint(input);
		yield matchTernaryPrint(input);
		yield matchIteration(input);
		yield matchSwitch(input);
		yield matchNestedTemplate(input, resultPayload);
		yield matchScopeEnd(input);
	}

	function chewChunk(input, resultPayload) {
		var matchResult, trimmedInput = trimWrappers(input);

		for (matchResult of matchGenerator(trimmedInput, resultPayload)) {
			if (matchResult) break;
		}

		!matchResult && throwError('Template Parsing Error', `Unrecognized Expression:`, trimmedInput);

		return `<%${matchResult}%>`;
	}

	function compileTemplate(templateString) {
		var result = {deps: []}, resultText = new StringAccumulator(), lastHandledIndex = 0, nextEnd = 0, closingIndex,
			totalLength = templateString.length;
		getAllIndices('<?', templateString).forEach(function (openingIndex) {
			resultText.add(templateString.substr(lastHandledIndex, openingIndex - lastHandledIndex)); // Store all until current opening
			closingIndex = templateString.indexOf('?>', openingIndex);
			nextEnd = ~closingIndex ? closingIndex + 2 : undefined;
			resultText.add(chewChunk(templateString.substring(openingIndex, nextEnd), result));
			lastHandledIndex = closingIndex + 2;
		});
		amidstIteration() && throwError('Template Parsing Error', 'Scope opened but never closed');
		if (nextEnd < totalLength) { // If anything remains after
			resultText.add(templateString.substr(lastHandledIndex));
		}
		result.compiledContent = resultText.get();
		return result;
	}

	this.compile = compileTemplate;
}

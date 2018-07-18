// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.4
var LZString = (function() {

// private property
	var f = String.fromCharCode;
	var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
	var baseReverseDic = {};

	function getBaseValue(alphabet, character) {
		if (!baseReverseDic[alphabet]) {
			baseReverseDic[alphabet] = {};
			for (var i=0 ; i<alphabet.length ; i++) {
				baseReverseDic[alphabet][alphabet.charAt(i)] = i;
			}
		}
		return baseReverseDic[alphabet][character];
	}

	var LZString = {
		compressToBase64 : function (input) {
			if (input == null) return "";
			var res = LZString._compress(input, 6, function(a){return keyStrBase64.charAt(a);});
			switch (res.length % 4) { // To produce valid Base64
				default: // When could this happen ?
				case 0 : return res;
				case 1 : return res+"===";
				case 2 : return res+"==";
				case 3 : return res+"=";
			}
		},

		decompressFromBase64 : function (input) {
			if (input == null) return "";
			if (input == "") return null;
			return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrBase64, input.charAt(index)); });
		},

		compressToUTF16 : function (input) {
			if (input == null) return "";
			return LZString._compress(input, 15, function(a){return f(a+32);}) + " ";
		},

		decompressFromUTF16: function (compressed) {
			if (compressed == null) return "";
			if (compressed == "") return null;
			return LZString._decompress(compressed.length, 16384, function(index) { return compressed.charCodeAt(index) - 32; });
		},

		//compress into uint8array (UCS-2 big endian format)
		compressToUint8Array: function (uncompressed) {
			var compressed = LZString.compress(uncompressed);
			var buf=new Uint8Array(compressed.length*2); // 2 bytes per character

			for (var i=0, TotalLen=compressed.length; i<TotalLen; i++) {
				var current_value = compressed.charCodeAt(i);
				buf[i*2] = current_value >>> 8;
				buf[i*2+1] = current_value % 256;
			}
			return buf;
		},

		//decompress from uint8array (UCS-2 big endian format)
		decompressFromUint8Array:function (compressed) {
			if (compressed===null || compressed===undefined){
				return LZString.decompress(compressed);
			} else {
				var buf=new Array(compressed.length/2); // 2 bytes per character
				for (var i=0, TotalLen=buf.length; i<TotalLen; i++) {
					buf[i]=compressed[i*2]*256+compressed[i*2+1];
				}

				var result = [];
				buf.forEach(function (c) {
					result.push(f(c));
				});
				return LZString.decompress(result.join(''));

			}

		},


		//compress into a string that is already URI encoded
		compressToEncodedURIComponent: function (input) {
			if (input == null) return "";
			return LZString._compress(input, 6, function(a){return keyStrUriSafe.charAt(a);});
		},

		//decompress from an output of compressToEncodedURIComponent
		decompressFromEncodedURIComponent:function (input) {
			if (input == null) return "";
			if (input == "") return null;
			input = input.replace(/ /g, "+");
			return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrUriSafe, input.charAt(index)); });
		},

		compress: function (uncompressed) {
			return LZString._compress(uncompressed, 16, function(a){return f(a);});
		},
		_compress: function (uncompressed, bitsPerChar, getCharFromInt) {
			if (uncompressed == null) return "";
			var i, value,
				context_dictionary= {},
				context_dictionaryToCreate= {},
				context_c="",
				context_wc="",
				context_w="",
				context_enlargeIn= 2, // Compensate for the first entry which should not count
				context_dictSize= 3,
				context_numBits= 2,
				context_data=[],
				context_data_val=0,
				context_data_position=0,
				ii;

			for (ii = 0; ii < uncompressed.length; ii += 1) {
				context_c = uncompressed.charAt(ii);
				if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {
					context_dictionary[context_c] = context_dictSize++;
					context_dictionaryToCreate[context_c] = true;
				}

				context_wc = context_w + context_c;
				if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {
					context_w = context_wc;
				} else {
					if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
						if (context_w.charCodeAt(0)<256) {
							for (i=0 ; i<context_numBits ; i++) {
								context_data_val = (context_data_val << 1);
								if (context_data_position == bitsPerChar-1) {
									context_data_position = 0;
									context_data.push(getCharFromInt(context_data_val));
									context_data_val = 0;
								} else {
									context_data_position++;
								}
							}
							value = context_w.charCodeAt(0);
							for (i=0 ; i<8 ; i++) {
								context_data_val = (context_data_val << 1) | (value&1);
								if (context_data_position == bitsPerChar-1) {
									context_data_position = 0;
									context_data.push(getCharFromInt(context_data_val));
									context_data_val = 0;
								} else {
									context_data_position++;
								}
								value = value >> 1;
							}
						} else {
							value = 1;
							for (i=0 ; i<context_numBits ; i++) {
								context_data_val = (context_data_val << 1) | value;
								if (context_data_position ==bitsPerChar-1) {
									context_data_position = 0;
									context_data.push(getCharFromInt(context_data_val));
									context_data_val = 0;
								} else {
									context_data_position++;
								}
								value = 0;
							}
							value = context_w.charCodeAt(0);
							for (i=0 ; i<16 ; i++) {
								context_data_val = (context_data_val << 1) | (value&1);
								if (context_data_position == bitsPerChar-1) {
									context_data_position = 0;
									context_data.push(getCharFromInt(context_data_val));
									context_data_val = 0;
								} else {
									context_data_position++;
								}
								value = value >> 1;
							}
						}
						context_enlargeIn--;
						if (context_enlargeIn == 0) {
							context_enlargeIn = Math.pow(2, context_numBits);
							context_numBits++;
						}
						delete context_dictionaryToCreate[context_w];
					} else {
						value = context_dictionary[context_w];
						for (i=0 ; i<context_numBits ; i++) {
							context_data_val = (context_data_val << 1) | (value&1);
							if (context_data_position == bitsPerChar-1) {
								context_data_position = 0;
								context_data.push(getCharFromInt(context_data_val));
								context_data_val = 0;
							} else {
								context_data_position++;
							}
							value = value >> 1;
						}


					}
					context_enlargeIn--;
					if (context_enlargeIn == 0) {
						context_enlargeIn = Math.pow(2, context_numBits);
						context_numBits++;
					}
					// Add wc to the dictionary.
					context_dictionary[context_wc] = context_dictSize++;
					context_w = String(context_c);
				}
			}

			// Output the code for w.
			if (context_w !== "") {
				if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
					if (context_w.charCodeAt(0)<256) {
						for (i=0 ; i<context_numBits ; i++) {
							context_data_val = (context_data_val << 1);
							if (context_data_position == bitsPerChar-1) {
								context_data_position = 0;
								context_data.push(getCharFromInt(context_data_val));
								context_data_val = 0;
							} else {
								context_data_position++;
							}
						}
						value = context_w.charCodeAt(0);
						for (i=0 ; i<8 ; i++) {
							context_data_val = (context_data_val << 1) | (value&1);
							if (context_data_position == bitsPerChar-1) {
								context_data_position = 0;
								context_data.push(getCharFromInt(context_data_val));
								context_data_val = 0;
							} else {
								context_data_position++;
							}
							value = value >> 1;
						}
					} else {
						value = 1;
						for (i=0 ; i<context_numBits ; i++) {
							context_data_val = (context_data_val << 1) | value;
							if (context_data_position == bitsPerChar-1) {
								context_data_position = 0;
								context_data.push(getCharFromInt(context_data_val));
								context_data_val = 0;
							} else {
								context_data_position++;
							}
							value = 0;
						}
						value = context_w.charCodeAt(0);
						for (i=0 ; i<16 ; i++) {
							context_data_val = (context_data_val << 1) | (value&1);
							if (context_data_position == bitsPerChar-1) {
								context_data_position = 0;
								context_data.push(getCharFromInt(context_data_val));
								context_data_val = 0;
							} else {
								context_data_position++;
							}
							value = value >> 1;
						}
					}
					context_enlargeIn--;
					if (context_enlargeIn == 0) {
						context_enlargeIn = Math.pow(2, context_numBits);
						context_numBits++;
					}
					delete context_dictionaryToCreate[context_w];
				} else {
					value = context_dictionary[context_w];
					for (i=0 ; i<context_numBits ; i++) {
						context_data_val = (context_data_val << 1) | (value&1);
						if (context_data_position == bitsPerChar-1) {
							context_data_position = 0;
							context_data.push(getCharFromInt(context_data_val));
							context_data_val = 0;
						} else {
							context_data_position++;
						}
						value = value >> 1;
					}


				}
				context_enlargeIn--;
				if (context_enlargeIn == 0) {
					context_enlargeIn = Math.pow(2, context_numBits);
					context_numBits++;
				}
			}

			// Mark the end of the stream
			value = 2;
			for (i=0 ; i<context_numBits ; i++) {
				context_data_val = (context_data_val << 1) | (value&1);
				if (context_data_position == bitsPerChar-1) {
					context_data_position = 0;
					context_data.push(getCharFromInt(context_data_val));
					context_data_val = 0;
				} else {
					context_data_position++;
				}
				value = value >> 1;
			}

			// Flush the last char
			while (true) {
				context_data_val = (context_data_val << 1);
				if (context_data_position == bitsPerChar-1) {
					context_data.push(getCharFromInt(context_data_val));
					break;
				}
				else context_data_position++;
			}
			return context_data.join('');
		},

		decompress: function (compressed) {
			if (compressed == null) return "";
			if (compressed == "") return null;
			return LZString._decompress(compressed.length, 32768, function(index) { return compressed.charCodeAt(index); });
		},

		_decompress: function (length, resetValue, getNextValue) {
			var dictionary = [],
				next,
				enlargeIn = 4,
				dictSize = 4,
				numBits = 3,
				entry = "",
				result = [],
				i,
				w,
				bits, resb, maxpower, power,
				c,
				data = {val:getNextValue(0), position:resetValue, index:1};

			for (i = 0; i < 3; i += 1) {
				dictionary[i] = i;
			}

			bits = 0;
			maxpower = Math.pow(2,2);
			power=1;
			while (power!=maxpower) {
				resb = data.val & data.position;
				data.position >>= 1;
				if (data.position == 0) {
					data.position = resetValue;
					data.val = getNextValue(data.index++);
				}
				bits |= (resb>0 ? 1 : 0) * power;
				power <<= 1;
			}

			switch (next = bits) {
				case 0:
					bits = 0;
					maxpower = Math.pow(2,8);
					power=1;
					while (power!=maxpower) {
						resb = data.val & data.position;
						data.position >>= 1;
						if (data.position == 0) {
							data.position = resetValue;
							data.val = getNextValue(data.index++);
						}
						bits |= (resb>0 ? 1 : 0) * power;
						power <<= 1;
					}
					c = f(bits);
					break;
				case 1:
					bits = 0;
					maxpower = Math.pow(2,16);
					power=1;
					while (power!=maxpower) {
						resb = data.val & data.position;
						data.position >>= 1;
						if (data.position == 0) {
							data.position = resetValue;
							data.val = getNextValue(data.index++);
						}
						bits |= (resb>0 ? 1 : 0) * power;
						power <<= 1;
					}
					c = f(bits);
					break;
				case 2:
					return "";
			}
			dictionary[3] = c;
			w = c;
			result.push(c);
			while (true) {
				if (data.index > length) {
					return "";
				}

				bits = 0;
				maxpower = Math.pow(2,numBits);
				power=1;
				while (power!=maxpower) {
					resb = data.val & data.position;
					data.position >>= 1;
					if (data.position == 0) {
						data.position = resetValue;
						data.val = getNextValue(data.index++);
					}
					bits |= (resb>0 ? 1 : 0) * power;
					power <<= 1;
				}

				switch (c = bits) {
					case 0:
						bits = 0;
						maxpower = Math.pow(2,8);
						power=1;
						while (power!=maxpower) {
							resb = data.val & data.position;
							data.position >>= 1;
							if (data.position == 0) {
								data.position = resetValue;
								data.val = getNextValue(data.index++);
							}
							bits |= (resb>0 ? 1 : 0) * power;
							power <<= 1;
						}

						dictionary[dictSize++] = f(bits);
						c = dictSize-1;
						enlargeIn--;
						break;
					case 1:
						bits = 0;
						maxpower = Math.pow(2,16);
						power=1;
						while (power!=maxpower) {
							resb = data.val & data.position;
							data.position >>= 1;
							if (data.position == 0) {
								data.position = resetValue;
								data.val = getNextValue(data.index++);
							}
							bits |= (resb>0 ? 1 : 0) * power;
							power <<= 1;
						}
						dictionary[dictSize++] = f(bits);
						c = dictSize-1;
						enlargeIn--;
						break;
					case 2:
						return result.join('');
				}

				if (enlargeIn == 0) {
					enlargeIn = Math.pow(2, numBits);
					numBits++;
				}

				if (dictionary[c]) {
					entry = dictionary[c];
				} else {
					if (c === dictSize) {
						entry = w + w.charAt(0);
					} else {
						return null;
					}
				}
				result.push(entry);

				// Add w+entry[0] to the dictionary.
				dictionary[dictSize++] = w + entry.charAt(0);
				enlargeIn--;

				w = entry;

				if (enlargeIn == 0) {
					enlargeIn = Math.pow(2, numBits);
					numBits++;
				}

			}
		}
	};
	return LZString;
})();
define("External/lz-string", function(){});

define('Toolset/Tools/math',[
    "underscore",
    "jquery",
    "Backbone"
], function (_, $, Backbone) {
    return Backbone.Model.extend({
        initialize: function () {

        },
        rand: function (a, b) {
            var rndVal = Math.random(), result;
            if (a && b) {
                result = parseInt((b-a)*rndVal)+a;
            } else if (a) {
                result = parseInt(a*rndVal);
            } else {
                result = rndVal;
            }

            return result;
        }
    });
});

define('Toolset/Tools/FinancialData',[
    "underscore",
    "jquery",
    "Backbone"
], function (_, $, Backbone) {


	const typeRegexMap = {
		'price': /^\d{1,3}(,(\d{3}))*(\.\d+)?$/,
		'percent': /^\+?\d{1,3}(,(\d{3}))*(\.\d+)?%$/
	},
    extractValue = {
		'price': val => +val.replace(/,/g, ''),
	    'percent': val => +val.replace(/[\+%,]/g, '')
    };

    return Backbone.Model.extend({
        initialize: function () {
            // Ascertain local format
        },
        is: function (type, value) {
            return !!typeRegexMap[type].exec(value);
        },
        getValue: function (type, value) {
			return extractValue[type](value);
		}
    });
});

define('Toolset/Tools/texts',[
    "underscore",
    "jquery",
    "Backbone"
], function (_, $, Backbone, MainFrame, Router) {
    return Backbone.Model.extend({
        initialize: function () {

        },
        capitalizeWord: function (word) {
            return word.substr(0, 1).toUpperCase() + word.substr(1);
        }
    });
});

define('Toolset/Tools/is',[
    "underscore",
    "jquery",
    "Backbone"
], function (_, $, Backbone, MainFrame, Router) {
    return Backbone.Model.extend({
        initialize: function () {

        },
        St: function (possibleString) { return _.isString(possibleString) },
        Fu: function (possibleFunction) { return _.isFunction(possibleFunction) },
/*Arr!*/Arr: function (possibleArray) { return possibleArray && possibleArray.constructor === Array; }
    });
});

/**
 * Created by Skeksify on 09/07/2016.
 */

define('Toolset/Tools/DeepMap',[], function () {
	return function (initData) {
		function set(trail, value) {
			const madeTrail = toArray(trail),
				endOfTrail = madeTrail.length - 1;

			let thisMap, nextMap = this.dataMap;

			madeTrail.forEach((milestone, milestoneIndex) => {
				thisMap = nextMap.get(milestone);

				if (milestoneIndex === endOfTrail) { // Last iteration
					nextMap.set(milestone, value);
				} else { // Keep going deeper
					if (!thisMap || thisMap.constructor !== Map) {
						nextMap.initOn(milestone);
						thisMap && console.warn('Existing value overridden by deeper maps', thisMap);
					}
					nextMap = nextMap.get(milestone); // Recurse in
				}
			})

			return thisMap; // Return overridden value if existed
		}

		function get(key) {
			try {
				return _get(key, this.dataMap);
			} catch (e) { }
		}

		function _get(trail, ds) {
			return toArray(trail).reduce((owningMap, milestone) => owningMap.get(milestone), ds);
		}

		function enhancedMap() {
			var result = new Map(initData);
			result.initOn = milestone => {
				result.set(milestone, enhancedMap());
			}
			return result;
		}

		function toArray(val) {
			return [].concat(val);
		}

		this.dataMap = enhancedMap();
		this.get = get;
		this.set = set;
	}
});

/**
 * Created by Skeksify on 09/07/2016.
 */

define('Toolset/Tools/ClientStorage',[
	"underscore",
	"jquery",
	"Backbone"
], function (_, $, Backbone) {

	return Backbone.Model.extend({

		initialize: function (useCompression, withPrints) {
			this._useCompression = useCompression;
			this._withPrints = withPrints;
		},

		setVal: function (key, value, warnIfExists) {
			let valueToSet = value;

			if (warnIfExists && !_.isNull(this.getVal(key))) {
				announceWarn('LocalStorage item already exists', key, this.getVal(key));
			}

			if (this._useCompression) {
				valueToSet = LZString.compress('' + value);
				this._withPrints && lcl(`Compression Stats\nBefore: ${value.length}\nAfter: ${valueToSet.length}\nRatio: ${+(valueToSet.length / value.length).toFixed(8)}`);
			}

			localStorage.setItem(key, valueToSet);
		},

		getVal: function (key) {
			let gotItem = localStorage.getItem(key);
			return this._useCompression ? LZString.decompress(gotItem) : gotItem;
		},

		clearVal: function (key) {
			localStorage.removeItem(key);
		},

		clearAll: function () {
			localStorage.clear();
		}
	});
});

/**
 * Created by Skeksify on 09/07/2016.
 */

define('Toolset/Tools/ClientSettings',[
	"underscore",
	"jquery",
	"Backbone",
	"./ClientStorage"
], function (_, $, Backbone, ClientStorage) {
	return ClientStorage.extend({
		initialize: function () {
			ClientStorage.prototype.initialize.call(this, false, false);

			this._userId = window.serverData.uid;
		},

		setVal: function (key, value) {
			ClientStorage.prototype.setVal.call(this, this._userId + key, value);
		},

		getVal: function (key) {
			return ClientStorage.prototype.getVal.call(this, this._userId + key);
		}
	})
});

/**
 * Created by Skeksify on 09/07/2016.
 */

window.cl = console.log;
window.lcl = (...args) => {
    if (window.lcl.flag) {
        cl(...args);
        window.lcl.customCL(...args);
    }
}

window.lcl.flag = localStorage.getItem('consolePrints') === '1';
window.lcl.customCL = ()=>1;

console.clear();

function getIfNotProd(fu) {
	if ('Not production') {
		return fu;
	} else {
		return $.noop;
	}
}

window.throwError = getIfNotProd(function (mainLabel) {
	var i, finalStrArr = ['__ Runtime Error: ' + mainLabel];
	for (i = 1; i < arguments.length; i++) {
		i === 1 && finalStrArr.push(' [');
		finalStrArr.push(arguments[i] + (i !== arguments.length - 1 ? ', ' : ''));
		i === arguments.length - 1 && finalStrArr.push(']');
	}
	throw new Error(finalStrArr.join(''))
})

window.announceWarn = getIfNotProd(function (mainLabel) {
	var i, finalStrArr = ['__ Runtime Warning: ' + mainLabel];
	for (i = 1; i < arguments.length; i++) {
		i === 1 && finalStrArr.push(' [');
		finalStrArr.push(arguments[i] + (i !== arguments.length - 1 ? ', ' : ''));
		i === arguments.length - 1 && finalStrArr.push(']');
	}
	console.warn(finalStrArr.join(''));
})



define('Toolset/Toolset',[
    "underscore",
    "jquery",
    "Backbone",
    "Toolset/Tools/math",
    "Toolset/Tools/FinancialData",
    "Toolset/Tools/texts",
    "Toolset/Tools/is",
    "Toolset/Tools/DeepMap",
    "Toolset/Tools/ClientStorage",
    "Toolset/Tools/ClientSettings"
], function (_, $, Backbone, MathTool, FinancialData, TextsTool, IsTool, DeepMap, ClientStorage, ClientSettings) {
    var Toolset = Backbone.Model.extend({
        initialize: function () {

        },
        Math: new MathTool(),
		FinancialData: new FinancialData(),
        Texts: new TextsTool(),
        is: new IsTool(),
        DeepMap,
		ClientStorage: new ClientStorage(true, true),
		ClientSettings: new ClientSettings(),
		Compression: LZString,
        miscFuncs: {
            p: function (func, context, params) {
                return params ? func.bind(context, params) : func.bind(context);
            },
            pAr: function (func, context, params) {
                return params ? func.bind.apply(func, [context].concat(params)) : func.bind(context);
            }
        }
    });

    return new Toolset();
});

/**
 * Created by Skeksify on 09/07/2016.
 */

define('Displayable',[
    "underscore",
    "jquery",
    "Backbone"
], function (_, $, Backbone) {
	let $head = $('head');

    return Backbone.View.extend({

        _dom: null,
		_rawCSS: null,
        _markupTemplate: null,

        initialize: function (html__$elem, css, prerendered) {
        	this._rawCSS = css;
            if (prerendered) { // Server rendered, seek in DOM
                this.$el = $.is$elem(html__$elem) ? html__$elem : $(`body [data-section="${html__$elem}"]`);
				this.$el.isEmpty() && throwError('Section Wrapper not found', html__$elem);
            } else { // Normal fetching through require, render regularly
				this._setTemplate(html__$elem);
			}
			this._createStyleElem();
        },

        render: function (templateData, scheme) {
			this._render(templateData, scheme);

            return this.$el;
        },

		_setTemplate: function (html) {
        	if (html) {
				this._markupTemplate = _.template(html || "");
			}
		},

		_createStyleElem: function () {
			if (this._rawCSS) {
				this._cssElement = $("<style/>").text(this._rawCSS);
			}
		},

		injectCSS: function () {
			if (this._cssElement) {
				$head.append(this._cssElement);
			}
		},

		_render: function (templateData, scheme) {
			this.injectCSS();
			if (this._markupTemplate) {
                this.$el = $(this._markupTemplate(templateData || {}));
            }
			this.delegateEvents(); // Rebind according to 'events'
			if (scheme) {
				this._cacheDom(scheme);
			}
		},

        _cacheDom: function (scheme) {
            var key, result = {};

            for (key in scheme) {
                result[key] = this.$el.find(scheme[key]);
                if (!result[key].length) {
                    throwError('cacheDOM - Element Not Found', key, scheme[key]);
                }
            }

            this._dom = result;
        }
    })
});

/**
 * Created by Skeksify on 09/07/2016.
 */

define('EventBus',[
	"underscore",
	"jquery",
	"Backbone"
], function (_, $, Backbone) {
	let incId = 1,
		domAttachmentWatchers = {},
		EventBus = Backbone.Model.extend({
			onceAttachedToDOM: function ($elemToMonitor, cb) {
				domAttachmentWatchers[incId++] = { $elemToMonitor, cb };
			}
		}),
		EventBusInstance = new EventBus();

	EventBusInstance.on('mainFrameInsertion', ($elemInjected) => {
		_.each(domAttachmentWatchers, (watcher, i) => {
			if (watcher.$elemToMonitor.isChildOf($elemInjected) || watcher.$elemToMonitor === $elemInjected) {
				watcher.cb.forEach ? watcher.cb.forEach(cb => cb()) : watcher.cb();
				delete domAttachmentWatchers[i]; // Always Once (heh) need optionality?
			}
		})
	})

	return EventBusInstance;
});

/**
 * @license text 2.0.15 Copyright jQuery Foundation and other contributors.
 * Released under MIT license, http://github.com/requirejs/text/LICENSE
 */
/*jslint regexp: true */
/*global require, XMLHttpRequest, ActiveXObject,
 define, window, process, Packages,
 java, location, Components, FileUtils */

define('text',['module'], function (module) {
    'use strict';

    var text, fs, Cc, Ci, xpcIsWindows,
        progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
        bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
        hasLocation = typeof location !== 'undefined' && location.href,
        defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ''),
        defaultHostName = hasLocation && location.hostname,
        defaultPort = hasLocation && (location.port || undefined),
        buildMap = {},
        masterConfig = (module.config && module.config()) || {};

    function useDefault(value, defaultValue) {
        return value === undefined || value === '' ? defaultValue : value;
    }

    //Allow for default ports for http and https.
    function isSamePort(protocol1, port1, protocol2, port2) {
        if (port1 === port2) {
            return true;
        } else if (protocol1 === protocol2) {
            if (protocol1 === 'http') {
                return useDefault(port1, '80') === useDefault(port2, '80');
            } else if (protocol1 === 'https') {
                return useDefault(port1, '443') === useDefault(port2, '443');
            }
        }
        return false;
    }

    text = {
        version: '2.0.15',

        strip: function (content) {
            //Strips <?xml ...?> declarations so that external SVG and XML
            //documents can be added to a document without worry. Also, if the string
            //is an HTML document, only the part inside the body tag is returned.
            if (content) {
                content = content.replace(xmlRegExp, "");
                var matches = content.match(bodyRegExp);
                if (matches) {
                    content = matches[1];
                }
            } else {
                content = "";
            }
            return content;
        },

        jsEscape: function (content) {
            return content.replace(/(['\\])/g, '\\$1')
                .replace(/[\f]/g, "\\f")
                .replace(/[\b]/g, "\\b")
                .replace(/[\n]/g, "\\n")
                .replace(/[\t]/g, "\\t")
                .replace(/[\r]/g, "\\r")
                .replace(/[\u2028]/g, "\\u2028")
                .replace(/[\u2029]/g, "\\u2029");
        },

        createXhr: masterConfig.createXhr || function () {
            //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject !== "undefined") {
                for (i = 0; i < 3; i += 1) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) {}

                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }
            }

            return xhr;
        },

        /**
         * Parses a resource name into its component parts. Resource names
         * look like: module/name.ext!strip, where the !strip part is
         * optional.
         * @param {String} name the resource name
         * @returns {Object} with properties "moduleName", "ext" and "strip"
         * where strip is a boolean.
         */
        parseName: function (name) {
            var modName, ext, temp,
                strip = false,
                index = name.lastIndexOf("."),
                isRelative = name.indexOf('./') === 0 ||
                    name.indexOf('../') === 0;

            if (index !== -1 && (!isRelative || index > 1)) {
                modName = name.substring(0, index);
                ext = name.substring(index + 1);
            } else {
                modName = name;
            }

            temp = ext || modName;
            index = temp.indexOf("!");
            if (index !== -1) {
                //Pull off the strip arg.
                strip = temp.substring(index + 1) === "strip";
                temp = temp.substring(0, index);
                if (ext) {
                    ext = temp;
                } else {
                    modName = temp;
                }
            }

            return {
                moduleName: modName,
                ext: ext,
                strip: strip
            };
        },

        xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,

        /**
         * Is an URL on another domain. Only works for browser use, returns
         * false in non-browser environments. Only used to know if an
         * optimized .js version of a text resource should be loaded
         * instead.
         * @param {String} url
         * @returns Boolean
         */
        useXhr: function (url, protocol, hostname, port) {
            var uProtocol, uHostName, uPort,
                match = text.xdRegExp.exec(url);
            if (!match) {
                return true;
            }
            uProtocol = match[2];
            uHostName = match[3];

            uHostName = uHostName.split(':');
            uPort = uHostName[1];
            uHostName = uHostName[0];

            return (!uProtocol || uProtocol === protocol) &&
                (!uHostName || uHostName.toLowerCase() === hostname.toLowerCase()) &&
                ((!uPort && !uHostName) || isSamePort(uProtocol, uPort, protocol, port));
        },

        finishLoad: function (name, strip, content, onLoad) {
            content = strip ? text.strip(content) : content;
            if (masterConfig.isBuild) {
                buildMap[name] = content;
            }
            onLoad(content);
        },

        load: function (name, req, onLoad, config) {
            //Name has format: some.module.filext!strip
            //The strip part is optional.
            //if strip is present, then that means only get the string contents
            //inside a body tag in an HTML string. For XML/SVG content it means
            //removing the <?xml ...?> declarations so the content can be inserted
            //into the current doc without problems.

            // Do not bother with the work if a build and text will
            // not be inlined.
            if (config && config.isBuild && !config.inlineText) {
                onLoad();
                return;
            }

            masterConfig.isBuild = config && config.isBuild;

            var parsed = text.parseName(name),
                nonStripName = parsed.moduleName +
                    (parsed.ext ? '.' + parsed.ext : ''),
                url = req.toUrl(nonStripName),
                useXhr = (masterConfig.useXhr) ||
                    text.useXhr;

            // Do not load if it is an empty: url
            if (url.indexOf('empty:') === 0) {
                onLoad();
                return;
            }

            //Load the text. Use XHR if possible and in a browser.
            if (!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort)) {
                text.get(url, function (content) {
                    text.finishLoad(name, parsed.strip, content, onLoad);
                }, function (err) {
                    if (onLoad.error) {
                        onLoad.error(err);
                    }
                });
            } else {
                //Need to fetch the resource across domains. Assume
                //the resource has been optimized into a JS module. Fetch
                //by the module name + extension, but do not include the
                //!strip part to avoid file system issues.
                req([nonStripName], function (content) {
                    text.finishLoad(parsed.moduleName + '.' + parsed.ext,
                        parsed.strip, content, onLoad);
                });
            }
        },

        write: function (pluginName, moduleName, write, config) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = text.jsEscape(buildMap[moduleName]);
                write.asModule(pluginName + "!" + moduleName,
                    "define(function () { return '" +
                    content +
                    "';});\n");
            }
        },

        writeFile: function (pluginName, moduleName, req, write, config) {
            var parsed = text.parseName(moduleName),
                extPart = parsed.ext ? '.' + parsed.ext : '',
                nonStripName = parsed.moduleName + extPart,
            //Use a '.js' file name so that it indicates it is a
            //script that can be loaded across domains.
                fileName = req.toUrl(parsed.moduleName + extPart) + '.js';

            //Leverage own load() method to load plugin value, but only
            //write out values that do not have the strip argument,
            //to avoid any potential issues with ! in file names.
            text.load(nonStripName, req, function (value) {
                //Use own write() method to construct full module value.
                //But need to create shell that translates writeFile's
                //write() to the right interface.
                var textWrite = function (contents) {
                    return write(fileName, contents);
                };
                textWrite.asModule = function (moduleName, contents) {
                    return write.asModule(moduleName, fileName, contents);
                };

                text.write(pluginName, nonStripName, textWrite, config);
            }, config);
        }
    };

    if (masterConfig.env === 'node' || (!masterConfig.env &&
        typeof process !== "undefined" &&
        process.versions &&
        !!process.versions.node &&
        !process.versions['node-webkit'] &&
        !process.versions['atom-shell'])) {
        //Using special require.nodeRequire, something added by r.js.
        fs = require.nodeRequire('fs');

        text.get = function (url, callback, errback) {
            try {
                var file = fs.readFileSync(url, 'utf8');
                //Remove BOM (Byte Mark Order) from utf8 files if it is there.
                if (file[0] === '\uFEFF') {
                    file = file.substring(1);
                }
                callback(file);
            } catch (e) {
                if (errback) {
                    errback(e);
                }
            }
        };
    } else if (masterConfig.env === 'xhr' || (!masterConfig.env &&
        text.createXhr())) {
        text.get = function (url, callback, errback, headers) {
            var xhr = text.createXhr(), header;
            xhr.open('GET', url, true);

            //Allow plugins direct access to xhr headers
            if (headers) {
                for (header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header.toLowerCase(), headers[header]);
                    }
                }
            }

            //Allow overrides specified in config
            if (masterConfig.onXhr) {
                masterConfig.onXhr(xhr, url);
            }

            xhr.onreadystatechange = function (evt) {
                var status, err;
                //Do not explicitly handle errors, those should be
                //visible via console output in the browser.
                if (xhr.readyState === 4) {
                    status = xhr.status || 0;
                    if (status > 399 && status < 600) {
                        //An http 4xx or 5xx error. Signal an error.
                        err = new Error(url + ' HTTP status: ' + status);
                        err.xhr = xhr;
                        if (errback) {
                            errback(err);
                        }
                    } else {
                        callback(xhr.responseText);
                    }

                    if (masterConfig.onXhrComplete) {
                        masterConfig.onXhrComplete(xhr, url);
                    }
                }
            };
            xhr.send(null);
        };
    } else if (masterConfig.env === 'rhino' || (!masterConfig.env &&
        typeof Packages !== 'undefined' && typeof java !== 'undefined')) {
        //Why Java, why is this so awkward?
        text.get = function (url, callback) {
            var stringBuffer, line,
                encoding = "utf-8",
                file = new java.io.File(url),
                lineSeparator = java.lang.System.getProperty("line.separator"),
                input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)),
                content = '';
            try {
                stringBuffer = new java.lang.StringBuffer();
                line = input.readLine();

                // Byte Order Mark (BOM) - The Unicode Standard, version 3.0, page 324
                // http://www.unicode.org/faq/utf_bom.html

                // Note that when we use utf-8, the BOM should appear as "EF BB BF", but it doesn't due to this bug in the JDK:
                // http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058
                if (line && line.length() && line.charAt(0) === 0xfeff) {
                    // Eat the BOM, since we've already found the encoding on this file,
                    // and we plan to concatenating this buffer with others; the BOM should
                    // only appear at the top of a file.
                    line = line.substring(1);
                }

                if (line !== null) {
                    stringBuffer.append(line);
                }

                while ((line = input.readLine()) !== null) {
                    stringBuffer.append(lineSeparator);
                    stringBuffer.append(line);
                }
                //Make sure we return a JavaScript string and not a Java string.
                content = String(stringBuffer.toString()); //String
            } finally {
                input.close();
            }
            callback(content);
        };
    } else if (masterConfig.env === 'xpconnect' || (!masterConfig.env &&
        typeof Components !== 'undefined' && Components.classes &&
        Components.interfaces)) {
        //Avert your gaze!
        Cc = Components.classes;
        Ci = Components.interfaces;
        Components.utils['import']('resource://gre/modules/FileUtils.jsm');
        xpcIsWindows = ('@mozilla.org/windows-registry-key;1' in Cc);

        text.get = function (url, callback) {
            var inStream, convertStream, fileObj,
                readData = {};

            if (xpcIsWindows) {
                url = url.replace(/\//g, '\\');
            }

            fileObj = new FileUtils.File(url);

            //XPCOM, you so crazy
            try {
                inStream = Cc['@mozilla.org/network/file-input-stream;1']
                    .createInstance(Ci.nsIFileInputStream);
                inStream.init(fileObj, 1, 0, false);

                convertStream = Cc['@mozilla.org/intl/converter-input-stream;1']
                    .createInstance(Ci.nsIConverterInputStream);
                convertStream.init(inStream, "utf-8", inStream.available(),
                    Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);

                convertStream.readString(inStream.available(), readData);
                convertStream.close();
                inStream.close();
                callback(readData.value);
            } catch (e) {
                throw new Error((fileObj && fileObj.path || '') + ': ' + e);
            }
        };
    }
    return text;
});

define('text!Modules/ToolsetUI/ToolsetUI.html',[],function () { return '<div class="toolset-ui-wrapper">\n    <h2>\n        Toolset UI\n    </h2>\n    <span class="toolset-ui-toggle">Toggle</span>\n    <div class="toolset-ui-cont">\n        <button class="console-prints">Console Prints (On)</button>\n        <button class="compile-templates">Compile Templates</button>\n        <button class="clear-template-cache">Clear Template Cache</button>\n        <button class="load-portfolios">Load portfolios</button>\n        <button class="append-more-rows-button2">Append 1k to Table</button>\n        <button class="append-more-rows-button">Append 5k to Table</button>\n\n        <div class="clear"></div>\n\n        <span class="clear-console">Clear console</span>\n        <div class="custom-console"></div>\n    </div>\n</div>';});


define('text!Modules/ToolsetUI/ToolsetUI.css',[],function () { return '.toolset-ui-wrapper {\r\n    top: 20px;\r\n    right: 20px;\r\n    z-index: 99;\r\n    width: 300px;\r\n    padding: 10px;\r\n    position: fixed;\r\n    border-radius: 4px;\r\n    text-align: center;\r\n    background: #222121;\r\n    border: 1px white solid;\r\n}\r\n\r\n.tabs-inner-wrapper ul {\r\n    position: relative;\r\n}\r\n\r\n.toolset-ui-wrapper.open {\r\n    /*min-height: 300px;*/\r\n}\r\n\r\n.toolset-ui-wrapper.open .toolset-ui-cont {\r\n    display: block;\r\n}\r\n\r\n.toolset-ui-toggle {\r\n    position: absolute;\r\n    left: 15px;\r\n    top: 13px;\r\n    cursor: pointer;\r\n}\r\n.toolset-ui-wrapper h2 {\r\n    margin: 0;\r\n}\r\n\r\n.toolset-ui-wrapper button {\r\n    color: white;\r\n    margin: 10px;\r\n    cursor: pointer;\r\n    background: #333;\r\n    padding: 4px 21px;\r\n    border-radius: 4px;\r\n    border: 1px solid white;\r\n}\r\n\r\n.toolset-ui-wrapper button:hover {\r\n    border-color: #aaffbd;\r\n}\r\n\r\n.toolset-ui-wrapper button.disabled {\r\n    color: #000;\r\n}\r\n\r\n.toolset-ui-cont {\r\n    padding-top: 12px;\r\n    display: none;\r\n}\r\n\r\nh6 {\r\n    display: inline-block;\r\n}\r\n\r\n.topBar .topBarSearch INPUT {\r\n    margin-top: 8px;\r\n}\r\n\r\n.console-entry.closed {\r\n    text-overflow: ellipsis;\r\n    white-space: nowrap;\r\n    overflow: hidden;\r\n}\r\n\r\n.console-entry {\r\n    max-width: 300px;\r\n    margin: 10px 2px;\r\n}\r\n\r\n.custom-console {\r\n    padding-top: 24px;\r\n}\r\n\r\n.clear-console {\r\n    float: right;\r\n    margin-top: 10px;\r\n    cursor: pointer;\r\n}';});

/**
 * Created by Skeksify on 09/07/2016.
 */

define('Modules/ToolsetUI/ToolsetUIView',[
	"underscore",
	"jquery",
	"Backbone",
	"Displayable",
	"EventBus",
	"Toolset/Toolset",
	"text!./ToolsetUI.html",
	"text!./ToolsetUI.css"
], function (_, $, Backbone, Displayable, EventBus, Toolset, html, css) {
	var consolePrintsAreOn = Toolset.ClientStorage.getVal('consolePrints') === '1';

	return Displayable.extend({

		_markupScheme: {
			"cpButton": "button.console-prints",
			"customConsole": ".custom-console"
		},

		events: {
			"click .toolset-ui-toggle": "_toggleUI",
			"click .console-prints": "_toggleConsolePrints",
			"click .clear-console": "_clearCustomConsole",
			"click .clear-template-cache": "_clearTemplateCache",
			"click .compile-templates": "_compileTemplates",
			"click .load-portfolios": "_loadPortfolios",
			"click .console-entry": "_toggleEntry",
			"click .append-more-rows-button2": "_append1k"
		},

		initialize: function () {
			Displayable.prototype.initialize.call(this, html, css);

		},

		render: function () {
			Displayable.prototype.render.call(this, {}, this._markupScheme);

			this._toggleUIElem(this._loadState());
			this._applyConsolePrintsState();
			this._initCustomCL();

			return this.$el;
		},

		_initCustomCL: function () {
			window.lcl.customCL = (...args) => {
				const enstringification = args.reduce((acc, arg) => acc + ' | ' + arg);
				this._dom.customConsole.prepend($('<div/>').addClass('console-entry closed').text(enstringification).attr('title', enstringification));
			}
		},

		_clearCustomConsole: function () {
			this._dom.customConsole.empty();
		},

		_toggleUIElem: function (toOpen) {
			this.$el.toggleClass('open', toOpen);
		},

		_toggleUI: function () {
			this._toggleUIElem(this._saveState(!this.$el.hasClass('open')));
		},

		_toggleEntry: function (e) {
			$(e.target).toggleClass('closed');
		},

		_saveState: function (isOpen) {
			this._state = isOpen;
			Toolset.ClientStorage.setVal('toolset-ui-isOpen', +this._state);
			return this._state;
		},

		_loadState: function () {
			this._state = Toolset.ClientStorage.getVal('toolset-ui-isOpen') === '1';
			return this._state;
		},

		_toggleConsolePrints: function () {
			consolePrintsAreOn = !consolePrintsAreOn;
			cl(`Console Prints are ${consolePrintsAreOn ? 'On' : 'Off'}`);
			this._applyConsolePrintsState();
		},

		_applyConsolePrintsState: function () {
			Toolset.ClientStorage.setVal('consolePrints', +consolePrintsAreOn);
			window.lcl.flag = consolePrintsAreOn;
			this._dom.cpButton.text(`Console Prints (${consolePrintsAreOn ? 'On' : 'Off'})`);
		},

		_clearTemplateCache: function () {
			Toolset.ClientStorage.clearVal('templates');
			EventBus.trigger('dropTemplates');
			lcl('Templates Cleared');
		},

		_compileTemplates: function () {
			EventBus.trigger('CompileTemplates');
		},

		_loadPortfolios: function () {
			EventBus.trigger('loadTemplate', 'portfolios', 'portfolios')
		},

		_append1k: function () {
			EventBus.trigger('append1k');
		}
	})
});

/**
 * Created by Skeksify on 09/07/2016.
 */

define('Modules/DependencyLoader/DependencyLoader',[
	"underscore",
	"jquery",
	"Backbone"
], function (_, $, Backbone) {

	function isFu(fu) {
		return typeof(fu) === 'function';
	}

	function applyOrGetSelf(def, deps) {
		return isFu(def) ? def.apply(null, deps) : def;
	}

	return Backbone.Model.extend({
		initialize: function () {
			this.loadedComponents = {};
			this.initializedComponents = {};
		},

		drop: function () {
			this.loadedComponents = {};
			this.initializedComponents = {};
		},

		get: function (name) {
			return this.loadedComponents[name];
		},

		load: function (name, deps, definition) {
			this.loadedComponents[name] = {
				deps,
				definition
			}
		},

		// init: function () {
		// 	var name;
		// 	debugger;
		// 	for (name in this.loadedComponents) {
		// 		if (this._attemptToInitScript(name)) {
		// 			this.initializedComponents[name] = this.loadedComponents[name]();
		// 		}
		// 	}
		// },

		areLoaded: function(col) {
			return this._allScriptsLoadedInArray(col);
		},

		export: function () {
			return JSON.stringify(this.loadedComponents);
		},

		import: function (dataJSON) {
			this.loadedComponents = JSON.parse(dataJSON);
		},

		_buildDepsReferences: function (depsArr) {
			return depsArr.reduce(function (result, depName) {
				result.push(this.initializedComponents[depName]);
				return result;
			}, [])
		},

		_loadComponent: function (name) {
			var deps = this.loadedComponents[name].deps,
				depsRefArray = this._buildDepsReferences(deps);

			this.initializedComponents[name] = applyOrGetSelf(this.loadedComponents[name].definition, depsRefArray);
		},

		_allScriptsLoadedInArray: function (collection) {
			return collection.reduce((result, script) => result && !!this.initializedComponents[script], true)
		},

		_attemptToInitScript: function (name) {
			if (this._allScriptsLoadedInArray(this.loadedComponents[name].deps)) {
				this._loadComponent(name);
			}
		}
	})
});

define('text!Modules/TemplateManager/_views1.json',[],function () { return '{\r\n\r\n  "mainContentView": "<div class=\\"<%=$bodyClass%>\\" <%=$takeOverBg%>><span><%=$nestedData.header %></span><div><%=$nestedData.from %></div><div><%=$nestedData.iterMacher %></div></div>",\r\n\r\n  "mainEquitiesView": "<div data-section=\\"equities\\" class=\\"<%=$bodyClass%>\\" <%=$takeOverBg%>><span><%=$nestedData.header %></span><div><%=$nestedData.from %></div><div><%=$nestedData.iterMacher %></div></div>",\r\n\r\n  "iter1": "<table data-section=\\"indices\\"><%_.each($rows, function($rowValue, $rowIndex) {%><tr><td><h3><%=$rowIndex%>: <span><%=$rowValue%></span></h3></td></tr><%});%></table>",\r\n\r\n  "innerTitle": "<h1><%=$title%></h1>",\r\n\r\n  "companyNameView": "<h6><%=$companyNameLabel%></h6>",\r\n\r\n  "from": "[From <%=$fromLabel%>, by <%=$nestedData.companyName %>]",\r\n\r\n  "titleWrap": "<%=$sign%><%=$nestedData.innerTitle %><%=$sign%>",\r\n\r\n  "portfolios2": "<div class=\'portfolios-wrapper\'><div class=\'tabs-placeholder\'></div><div class=\'portfolio-placeholder\'></div></div><%=$sign%>",\r\n\r\n  "major-indices-view": "<div data-section=\\"major-indices\\" class=\\"indices-wrapper\\"><div class=\\"tabs-placeholder\\" data-section=\\"tabs-wrapper\\"><div class=\\"tabs-wrapper clip\\"><div class=\\"tabs-inner-wrapper\\"><ul><li data-tab-name=\\"price\\" class=\\"selected\\">Price</li><li data-tab-name=\\"performance\\">Performance</li></ul><div class=\\"clip-controls\\"><span class=\\"show-more\\">...</span><div class=\\"more-tabs displayNone\\"><ul><li data-tab-name=\\"Watchlist4\\">Watchlist4</li><li data-tab-name=\\"Watchlist5\\">Watchlist5</li><li data-tab-name=\\"Watchlist6\\">Watchlist6</li><li data-tab-name=\\"Watchlist7\\">Watchlist7</li><li data-tab-name=\\"Watchlist8\\">Watchlist8</li><li data-tab-name=\\"Watchlist9\\">Watchlist9</li><li data-tab-name=\\"Watchlist10\\">Watchlist10</li></ul></div></div></div></div></div><div class=\\"table-wrapper\\"><table class=\\"data-table-style common-table high js-table\\" data-section=\\"price\\"><colgroup><col class=\\"col-name\\"><col class=\\"col-last\\"><col class=\\"col-high\\"><col class=\\"col-low\\"><col class=\\"col-chg\\"><col class=\\"col-volume\\"><col class=\\"col-time\\"></colgroup><thead><tr><th col-name=\\"mark\\"></th><th col-name=\\"name\\"><span class=\\"text\\">Name</span><span class=\\"drag-handle\\">&nbsp;+&nbsp;</span></th><th col-name=\\"last\\"><span class=\\"text\\">Last</span><span class=\\"drag-handle\\">&nbsp;+&nbsp;</span></th><th col-name=\\"high\\" data-type=\\"price\\"><span class=\\"text\\">High</span><span class=\\"drag-handle\\">&nbsp;+&nbsp;</span></th><th col-name=\\"low\\" data-type=\\"price\\"><span class=\\"text\\">Low</span><span class=\\"drag-handle\\">&nbsp;+&nbsp;</span></th><th col-name=\\"chg\\" data-type=\\"percent\\"><span class=\\"text\\">Chg %</span><span class=\\"drag-handle\\">&nbsp;+&nbsp;</span></th><th col-name=\\"volume\\"><span class=\\"text\\">Volume</span><span class=\\"drag-handle\\">&nbsp;+&nbsp;</span></th><th col-name=\\"time\\"><span class=\\"text\\">Time</span><span class=\\"drag-handle\\">&nbsp;+&nbsp;</span></th></tr></thead><tbody><tr class=\\"common-table-item\\"><td class=\\"col-mark\\"><input type=\\"checkbox\\"></td><td class=\\"col-name\\"><span class=\\"text\\">Dow 10</span></td><td class=\\"col-last highlight\\">24,884.14</td><td class=\\"col-high\\">34,324.12</td><td class=\\"col-low\\">3,650.18</td><td class=\\"col-chg\\">+0.04%</td><td class=\\"col-volume\\">7.54M</td><td class=\\"col-time opened\\"><time datetime=\\"\\" class=\\"text\\">06/03</time><span class=\\"s-exchange\\">Toronto</span><span class=\\"icon-clock\\" aria-hidden=\\"true\\"></span></td></tr><tr class=\\"common-table-item\\"><td class=\\"col-mark\\"><input type=\\"checkbox\\"></td><td class=\\"col-name\\"><span class=\\"text\\">Dow 20</span></td><td class=\\"col-last highlight up\\">24,884.14</td><td class=\\"col-high\\">24,124.12</td><td class=\\"col-low\\">33,650.18</td><td class=\\"col-chg\\">+0.04%</td><td class=\\"col-volume\\">7.54M</td><td class=\\"col-time closed\\"><time datetime=\\"\\" class=\\"text\\">06/03</time><span class=\\"s-exchange\\">Amsterdam</span><span class=\\"icon-clock\\" aria-hidden=\\"true\\"></span></td></tr><tr class=\\"common-table-item\\"><td class=\\"col-mark\\"><input type=\\"checkbox\\"></td><td class=\\"col-name\\"><span class=\\"text\\">Dow 30</span></td><td class=\\"col-last highlight up\\">24,884.14</td><td class=\\"col-high\\">54,524.12</td><td class=\\"col-low\\">23,650.18</td><td class=\\"col-chg\\">+0.04%</td><td class=\\"col-volume\\">7.54M</td><td class=\\"col-time opened\\"><time datetime=\\"\\" class=\\"text\\">06/03</time><span class=\\"s-exchange\\">Nsadaq</span><span class=\\"icon-clock\\" aria-hidden=\\"true\\"></span></td></tr><tr class=\\"common-table-item\\"><td class=\\"col-mark\\"><input type=\\"checkbox\\"></td><td class=\\"col-name\\"><span class=\\"text\\">Dow 40</span></td><td class=\\"col-last highlight\\">24,884.14</td><td class=\\"col-high\\">11,924.12</td><td class=\\"col-low\\">63,650.18</td><td class=\\"col-chg\\">+0.04%</td><td class=\\"col-volume\\">7.54M</td><td class=\\"col-time opened\\"><time datetime=\\"\\" class=\\"text\\">06/03</time><span class=\\"s-exchange\\">Nsadaq</span><span class=\\"icon-clock\\" aria-hidden=\\"true\\"></span></td></tr><tr class=\\"common-table-item\\"><td class=\\"col-mark\\"><input type=\\"checkbox\\"></td><td class=\\"col-name\\"><span class=\\"text\\">Dow 50</span></td><td class=\\"col-last highlight down\\">24,884.14</td><td class=\\"col-high\\">88,924.12</td><td class=\\"col-low\\">11,650.18</td><td class=\\"col-chg\\">+0.04%</td><td class=\\"col-volume\\">7.54M</td><td class=\\"col-time opened\\"><time datetime=\\"\\" class=\\"text\\">06/03</time><span class=\\"s-exchange\\">Nyse</span><span class=\\"icon-clock\\" aria-hidden=\\"true\\"></span></td></tr><tr class=\\"common-table-item\\"><td class=\\"col-mark\\"><input type=\\"checkbox\\"></td><td class=\\"col-name\\"><span class=\\"text\\">Dow 60</span></td><td class=\\"col-last highlight\\">24,884.14</td><td class=\\"col-high\\">94,924.12</td><td class=\\"col-low\\">997,650.18</td><td class=\\"col-chg\\">+0.04%</td><td class=\\"col-volume\\">7.54M</td><td class=\\"col-time closed\\"><time datetime=\\"\\" class=\\"text\\">06/03</time><span class=\\"s-exchange\\">Nyse</span><span class=\\"icon-clock\\" aria-hidden=\\"true\\"></span></td></tr><tr class=\\"common-table-item\\"><td class=\\"col-mark\\"><input type=\\"checkbox\\"></td><td class=\\"col-name\\"><span class=\\"text\\">Dow 70</span></td><td class=\\"col-last highlight\\">24,884.14</td><td class=\\"col-high\\">26,924.12</td><td class=\\"col-low\\">8,650.18</td><td class=\\"col-chg\\">+0.04%</td><td class=\\"col-volume\\">7.54M</td><td class=\\"col-time closed\\"><time datetime=\\"\\" class=\\"text\\">06/03</time><span class=\\"s-exchange\\">Cboe</span><span class=\\"icon-clock\\" aria-hidden=\\"true\\"></span></td></tr><tr class=\\"common-table-item\\"><td class=\\"col-mark\\"><input type=\\"checkbox\\"></td><td class=\\"col-name\\"><span class=\\"text\\">Dow 80</span></td><td class=\\"col-last highlight down\\">24,884.14</td><td class=\\"col-high\\">14,924.12</td><td class=\\"col-low\\">93,650.18</td><td class=\\"col-chg\\">+0.04%</td><td class=\\"col-volume\\">7.54M</td><td class=\\"col-time closed\\"><time datetime=\\"\\" class=\\"text\\">06/03</time><span class=\\"s-exchange\\">Nyse</span><span class=\\"icon-clock\\" aria-hidden=\\"true\\"></span></td></tr></tbody></table></div></div>",\r\n\r\n  "major-indices-performance": "<table class=\\"common-table high js-table data-table-style\\" data-section=\\"performance\\"><colgroup><col class=\\"col-name\\"><col class=\\"col-last\\"><col class=\\"col-high\\"><col class=\\"col-low\\"><col class=\\"col-chg\\"><col class=\\"col-volume\\"><col class=\\"col-time\\"></colgroup><thead><tr><th col-name=\\"mark\\"></th><th col-name=\\"name\\"><span class=\\"text\\">Name</span><span class=\\"drag-handle\\">&nbsp;+&nbsp;</span></th><th col-name=\\"last\\"><span class=\\"text\\">Last</span><span class=\\"drag-handle\\">&nbsp;+&nbsp;</span></th><th col-name=\\"high\\" data-type=\\"price\\"><span class=\\"text\\">High</span><span class=\\"drag-handle\\">&nbsp;+&nbsp;</span></th><th col-name=\\"low\\" data-type=\\"price\\"><span class=\\"text\\">Low</span><span class=\\"drag-handle\\">&nbsp;+&nbsp;</span></th><th col-name=\\"chg\\" data-type=\\"percent\\"><span class=\\"text\\">Chg %</span><span class=\\"drag-handle\\">&nbsp;+&nbsp;</span></th><th col-name=\\"volume\\"><span class=\\"text\\">Volume</span><span class=\\"drag-handle\\">&nbsp;+&nbsp;</span></th><th col-name=\\"time\\"><span class=\\"text\\">Time</span><span class=\\"drag-handle\\">&nbsp;+&nbsp;</span></th></tr></thead><tbody><tr class=\\"common-table-item\\"><td class=\\"col-mark\\"><input type=\\"checkbox\\"></td><td class=\\"col-name\\"><span class=\\"text\\">Dow 10</span></td><td class=\\"col-last highlight\\">24,884.14</td><td class=\\"col-high\\">34,324.12</td><td class=\\"col-low\\">3,650.18</td><td class=\\"col-chg\\">+0.04%</td><td class=\\"col-volume\\">7.54M</td><td class=\\"col-time opened\\"><time datetime=\\"\\" class=\\"text\\">06/03</time><span class=\\"s-exchange\\">Toronto</span><span class=\\"icon-clock\\" aria-hidden=\\"true\\"></span></td></tr><tr class=\\"common-table-item\\"><td class=\\"col-mark\\"><input type=\\"checkbox\\"></td><td class=\\"col-name\\"><span class=\\"text\\">Dow 20</span></td><td class=\\"col-last highlight up\\">24,884.14</td><td class=\\"col-high\\">24,124.12</td><td class=\\"col-low\\">33,650.18</td><td class=\\"col-chg\\">+0.04%</td><td class=\\"col-volume\\">7.54M</td><td class=\\"col-time closed\\"><time datetime=\\"\\" class=\\"text\\">06/03</time><span class=\\"s-exchange\\">Amsterdam</span><span class=\\"icon-clock\\" aria-hidden=\\"true\\"></span></td></tr><tr class=\\"common-table-item\\"><td class=\\"col-mark\\"><input type=\\"checkbox\\"></td><td class=\\"col-name\\"><span class=\\"text\\">Dow 30</span></td><td class=\\"col-last highlight up\\">24,884.14</td><td class=\\"col-high\\">54,524.12</td><td class=\\"col-low\\">23,650.18</td><td class=\\"col-chg\\">+0.04%</td><td class=\\"col-volume\\">7.54M</td><td class=\\"col-time opened\\"><time datetime=\\"\\" class=\\"text\\">06/03</time><span class=\\"s-exchange\\">Nsadaq</span><span class=\\"icon-clock\\" aria-hidden=\\"true\\"></span></td></tr><tr class=\\"common-table-item\\"><td class=\\"col-mark\\"><input type=\\"checkbox\\"></td><td class=\\"col-name\\"><span class=\\"text\\">Dow 40</span></td><td class=\\"col-last highlight\\">24,884.14</td><td class=\\"col-high\\">11,924.12</td><td class=\\"col-low\\">63,650.18</td><td class=\\"col-chg\\">+0.04%</td><td class=\\"col-volume\\">7.54M</td><td class=\\"col-time opened\\"><time datetime=\\"\\" class=\\"text\\">06/03</time><span class=\\"s-exchange\\">Nsadaq</span><span class=\\"icon-clock\\" aria-hidden=\\"true\\"></span></td></tr></tbody></table>"\r\n\r\n}';});

/**
 * Created by Skeksify on 09/07/2016.
 */

define('TemplateManager',[
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


define('text!Modules/mainFrame/scheme2.json',[],function () { return '{\r\n  "cont" : {\r\n    "view": "mainContentView",\r\n    "vars": {\r\n      "name": "Ben",\r\n      "takeOverBg": "yup",\r\n      "bodyClass": "white"\r\n    },\r\n    "nested": {\r\n      "from": {\r\n        "view": "from",\r\n        "vars": {\r\n          "fromLabel": "Skeksify"\r\n        },\r\n        "nested": {\r\n          "companyName": {\r\n            "view": "companyNameView",\r\n            "vars": {\r\n              "companyNameLabel": "Investing Ltd."\r\n            }\r\n          }\r\n        }\r\n      },\r\n      "header": {\r\n        "view": "companyNameView",\r\n        "vars": {\r\n          "companyNameLabel": "Success."\r\n        }\r\n      },\r\n      "iterMacher": {\r\n        "view": "iter1",\r\n        "vars": {\r\n          "rows": ["Yabba", " dubbah", " DOO"],\r\n          "rowsa": {"a":"OBYabba", "b":" OBdubbah", "c":" OBDOO"}\r\n        }\r\n      }\r\n    }\r\n  }\r\n}';});

/**
 * Created by Skeksify on 09/07/2016.
 */

define('Modules/topBar/topBarView',[
    "underscore",
    "jquery",
    "Backbone",
    "Displayable"
], function (_, $, Backbone, Displayable) {
    return Displayable.extend({

        events: {
            "mouseover.lt #searchTextTop": "_al"
        },

        _markupScheme: {
        },

        initialize: function () {
            Displayable.prototype.initialize.call(this, 'topBar', 'topBar', true);

        },

        render: function () {
            Displayable.prototype.render.call(this, {}, this._markupScheme);

            return this.$el;
        },

		_al: function () {
			this.$el.off('mouseover.lt');
		}
    })
});

/**
 * Created by Skeksify on 09/07/2016.
 */

define('Modules/rightContent/rightContentView',[
    "underscore",
    "jquery",
    "Backbone",
    "Displayable"
], function (_, $, Backbone, Displayable) {
    return Displayable.extend({

		events: {
			"mouseover #QBS_2_inner>tbody>tr": "_all"
		},

        _markupScheme: {
			"trs": "#QBS_2_inner>tbody>tr"
        },

        initialize: function () {
            Displayable.prototype.initialize.call(this, 'rightContent', 'rightContent', true);
        },

        render: function () {
            Displayable.prototype.render.call(this, {}, this._markupScheme);

            return this.$el;
        },

		_all: function (e) {
			const $target = $(e.currentTarget);
			$target.css('background', '#111');
			setTimeout(() => $target.css('background', 'none'), 500);
		}
    })
});

/**
 * Created by Skeksify on 09/07/2016.
 */

define('Modules/mainFrame/mainFrameView',[
    "underscore",
    "jquery",
    "Backbone",
    "Displayable",
    "Toolset/Toolset",
    "Modules/topBar/topBarView",
    "Modules/rightContent/rightContentView"
], function (_, $, Backbone, Displayable, Toolset, TopBarView, RightContentView) {
    return Displayable.extend({
        _topBar: null,
        _markupScheme: {
            "topBar": ".top-bar",
            "mainContent": ".main-content",
            "rightContent": ".right-content",
        },

        initialize: function () {
            Displayable.prototype.initialize.call(this, 'mainFrame', 'mainFrame', true);
            this._topBar = new TopBarView();
            this._rightContent = new RightContentView();
        },

        render: function () {
            Displayable.prototype.render.call(this, {}, this._markupScheme);
            this._topBar.render();
            this._rightContent.render();
            return this.$el;
        },

        setMainContent: function (content) {
            this._dom.mainContent.html(content)
        }
    })
});

/**
 * Created by Skeksify on 09/07/2016.
 */

define('Modules/mainFrame/mainFrame',[
    "underscore",
    "jquery",
    "Backbone",
	"EventBus",
	"TemplateManager",
	"text!./scheme2.json",
    "./mainFrameView"
], function (_, $, Backbone, EventBus, TemplateManager, scheme2, View) {
    var scheme2Obj = JSON.parse(scheme2),
        view,
		getCacheParam = () => {
    		let result = '?v=';
    		if (0){ // No cache
				result += (new Date).getTime()
			} else if (0) { // One day
    			result += Math.floor((new Date).getTime() / (1000*60*60*24));
			}
			return result;
		}

    return Backbone.Model.extend({
        _sectionToModelMap: {
            'index': 'Modules/mainContent/mainContentView',
            'major-indices': {
				'model': 'Modules/indices/MajorIndicesView',
				'scheme': 'text!Schemes/MajorIndicesScheme.json'
			},
            'indices': {
				'model': 'Modules/indices/IndicesView',
				'scheme': 'text!Schemes/indicesScheme.json'
			},
            'news': 'Modules/news/newsView',
            'portfolio': 'Modules/Portfolios/Portfolios',
            'equities': {
            	'model': 'Modules/equities/equitiesView',
				'scheme': 'text!Schemes/equitiesScheme.json'
			}
        },

        initialize: function () {
            view = new View();
			EventBus.on('CompileTemplates', this._renderToHeaders.bind(this, scheme2Obj))
        },

        render: function () {
            return view.render();
        },

        navigate: function (schemeNav, section, p1, p2) {
        	const modelPath = this._sectionToModelMap[section];

        	// Todo: DESTROY PREVIOUS!

			$(document).attr("title", section);
			if (schemeNav) {
				require([modelPath.model, modelPath.scheme + getCacheParam()], (ModelClass, Scheme) => {
					let schemeObj = JSON.parse(Scheme);
					this._renderTemplatesAndInject(schemeObj).then(renderedView => {
						view.setMainContent(renderedView);
						(new ModelClass(p1, p2, true)).render(p1, p2, true);
						// EventBus.trigger('mainFrameInsertion', renderedView);
					})
				})
			} else {
				require([modelPath], function (ModelClass) {
					let modelInstance = new ModelClass(p1, p2),
						renderedView = modelInstance.render(p1, p2);

					view.setMainContent(renderedView);
					EventBus.trigger('mainFrameInsertion', renderedView);
					$(document).attr("title", section);
				})
			}
        },

		_renderTemplatesAndInject: function (schemeToRender) {
			return TemplateManager.render(schemeToRender); // Promise
		},

		_renderToHeaders: function (schemeToRender) {
            this._renderTemplatesAndInject(schemeToRender).then(cont => {
                view.$el.find('h1').eq(1).html(cont);
                view.$el.find('h2').html(cont);
            });
		}
    });
});

/**
 * Created by Skeksify on 09/07/2016.
 */

define('Modules/Mutators/Mutator',[
    "underscore",
    "jquery",
    "Backbone"
], function (_, $, Backbone) {
	let currentMutateeName;
    const Mutator = Backbone.Model.extend({
		initialize: function () { },

		mutate: function (mutatee, mutations, mutateeName) {
			currentMutateeName = mutateeName;
			mutations.map(mapping => this._applyFunction(mutatee, ...mapping));
		},

		_applyFunction: function(mutatee, fuName, fu) {
			if (fuName) {
				if (mutatee[fuName]) {
					throwError(`${currentMutateeName} Mutation Exception`, `Function '${fuName}' already exists`);
				} else {
					mutatee[fuName] = fu;
				}
			}
		}
	});

    return new Mutator();
});

/**
 * Created by Skeksify on 09/07/2016.
 */

define('Modules/Mutators/underscoreMutator',[
    "underscore",
    "jquery",
    "Backbone",
	"./Mutator"
], function (_, $, Backbone, Mutator) {

	const functionSet = [
		['isntEmpty', obj => !_.isEmpty(obj)],
		['isUn', _.isUndefined],
		['isSt', _.isString],
		['isNu', _.isNumber],
		['e', _.each],
		['bindSet', function (set, context) {
			return set.map(fu => fu.bind(context));
		}],
		['swap', function (arr, i1, i2) {
			const first = arr[i1];
			arr[i1] = arr[i2];
			arr[i2] = first;
			return arr;
		}],
		['relocate', function(arr, from, to) {
			arr.splice(to, 0, arr.splice(from, 1)[0]);
			return arr;
		}],
		['injectByIndices', function (arr, indices, itemsArray) {
			let i = 0;
			_.e(indices, index => {
				arr.splice(index, 0, itemsArray[i++]);
			})
			return arr;
		}],
		['extractByIndices', function (arr, indices) {
			let result = [],
				gaps = [], offset = 0,
				fillGaps = arr.length > 1; // Need to fill gaps to maintain indices for multiple removals

			_.e(indices, index => {
				if (fillGaps) {
					result.push(arr.splice(index, 1, undefined)[0]);
					gaps.push(index);
				} else { // Quandary! Differentiate between undefined and no param
					result.push(arr.splice(index, 1)[0]);
				}
			})

			if (fillGaps) {
				_.e(gaps, gapIndex => {
					arr.splice(gapIndex - (offset++), 1);
				})
			}

			return result;
		}],
		['getByIndices', function (arr, indices) {
			let result = [];

			_.e(indices, index => {
				result.push(arr.slice(+index, +index + 1)[0]);
			})

			return result;
		}],
		['existsIn', function (arr, value) {
			return _.indexOf(arr, value) > -1;
		}]
	]

	Mutator.mutate(_, functionSet, 'Underscore');
});

/**
 * Created by Skeksify on 09/07/2016.
 */

define('Modules/Mutators/jQueryMutator',[
	"jquery",
	"underscore",
	"./Mutator"
], function ($, _, Mutator) {
	const fnFunctionSet = [
		['exists', function () {
			// return !!$(this).length;
			return !!this[0]; // Less actions
		}],
		['isEmpty', function () {
			return !this[0];
		}],
		['_show', function () {
			return $(this).removeClass('displayNone');
		}],
		['_hide', function () {
			return $(this).addClass('displayNone');
		}],
		['_toggleShow', function (flag) {
			var action;
			if (_.isUn(flag)) {
				action = $(this).hasClass('displayNone') ? '_show' : '_hide';
			} else {
				action = flag ? '_show' : '_hide';
			}
			return $(this)[action]();
		}],
		['isChildOf', function ($ofThis) {
			var result;
			if (_.isSt($ofThis)) {
				result = !!this.parents($ofThis).length
			} else {
				result = $.contains($ofThis[0], this[0]);
			}
			return result;
		}],
		['swapWith', function ($withThis) {
			$.swapElements($(this), $withThis);
		}],
		['', ],
	],
	functionSet = [
		['elementAcc', function (action) {
			return (acc, item) => {
				const itemRes = action ? action(item) : item;
				return acc ? acc.add(itemRes) : itemRes
			}
		}],
		['swapElements', function ($first, $second) { // Make two DOM elements trade places
			var $worthlessSpan = $('<span/>');
			$first.after($worthlessSpan);
			$second.after($first);
			$worthlessSpan.after($second).remove();
		}],
		['is$elem', function ($possibleElem) {
			return $possibleElem instanceof $;
		}]
	],
	StringFunctionSet = [
		['is', function (secondValue, caseSensitive) {
			return !_.isUn(_.find([].concat(secondValue), (val) => match(this, toStr(val), caseSensitive)));
		}],
		['isnt', function (secondValue, caseSensitive) {
			return !toStr(this).is(secondValue, caseSensitive);
		}]
	];

	function toStr(str) {
		return '' + str;
	}

	function match(val1, val2, caseSensitive) {
		return caseSensitive ? (toStr(val1) === toStr(val2)) : (toStr(val1).toLowerCase() === toStr(val2).toLowerCase());
	}

	Mutator.mutate($, functionSet, '$');
	Mutator.mutate($.fn, fnFunctionSet, '$.fn');
	Mutator.mutate(String.prototype, StringFunctionSet, 'String.prototype');
});

/**
 * Created by Skeksify on 09/07/2016.
 */

define('Modules/Mutators/backboneMutator',[
    "underscore",
    "jquery",
    "Backbone"
], function (_, $, Backbone) {
    Backbone.ModelI = Backbone.Model.extend({});
	Backbone.ModelI.prototype.sync = function () { return null; }
	Backbone.ModelI.prototype.fetch = function () { return null; }
	Backbone.ModelI.prototype.save = function () { return null; }
});

/**
 * Created by Skeksify on 09/07/2016.
 */

define('app/router',[
    "underscore",
    "jquery",
    "Backbone",
    "Modules/mainFrame/mainFrame"
], function (_, $, Backbone) {
    var debug = function() { if (1) debugger; };

    return Backbone.Model.extend({
        _dispatchNavigation: function (schemeNav, section, p1, p2) {
            this.trigger('navigation', schemeNav, section, p1, p2);
        },

        initialize: function () {
            var RouterClass = Backbone.Router.extend({
                routes: {
                    '': 'index',
                    'news/:category/:article': 'news',
                    'indices/major-indices(-:inner)': 'm_indices',
                    'indices/:instrument': 'indices',
                    'equities/:instrument': 'equities',
                    'portfolio/(:pId)': 'portfolio'
                },
                index: () => this._dispatchNavigation(false, 'index'),
                news: (category, article) => this._dispatchNavigation(false, 'news', category, article),
                indices: (indices) => this._dispatchNavigation(true, 'indices', indices),
                m_indices: (inner) => this._dispatchNavigation(true, 'major-indices', inner),
				equities: (equities) => this._dispatchNavigation(true, 'equities', equities),
                portfolio: (portfolioId) => this._dispatchNavigation(false, 'portfolio', portfolioId)
            });

            window.InvestingApp.Router = new RouterClass();

			// window.InvestingApp.Router.on('route', () => {debugger;});

            $(document).on("click", "a[href]:not([data-bypass])", function(evt) {
                var href = { prop: $(this).prop("href"), attr: $(this).attr("href") },
                    root = location.protocol + "//" + location.host + window.InvestingApp.root;

                if (href.prop.slice(0, root.length) === root) { // Inner link
                    evt.preventDefault();
                    window.InvestingApp.Router.navigate(href.attr, { trigger: true });
                }
            });
            return this;
        }
    })
});

window.InvestingApp = {};

define('app/investing',[
    "underscore",
    "jquery",
    "Backbone",
	"External/lz-string",
	"Toolset/Toolset",
	"Modules/ToolsetUI/ToolsetUIView",
    "Modules/mainFrame/mainFrame",
    "Modules/Mutators/underscoreMutator",
    "Modules/Mutators/jQueryMutator",
    "Modules/Mutators/backboneMutator",
    "./router"
], function (_, $, Backbone, LZstring, Toolset, ToolsetUIView, MainFrame, underscoreMutator, jQueryMutator, backboneMutator, Router) {
    var investingApp;

    window.InvestingApp.Router = {};
    window.InvestingApp.root = '/';

    investingApp = Backbone.Model.extend({
        init: function () {
            let router = new Router(),
                main_frame = new MainFrame(),
                $body = $(document.body);

			$body.append(main_frame.render());

			if ('Not Production') {
				this._toolsetUIView = new ToolsetUIView();

				$body.append(this._toolsetUIView.render());
            }
            router.on('navigation', function (...params) {
                main_frame.navigate(...params);
            });

            Backbone.history.start({
                pushState: true,
                root: window.InvestingApp.root
            });
        }
    });

    return new investingApp();
});

/**
 * Created by Skeksify on 09/07/2016.
 */

define('app/main',['require','./investing'],function (require) {
    (function () {
        var app = require('./investing');
        app.init();
    })();
});


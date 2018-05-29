'use strict';

(function () {

    var specObj = { a1: 1, a2: 3498, a3: 49589, a4: 'HI' },
        daPromise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log('Done, firing all resolutions');
            resolve('Data');
        }, 2500);
    });

    daPromise.then(function (data) {
        return console.log('@@' + data + '@@');
    });

    specObj[Symbol.iterator] = function () {
        var _this = this,
            i = 0;

        return {
            next: function next() {
                console.log(++i);
                return {
                    value: i <= 4 ? _this['a' + i] : undefined,
                    done: i > 4
                };
            }
        };
    };

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = specObj[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var moi = _step.value;

            console.log(moi);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
})();

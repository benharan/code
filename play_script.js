'use strict';
(function () {

    let specObj = { a1: 1, a2: 3498, a3: 49589, a4: 'HI' },
        daPromise = new Promise(function(resolve, reject) {
            setTimeout(() => {
                console.log('Done, firing all resolutions');
                resolve('Data');
			}, 2500);
        });

    daPromise.then(data => console.log(`@@${data}@@`));

    specObj[Symbol.iterator] = function () {
        let _this = this,
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

    for(var moi of specObj) {
        console.log(moi);
    }

})()

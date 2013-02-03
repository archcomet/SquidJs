(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Factory = (function () {

        /**
         * Factory
         * @return {*}
         * @constructor
         */

        function Factory(engine) {
            this.engine = engine;
            return Factory.alloc(this, arguments);
        }

        app.inherit(app.BaseObj, Factory);

        return Factory;

    }());

}(window));
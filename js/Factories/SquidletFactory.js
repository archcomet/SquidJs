(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Factory.SquidletFactory = (function () {

        /**
         * SquidletFactory
         * @return {*}
         * @constructor
         */

        function SquidletFactory() {
            return SquidletFactory.alloc(this, arguments);
        }

        app.inherit(app.Factory, SquidletFactory);

        SquidletFactory.prototype.spawnSquidlet = function (options) {

        };

        SquidletFactory.prototype.despawnSquidlet = function (entity) {

        };

        return SquidletFactory;

    }());

}(window));
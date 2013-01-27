(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System = (function () {

        /**
         * System
         * An object that contains game logic.
         * @param engine
         * @return {*}
         * @constructor
         */

        function System(engine) {
            this.engine = engine;
            return System.alloc(this);
        }
        app.inherit(app.BaseObj, System);

        return System;

    }());

}(window));
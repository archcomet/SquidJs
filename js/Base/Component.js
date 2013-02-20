(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Component = (function () {

        /**
         * Component
         * An object that contains game state.
         * @param options
         * @return {*}
         * @constructor
         */

        function Component(options) {
            return Component.alloc(this, arguments);
        }

        app.inherit(app.BaseObj, Component);

        return Component;

    }());

}(window));
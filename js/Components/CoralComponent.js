(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Component.CoralComponent = (function () {

        /**
         * CoralComponent
         * Provides coral properties to Entity
         * @param options
         * @return {*}
         * @constructor
         */

        function CoralComponent(options) {
            return CoralComponent.alloc(this, arguments);
        }

        app.inherit(app.Component, CoralComponent);

        CoralComponent.prototype.init = function (options) {
            _.defaults(this, options, {
                vertices: []
            });

            return this;
        };

        return CoralComponent;

    }());

}(window));
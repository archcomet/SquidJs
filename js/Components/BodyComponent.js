(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Component.BodyComponent = (function () {

        /**
         * BodyComponent
         * Provides body shape data to Entity
         * @param options
         * @return {*}
         * @constructor
         */

        function BodyComponent(options) {
            return BodyComponent.alloc(this, arguments);
        }
        app.inherit(app.Component, BodyComponent);

        BodyComponent.prototype.init = function (options) {
            _.defaults(this, options, {
                radius: 10.0,
                thickness: 5.0,
                eyeRadius: 5.0,
                irisRadius: 2.0
            });
            return this;
        };

        return BodyComponent;

    }());

}(window));
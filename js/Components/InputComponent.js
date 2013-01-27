(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Component.InputComponent = (function () {

        /**
         * InputComponent
         * Provides human input to Entity
         * @param options
         * @return {*}
         * @constructor
         */

        function InputComponent(options) {
            return InputComponent.alloc(this, arguments);
        }
        app.inherit(app.Component, InputComponent);


        InputComponent.prototype.init = function (options) {
            _.defaults(this, options, {
                respondToInput: true
            });
        };

        return InputComponent;

    }());

}(window));
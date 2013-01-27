(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Component.ColorComponent = (function () {

        /**
         * ColorComponent
         * Provides color data to Entity
         * @param options
         * @return {*}
         * @constructor
         */

        function ColorComponent(options) {
            return ColorComponent.alloc(this, arguments);
        }
        app.inherit(app.Component, ColorComponent);

        ColorComponent.prototype.init = function (options) {
            _.defaults(this, options, {
                h: 0,
                s: 0,
                v: 0,
                dark: true
            });

            var strokeV = (this.dark) ? this.v + 30 : this.v - 30;
            this.hslFill = 'hsl(' + this.h + ', ' + this.s + '%, ' + this.v + '%)';
            this.hslStroke = 'hsl(' + this.h + ', ' + this.s + '%, ' + strokeV + '%)';
            return this;
        };

        return ColorComponent;

    }());

}(window));
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

            this.setShade(1);
            return this;
        };

        ColorComponent.prototype.setShade = function (shade) {
            var strokeV = (this.dark) ? this.v + 0.3 : this.v - 0.3;
            this.shade = shade;
            this.hslFill = 'hsl(' + this.h + ', ' + 100 * this.s * shade + '%, ' + 100 * this.v * shade + '%)';
            this.hslStroke = 'hsl(' + this.h + ', ' + 100 * this.s * shade + '%, ' + 100 * strokeV * shade + '%)';
        };

        return ColorComponent;

    }());

}(window));
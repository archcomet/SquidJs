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
            var strokeV = (this.dark) ? this.v + 30 : this.v - 30;
            this.shade = shade;
            this.hslFill = 'hsl(' + this.h + ', ' + this.s * shade + '%, ' + this.v * shade + '%)';
            this.hslStroke = 'hsl(' + this.h + ', ' + this.s * shade + '%, ' + strokeV * shade + '%)';
        };

        return ColorComponent;

    }());

}(window));
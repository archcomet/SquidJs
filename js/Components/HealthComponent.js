(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Component.HealthComponent = (function () {

        /**
         * HealthComponent
         * @param options
         * @return {*}
         * @constructor
         */

        function HealthComponent(options) {
            return HealthComponent.alloc(this, arguments);
        }

        app.inherit(app.Component, HealthComponent);

        HealthComponent.prototype.init = function (options) {
            _.defaults(this, options, {
                health: 100
            });
            this.maxHealth = this.health;
            return this;
        };

        return HealthComponent;

    }());

}(window));
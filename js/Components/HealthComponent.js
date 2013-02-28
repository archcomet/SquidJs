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
                health: undefined,
                maxHealth: 100,
                hardness: 5,
                invulFrames: 0,
                stunFrames: 0,
                damageMask: 0x0000
            });
            if (this.health === undefined) {
                this.health = this.maxHealth;
            }
            return this;
        };

        return HealthComponent;

    }());

}(window));
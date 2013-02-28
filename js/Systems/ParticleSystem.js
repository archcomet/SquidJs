(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.ParticleSystem = (function () {

        /**
         * ParticleSystem
         * @return {*}
         * @constructor
         */

        function ParticleSystem(engine) {
            return ParticleSystem.alloc(this, arguments);
        }

        app.inherit(app.System, ParticleSystem);


        ParticleSystem.prototype.init = function () {
            this.engine.bindEvent('update', this);
            return this;
        };

        ParticleSystem.prototype.deinit = function () {
            this.engine.unbindEvent('update', this);
            return this;
        };

        ParticleSystem.prototype.update = function (dt) {
            // do stuff
        };

        return ParticleSystem;

    }());

}(window));
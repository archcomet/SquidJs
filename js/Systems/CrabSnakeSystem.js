(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.CrabSnakeSystem = (function () {

        /**
         * CrabSnakeSystem
         * @return {CrabSnakeSystem}
         * @constructor
         */

        function CrabSnakeSystem(engine) {
            return CrabSnakeSystem.alloc(this, arguments);
        }

        app.inherit(app.System, CrabSnakeSystem);

        CrabSnakeSystem.prototype.init = function () {
            this.engine.bindEvent('update', this);
            this.engine.bindEvent('entityAdded', this);
            this.engine.bindEvent('entityRemoved', this);
            return this;
        };

        CrabSnakeSystem.prototype.deinit = function () {
            this.engine.unbindEvent('update', this);
            this.engine.unbindEvent('entityAdded', this);
            this.engine.unbindEvent('entityRemoved', this);
        };

        CrabSnakeSystem.prototype.update = function (dt) {

        };

        CrabSnakeSystem.prototype.entityAdded = function (entity) {
            // do something
        };

        CrabSnakeSystem.prototype.entityRemoved = function (entity) {
            // do something
        };

        return CrabSnakeSystem;

    }());

}(window));
(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.RockSnakeSystem = (function () {

        /**
         * RockSnakeSystem
         * @return {RockSnakeSystem}
         * @constructor
         */

        function RockSnakeSystem(engine) {
            return RockSnakeSystem.alloc(this, arguments);
        }

        app.inherit(app.System, RockSnakeSystem);

        RockSnakeSystem.prototype.init = function () {
            this.engine.bindEvent('update', this);
            this.engine.bindEvent('entityAdded', this);
            this.engine.bindEvent('entityRemoved', this);
            return this;
        };

        RockSnakeSystem.prototype.deinit = function () {
            this.engine.unbindEvent('update', this);
            this.engine.unbindEvent('entityAdded', this);
            this.engine.unbindEvent('entityRemoved', this);
        };

        RockSnakeSystem.prototype.update = function (dt) {

        };

        RockSnakeSystem.prototype.entityAdded = function (entity) {
            // do something
        };

        RockSnakeSystem.prototype.entityRemoved = function (entity) {
            // do something
        };

        return RockSnakeSystem;

    }());

}(window));
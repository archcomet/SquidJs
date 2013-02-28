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
            return this;
        };

        RockSnakeSystem.prototype.deinit = function () {
            this.engine.unbindEvent('update', this);
        };

        RockSnakeSystem.prototype.update = function (dt) {

        };


        return RockSnakeSystem;

    }());

}(window));
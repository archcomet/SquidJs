(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.StageSystem = (function () {

        /**
         * StageSystem
         * @return {*}
         * @constructor
         */

        function StageSystem(engine) {
            return StageSystem.alloc(this, arguments);
        }

        app.inherit(app.System, StageSystem);


        StageSystem.prototype.init = function () {
            this.engine.bindEvent('update', this);
            return this;
        };

        StageSystem.prototype.deinit = function () {
            this.engine.unbindEvent('update', this);
            return this;
        };

        StageSystem.prototype.update = function (dt) {
            // do stuff
        };

        return StageSystem;

    }());

}(window));
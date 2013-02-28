(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.ScoreSystem = (function () {

        /**
         * ScoreSystem
         * @return {*}
         * @constructor
         */

        function ScoreSystem(engine) {
            return ScoreSystem.alloc(this, arguments);
        }

        app.inherit(app.System, ScoreSystem);


        ScoreSystem.prototype.init = function () {
            this.engine.bindEvent('update', this);
            return this;
        };

        ScoreSystem.prototype.deinit = function () {
            this.engine.unbindEvent('update', this);
            return this;
        };

        ScoreSystem.prototype.update = function (dt) {
            // do stuff
        };

        return ScoreSystem;

    }());

}(window));
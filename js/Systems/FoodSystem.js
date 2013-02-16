(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.FoodSystem = (function () {

        /**
         * FoodSystem
         * @return {*}
         * @constructor
         */

        function FoodSystem(engine) {
            return FoodSystem.alloc(this, arguments);
        }

        app.inherit(app.System, FoodSystem);


        FoodSystem.prototype.init = function () {
            //this.engine.bindEvent('entityAdded', this);
            //this.engine.bindEvent('entityRemoved', this);
            return this;
        };

        FoodSystem.prototype.deinit = function () {
            //this.engine.unbindEvent('entityAdded', this);
            //this.engine.unbindEvent('entityRemoved', this);
        };

        FoodSystem.prototype.entityAdded = function (entity) {

        };

        FoodSystem.prototype.entityRemoved = function (entity) {

        };

        return FoodSystem;

    }());

}(window));
(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.RockSystem = (function () {

        /**
         * CoralRenderSystem
         * @return {*}
         * @constructor
         */

        function RockSystem(engine) {
            return RockSystem.alloc(this, arguments);
        }

        app.inherit(app.System, RockSystem);


        RockSystem.prototype.init = function () {
            this.createModel(
                ['RockComponent', 'PositionComponent', 'ColorComponent'],
                this.entityAdded,
                this.entityRemoved
            );
            return this;
        };

        RockSystem.prototype.deinit = function () {
            this.destroyModel();
        };

        RockSystem.prototype.entityAdded = function (entity) {
            var rockNode = new app.RockNode(entity);
            this.engine.canvas.addChild(rockNode);
        };

        RockSystem.prototype.entityRemoved = function (entity) {
            this.engine.canvas.removeChildForEntity(entity);
        };

        return RockSystem;

    }());

}(window));
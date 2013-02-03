(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.CoralRenderSystem = (function () {

        /**
         * CoralRenderSystem
         * @return {*}
         * @constructor
         */

        function CoralRenderSystem(engine) {
            return CoralRenderSystem.alloc(this, arguments);
        }

        app.inherit(app.System, CoralRenderSystem);


        CoralRenderSystem.prototype.init = function () {
            this.createModel(
                ['CoralComponent', 'PositionComponent', 'ColorComponent'],
                this.entityAdded,
                this.entityRemoved
            );
            return this;
        };

        CoralRenderSystem.prototype.deinit = function () {
            this.destroyModel();
        };

        CoralRenderSystem.prototype.entityAdded = function (entity) {

           // bodyDrawNode = new app.DrawNode(entity, this.drawCoral, entity.PositionComponent.zOrder);
        };

        CoralRenderSystem.prototype.entityRemoved = function (entity) {

        };

        CoralRenderSystem.prototype.drawCoral = function (ctx, entity) {

        };

        return CoralRenderSystem;

    }());

}(window));
(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.DrawNode.FoodNode = (function () {

        /**
         * FoodNode
         * @param entity
         * @return {*}
         * @constructor
         */

        function FoodNode(entity) {
            return FoodNode.alloc(this, arguments);
        }

        app.inherit(app.DrawNode, FoodNode);

        FoodNode.prototype.draw = function (ctx) {
            var t = this.entity.engine.timer.counter,
                food = this.entity.FoodComponent,
                color = this.entity.ColorComponent,
                radius = food.radius * (1.0 + Math.sin(t / food.radius) * Math.cos(t / food.radius));

            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2, false);
            ctx.lineWidth = 1;
            ctx.setCachedFillStyle(color.hslFill);
            ctx.setCachedStrokeStyle(color.hslStroke);
            ctx.fill();
            ctx.stroke();
        };

        return FoodNode;

    }());

}(window));
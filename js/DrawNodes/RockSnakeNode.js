(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.DrawNode.RockSnakeNode = (function () {

        /**
         * RockSnakeNode
         * @param entity
         * @return {RockSnakeNode}
         * @constructor
         */

        function RockSnakeNode(entity) {
            return RockSnakeNode.alloc(this, arguments);
        }

        app.inherit(app.DrawNode, RockSnakeNode);

        RockSnakeNode.prototype.draw = function (ctx) {
            var t = this.entity.engine.timer.counter,
                body = this.entity.RockSnakeComponent,
                color = this.entity.ColorComponent,
                radius = body.radius;

            ctx.lineWidth = 3.0;
            ctx.setCachedFillStyle(color.hslFill);
            ctx.setCachedStrokeStyle(color.hslStroke);
            ctx.beginPath();
            ctx.moveTo(radius * -(3 / 6), radius * (4 / 6));
            ctx.lineTo(radius * -(5 / 6), radius);
            ctx.lineTo(radius * -(4 / 6), radius * (3 / 6));
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.moveTo(radius * -(4 / 6), radius * -(3 / 6));
            ctx.lineTo(radius * -(5 / 6), radius * -1);
            ctx.lineTo(radius * -(3 / 6), radius * -(4 / 6));
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            radius = body.radius * (1.0 + Math.pow(Math.sin(t / 10), 12) / 10);
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.arc(-radius * 0.3, 0, radius * 0.7, 0, Math.PI * 2, false);
            ctx.setCachedFillStyle('hsl(356, 87%, 34%)');
            ctx.setCachedStrokeStyle('hsl(356, 87%, 63%)');
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            radius = body.radius;
            ctx.lineWidth = 4.0;
            ctx.setCachedFillStyle(color.hslFill);
            ctx.setCachedStrokeStyle(color.hslStroke);
            ctx.beginPath();
            ctx.moveTo(radius * (5 / 6), 0);
            ctx.lineTo(radius * (4 / 6), radius * (3 / 6));
            ctx.lineTo(radius * (3 / 6), radius * (5 / 6));
            ctx.lineTo(radius * (1 / 6), radius);
            ctx.lineTo(radius * -(2 / 6), radius * (9 / 6));
            ctx.lineTo(radius * -(1 / 6), radius * (5 / 6));
            ctx.lineTo(radius * -(2 / 6), radius * (2 / 6));
            ctx.lineTo(radius * -(5 / 6), 0);
            ctx.lineTo(radius * -(2 / 6), radius * -(2 / 6));
            ctx.lineTo(radius * -(1 / 6), radius * -(5 / 6));
            ctx.lineTo(radius * -(2 / 6), radius * -(9 / 6));
            ctx.lineTo(radius * (1 / 6), radius * -1);
            ctx.lineTo(radius * (3 / 6), radius * -(5 / 6));
            ctx.lineTo(radius * (4 / 6), radius * -(3 / 6));
            ctx.lineTo(radius * (5 / 6), 0);
            ctx.fill();
            ctx.stroke();

            ctx.setCachedFillStyle('hsl(40, 100%, 90%)');
            ctx.setCachedStrokeStyle('hsl(40, 100%, 70%)');
            ctx.beginPath();
            ctx.arc(radius * 0.4, 0, radius * 0.2, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

        };

        return RockSnakeNode;

    }());

}(window));
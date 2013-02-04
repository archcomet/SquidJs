(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.CreatureBodyNode = (function () {

        /**
         * CreatureBodyNode
         * @param entity
         * @return {*}
         * @constructor
         */

        function CreatureBodyNode(entity) {
            return CreatureBodyNode.alloc(this, arguments);
        }
        app.inherit(app.DrawNode, CreatureBodyNode);


        CreatureBodyNode.prototype.draw = function (ctx) {
            var t = this.entity.engine.timer.counter,
                body = this.entity.BodyComponent,
                color = this.entity.ColorComponent,
                radius = body.radius * (1.0 + Math.pow(Math.sin(t / body.radius), 12) / 10);

            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2, false);
            ctx.lineWidth = body.thickness;
            ctx.fillStyle = color.hslFill;
            ctx.strokeStyle = color.hslStroke;
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, body.eyeRadius, 0, Math.PI * 2, false);
            ctx.lineWidth = 1;
            ctx.fillStyle = 'hsl(0, 0%, 100%)';
            ctx.strokeStyle = color.hslStroke;
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(body.irisPosition.x, body.irisPosition.y, body.irisRadius, 0, Math.PI * 2, false);
            ctx.fillStyle = 'hsl(0, 0%, 0%)';
            ctx.fill();
        };

        return CreatureBodyNode;

    }());

}(window));
(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.DrawNode.TentaclesNode = (function () {

        /**
         * TentaclesNode
         * @param entity
         * @return {*}
         * @constructor
         */

        function TentaclesNode(entity) {
            return TentaclesNode.alloc(this, arguments);
        }
        app.inherit(app.DrawNode, TentaclesNode);

        TentaclesNode.prototype.init = function (entity) {
            TentaclesNode.parent.init.call(this, entity);
            this.autotransform = false;
        };

        TentaclesNode.prototype.draw = function (ctx) {
            var i, n, tentacles = this.entity.TentaclesComponent.tentacles;
            for (i = 0, n = tentacles.length; i < n; i += 1) {
                ctx.setCachedFillStyle(this.entity.ColorComponent.hslFill);
                ctx.setCachedStrokeStyle(this.entity.ColorComponent.hslStroke);
                this.drawTentacle(ctx, tentacles[i]);
            }
        };

        TentaclesNode.prototype.drawTentacle = function (ctx, tentacle) {
            var o = tentacle.outer[0],
                i = tentacle.inner[0];

            ctx.beginPath();
            ctx.moveTo(o.x, o.y);
            ctx.curveThroughPoints(tentacle.outer);
            ctx.curveThroughPoints(tentacle.inner.reverse());
            ctx.lineTo(i.x, i.y);
            ctx.closePath();
            ctx.fill();

            if (this.entity.TentaclesComponent.radius > 2) {
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        };

        return TentaclesNode;

    }());

}(window));
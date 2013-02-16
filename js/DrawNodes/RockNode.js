(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.DrawNode.RockNode = (function () {

        /**
         * RockNode
         * @param entity
         * @return {*}
         * @constructor
         */

        function RockNode(entity) {
            return RockNode.alloc(this, arguments);
        }
        app.inherit(app.DrawNode, RockNode);

        RockNode.prototype.draw = function (ctx) {
            var i, n,
                color = this.entity.ColorComponent,
                rock = this.entity.RockComponent;

            ctx.lineWidth = 10;
            ctx.lineJoin = 'round';
            ctx.setCachedFillStyle(color.hslFill);
            ctx.setCachedStrokeStyle(color.hslStroke);

            ctx.beginPath();
            ctx.moveTo(rock.vertices[0].x, rock.vertices[0].y);

            for (i = 0, n = rock.vertices.length; i < n; i += 1) {
                ctx.lineTo(rock.vertices[i].x, rock.vertices[i].y);
            }

            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        };

        return RockNode;

    }());

}(window));
(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.CoralFactory = (function () {

        /**
         * CoralFactory
         * @return {*}
         * @constructor
         */

        function CoralFactory() {
            return CoralFactory.alloc(this, arguments);
        }

        app.inherit(app.Factory, CoralFactory);

        CoralFactory.prototype.makeCoral = function (options) {

            _.defaults(options, {
                minRadius: 4,
                maxRadius: 30,
                vertexCount: 7
            });

            app.assert(options.vertexCount > 2, 'Coral must have 3 or more vertices');

            var i, n, theta, radius,
                lastStep = 0,
                vertices = [],
                step = (Math.PI * 2) / options.vertexCount;

            for (i = 0, n = options.vertexCount; i < n; i += 1) {
                theta = app.random(lastStep, lastStep + step);
                radius = app.random(options.minRadius, options.maxRadius);
                lastStep += step;
                vertices.push({
                    x: Math.cos(theta) * radius,
                    y: Math.sin(theta) * radius
                });
            }

            return this.engine.createEntity({
                tag: 'coral_',
                components: {
                    PositionComponent: {
                        x: 10,
                        y: 10
                    },
                    ColorComponent: {
                        h: app.random(0, 360),
                        s: app.random(50, 100),
                        v: app.random(30, 55)
                    },
                    CoralComponent: {
                        verticies: vertices
                    }
                }
            });
        };
        return CoralFactory;

    }());

}(window));
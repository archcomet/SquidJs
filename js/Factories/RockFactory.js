(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.RockFactory = (function () {

        /**
         * RockFactory
         * @return {*}
         * @constructor
         */

        function RockFactory() {
            return RockFactory.alloc(this, arguments);
        }

        app.inherit(app.Factory, RockFactory);

        RockFactory.prototype.makeRock = function (options) {
            options = options || {};

            _.defaults(options, {
                minRadius: 50,
                maxRadius: 75,
                vertexCount: 7,
                x: 0,
                y: 0
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
                tag: 'rock_',
                components: {
                    PositionComponent: {
                        x: options.x,
                        y: options.y
                    },
                    ColorComponent: {
                        h: 228,
                        s: 50,
                        v: 30
                    },
                    RockComponent: {
                        vertices: vertices
                    },
                    PhysicsComponent: {
                        bodyDef: {
                            type: b2.Body.b2_dynamicBody,
                            linearDampening: 0.2,
                            angularDampening: 0.2
                        },
                        fixtureDef: {
                            density: 5,
                            friction: 0.5,
                            restitution: 0.1,
                            shape: b2.makeShape({
                                type: 'polygon',
                                vertices: vertices
                            })
                        }
                    }
                }
            });
        };
        return RockFactory;

    }());

}(window));
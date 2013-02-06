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
                minRadius: 60,
                maxRadius: 75,
                vertexCount: 5,
                x: 0,
                y: 0
            });

            var vertices = app.randomConvexPolygon(options.vertexCount, options.minRadius, options.maxRadius);

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
                        drag: -0.4,
                        bodyDef: {
                            type: b2.Body.b2_dynamicBody,
                            linearDampening: 0.1,
                            angularDampening: 0.1
                        },
                        fixtureDef: {
                            density: 3,
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
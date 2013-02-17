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

        RockFactory.prototype.createRock = function (options) {
            options = options || {};

            _.defaults(options, {
                minRadius: 60,
                maxRadius: 75,
                maxHealth: 60,
                vertexCount: 5,
                x: 0,
                y: 0
            });

            var entity, vertices = app.randomConvexPolygon(options.vertexCount, options.minRadius, options.maxRadius);

            entity = new app.Entity({
                tag: 'rock_',
                components: {
                    RockComponent: {
                        vertices: vertices,
                        minRadius: options.minRadius,
                        maxRadius: options.maxRadius
                    },
                    HealthComponent: {
                        health: options.maxHealth
                    },
                    PositionComponent: {
                        x: options.x,
                        y: options.y,
                        zOrder: 20
                    },
                    ColorComponent: {
                        h: 171,
                        s: 40,
                        v: 20
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
                },
                nodes: {
                    RockNode: {
                        zOrder: 0
                    }
                }
            });

            this.engine.addEntity(entity);
            return entity;
        };

        RockFactory.prototype.destroyRock = function (entity) {
            this.engine.removeEntity(entity);
            entity.destroy();
        };

        return RockFactory;

    }());

}(window));
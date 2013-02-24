(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Factory.RockFactory = (function () {

        /**
         * RockFactory
         * @return {*}
         * @constructor
         */

        function RockFactory(engine) {
            return RockFactory.alloc(this, arguments);
        }

        app.inherit(app.Factory, RockFactory);

        RockFactory.prototype.init = function () {
            RockFactory.parent.init.call(this);
            _.defaults(this.settings, {
                zOrder: 20,
                minRadius: 50,
                maxRadius: 90,
                maxVertexCount: 9,
                maxHealth: 60,
                color: { h: 171, s: 0.4, v: 0.2 },
                drag: -0.4,
                linearDampening: 0.1,
                angularDampening: 0.1,
                density: 3,
                friction: 0.5,
                restitution: 0.1
            });
        };

        RockFactory.prototype.spawn = function (options) {
            var entity, vertices;

            options = options || {};
            _.defaults(options, {
                minRadius: this.settings.minRadius,
                maxRadius: this.settings.maxRadius,
                maxHealth: this.settings.maxHealth,
                vertexCount: this.settings.maxVertexCount,
                x: 0,
                y: 0
            });

            vertices = app.randomConvexPolygon(options.vertexCount, options.minRadius, options.maxRadius);

            entity = this.createEntity({
                tag: 'rock_',
                components: {
                    RockComponent: {
                        vertices: vertices,
                        minRadius: options.minRadius,
                        maxRadius: options.maxRadius
                    },
                    HealthComponent: {
                        maxHealth: options.maxHealth
                    },
                    PositionComponent: {
                        x: options.x,
                        y: options.y,
                        zOrder: this.settings.zOrder
                    },
                    ColorComponent: {
                        h: this.settings.color.h,
                        s: this.settings.color.s,
                        v: this.settings.color.v
                    },
                    PhysicsComponent: {
                        drag: this.settings.drag,
                        bodyDef: {
                            type: b2.Body.b2_dynamicBody,
                            linearDampening: this.settings.linearDampening,
                            angularDampening: this.settings.angularDampening
                        },
                        fixtureDef: {
                            density: this.settings.density,
                            friction: this.settings.friction,
                            restitution: this.settings.restitution,
                            shape: b2.makeShape({
                                type: 'polygon',
                                vertices: vertices
                            }),
                            filter: b2.makeFilterData(
                                app.entityCategory.OBJECT,
                                app.entityMask.OBJECT,
                                0
                            )
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

        return RockFactory;

    }());

}(window));
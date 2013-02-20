(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Factory.SquidFactory = (function () {

        /**
         * SquidFactory
         * @return {*}
         * @constructor
         */

        function SquidFactory(engine) {
            return SquidFactory.alloc(this, arguments);
        }

        app.inherit(app.Factory, SquidFactory);

        SquidFactory.prototype.spawn = function (options) {
            var entity, segmentLength = options.segmentLength,
                radius = options.radius,
                thickness = options.thickness,
                velocity = options.velocity,
                force = options.force,
                sprint = options.sprint,
                tentacleCount = options.tentacleCount || 3;

            entity = this.createEntity({
                tag: 'squid_',
                components: {
                    SquidComponent: {
                        radius: radius,
                        thickness: thickness,
                        eyeRadius: radius * 0.6,
                        irisRadius: radius * 0.4
                    },
                    InputComponent: {},
                    SteeringComponent: {
                        maxSteeringVelocity: velocity,
                        maxSteeringForce: force,
                        sprintMultiplier: sprint
                    },
                    PositionComponent: {
                        x: app.random(this.engine.canvas.width, this.engine.canvas.width * 2),
                        y: app.random(this.engine.canvas.height, this.engine.canvas.height * 2),
                        zOrder: options.zOrder
                    },
                    PhysicsComponent: {
                        drag: -0.4,
                        bodyDef: {
                            type: b2.Body.b2_dynamicBody,
                            linearDampening: 0.1,
                            fixedRotation: true
                        },
                        fixtureDef: {
                            density: 0.5,
                            friction: 0.5,
                            restitution: 0.2,
                            shape: b2.makeShape({
                                type: 'circle',
                                radius: radius + thickness
                            })
                        }
                    },
                    TentaclesComponent: {
                        count: tentacleCount,
                        segmentCount: 6,
                        segmentLength: segmentLength,
                        radius: (radius + thickness - 2) / 2.2,
                        friction: 0.94,
                        variance: 0.02
                    },
                    ColorComponent: {
                        h: app.random(0, 360),
                        s: app.random(50, 100),
                        v: app.random(30, 50)
                    }
                },
                nodes: {
                    SquidNode: {
                        zOrder: 0
                    },
                    TentaclesNode: {
                        zOrder: -1
                    }
                }
            });

            this.engine.addEntity(entity);
            return entity;
        };

        return SquidFactory;

    }());

}(window));
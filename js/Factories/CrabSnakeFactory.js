(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Factory.CrabSnakeFactory = (function () {

        /**
         * CrabSnakeFactory
         * @return {CrabSnakeFactory}
         * @constructor
         */

        function CrabSnakeFactory(engine) {
            return CrabSnakeFactory.alloc(this, arguments);
        }

        app.inherit(app.Factory, CrabSnakeFactory);

        CrabSnakeFactory.prototype.spawn = function (options) {
            _.defaults(options, {
                x: 0,
                y: 0
            });

            var radius = 40, entity = this.createEntity({
                tag: 'entity_',
                components: {
                    CrabSnakeComponent: {
                        radius: radius
                    },
                    PositionComponent: {
                        x: options.x,
                        y: options.y,
                        angle: Math.PI * -0.7,
                        zOrder: options.zOrder
                    },
                    ColorComponent: {
                        h: 180,
                        s: 60,
                        v: 6
                    },
                    TentaclesComponent: {
                        count: 1,
                        segmentCount: 15,
                        segmentLength: 40,
                        radius: 20,
                        friction: 0.92,
                        variance: 0.0
                    },
                    InputComponent: {},
                    SteeringComponent: {
                        maxForwardVelocity: 35,
                        maxSteeringVelocity: 10,
                        maxAngularVelocity: 1.3,
                        maxForwardThrust: 400,
                        maxSteeringForce: 200,
                        maxTorque: 200,
                        sprintMultiplier: 1
                    },
                    PhysicsComponent: {
                        drag: -0.4,
                        bodyDef: {
                            type: b2.Body.b2_dynamicBody,
                            linearDampening: 0.1
                        },
                        fixtureDef: {
                            density: 3,
                            friction: 0.5,
                            restitution: 0.2,
                            shape: b2.makeShape({
                                type: 'circle',
                                radius: radius
                            })
                        }
                    }
                },
                nodes: {
                    CrabSnakeNode: {
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

        return CrabSnakeFactory;

    }());

}(window));
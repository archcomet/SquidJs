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

        CrabSnakeFactory.prototype.init = function () {
            CrabSnakeFactory.parent.init.call(this);
            _.defaults(this.settings, {
                radius: 40,
                color: { h: 180, s: 0.6, v: 0.06 },
                segmentCount: 15,
                segmentLength: 40,
                segmentRadius: 20,
                segmentFriction: 0.92,
                maxForwardVelocity: 35,
                maxSteeringVelocity: 10,
                maxAngularVelocity: 1.3,
                maxForwardThrust: 400,
                maxSteeringForce: 200,
                maxTorque: 200,
                sprintMultiplier: 1,
                drag: -0.4,
                linearDampening: 0.1,
                density: 3,
                friction: 0.5,
                restitution: 0.2
            });
        };

        CrabSnakeFactory.prototype.spawn = function (options) {
            _.defaults(options, {
                x: 0,
                y: 0
            });

            var entity = this.createEntity({
                tag: 'entity_',
                components: {
                    CrabSnakeComponent: {
                        radius: this.settings.radius
                    },
                    PositionComponent: {
                        x: options.x,
                        y: options.y,
                        angle: 0,
                        zOrder: options.zOrder
                    },
                    ColorComponent: {
                        h: this.settings.color.h,
                        s: this.settings.color.s,
                        v: this.settings.color.v
                    },
                    TentaclesComponent: {
                        count: 1,
                        segmentCount: this.settings.segmentCount,
                        segmentLength: this.settings.segmentLength,
                        radius: this.settings.segmentRadius,
                        friction: this.settings.segmentFriction,
                        variance: 0.0
                    },
                    InputComponent: {},
                    SteeringComponent: {
                        maxForwardVelocity: this.settings.maxForwardVelocity,
                        maxSteeringVelocity: this.settings.maxSteeringVelocity,
                        maxAngularVelocity: this.settings.maxAngularVelocity,
                        maxForwardThrust: this.settings.maxForwardThrust,
                        maxSteeringForce: this.settings.maxSteeringForce,
                        maxTorque: this.settings.maxTorque,
                        sprintMultiplier: this.settings.sprintMultiplier
                    },
                    PhysicsComponent: {
                        drag: this.settings.drag,
                        bodyDef: {
                            type: b2.Body.b2_dynamicBody,
                            linearDampening: this.settings.linearDampening
                        },
                        fixtureDef: {
                            density: this.settings.density,
                            friction: this.settings.friction,
                            restitution: this.settings.restitution,
                            shape: b2.makeShape({
                                type: 'circle',
                                radius: this.settings.radius
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
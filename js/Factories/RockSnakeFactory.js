(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Factory.RockSnakeFactory = (function () {

        /**
         * RockSnakeFactory
         * @return {RockSnakeFactory}
         * @constructor
         */

        function RockSnakeFactory(engine) {
            return RockSnakeFactory.alloc(this, arguments);
        }

        app.inherit(app.Factory, RockSnakeFactory);

        RockSnakeFactory.prototype.init = function () {
            RockSnakeFactory.parent.init.call(this);
            _.defaults(this.settings, {
                radius: 40,
                color: { h: 180, s: 0.6, v: 0.06 },
                //health
                maxHealth: 1500,
                hardness: 100,
                segmentCount: 15,
                segmentLength: 40,
                segmentRadius: 20,
                segmentFriction: 0.92,
                maxForwardVelocity: 30,
                maxSteeringVelocity: 25,
                maxAngularVelocity: 2.5,
                maxForwardThrust: 400,
                maxSteeringForce: 200,
                maxTorque: 200,
                sprintMultiplier: 1,
                drag: -0.4,
                linearDampening: 0.1,
                density: 3,
                friction: 0.5,
                restitution: 0.2,
                impactModifier: 4
            });
        };

        RockSnakeFactory.prototype.spawn = function (options) {
            _.defaults(options, {
                x: 0,
                y: 0
            });

            var entity = this.createEntity({
                tag: 'entity_',
                components: {
                    RockSnakeComponent: {
                        radius: this.settings.radius
                    },
                    RockSnakeAIComponent: {
                    },
                    HealthComponent: {
                        maxHealth: this.settings.maxHealth,
                        hardness: this.settings.hardness,
                        damageMask: app.damageMask.FOE
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
                        impactModifier: this.settings.impactModifier,
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
                            }),
                            filter: b2.makeFilterData(
                                app.entityCategory.FOE,
                                app.entityMask.FOE,
                                0
                            )
                        }
                    }
                },
                nodes: {
                    RockSnakeNode: {
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

        return RockSnakeFactory;

    }());

}(window));
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

        SquidFactory.prototype.init = function () {
            SquidFactory.parent.init.call(this);
            _.defaults(this.settings, {
                zOrder: 10,
                radius: 25,
                thickness: 3,
                colorMin: {
                    h: 0,
                    s: 0.5,
                    v: 0.3
                },
                colorMax: {
                    h: 360,
                    s: 1,
                    v: 0.5
                },
                tentacleCount: 5,
                segmentCount: 6,
                segmentLength: 28,
                segmentFriction: 0.94,
                segmentVariance: 0.02,
                maxSteeringVelocity: 22,
                maxSteeringForce: 600,
                sprintMultiplier: 2,
                drag: -0.4,
                linearDampening: 0.1,
                density: 0.5,
                friction: 0.5,
                restitution: 0.2

            });
        };

        SquidFactory.prototype.spawn = function (options) {

            _.defaults(options, {
                x: 0,
                y: 0,
                zOrder: this.settings.zOrder
            });

            var entity = this.createEntity({
                tag: 'squid_',
                components: {
                    SquidComponent: {
                        radius: this.settings.radius,
                        thickness: this.settings.thickness,
                        eyeRadius: this.settings.radius * 0.6,
                        irisRadius: this.settings.radius * 0.4
                    },
                    SquidPlayerComponent: {},
                    SteeringComponent: {
                        maxSteeringVelocity: this.settings.maxSteeringVelocity,
                        maxSteeringForce: this.settings.maxSteeringForce,
                        sprintMultiplier: this.settings.sprintMultiplier
                    },
                    PositionComponent: {
                        x: options.x,
                        y: options.y,
                        zOrder: options.zOrder
                    },
                    PhysicsComponent: {
                        drag: this.settings.drag,
                        bodyDef: {
                            type: b2.Body.b2_dynamicBody,
                            linearDampening: this.settings.linearDampening,
                            fixedRotation: true
                        },
                        fixtureDef: {
                            density: this.settings.density,
                            friction: this.settings.friction,
                            restitution: this.settings.restitution,
                            shape: b2.makeShape({
                                type: 'circle',
                                radius: this.settings.radius + this.settings.thickness
                            }),
                            filter: b2.makeFilterData(
                                app.entityCategory.PLAYER,
                                app.entityMask.PLAYER,
                                0
                            )
                        }
                    },
                    TentaclesComponent: {
                        count: this.settings.tentacleCount,
                        segmentCount: this.settings.segmentCount,
                        segmentLength: this.settings.segmentLength,
                        radius: (this.settings.radius + this.settings.thickness - 2) / 2.2,
                        friction: this.settings.segmentFriction,
                        variance: this.settings.segmentVariance
                    },
                    ColorComponent: {
                        h: app.random(this.settings.colorMin.h, this.settings.colorMax.h),
                        s: app.random(this.settings.colorMin.s, this.settings.colorMax.s),
                        v: app.random(this.settings.colorMin.v, this.settings.colorMax.v)
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
            this.engine.systems.CameraSystem.setTargetEntity(entity);
            return entity;
        };

        return SquidFactory;

    }());

}(window));
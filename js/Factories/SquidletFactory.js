(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Factory.SquidletFactory = (function () {

        /**
         * SquidletFactory
         * @return {*}
         * @constructor
         */

        function SquidletFactory(engine) {
            return SquidletFactory.alloc(this, arguments);
        }

        app.inherit(app.Factory, SquidletFactory);

        SquidletFactory.prototype.init = function () {
            SquidletFactory.parent.init.call(this);

            _.defaults(this.settings, {
                zOrder: 5,
                minRadius: 10,
                maxRadius: 19,
                minThickness: 1,
                maxThickness: 5,
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
                tentacleCount: 3,
                segmentCount: 6,
                segmentMinLength: 12,
                segmentMaxLength: 16,
                segmentFriction: 0.94,
                segmentVariance: 0.02,
                minSteeringVelocity: 17,
                maxSteeringVelocity: 19,
                minSteeringForce: 400,
                maxSteeringForce: 600,
                sprintMultiplier: 2,
                drag: -0.4,
                linearDampening: 0.1,
                density: 0.5,
                friction: 0.5,
                restitution: 0.2

            });
        };

        SquidletFactory.prototype.spawn = function (options) {
            options = options || { x: 0, y: 0 };

            var entity, radius = app.random(this.settings.minRadius, this.settings.maxRadius),
                thickness = app.random(this.settings.minThickness, this.settings.maxThickness);

            entity = this.createEntity({
                tag: 'squidlet_',
                components: {
                    SquidComponent: {
                        radius: radius,
                        thickness: thickness,
                        eyeRadius: radius * 0.6,
                        irisRadius: radius * 0.4
                    },
                    InputComponent: {},
                    SteeringComponent: {
                        maxSteeringVelocity: app.random(this.settings.minSteeringVelocity, this.settings.maxSteeringVelocity),
                        maxSteeringForce: app.random(this.settings.minSteeringForce, this.settings.maxSteeringForce),
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
                                radius: radius + thickness
                            })
                        }
                    },
                    TentaclesComponent: {
                        count: this.settings.tentacleCount,
                        segmentCount: 6,
                        segmentLength: app.random(this.settings.segmentMinLength, this.settings.segmentMaxLength),
                        radius: (radius + thickness - 2) / 2.2,
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
            return entity;
        };

        return SquidletFactory;

    }());

}(window));
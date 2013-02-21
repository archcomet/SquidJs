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

        SquidletFactory.prototype.spawn = function (options) {
            options = options || { x: 0, y: 0 };

            var entity, settings = this.engine.settings.squidletSettings,
                radius = app.random(settings.minRadius, settings.maxRadius),
                thickness = app.random(settings.minThickness, settings.maxThickness);

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
                        maxSteeringVelocity: app.random(settings.minVelocity, settings.maxSteeringVelocity),
                        maxSteeringForce: app.random(settings.minForce, settings.maxSteeringForce),
                        sprintMultiplier: settings.sprintMultiplier
                    },
                    PositionComponent: {
                        x: options.x,
                        y: options.y,
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
                        count: settings.tentacleCount,
                        segmentCount: 6,
                        segmentLength: app.random(settings.minSegmentLength, settings.maxSegmentLength),
                        radius: (radius + thickness - 2) / 2.2,
                        friction: 0.94,
                        variance: 0.02
                    },
                    ColorComponent: {
                        h: app.random(0, 360),
                        s: app.random(0.5, 1),
                        v: app.random(0.3, 0.5)
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
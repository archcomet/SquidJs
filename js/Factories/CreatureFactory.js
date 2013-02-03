(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.CreatureFactory = (function () {

        /**
         * CreatureFactory
         * @return {*}
         * @constructor
         */

        function CreatureFactory(engine) {
            return CreatureFactory.alloc(this, arguments);
        }

        app.inherit(app.Factory, CreatureFactory);

        CreatureFactory.prototype.makeCreature = function (options) {
            var segmentLength = options.segmentLength,
                radius = options.radius,
                thickness = options.thickness,
                velocity = options.velocity,
                force = options.force,
                sprint = options.sprint;

            return this.engine.createEntity({
                tag: 'creature_',
                components: {
                    InputComponent: {},
                    SteeringComponent: {
                        maxVelocity: velocity,
                        maxForce: force,
                        sprintMultiplier: sprint
                    },
                    PositionComponent: {
                        x: app.random(this.engine.canvas.width, this.engine.canvas.width * 2),
                        y: app.random(this.engine.canvas.height, this.engine.canvas.height * 2)
                    },
                    PhysicsComponent: {
                        bodyDef: {
                            type: b2.Body.b2_dynamicBody,
                            linearDampening: 0.2
                        },
                        fixtureDef: {
                            density: 0.5,
                            friction: 0.5,
                            restitution: 0.5,
                            shape: b2.makeShape({
                                type: 'circle',
                                radius: radius + thickness
                            })
                        }
                    },
                    BodyComponent: {
                        radius: radius,
                        thickness: thickness,
                        eyeRadius: radius * 0.6,
                        irisRadius: radius * 0.4
                    },
                    TentaclesComponent: {
                        count: 5,
                        segmentCount: 7,
                        segmentLength: segmentLength,
                        radius: (radius + thickness - 2) / 2.2,
                        friction: 0.88,
                        variance: 0.02
                    },
                    ColorComponent: {
                        h: app.random(0, 360),
                        s: app.random(50, 100),
                        v: app.random(30, 55)
                    }
                }
            });
        };

        return CreatureFactory;

    }());

}(window));
(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.start = function start() {
        var engine = new app.Engine({
                container: $('#container')[0],
                systems: [
                    'MouseInputSystem',
                    'SquidControlSystem',
                    'SteeringSystem',
                    'PhysicsSystem',
                    'CameraSystem',
                    'RockSystem',
                    'FoodSystem',
                    'SquidSystem',
                    'TentaclesSystem',
                    'BackgroundSystem'
                ],
                factories: [
                    'FoodFactory',
                    'RockFactory',
                    'SquidFactory',
                    'SquidletFactory'
                ],
                settings: {
                    rockSystem: {
                        minImpulseForDamage: 4,
                        minRadiusForFragments: 15,
                        numberOfFragments: 3,
                        foodSpawnRate: 0.2,
                        minFoodImpulse: 1,
                        maxFoodImpulse: 3
                    },
                    tentaclesSystem: {
                        friction: 0.01,
                        wind: 0.03,
                        gravity: 0.05
                    },
                    squidletFactory: {
                        minSegmentLength: 12,
                        maxSegmentLength: 16,
                        minRadius: 10,
                        maxRadius: 19,
                        minThickness: 1,
                        maxThickness: 5,
                        minVelocity: 18,
                        maxVelocity: 19,
                        minForce: 400,
                        maxForce: 500,
                        sprintMultiplier: 2,
                        tentacleCount: 3
                    }
                }
            });

        engine.systems.CameraSystem.setTargetEntity(engine.factories.SquidFactory.spawn({
            segmentLength: 28,
            radius: 25,
            thickness: 3,
            velocity: 22,
            force: 600,
            sprint: 2,
            tentacleCount: 7,
            zOrder: 10
        }));

        engine.start();

        global.myEngine = engine;
    };

}(window));

//mvp client systems
//todo hostile creature node
//todo AI behavior system
//todo health system
//todo environment spawn system
//todo scoring system
//todo game over screen
//todo start/restart game command
//todo start menu
//todo options
//todo sign in / authorization
//todo leader board
//todo achievements

//mvp server systems
//todo data service
//todo database

//bonus
//todo particle system
//todo damage indicators
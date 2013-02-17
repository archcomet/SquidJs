(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.start = function start() {
        var i, entity,
            engine = new app.Engine({
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
                    }
                }
            });

        for (i = 0; i < 3; i += 1) {
            engine.factories.RockFactory.spawnRock({
                x: app.random(0, 1500),
                y: app.random(1000, 1500)
            });
        }

        for (i = 0; i < 6; i += 1) {
            engine.factories.SquidFactory.spawnSquid({
                segmentLength: app.random(12, 16),
                radius: app.random(10, 19),
                thickness: app.random(1, 5),
                velocity: app.random(18, 19),
                force: app.random(400, 500),
                sprint: 2
            });
        }

        entity = engine.factories.SquidFactory.spawnSquid({
            segmentLength: 28,
            radius: 25,
            thickness: 3,
            velocity: 22,
            force: 600,
            sprint: 2,
            tentacleCount: 7,
            zOrder: 10
        });

        engine.systems.CameraSystem.setTargetEntity(entity);
        engine.start();

        global.myEngine = engine;
    };

}(window));

//mvp client systems
//todo squidlet
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
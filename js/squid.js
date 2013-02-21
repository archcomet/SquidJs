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
                'CrabSnakeSystem',
                'TentaclesSystem',
                'BackgroundSystem'
            ],
            factories: [
                'CrabSnakeFactory',
                'FoodFactory',
                'RockFactory',
                'SquidFactory',
                'SquidletFactory'
            ],
            settings: {
                rockSettings: {
                    minRadius: 50,
                    maxRadius: 90,
                    maxHealth: 70,
                    impulseToDamage: 4,
                    fragmentRadiusLimit: 15,
                    fragmentCount: 3,
                    fragmentImpulseMultiplier: 0.5,
                    foodSpawnRate: 0.2,
                    minFoodImpulse: 1,
                    maxFoodImpulse: 3
                },
                tentacleSettings: {
                    friction: 0.01,
                    wind: 0.03,
                    gravity: 0.05
                },
                squidletSettings: {
                    minSegmentLength: 12,
                    maxSegmentLength: 16,
                    minRadius: 10,
                    maxRadius: 19,
                    minThickness: 1,
                    maxThickness: 5,
                    minVelocity: 18,
                    maxSteeringVelocity: 19,
                    minForce: 400,
                    maxSteeringForce: 500,
                    sprintMultiplier: 2,
                    tentacleCount: 3
                }
            }
        });

        engine.systems.CameraSystem.setTargetEntity(engine.factories.SquidFactory.spawn({
            x: app.random(engine.canvas.width, engine.canvas.width * 2),
            y: app.random(engine.canvas.height, engine.canvas.height * 2)
        }));

        engine.start();

        global.myEngine = engine;
    };

}(window));

//todo angular steering system
//todo angular pursuit
//todo angular evade
//todo refactor settings for all factories and systems
//todo refactor Squid spawner
//todo create debug despawner
//todo fixture for CrabSnake shell
//todo CrabSnake-Rock collision response
//todo CrabSnake AI
//todo linear pursuit
//todo linear evade
//todo Squidlet AI
//todo Health system
//todo scoring system
//todo start/restart game command
//todo main menu screen
//todo game over screen
//todo server side api
//todo leader board screen
//todo sign in / authorization

//todo environment spawn system
//todo audio
//todo music
//todo achievements


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
                ]
            });

        engine.creatureFactory = new app.SquidFactory(engine);
        engine.foodFactory = new app.FoodFactory(engine);
        engine.rockFactory = new app.RockFactory(engine);

        for (i = 0; i < 3; i += 1) {
            engine.rockFactory.createRock({
                x: app.random(0, 1500),
                y: app.random(1000, 1500),
                vertexCount: 9,
                minRadius: 40,
                maxRadius: 90
            });
        }

        for (i = 0; i < 6; i += 1) {
            engine.creatureFactory.createSquid({
                segmentLength: app.random(12, 16),
                radius: app.random(10, 19),
                thickness: app.random(1, 5),
                velocity: app.random(18, 19),
                force: app.random(400, 500),
                sprint: 2
            });
        }

        entity = engine.creatureFactory.createSquid({
            segmentLength: 28,
            radius: 25,
            thickness: 3,
            velocity: 22,
            force: 600,
            sprint: 2,
            tentacleCount: 7
        });

        engine.systems.CameraSystem.setTargetEntity(entity);
        engine.start();

        global.myEngine = engine;
    };

}(window));

//improvements
//todo factories to keep handle on their creations
//todo formalize factory creation in engine

//mvp client systems
//todo pickup logic
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
//todo rock damage texture
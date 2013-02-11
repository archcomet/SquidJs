(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.start = function start() {
        var i, entity,
            engine = new app.Engine({
                container: $('#container')[0],
                systems: [
                    'MouseInputSystem',
                    'CreatureControlSystem',
                    'SteeringSystem',
                    'PhysicsSystem',
                    'CameraSystem',
                    'BackgroundSystem',
                    'CreatureBodySystem',
                    'RockSystem'
                ]
            }),
            creatureFactory = new app.CreatureFactory(engine),
            rockFactory = new app.RockFactory(engine);

        for (i = 0; i < 3; i += 1) {
            rockFactory.makeRock({
                x: app.random(0, 1500),
                y: app.random(1000, 1500),
                vertexCount: 9,
                minRadius: 40,
                maxRadius: 90
            });
        }

        for (i = 0; i < 10; i += 1) {
            creatureFactory.makeCreature({
                segmentLength: app.random(5, 11),
                radius: app.random(10, 19),
                thickness: app.random(1, 5),
                velocity: app.random(20, 25),
                force: app.random(300, 600),
                sprint: 2
            });
        }

        entity = creatureFactory.makeCreature({
            segmentLength: 25,
            radius: 25,
            thickness: 3,
            velocity: 26,
            force: 700,
            sprint: 2,
            tentacleCount: 5
        });

        engine.systems.CameraSystem.setTargetEntity(entity);
        engine.start();

        global.myEngine = engine;
    };

}(window));


//todo collision response
//todo rock system
//todo food renderer
//todo pickups
//todo hostile creature render (maybe just different color squids)
//todo AI behavior system
//todo health system
//todo environment spawn system
//todo scoring
//todo start menu
//todo options
//todo leader board
//todo game over screen

//todo data service
//todo database
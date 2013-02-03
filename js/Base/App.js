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
                    'CreatureRenderSystem'
                ]
            }),
            creatureFactory = new app.CreatureFactory(engine),
            coralFactory = new app.CoralFactory(engine);

        coralFactory.makeCoral({
            minRadius: 5,
            maxRadius: 30,
            vertexCount: 7
        });

        for (i = 0; i < 14; i++) {
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
            segmentLength: 20,
            radius: 25,
            thickness: 3,
            velocity: 26,
            force: 700,
            sprint: 2
        });

        engine.systems.CameraSystem.setTargetEntity(entity);
        engine.start();

        global.myEngine = engine;
    };

}(window));


//todo rock renderer
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
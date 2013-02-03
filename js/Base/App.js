(function (global) {
    'use strict';

    global.app = global.app || {};

    function makeCreature(engine, options) {
        var segmentLength = options.segmentLength,
            radius = options.radius,
            thickness = options.thickness,
            velocity = options.velocity,
            force = options.force,
            sprint = options.sprint;

        return engine.createEntity({
            tag: 'creature_',
            components: {
                InputComponent: {},
                SteeringComponent: {
                    maxVelocity: velocity,
                    maxForce: force,
                    sprintMultiplier: sprint
                },
                PositionComponent: {
                    x: random(engine.canvas.width, engine.canvas.width * 2),
                    y: random(engine.canvas.height, engine.canvas.height * 2)
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
                        //filter: b2.makeFilterData(0x0000, 0x0000, 0),
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
                    h: random(0, 360),
                    s: random(50, 100),
                    v: random(30, 55)
                }
            }
        });
    }

    global.app.start = function start() {
        var i, engine, entity;

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
        });

        for (i = 0; i < 14; i++) {
            makeCreature(engine, {
                segmentLength: random(5, 11),
                radius: random(10, 19),
                thickness: random(1, 5),
                velocity: random(20, 25),
                force: random(300, 600),
                sprint: 2
            });
        }

        entity = makeCreature(engine, {
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


//todo refactor modelList (one modelList per system)
//todo refactor creature render system into two systems

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
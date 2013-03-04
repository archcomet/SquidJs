(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.start = function start() {
        global.engine = new app.Engine({
            container: $('#container')[0],
            systems: [
                'StageSystem',
                'PhysicsSystem',
                'HealthSystem',
                'MouseInputSystem',
                'SquidControlSystem',
                'SquidletAISystem',
                'RockSnakeAISystem',
                'SteeringSystem',
                'CameraSystem',
                'RockSystem',
                'FoodSystem',
                'SquidSystem',
                'RockSnakeSystem',
                'TentaclesSystem',
                'ParticleSystem',
                'BackgroundSystem',
                'ScoreSystem'
            ],
            factories: [
                'FoodFactory',
                'RockFactory',
                'RockSnakeFactory',
                'SquidFactory',
                'SquidletFactory'
            ]
        }).start();
    };

}(window));

//todo scoring system
//todo game over screen
//todo main menu screen

// Final week
//todo server side api
//todo sign in / authorization
//todo leader board screen
//todo last minute polish
//todo music

// out of scope for this class :(
//todo sound effects
//todo achievements
//todo particle system
//todo damage textures

//future improvements
//todo centralize death event and onHit event
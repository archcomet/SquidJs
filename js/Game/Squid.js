(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.start = function start() {
        global.engine = new app.Engine({
            container: $('#canvasContainer')[0],
            inputContainer: $('#container')[0],
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
                'ScoreSystem',
                'UiSystem'
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
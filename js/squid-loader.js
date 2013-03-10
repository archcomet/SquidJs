(function (global) {
    'use strict';

    global.app = global.app || {};
    global.app.verbose = true;

    var files = {
        debug: [
            // Resources
            'resource!images/backgroundNoise.png',
            // 3rd party
            'js/3rdParty/jquery.js',
            'js/3rdParty/underscore.js',
            'js/3rdParty/Box2dWeb-2.1.a.3.js',
            'js/3rdParty/stats.min.js',
            'js/3rdParty/dat.gui.js',
            // Game
            'js/Game/Squid.js',
            'js/Game/CollisionMasks.js',
            // Engine
            'js/Base/Utility.js',
            'js/Base/BaseObj.js',
            'js/Base/Canvas.js',
            'js/Base/Component.js',
            'js/Base/DrawNode.js',
            'js/Base/Engine.js',
            'js/Base/Entity.js',
            'js/Base/Factory.js',
            'js/Base/Settings.js',
            'js/Base/System.js',
            'js/Base/Timer.js',
            // Components
            'js/Components/RockSnakeComponent.js',
            'js/Components/ColorComponent.js',
            'js/Components/FoodComponent.js',
            'js/Components/HealthComponent.js',
            'js/Components/RockComponent.js',
            'js/Components/SquidPlayerComponent.js',
            'js/Components/PhysicsComponent.js',
            'js/Components/PositionComponent.js',
            'js/Components/RockSnakeAIComponent.js',
            'js/Components/SquidComponent.js',
            'js/Components/SquidletAIComponent.js',
            'js/Components/SteeringComponent.js',
            'js/Components/TentaclesComponent.js',
            // DrawNodes
            'js/DrawNodes/FoodNode.js',
            'js/DrawNodes/SquidNode.js',
            'js/DrawNodes/RockNode.js',
            'js/DrawNodes/RockSnakeNode.js',
            'js/DrawNodes/TentaclesNode.js',
            // Factories
            'js/Factories/RockSnakeFactory.js',
            'js/Factories/FoodFactory.js',
            'js/Factories/RockFactory.js',
            'js/Factories/SquidFactory.js',
            'js/Factories/SquidletFactory.js',
            // Systems
            'js/Systems/BackgroundSystem.js',
            'js/Systems/CameraSystem.js',
            'js/Systems/FoodSystem.js',
            'js/Systems/HealthSystem.js',
            'js/Systems/MouseInputSystem.js',
            'js/Systems/ParticleSystem.js',
            'js/Systems/PhysicsSystem.js',
            'js/Systems/RockSnakeAISystem.js',
            'js/Systems/RockSnakeSystem.js',
            'js/Systems/RockSystem.js',
            'js/Systems/ScoreSystem.js',
            'js/Systems/SquidControlSystem.js',
            'js/Systems/SquidletAISystem.js',
            'js/Systems/SquidSystem.js',
            'js/Systems/StageSystem.js',
            'js/Systems/SteeringSystem.js',
            'js/Systems/TentaclesSystem.js',
            'js/Systems/UiSystem.js'
        ],
        compiled: [
            'resource!images/background.png',
            'js/3rdParty/jquery.min.js',
            'js/3rdParty/underscore-min.js',
            'js/3rdParty/Box2dWeb-2.1.a.3-min.js',
            'js/3rdParty/stats.min.js',
            'js/squid-compiled.js'
        ]
    };
    yepnope.addPrefix(
        'resource',
        function (resourceObj) {
            resourceObj.noexec = true;
            return resourceObj;
        }
    );
    yepnope({
        test: app.verbose,
        yep: files.debug,
        nope: files.compiled,
        complete: function () {
            app.start();
        }
    });

}(window));
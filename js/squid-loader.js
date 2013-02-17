(function (global) {
    'use strict';

    global.app = global.app || {};
    global.app.verbose = true;

    var files = {
        debug: [
            'resource!images/backgroundNoise.png',
            'js/3rdParty/jquery.js',
            'js/3rdParty/underscore.js',
            'js/3rdParty/Box2dWeb-2.1.a.3.js',
            'js/3rdParty/stats.min.js',
            'js/3rdParty/dat.gui.min.js',
            'js/squid.js',
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
            'js/Components/ColorComponent.js',
            'js/Components/FoodComponent.js',
            'js/Components/HealthComponent.js',
            'js/Components/RockComponent.js',
            'js/Components/InputComponent.js',
            'js/Components/PhysicsComponent.js',
            'js/Components/PositionComponent.js',
            'js/Components/SquidComponent.js',
            'js/Components/SteeringComponent.js',
            'js/Components/TentaclesComponent.js',
            'js/DrawNodes/FoodNode.js',
            'js/DrawNodes/SquidNode.js',
            'js/DrawNodes/RockNode.js',
            'js/DrawNodes/TentaclesNode.js',
            'js/Factories/FoodFactory.js',
            'js/Factories/RockFactory.js',
            'js/Factories/SquidFactory.js',
            'js/Systems/BackgroundSystem.js',
            'js/Systems/CameraSystem.js',
            'js/Systems/FoodSystem.js',
            'js/Systems/SquidControlSystem.js',
            'js/Systems/SquidSystem.js',
            'js/Systems/MouseInputSystem.js',
            'js/Systems/PhysicsSystem.js',
            'js/Systems/RockSystem.js',
            'js/Systems/SteeringSystem.js',
            'js/Systems/TentaclesSystem.js'
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
(function (global) {
    'use strict';

    global.app = global.app || {};


    global.app.System.StageSystem = (function () {

        var states = {
            setup: 0,
            preGame: 1,
            midGame: 2,
            postGame: 3
        };

        /**
         * StageSystem
         * @return {StageSystem}
         * @constructor
         */

        function StageSystem(engine) {
            return StageSystem.alloc(this, arguments);
        }

        app.inherit(app.System, StageSystem);

        /*** Initialization ***/

        StageSystem.prototype.init = function () {
            this.settings = {
                minRockDensity: 1,
                maxRockDensity: 10,
                maxRockCount: 35,
                minFoodDensity: 0,
                maxFoodDensity: 1.5,
                rockSnakeWaitFrames: 2500
            };

            this.position = {
                x: 0,
                y: 0
            };

            this.center = {};
            this.stageRect = {};
            this.spawnRect = {};
            this.despawnRect = {};
            this.scrollWidth = app.maxWidth;
            this.scrollHeight = app.maxHeight;
            this.initStageRects(this.position.x, this.position.y);

            this.player = undefined;
            this.rocks = {};
            this.rockCount = 0;
            this.rockSnakeCount = 0;
            this.rockSnakeWaitFrames = this.settings.rockSnakeWaitFrames;
            this.squidletCount = 0;
            this.depth = 0;

            this.engine.bindEvent('update', this);
            this.engine.bindEvent('cameraUpdate', this);
            this.engine.bindEvent('rockSpawned', this);
            this.engine.bindEvent('rockDespawned', this);
            this.engine.bindEvent('rockSnakeSpawned', this);
            this.engine.bindEvent('rockSnakeDespawned', this);
            this.engine.bindEvent('squidletSpawned', this);
            this.engine.bindEvent('squidletDespawned', this);
            this.engine.bindEvent('setupStage', this);
            this.engine.bindEvent('startStage', this);

            this.setupStage();
            return this;
        };

        StageSystem.prototype.initStageRects = function (x, y) {
            this.center.x = x;
            this.center.y = y;

            this.stageRect.minX = x - 3 * app.maxWidth;
            this.stageRect.maxX = x + 3 * app.maxWidth;
            this.stageRect.minY = y - 3 * app.maxHeight;
            this.stageRect.maxY = y + 3 * app.maxHeight;

            this.despawnRect.minX = x - 3 * app.maxWidth;
            this.despawnRect.maxX = x + 3 * app.maxWidth;
            this.despawnRect.minY = y - 3 * app.maxHeight;
            this.despawnRect.maxY = y + 3 * app.maxHeight;

            this.spawnRect.minX = x - 2.25 * app.maxWidth;
            this.spawnRect.maxX = x + 2.25 * app.maxWidth;
            this.spawnRect.minY = y - 2.25 * app.maxHeight;
            this.spawnRect.maxY = y + 2.25 * app.maxHeight;
        };

        /*** Deinitialization ***/

        StageSystem.prototype.deinit = function () {
            this.engine.unbindEvent('update', this);
            this.engine.unbindEvent('cameraUpdate', this);
            this.engine.unbindEvent('rockSpawned', this);
            this.engine.unbindEvent('rockDespawned', this);
            this.engine.unbindEvent('rockSnakeSpawned', this);
            this.engine.unbindEvent('rockSnakeDespawned', this);
            this.engine.unbindEvent('squidletSpawned', this);
            this.engine.unbindEvent('squidletDespawned', this);
            this.engine.unbindEvent('setupStage', this);
            this.engine.unbindEvent('startStage', this);
            return this;
        };

        /*** Event Handlers ***/

        StageSystem.prototype.setupStage = function (autostart) {
            this.state = states.setup;
            this.ready = (autostart) ? true : false;
        };

        StageSystem.prototype.startStage = function () {
            this.ready = true;
        };

        StageSystem.prototype.cameraUpdate = function (position) {
            this.position.x = position.x;
            this.position.y = position.y;
        };

        StageSystem.prototype.rockSpawned = function (rock) {
            this.rocks[rock.id] = rock;
            this.rockCount += 1;
        };

        StageSystem.prototype.rockDespawned = function (rock) {
            delete this.rocks[rock.id];
            this.rockCount -= 1;
        };

        StageSystem.prototype.rockSnakeSpawned = function () {
            this.rockSnakeCount += 1;
        };

        StageSystem.prototype.rockSnakeDespawned = function () {
            this.rockSnakeCount -= 1;
        };

        StageSystem.prototype.squidletSpawned = function () {
            this.squidletCount += 1;
        };

        StageSystem.prototype.squidletDespawned = function () {
            this.squidletCount -= 1;
        };

        /*** Spawn Environment Functions ***/

        StageSystem.prototype.spawnEnvironment = function (minX, maxX, minY, maxY) {
            var i, n, waterLevel = b2.WATERLEVEL * b2.PTM + 200;
            if (minY < waterLevel) {
                minY = waterLevel;
            }

            // Rocks
            n = Math.floor(app.random(this.settings.minRockDensity, this.settings.maxRockDensity));
            if (n + this.rockCount > this.settings.maxRockCount) {
                n = this.settings.maxRockCount - this.rockCount;
            }

            for (i = 0; i < n; i += 1) {
                this.engine.factories.RockFactory.spawn({
                    x: app.random(minX, maxX),
                    y: app.random(minY, maxY)
                });
            }

            // Spawn Rocks
            n = Math.floor(app.random(this.settings.minFoodDensity, this.settings.maxFoodDensity));
            for (i = 0; i < n; i += 1) {
                this.engine.factories.FoodFactory.spawn({
                    x: app.random(minX, maxX),
                    y: app.random(minY, maxY)
                });
            }
        };

        StageSystem.prototype.spawnEnvironmentRight = function () {
            var prevMaxX = this.stageRect.maxX;
            this.center.x += this.scrollWidth;
            this.spawnRect.maxX += this.scrollWidth;
            this.stageRect.maxX += this.scrollWidth;
            this.spawnEnvironment(prevMaxX, this.stageRect.maxX, this.stageRect.minY, this.stageRect.maxY);
        };

        StageSystem.prototype.spawnEnvironmentLeft = function () {
            var prevMinX = this.stageRect.minX;
            this.center.x -= this.scrollWidth;
            this.spawnRect.minX -= this.scrollWidth;
            this.stageRect.minX -= this.scrollWidth;
            this.spawnEnvironment(this.stageRect.minX, prevMinX, this.stageRect.minY, this.stageRect.maxY);
        };

        StageSystem.prototype.spawnEnvironmentDown = function () {
            var prevMaxY = this.stageRect.maxY;
            this.center.y += this.scrollHeight;
            this.spawnRect.maxY += this.scrollHeight;
            this.stageRect.maxY += this.scrollHeight;
            this.spawnEnvironment(this.stageRect.minX, this.stageRect.maxX, prevMaxY, this.stageRect.maxY);
        };

        StageSystem.prototype.spawnEnvironmentUp = function () {
            var prevMinY = this.stageRect.minY;
            this.center.y -= this.scrollHeight;
            this.spawnRect.minY -= this.scrollHeight;
            this.stageRect.minY -= this.scrollHeight;
            this.spawnEnvironment(this.stageRect.minX, this.stageRect.maxX, this.stageRect.minY, prevMinY);
        };

        /*** Despawn Environment Function ***/

        StageSystem.prototype.despawnEnvironment = function (test) {
            var key, rock;
            for (key in this.rocks) {
                if (this.rocks.hasOwnProperty(key)) {
                    rock = this.rocks[key];
                    if (test.call(this, rock)) {
                        this.engine.factories.RockFactory.despawn(rock);
                    }
                }
            }
        };

        StageSystem.prototype.despawnEnvironmentRight = function () {
            this.stageRect.maxX -= this.scrollWidth;
            this.spawnRect.maxX -= this.scrollWidth;
            this.despawnRect.maxX -= this.scrollWidth;
            this.despawnRect.minX -= this.scrollWidth;
            this.despawnEnvironment(function (rock) {
                return rock.PositionComponent.x > this.stageRect.maxX;
            });
        };

        StageSystem.prototype.despawnEnvironmentLeft = function () {
            this.stageRect.minX += this.scrollWidth;
            this.spawnRect.minX += this.scrollWidth;
            this.despawnRect.minX += this.scrollWidth;
            this.despawnRect.maxX += this.scrollWidth;
            this.despawnEnvironment(function (rock) {
                return rock.PositionComponent.x < this.stageRect.minX;
            });
        };

        StageSystem.prototype.despawnEnvironmentDown = function () {
            this.stageRect.maxY -= this.scrollHeight;
            this.spawnRect.maxY -= this.scrollHeight;
            this.despawnRect.minY -= this.scrollHeight;
            this.despawnRect.maxY -= this.scrollHeight;
            this.despawnEnvironment(function (rock) {
                return rock.PositionComponent.y > this.stageRect.maxY;
            });
        };

        StageSystem.prototype.despawnEnvironmentUp = function () {
            this.stageRect.minY += this.scrollHeight;
            this.spawnRect.minY += this.scrollHeight;
            this.despawnRect.maxY += this.scrollHeight;
            this.despawnRect.minY += this.scrollHeight;
            this.despawnEnvironment(function (rock) {
                return rock.PositionComponent.y < this.stageRect.minY;
            });
        };

        /*** Spawn Rock Snake ***/

        StageSystem.prototype.spawnRockSnake = function () {
            var mod = (this.depth / 15000);
            this.rockSnakeWaitFrames -= this.squidletCount;
            this.maxRockSnakes = 1 + mod;

            if (this.rockSnakeWaitFrames <= 0 && this.rockSnakeCount < this.maxRockSnakes) {
                this.engine.factories.RockSnakeFactory.spawn({
                    x: app.random(this.stageRect.minX, this.stageRect.maxX),
                    y: this.stageRect.maxY + this.scrollHeight,
                    sizeModifier: mod
                });
                this.rockSnakeWaitFrames = this.settings.rockSnakeWaitFrames;
            }
        };

        /*** Stage Update State Machine ***/

        StageSystem.prototype.update = function (dt) {
            switch (this.state) {
            case states.setup:
                this.setupUpdate();
                break;
            case states.preGame:
                this.preGameUpdate();
                break;
            case states.midGame:
                this.midGameUpdate();
                break;
            case states.postGame:
                this.postGameUpdate();
                break;
            }
        };

        StageSystem.prototype.setupUpdate = function () {
            var i, key, factory;

            // Delete exiting rocks for restart rocks
            for (key in this.rocks) {
                if (this.rocks.hasOwnProperty(key)) {
                    delete this.rocks[key];
                }
            }
            this.rockCount = 0;
            this.rockSnakeSpawnRate = 0;
            // Clear all entities out of the engine
            for (key in this.engine.factories) {
                if (this.engine.factories.hasOwnProperty(key)) {
                    factory = this.engine.factories[key];
                    if (_.isFunction(factory.despawnAll)) {
                        factory.despawnAll();
                    }
                }
            }

            // Create squidlets
            for (i = 0; i < 3; i += 1) {
                this.engine.factories.SquidletFactory.spawn({
                    x: app.random(app.maxWidth, app.maxWidth * 2),
                    y: app.random(app.maxHeight, app.maxHeight * 2)
                });
            }

            // Create a player
            this.player = this.engine.factories.SquidFactory.spawn({
                x: app.random(app.maxWidth, app.maxWidth * 2),
                y: b2.WATERLEVEL * b2.PTM + 450
            });

            // Set starting camera position
            this.engine.systems.CameraSystem.position.x = 0;
            this.engine.systems.CameraSystem.position.y = 0;
            this.engine.systems.CameraSystem.setTargetEntity(this.player);
            this.initStageRects(0, 0);

            // Change state
            this.depth = this.player.PositionComponent.y - b2.WATERLEVEL * b2.PTM;
            this.state = states.preGame;
        };

        StageSystem.prototype.preGameUpdate = function () {
            if (this.ready === true) {
                this.state = states.midGame;
                this.engine.triggerEvent('stageStart');
            }
        };

        StageSystem.prototype.midGameUpdate = function () {

            this.depth = this.player.PositionComponent.y - b2.WATERLEVEL * b2.PTM;

            // Spawn horizontal
            if (this.position.x > this.spawnRect.maxX) {
                this.spawnEnvironmentRight();
            } else if (this.position.x < this.spawnRect.minX) {
                this.spawnEnvironmentLeft();
            }

            // Spawn vertical
            if (this.position.y > this.spawnRect.maxY) {
                this.spawnEnvironmentDown();
            } else if (this.position.y < this.spawnRect.minY) {
                this.spawnEnvironmentUp();
            }

            // Despawn horizontal
            if (this.position.x > this.despawnRect.maxX) {
                this.despawnEnvironmentLeft();
            } else if (this.position.x < this.despawnRect.minX) {
                this.despawnEnvironmentRight();
            }

            // Despawn vertical
            if (this.position.y > this.despawnRect.maxY) {
                this.despawnEnvironmentUp();
            } else if (this.position.y < this.despawnRect.minY) {
                this.despawnEnvironmentDown();
            }

            this.spawnRockSnake();

            // Check for game over condition
            if (this.squidletCount <= 0) {
                this.engine.triggerEvent('stageEnd');
                this.state = states.postGame;
            }
        };

        StageSystem.prototype.postGameUpdate = function () {
            this.ready = false;
        };

        return StageSystem;

    }());

}(window));
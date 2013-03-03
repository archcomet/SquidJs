(function (global) {
    'use strict';

    global.app = global.app || {};


    global.app.System.StageSystem = (function () {

        var states = {
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
                minRockDensity: 0,
                maxRockDensity: 5,
                maxRockCount: 20,
                minFoodDensity: 0,
                maxFoodDensity: 2
            };

            this.position = {
                x: 0,
                y: 0
            };

            this.center = {};
            this.stageRect = {};
            this.loadRect = {};
            this.unloadRect = {};
            this.scrollWidth = app.maxWidth;
            this.scrollHeight = app.maxHeight;
            this.initStageRects(this.position.x, this.position.y);

            this.state = states.preGame;
            this.rocks = {};
            this.rockCount = 0;
            this.engine.bindEvent('update', this);
            this.engine.bindEvent('restart', this);
            this.engine.bindEvent('cameraUpdate', this);
            this.engine.bindEvent('rockSpawned', this);
            this.engine.bindEvent('rockDespawned', this);
            return this;
        };

        StageSystem.prototype.initStageRects = function (x, y) {
            this.center.x = x;
            this.center.y = y;

            this.stageRect.minX = x - 3 * app.maxWidth;
            this.stageRect.maxX = x + 3 * app.maxWidth;
            this.stageRect.minY = y - 3 * app.maxHeight;
            this.stageRect.maxY = y + 3 * app.maxHeight;

            this.unloadRect.minX = x - 3 * app.maxWidth;
            this.unloadRect.maxX = x + 3 * app.maxWidth;
            this.unloadRect.minY = y - 3 * app.maxHeight;
            this.unloadRect.maxY = y + 3 * app.maxHeight;

            this.loadRect.minX = x - 2.25 * app.maxWidth;
            this.loadRect.maxX = x + 2.25 * app.maxWidth;
            this.loadRect.minY = y - 2.25 * app.maxHeight;
            this.loadRect.maxY = y + 2.25 * app.maxHeight;
        };

        /*** Deinitialization ***/

        StageSystem.prototype.deinit = function () {
            this.engine.unbindEvent('update', this);
            this.engine.unbindEvent('restart', this);
            this.engine.unbindEvent('cameraUpdate', this);
            this.engine.unbindEvent('rockSpawned', this);
            this.engine.unbindEvent('rockDespawned', this);
            return this;
        };

        /*** Event Handlers ***/

        StageSystem.prototype.restart = function () {
            this.state = states.preGame;
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

        /*** Spawn and Despawn Environment ***/

        StageSystem.prototype.spawnEnvironment = function (minX, maxX, minY, maxY) {
            var i, n, waterLevel = b2.WATERLEVEL * b2.PTM;
            if (minY < waterLevel) {
                minY = waterLevel;
            }

            // Spawn Rocks
            n = app.random(this.settings.minRockDensity, this.settings.maxRockDensity);
            if (n + this.rockCount > this.settings.maxRockCount) {
                n = this.settings.maxRockCount - this.rockCount;
            }

            for (i = 0; i < n; i += 1) {
                this.engine.factories.RockFactory.spawn({
                    x: app.random(minX, maxX),
                    y: app.random(minY, maxY)
                });
            }

            // Spawn Food
            n = app.random(this.settings.minFoodDensity, this.settings.maxFoodDensity);
            for (i = 0; i < n; i += 1) {
                this.engine.factories.FoodFactory.spawn({
                    x: app.random(minX, maxX),
                    y: app.random(minY, maxY)
                });
            }
        };

        StageSystem.prototype.despawnEnvironment = function (test) {
            var key, rock, nRemaining = 0, nDeleted = 0;
            for (key in this.rocks) {
                if (this.rocks.hasOwnProperty(key)) {
                    rock = this.rocks[key];
                    if (test.call(this, rock)) {
                        this.engine.factories.RockFactory.despawn(rock);
                        nDeleted += 1;
                    } else {
                        nRemaining += 1;
                    }
                }
            }

            console.log('Deleted: ' + nDeleted + ' Remaining:' + nRemaining);
        };

        /*** Load Stage Functions ***/

        StageSystem.prototype.loadStageRight = function () {
            var prevMaxX = this.stageRect.maxX;
            this.center.x += this.scrollWidth;
            this.loadRect.maxX += this.scrollWidth;
            this.stageRect.maxX += this.scrollWidth;
            this.spawnEnvironment(prevMaxX, this.stageRect.maxX, this.stageRect.minY, this.stageRect.maxY);
        };

        StageSystem.prototype.loadStageLeft = function () {
            var prevMinX = this.stageRect.minX;
            this.center.x -= this.scrollWidth;
            this.loadRect.minX -= this.scrollWidth;
            this.stageRect.minX -= this.scrollWidth;
            this.spawnEnvironment(this.stageRect.minX, prevMinX, this.stageRect.minY, this.stageRect.maxY);
        };

        StageSystem.prototype.loadStageDown = function () {
            var prevMaxY = this.stageRect.maxY;
            this.center.y += this.scrollHeight;
            this.loadRect.maxY += this.scrollHeight;
            this.stageRect.maxY += this.scrollHeight;
            this.spawnEnvironment(this.stageRect.minX, this.stageRect.maxX, prevMaxY, this.stageRect.maxY);
        };

        StageSystem.prototype.loadStageUp = function () {
        };

        /*** Unload Stage Function ***/

        StageSystem.prototype.unloadStageRight = function () {
            this.stageRect.maxX -= this.scrollWidth;
            this.loadRect.maxX -= this.scrollWidth;
            this.unloadRect.maxX -= this.scrollWidth;
            this.unloadRect.minX -= this.scrollWidth;
            this.despawnEnvironment(function (rock) {
                return rock.PositionComponent.x > this.stageRect.maxX;
            });
        };

        StageSystem.prototype.unloadStageLeft = function () {
            this.stageRect.minX += this.scrollWidth;
            this.loadRect.minX += this.scrollWidth;
            this.unloadRect.minX += this.scrollWidth;
            this.unloadRect.maxX += this.scrollWidth;
            this.despawnEnvironment(function (rock) {
                return rock.PositionComponent.x < this.stageRect.minX;
            });
        };

        StageSystem.prototype.unloadStageDown = function () {
        };

        StageSystem.prototype.unloadStageUp = function () {
            this.stageRect.minY += this.scrollHeight;
            this.loadRect.minY += this.scrollHeight;
            this.unloadRect.maxY += this.scrollHeight;
            this.unloadRect.minY += this.scrollHeight;
            this.despawnEnvironment(function (rock) {
                return rock.PositionComponent.y < this.stageRect.minY;
            });
        };

        /*** Stage Update State Machine ***/

        StageSystem.prototype.update = function (dt) {
            switch (this.state) {
            case states.preGame:
                this.updatePreGame();
                break;
            case states.midGame:
                this.updateMidGame();
                break;
            case states.postGame:
                this.updatePostGame();
                break;
            }
        };

        StageSystem.prototype.updatePreGame = function () {
            var i, key, factory, entity;

            // Delete exiting rocks for restart rocks
            for (key in this.rocks) {
                if (this.rocks.hasOwnProperty(key)) {
                    delete this.rocks[key];
                }
            }
            this.rockCount = 0;

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
                entity = this.engine.factories.SquidletFactory.spawn({
                    x: app.random(app.maxWidth, app.maxWidth * 2),
                    y: app.random(app.maxHeight, app.maxHeight * 2)
                });
            }

            // Create a player
            entity = this.engine.factories.SquidFactory.spawn({
                x: app.random(app.maxWidth, app.maxWidth * 2),
                y: app.random(app.maxHeight, app.maxHeight * 2)
            });

            // Set starting camera position
            this.engine.systems.CameraSystem.position.x = 0;
            this.engine.systems.CameraSystem.position.y = 0;
            this.engine.systems.CameraSystem.setTargetEntity(entity);

            this.initStageRects(0, 0);

            // Change state
            this.state = states.midGame;
        };

        StageSystem.prototype.updateMidGame = function () {

            // Load horizontal
            if (this.position.x > this.loadRect.maxX) {
                this.loadStageRight();
            } else if (this.position.x < this.loadRect.minX) {
                this.loadStageLeft();
            }

            // Unload horizontal
            if (this.position.x > this.unloadRect.maxX) {
                this.unloadStageLeft();
            } else if (this.position.x < this.unloadRect.minX) {
                this.unloadStageRight();
            }

            // Load Vertical
            if (this.position.y > this.loadRect.maxY) {
                this.loadStageDown();
            } else if (this.position.y < this.loadRect.minY) {
                this.loadStageUp();
            }

            // Unload Vertical
            if (this.position.y > this.unloadRect.maxY) {
                this.unloadStageUp();
            } else if (this.position.y < this.unloadRect.minY) {
                this.unloadStageDown();
            }

            // check snake count
            // random chance based on number of snakes
            // if chance passes, spawn snakes below stage

        };

        StageSystem.prototype.updatePostGame = function () {

        };

        return StageSystem;

    }());
}(window));
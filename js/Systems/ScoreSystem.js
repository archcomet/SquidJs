(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.ScoreSystem = (function () {

        /**
         * ScoreSystem
         * @return {*}
         * @constructor
         */

        function ScoreSystem(engine) {
            return ScoreSystem.alloc(this, arguments);
        }

        app.inherit(app.System, ScoreSystem);


        ScoreSystem.prototype.init = function () {
            this.initScore();
            this.engine.bindEvent('foodCollected', this);
            this.engine.bindEvent('squidletSpawned', this);
            this.engine.bindEvent('rockSnakeKilled', this);
            this.engine.bindEvent('stageStart', this);
            this.engine.bindEvent('stageEnd', this);
            this.engine.bindEvent('update', this);
            return this;
        };

        ScoreSystem.prototype.initScore = function () {
            this.score = {
                foodCollected: 0,
                snakesKilled: 0,
                squidletsSpawned: 0,
                squidletMaxCount: 3,
                depth: 0,
                depthMax: 0,
                duration: 0
            };
            this.running = true;
        };

        ScoreSystem.prototype.deinit = function () {
            this.engine.unbindEvent('foodCollected', this);
            this.engine.unbindEvent('squidletSpawned', this);
            this.engine.unbindEvent('rockSnakeKilled', this);
            this.engine.unbindEvent('stageStart', this);
            this.engine.unbindEvent('stageEnd', this);
            this.engine.unbindEvent('update', this);
            return this;
        };

        ScoreSystem.prototype.stageStart = function () {
            this.initScore();
            this.player = undefined;
        };

        ScoreSystem.prototype.stageEnd = function () {
            this.running = false;
            this.engine.triggerEvent('finalScoreSet', this.score);
        };

        ScoreSystem.prototype.update = function (dt) {
            if (this.running) {
                this.score.duration += 1;

                if (this.player === undefined) {
                    this.player = this.engine.entitiesForComponent('SquidPlayerComponent')[0];
                }

                this.score.depth = b2.toWorld(this.player.PositionComponent.y) + b2.WATERLEVEL;
                if (this.score.depthMax < this.score.depth) {
                    this.score.depthMax = this.score.depth;
                }
            }
        };

        ScoreSystem.prototype.rockSnakeKilled = function () {
            this.score.snakesKilled += 1;
        };

        ScoreSystem.prototype.squidletSpawned = function () {
            this.score.squidletsSpawned += 1;
            if (this.score.squidletMaxCount < this.score.squidletCount) {
                this.score.squidletMaxCount = this.score.squidletCount;
            }
        };

        ScoreSystem.prototype.foodCollected = function () {
            this.score.foodCollected += 1;
        };

        return ScoreSystem;

    }());

}(window));
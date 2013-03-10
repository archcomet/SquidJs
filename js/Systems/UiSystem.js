(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.UiSystem = (function () {

        var states = {
            title: 0,
            gamePlaying: 1,
            gameOver: 2,
            leaderBoard: 3
        };

        /**
         * UiSystem
         * @return {*}
         * @constructor
         */

        function UiSystem(engine) {
            return UiSystem.alloc(this, arguments);
        }

        app.inherit(app.System, UiSystem);

        UiSystem.prototype.init = function () {
            this.engine.bindEvent('backgroundReady', this);
            this.engine.bindEvent('stageEnd', this);
            this.state = states.title;
            return this;
        };

        UiSystem.prototype.deinit = function () {
            this.engine.unbindEvent('backgroundReady', this);
        };

        UiSystem.prototype.backgroundReady  = function () {
            $(this.engine.container).fadeIn('slow');
            $('#loading').fadeOut('fast', this.displayContinue.bind(this));
        };

        UiSystem.prototype.stageEnd = function () {
            $('#gameOver').fadeIn('slow');
            this.state = states.gameOver;
        };

        UiSystem.prototype.displayContinue = function () {
            $('#container').click(this.click.bind(this));
            $('#title').find('.continue').fadeIn('fast');
        };

        UiSystem.prototype.click = function (event) {
            switch (this.state) {
            case states.title:
                this.engine.triggerEvent('startStage');
                this.state = states.gamePlaying;
                $('#title').fadeOut('slow');
                break;
            case states.gameOver:
                this.engine.triggerEvent('setupStage', true);
                this.state = states.gamePlaying;
                $('#gameOver').fadeOut('fast');
                break;
            }

            return true;
        };

        return UiSystem;

    }());

}(window));
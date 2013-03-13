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
            this.engine.bindEvent('finalScoreSet', this);

            $('#submitScore').click(this.submitScore.bind(this));
            $('#newGame').click(this.newGame.bind(this));

            this.state = states.title;
            return this;
        };

        UiSystem.prototype.deinit = function () {
            this.engine.unbindEvent('backgroundReady', this);
            this.engine.unbindEvent('stageEnd', this);
            this.engine.unbindEvent('finalScoreSet', this);
        };

        UiSystem.prototype.formatTime = function (duration) {
            var m, s, ms, remaining = duration;
            m = Math.floor(remaining / 3600);
            remaining -= m * 3600;
            s = Math.floor(remaining / 60);
            remaining -= s * 60;
            ms = (remaining % 60 / 60).toFixed(2).substring(1, 4);
            return m + ':' + ((s < 10) ? '0' + s : s) + ms;
        };

        UiSystem.prototype.formatDistance = function (distance) {
            return Math.floor(distance) + 'm';
        };

        /*** Title Screen ***/

        UiSystem.prototype.backgroundReady  = function () {
            $(this.engine.container).fadeIn('slow');
            $('#loading').fadeOut('fast', this.displayContinue.bind(this));
        };

        UiSystem.prototype.displayContinue = function () {
            $('#container').click(this.click.bind(this));
            $('#continue').fadeIn('fast');
        };

        UiSystem.prototype.click = function (event) {
            if (this.state === states.title) {
                this.engine.triggerEvent('startStage');
                this.state = states.gamePlaying;
                $('#title').fadeOut('slow');
                $('#container').unbind('click');
            }
            return true;
        };

        /*** Game Over Screen ***/

        UiSystem.prototype.stageEnd = function () {
            $('#gameOver').fadeIn('slow');
            this.state = states.gameOver;
        };

        UiSystem.prototype.finalScoreSet = function (score) {
            this.lastScore = score;
            this.hasSubmitted = false;

            $('#top10scores').hide();
            $('#postScore').hide();

            $('#timeScore').empty().append(this.formatTime(score.duration));
            $('#foodScore').empty().append(score.foodCollected);
            $('#killScore').empty().append(score.snakesKilled);
            $('#depthScore').empty().append(this.formatDistance(score.depthMax));

            this.refreshTopTen();
        };

        UiSystem.prototype.refreshTopTen = function () {
            this.newHighScore = false;
            this.threads = 4;
            this.getTopTen('duration', this.formatTopTen.bind(this, '#top10times', 'duration', this.formatTime));
            this.getTopTen('foodCollected', this.formatTopTen.bind(this, '#top10food', 'foodCollected', undefined));
            this.getTopTen('snakesKilled', this.formatTopTen.bind(this, '#top10kills', 'snakesKilled', undefined));
            this.getTopTen('depthMax', this.formatTopTen.bind(this, '#top10depths', 'depthMax', this.formatDistance));
        };

        UiSystem.prototype.formatTopTen = function (selector, column, formatter, data) {
            var i, n, rank, name, val, markup, row, table = $(selector).empty();

            for (i = 0, n = data.topTen.length; i < n; i += 1) {
                rank = i + 1;
                name = data.topTen[i].userName;
                val = parseInt(data.topTen[i][column], 10);

                if (this.lastScore[column] > val) {
                    this.newHighScore = true;
                }

                if (formatter !== undefined) {
                    val = formatter(val);
                }

                if (name.length > 9) {
                    name = name.substring(0, 9) + '...';
                }

                markup = '<tr><td>' + rank + '</td>';
                markup += '<td>' + name + '</td>';
                markup += '<td>' + val + '</td></tr>';

                row = $(markup)[0];
                table.append(row);
            }

            if (n === 0) {
                this.newHighScore = true;
            }

            this.showTopTen();
        };

        UiSystem.prototype.showTopTen = function () {
            this.threads -= 1;
            if (this.threads === 0) {
                if (this.newHighScore && !this.hasSubmitted) {
                    $('#postScore').fadeIn();
                }
                $('#top10scores').fadeIn();
            }
        };

        UiSystem.prototype.submitScore = function () {
            if (!this.hasSubmitted) {
                var userName = $('#name').val();
                this.lastScore.userName = (userName.length > 0) ? userName : undefined;
                this.hasSubmitted = true;
                this.postScore();
                $('#postScore').fadeOut();
            }
        };

        UiSystem.prototype.newGame = function () {
            this.engine.triggerEvent('setupStage', true);
            this.state = states.gamePlaying;
            $('#gameOver').fadeOut('fast');
        };

        /*** Ajax ***/

        UiSystem.prototype.postScore = function () {
            $.ajax({
                type: 'POST',
                url: '/postScore',
                data: JSON.stringify({ score: this.lastScore }),
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                success: this.refreshTopTen.bind(this)
            });
        };

        UiSystem.prototype.getTopTen = function (scoreKey, successCallback) {
            $.ajax({
                type: 'GET',
                url: '/topTen',
                data: { key: scoreKey, order: -1 },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                success: successCallback
            });
        };

        return UiSystem;

    }());

}(window));
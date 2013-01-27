(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Component.TentaclesComponent = (function () {

        /**
         * TentaclesComponent
         * Provides tentacle data to Entity.
         * @param options
         * @return {*}
         * @constructor
         */

        function TentaclesComponent(options) {
            return TentaclesComponent.alloc(this, arguments);
        }
        app.inherit(app.Component, TentaclesComponent);

        TentaclesComponent.prototype.init = function (options) {
            _.defaults(this, options, {
                count: 5,
                segmentCount: 10,
                segmentLength: 10,
                radius: 10,
                friction: 0.94,
                variance: 0.15
            });
            return this;
        };

        return TentaclesComponent;

    }());

}(window));
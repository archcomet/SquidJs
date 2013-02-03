(function (global) {
    'use strict';

    _.extend(global, {
        PI         : Math.PI,
        TWO_PI     : Math.PI * 2,
        HALF_PI    : Math.PI / 2,
        QUARTER_PI : Math.PI / 4,

        abs        : Math.abs,
        acos       : Math.acos,
        asin       : Math.asin,
        atan2      : Math.atan2,
        atan       : Math.atan,
        ceil       : Math.ceil,
        cos        : Math.cos,
        exp        : Math.exp,
        floor      : Math.floor,
        log        : Math.log,
        max        : Math.max,
        min        : Math.min,
        pow        : Math.pow,
        round      : Math.round,
        sin        : Math.sin,
        sqrt       : Math.sqrt,
        tan        : Math.tan,

        random     : function (min, max) {
            if (min && typeof min.length === 'number' && !!min.length) {
                return min[Math.floor(Math.random() * min.length)];
            }
            if (typeof max !== 'number') {
                max = min || 1;
                min = 0;
            }
            return min + Math.random() * (max - min);
        }
    });

    global.app = global.app || {};

    global.app.assert = function (condition, message) {
        if (!condition) {
            message = (message) ? 'Assert failed: ' + message : 'Assert failed';
            throw new Error(message);
        }
    };

    global.app.maxWidth = 1198;
    global.app.maxHeight = 768;

    /**
     * b2 Utility
     * ShortCuts and Helpers for using box2DWeb
     * @type {Object}
     */

    global.b2 = {

        // Constants
        PTM: 30,
        INTERVAL: 1 / 60,
        POSITION_ITERATIONS: 10,
        VELOCITY_ITERATIONS: 10,
        WATERLEVEL: 10,

        // Box2d Constructors
        World: Box2D.Dynamics.b2World,
        Vec2: Box2D.Common.Math.b2Vec2,
        Body: Box2D.Dynamics.b2Body,
        BodyDef: Box2D.Dynamics.b2BodyDef,
        Fixture: Box2D.Dynamics.b2Fixture,
        FixtureDef: Box2D.Dynamics.b2FixtureDef,
        PolygonShape: Box2D.Collision.Shapes.b2PolygonShape,
        CircleShape: Box2D.Collision.Shapes.b2CircleShape,
        MassData: Box2D.Collision.Shapes.b2MassData,
        DebugDraw: Box2D.Dynamics.b2DebugDraw,
        FilterData: Box2D.Dynamics.b2FilterData,

        makeShape: function (shape) {
            switch (shape.type) {
            case 'circle':
                return new this.CircleShape(this.toWorld(shape.radius));
            }
            return undefined;
        },

        makeFilterData: function (categoryBits, maskBits, groupIndex) {
            var data = new b2.FilterData();
            data.categoryBits = categoryBits;
            data.maskBits = maskBits;
            data.groupIndex = groupIndex;
            return data;
        },

        toWorld: function (n) {
            return (typeof n === 'number') ? n / this.PTM : {
                x: n.x / this.PTM,
                y: n.y / this.PTM
            };
        },

        toPixels: function (n) {
            return (typeof n === 'number') ? n * this.PTM : {
                x: n.x * this.PTM,
                y: n.y * this.PTM
            };
        }
    };

}(window));
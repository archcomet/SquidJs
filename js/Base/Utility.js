(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.random = function (min, max) {
        if (min && typeof min.length === 'number' && !!min.length) {
            return min[Math.floor(Math.random() * min.length)];
        }
        if (typeof max !== 'number') {
            max = min || 1;
            min = 0;
        }
        return min + Math.random() * (max - min);
    };

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
            var b2Shape;
            switch (shape.type) {
            case 'circle':
                return new this.CircleShape(this.toWorld(shape.radius));
            case 'polygon':
                b2Shape = new this.PolygonShape();
                b2Shape.SetAsVector(this.toWorld(shape.vertices));
                return b2Shape;
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

        toWorld: function (val) {
            var i, n, result, type = Object.prototype.toString.call(val);
            if (type === '[object Array]') {
                result = [];
                for (i = 0, n = val.length; i < n; i += 1) {
                    result.push(this.toWorld(val[i]));
                }
                return result;
            }

            if (type === '[object Number]') {
                return val / this.PTM;
            }

            if (val.x !== undefined && val.y !== undefined) {
                return {
                    x: val.x / this.PTM,
                    y: val.y / this.PTM
                };
            }

            return undefined;
        },

        toPixels: function (val) {
            var i, n, result, type = Object.prototype.toString.call(val);
            if (type === '[object Array]') {
                result = [];
                for (i = 0, n = val.length; i < n; i += 1) {
                    result.push(this.toWorld(val[i]));
                }
                return result;
            }

            if (type === '[object Number]') {
                return val * this.PTM;
            }

            if (val.x !== undefined && val.y !== undefined) {
                return {
                    x: val.x * this.PTM,
                    y: val.y * this.PTM
                };
            }

            return undefined;
        }
    };

}(window));
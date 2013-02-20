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

    function crossProduct(prevVertex, currVertex, nextVertex) {
        var a = {
            x: currVertex.x - prevVertex.x,
            y: currVertex.y - prevVertex.y
        }, b = {
            x: nextVertex.x - prevVertex.x,
            y: nextVertex.y - prevVertex.y
        };
        return (a.x * b.y - a.y * b.x);
    }

    function removeNextConcavePoint(vertices) {
        var i, n, cross, prev, next;
        for (i = 0, n = vertices.length; i < n; i += 1) {

            prev = (i === 0) ? n - 1 : i - 1;
            next = (i === n - 1) ? 0 : i + 1;

            cross = crossProduct(vertices[prev], vertices[i], vertices[next]);

            if (cross <= 0) {
                vertices.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    global.app.randomConvexPolygon = function (n, minRadius, maxRadius) {
        var i, theta, radius, removedConcave,
            step = (Math.PI * 2) / n,
            vertices = [];

        for (i = 0; i < n; i += 1) {
            theta = app.random(step * i, step * i + step);
            radius = app.random(minRadius, maxRadius);
            vertices.push({
                x: Math.cos(theta) * radius,
                y: Math.sin(theta) * radius
            });
        }

        removedConcave = true;
        while (removedConcave) {
            removedConcave = removeNextConcavePoint(vertices);
        }

        return vertices;
    };

    global.app.vectorAngle = function (v1, v2) {
        return Math.acos((v1.x * v2.x + v1.y * v2.y) /
            Math.sqrt((v1.x * v1.x + v1.y * v1.y) * (v2.x * v2.x + v2.y * v2.y)));
    };

    global.app.maxWidth = 1028;

    global.app.maxHeight = 652;

    /**
     * b2 Utility
     * ShortCuts and Helpers for using box2DWeb
     * @type {Object}
     */

    global.b2 = {

        // Constants
        PTM: 30,
        POSITION_ITERATIONS: 8,
        VELOCITY_ITERATIONS: 8,
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
        ContactListener: Box2D.Dynamics.b2ContactListener,
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
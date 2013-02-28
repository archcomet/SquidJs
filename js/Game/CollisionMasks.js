(function (global) {
    'use strict';

    global.app = global.app || {};

    var PLAYER  =   0x0001,
        FRIEND  =   0x0002,
        FOE     =   0x0004,
        ITEM    =   0x0008,
        OBJECT  =   0x0010;

    global.app.entityCategory = {
        PLAYER: PLAYER,
        FRIEND: FRIEND,
        FOE: FOE,
        ITEM: ITEM,
        OBJECT: OBJECT
    };

    global.app.entityMask = {
        PLAYER: PLAYER + FOE + ITEM + OBJECT,
        FRIEND: FRIEND + FOE + OBJECT,
        FOE: PLAYER + FRIEND + OBJECT,
        ITEM: PLAYER,
        OBJECT: PLAYER + FRIEND + FOE + ITEM + OBJECT
    };

    global.app.damageMask = {
        PLAYER: 0,
        FRIEND: FOE,
        FOE: PLAYER,
        ITEM: PLAYER,
        OBJECT: PLAYER + FRIEND + FOE
    };

}(window));
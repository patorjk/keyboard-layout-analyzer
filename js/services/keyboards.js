/*
	Service for maintaining the keyboards
*/

var appServices = appServices || angular.module('kla.services', []);

appServices.factory('keyboards', [

	function() {
        var me = {},
            layouts = []
            ;

        // setup layouts
    
        layouts[0] = {};
        layouts[0].keySet = $.extend(true, {}, KB.keySet.standard.qwerty);
        layouts[0].keyMap = $.extend(true, {}, KB.keyMap.standard.s683_225);
        layouts[0].keyboard = null;
        
        layouts[1] = {};
        layouts[1].keySet = $.extend(true, {}, KB.keySet.standard.simplifiedDvorak);
        layouts[1].keyMap = $.extend(true, {}, KB.keyMap.standard.s683_225);
        layouts[1].keyboard = null;

        layouts[2] = {};
        layouts[2].keySet = $.extend(true, {}, KB.keySet.standard.colemak);
        layouts[2].keyMap = $.extend(true, {}, KB.keyMap.standard.s683_225);
        layouts[2].keyboard = null;
        
        layouts[3] = {};
        layouts[3].keySet = $.extend(true, {}, KB.keySet.european.azerty);
        layouts[3].keyMap = $.extend(true, {}, KB.keyMap.european.s683_225);
        layouts[3].keyboard = null;
        
        layouts[4] = {};
        layouts[4].keySet = $.extend(true, {}, KB.keySet.standard.programmerDvorak);
        layouts[4].keyMap = $.extend(true, {}, KB.keyMap.standard.s683_225);
        layouts[4].keyboard = null;

        // public functions

        me.registerKeyboard = function(index, elmId) {
            if (typeof layouts[index] === 'undefined') {
                throw Error("keyboards service: Invalid index");
            }

            layouts[index].keyboard = new KB.Keyboard({
                container: elmId,
                layout: layouts[index]
            });
        };

        me.forEach = function(cb) {
            var ii = 0;
            for (ii = 0; ii < layouts.length; ii++) {
                cb(layouts[ii]);
            }
        };

        me.getKeyMapFromKeyboardType = function(keyboardType) {
            if ( typeof KB.keyMap[keyboardType] === 'undefined' || typeof KB.keyMap[keyboardType].s683_225 === 'undefined' ) {
                throw Error("Invalid keyboard type.");
            }

            return KB.keyMap[keyboardType].s683_225;
        };

        /*
            keys - array of keys ordered from most popular to least
        */
        me.createPersonalLayout = function(keys, refKeySet) {

            var topQwertyKeys = [31, 36, 32, 35, 30, 37, 33, 34, 29, 38, 18, 21, 17, 22, 16, 23, 45, 47, 48, 19, 39, 15, 24, 44, 20, 46, 25, 26, 42, 43, 49, 50, 51, 27], 
                tqkLookup = {},
                ii = 0, 
                jj,
                key,
                orderedKeys = [];
            for (ii = 0; ii < topQwertyKeys.length; ii++) {
                tqkLookup[ topQwertyKeys[ii] ] = true;
            }

            var pKeySet = $.extend(true, {}, refKeySet);
            pKeySet.label = "Personalized";
            
            for (ii = 0; ii < keys.length; ii++) {
                if (tqkLookup[ keys[ii].index ] && keys[ii].count > 0) {
                    orderedKeys.push(pKeySet.keys[keys[ii].index]);
                    orderedKeys[orderedKeys.length-1].index = keys[ii].index;
                }
            }
            
            for (ii = 0; ii < orderedKeys.length; ii++) {
                var kIndex = topQwertyKeys[ii];
                for (jj = 0; jj < keys.length; jj++) {
                    if ( keys[jj].index === kIndex && keys[jj].count === 0) {
                        orderedKeys.push(pKeySet.keys[keys[jj].index]);
                        orderedKeys[orderedKeys.length-1].index = keys[jj].index;
                    }
                }
            }
            
            for (ii = 0; ii < orderedKeys.length; ii++) {
                pKeySet.keys[ topQwertyKeys[ii] ] = orderedKeys[ ii ];
            }

            // copy over finger information
            for (ii = 0; ii < pKeySet.keys.length; ii++) {
                pKeySet.keys[ii].finger = refKeySet.keys[ii].finger;
                pKeySet.keys[ii].id = ii;
            }
            
            return pKeySet;
        };

        me.getLayouts = function() {
            return layouts;
        }

        me.getLayout = function(index) {
            if (typeof layouts[index] === 'undefined') {
                throw Error("keyboards service: Invalid index");
            }

            return layouts[index];
        };
        me.setLayout = function(index, layout) {
            if (typeof layouts[index] === 'undefined') {
                throw Error("keyboards service: Invalid index");
            }

            layouts[index].keySet = layout.keySet;
            layouts[index].keyMap = layout.keyMap;
            if (layouts[index].keyboard !== null) {
                layouts[index].keyboard.setLayout( layout );
            }
        };

        me.getKeySet = function(index) {
            if (typeof layouts[index] === 'undefined') {
                throw Error("keyboards service: Invalid index");
            }

            return layouts[index].keySet;
        };

        me.setLayoutName = function(index, name) {
            if (typeof layouts[index] === 'undefined') {
                throw Error("keyboards service: Invalid index");
            }

            layouts[index].keySet.label = name;
        };
        me.getLayoutName = function(index) {
            if (typeof layouts[index] === 'undefined') {
                throw Error("keyboards service: Invalid index");
            }

            return layouts[index].keySet.label;
        };

        me.getMoreInfoUrl = function(index) {
            if (typeof layouts[index] === 'undefined') {
                throw Error("keyboards service: Invalid index");
            }

            return layouts[index].keySet.moreInfoUrl;
        };
        me.getMoreInfoText = function(index) {
            if (typeof layouts[index] === 'undefined') {
                throw Error("keyboards service: Invalid index");
            }

            return layouts[index].keySet.moreInfoText;
        };

        me.getKeyboardType = function(index) {
            if (typeof layouts[index] === 'undefined') {
                throw Error("keyboards service: Invalid index");
            }

            return layouts[index].keySet.keyboardType;
        };

        me.parseKeySet = function(txt) {
            try {
                var nn = JSON.parse(txt);
            } catch (err) {
                return {
                    valid: false,
                    reason: "Invalid input."
                };
            }
            var vv = {}, prop, ii, valid = true;
            if (typeof nn.label === "string") {
                vv.label = nn.label;
            } else {
                return {
                    valid: false,
                    reason: "Label not a string."
                };
            }
            if (typeof nn.fingerStart === "object") {
                vv.fingerStart = {};
                for (prop in nn.fingerStart) {
                    if (typeof nn.fingerStart[prop] === "number") {
                        vv.fingerStart[prop] = nn.fingerStart[prop];
                    } else {
                        return {
                            valid: false,
                            reason: "Finger start is not a number."
                        };
                    }
                }
            } else {
                return {
                    valid: false,
                    reason: "Finger start is not a object."
                };
            }
            if (typeof nn.keyboardType === "string") {
                vv.keyboardType = nn.keyboardType;
            } else {
                return {
                    valid: false,
                    reason: "Keyboard type is not a string."
                };
            }
            if (typeof nn.author === "string" || typeof nn.author === 'undefined') {
                vv.author = nn.author || 'Unknown';
            } else {
                return {
                    valid: false,
                    reason: "Keyboard author is defined and is not a string."
                };
            }

            // deprecated, ignore
            if (typeof nn.authorUrl === "string" || typeof nn.authorUrl === 'undefined') {
                vv.authorUrl = nn.authorUrl || '';
            } else {
                return {
                    valid: false,
                    reason: "Keyboard authorUrl is defined and is not a string."
                };
            }


            if (typeof nn.moreInfoUrl === "string" || typeof nn.moreInfoUrl === 'undefined') {
                vv.moreInfoUrl = nn.moreInfoUrl || '';
            } else {
                return {
                    valid: false,
                    reason: "Keyboard moreInfoUrl is defined and is not a string."
                };
            }
            if (typeof nn.moreInfoText === "string" || typeof nn.moreInfoText === 'undefined') {
                vv.moreInfoText = nn.moreInfoText || '';
            } else {
                return {
                    valid: false,
                    reason: "Keyboard moreInfoText is defined and is not a string."
                };
            }

            if (typeof nn.keys === "object" && typeof nn.keys.length === "number") {
                vv.keys = [];
                outterloop: for (ii = 0; ii < nn.keys.length; ii++) {
                    if (typeof nn.keys[ii] === "object") {
                        for (prop in nn.keys[ii]) {
                            if (typeof nn.keys[ii][prop] !== "string" && typeof nn.keys[ii][prop] !== "number") {
                                return {
                                    valid: false,
                                    reason: "Key prop is not a string or number."
                                };
                            }
                        }
                        vv.keys.push(nn.keys[ii]);
                    } else {
                        return {
                            valid: false,
                            reason: "Key item is not an object."
                        };
                    }
                }
            } else {
                return {
                    valid: false,
                    reason: "Keys are not an array."
                };
            }
            
            return {
                valid: true,
                keySet: vv
            };
        }; // end function

        return me;
	}

])
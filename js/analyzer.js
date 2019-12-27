"use strict";

var KLA = KLA || {};

if (typeof console === 'undefined') {
    var console = {};
    console.log = function() {};
    console.dir = function() {};
}

KLA.Analyzer = (function() {

    var me,
        distanceBetweenKeysCached;

    me = function() {
        return me;
    };

    // utility function
    var memoize = function(funct) {
        var cache = {};
        return function() {
            var key = arguments.length + Array.prototype.join.call(arguments,",");
            if (key in cache) return cache[key];
            else return cache[key] = funct.apply(this,arguments);
        };
    };

    function distanceBetweenKeys(keyMap, keyIndex1, keyIndex2) {
        var xDiff = keyMap[keyIndex1].cx - keyMap[keyIndex2].cx,
            yDiff = keyMap[keyIndex1].cy - keyMap[keyIndex2].cy;
        return Math.sqrt(xDiff*xDiff + yDiff*yDiff);
    }

    /*
        Look up where the char was typed and any other information we'll need. 
        
        Input:
        * keySet
        * charCode
        
        An object with the following properties will be returned:
          * fingerUsed          - Represents the finger used. 
          * keyIndex            - keyID for the keySet
          * charCode            - Char code for character pressed
          * pushType            - What type of key (ie, KB.PRIME_PUSH, KB.SHIFT_PUSH, etc)
          * errors              - A string array indicating any errors
    */
    function findCharInKeySet(keySet, charCode) {
        var ret,
            len,
            keys = keySet.keys,
            ii,
            hand;
        ret = {
            fingerUsed: null,
            keyIndex: null,
            charCode: charCode,
            pushType: null,
            errors: []
        };

        //console.log("Entering findCharInKeySet");

        len = keys.length;
        for (ii = 0; ii < len; ii++) {
            if ( keys[ii].primary && keys[ii].primary === charCode ) {
                ret.fingerUsed = keys[ii].finger;
                ret.keyIndex = ii;
                ret.pushType = KB.PRIME_PUSH;
                break;
            } else if ( keys[ii].shift && keys[ii].shift === charCode ) {
                ret.fingerUsed = keys[ii].finger;
                ret.keyIndex = ii;    
                ret.pushType = KB.SHIFT_PUSH;
                break;
            } else if ( keys[ii].altGr && keys[ii].altGr === charCode ) {
                ret.fingerUsed = keys[ii].finger;
                ret.keyIndex = ii;
                ret.pushType = KB.ALTGR_PUSH;
                break;
            } else if ( keys[ii].shiftAltGr && keys[ii].shiftAltGr === charCode ) {
                ret.fingerUsed = keys[ii].finger;
                ret.keyIndex = ii;
                ret.pushType = KB.SHIFT_ALTGR_PUSH;
                break;
            }
        }

        // Blogs often change certain characters to other codes, so do some character changes to accommodate certain instances
        if (ret.fingerUsed === null) {
	        switch (charCode) {
	            case 8217:
	                return findCharInKeySet(keySet, 39); // '
                case 8220:
                case 8221:
                    return findCharInKeySet(keySet, 34); // "
                case 8211:
	                return findCharInKeySet(keySet, 45); // -
	        }
	        ret.errors.push("Char code not found: " + charCode + " ("+String.fromCharCode(charCode)+")");
        }

        if ( ret.pushType !== KB.PRIME_PUSH && (charCode === 16 || charCode === -16 || charCode === -18) ) {
	        //console.log("Shift Key and Alt GR Key can only be set as 'primary' key presses.");
	        ret.errors.push("Shift Key and Alt GR Key can only be set as 'primary' key presses.");
	        return ret;
        }
        
        //console.dir(ret);
        //console.log("Leaving findCharInKeySet");
        
        return ret;
    }

    /*
        Returns an array of the fingers used to press the key.
        An object from the "findCharInKeySet" function is taken in as input.
    */
    function getFingersUsed( char2KeyMap, keyInfo ) {
        var hand = KB.finger.whichHand( keyInfo.fingerUsed ),
            fingers = {},
            shiftInfo,
            altGrInfo;
    
        //console.log("Entering getFingersUsed");
    
        fingers[keyInfo.fingerUsed] = true;
    
        if (keyInfo.pushType === KB.SHIFT_PUSH) {
            shiftInfo = (hand === "right") ? char2KeyMap[16] : char2KeyMap[-16];
            fingers[ shiftInfo.fingerUsed ] = true;
        } else if (keyInfo.pushType === KB.ALTGR_PUSH) {
            altGrInfo = char2KeyMap[-18];
            //console.dir(altGrInfo);
            fingers[ altGrInfo.fingerUsed ] = true;
        } else if (keyInfo.pushType === KB.SHIFT_ALTGR_PUSH) {
            shiftInfo = (hand === "right") ? char2KeyMap[16] : char2KeyMap[-16];
            altGrInfo = char2KeyMap[-18];
            fingers[ shiftInfo.fingerUsed ] = true;
            fingers[ altGrInfo.fingerUsed ] = true;
        }
    
        //console.log("Leaving getFingersUsed");
    
        return fingers;
    }

    /*
        input:
	        keyMap             - key map
	        fingerHomes        - object indexed by fingers, maps to key index where they start
	        fingerPositions    - current finger positions (same type of object as fingerHomes)
	        except             - finger indexes to not return to home keys
	        analysis           - analysis object
    */
    function returnFingersToHomeRow(config) {
    
        var finger,
            fingerHomes = config.fingerHomes,
            fingerPositions = config.fingerPositions,
            keyMap = config.keyMap,
            except = config.except,
            analysis = config.analysis;
    
        //console.log("Entering returnFingersToHomeRow");
    
        for (finger in KB.fingers) {
            if ( except[finger] ) {continue;} // don't return finger if in except list
            if ( fingerHomes[finger] === fingerPositions[finger]) {continue;} // finger already home
            //console.log("finger:"+finger);
            analysis.distance[finger] += distanceBetweenKeysCached(keyMap, fingerPositions[finger], fingerHomes[finger] );
            fingerPositions[finger] = fingerHomes[finger]; // return finger to key
        }
        
        //console.log("Leaving returnFingersToHomeRow");
    }

    /*
    Inputs:
	   keyInfo: char2KeyMap[charCode],
	   char2KeyMap: 
	   fingerPositions: curFingerPos,
	   keyMap: keyMap,
	   analysis: analysis
    */
    function typeKey(config) {
    
        var keyInfo = config.keyInfo,
            char2KeyMap = config.char2KeyMap,
            fingerPositions = config.fingerPositions,
            keyMap = config.keyMap,
            analysis = config.analysis,
            hand = KB.finger.whichHand( keyInfo.fingerUsed ),
            shiftInfo = {},
            altGrInfo = {},
            errors = [],
            tmpHand;
    
        //console.log("Entering typeKey");
    
        switch (keyInfo.pushType) {
            case KB.SHIFT_PUSH:
                shiftInfo = (hand === "right") ? char2KeyMap[16] : char2KeyMap[-16];
                break;
            case KB.ALTGR_PUSH:
                altGrInfo = char2KeyMap[-18];
                break;
            case KB.SHIFT_ALTGR_PUSH:
                shiftInfo = (hand === "right") ? char2KeyMap[16] : char2KeyMap[-16];
                altGrInfo = char2KeyMap[-18];
                break;
        }

        if ( ( shiftInfo.fingerUsed && shiftInfo.fingerUsed === altGrInfo.fingerUsed ) ||
            shiftInfo.fingerUsed === keyInfo.fingerUsed ||
            altGrInfo.fingerUsed === keyInfo.fingerUsed ) {
            errors.push("Keyboard configuration error: Same finger used to type shift, altgr or " + String.fromCharCode(keyInfo.charCode));
            console.log("Exiting typeKey due to errors.");
            return errors;
        }

        //shift key has been lifted up
        if ( 
            (!angular.equals(analysis.tmp.prevShiftInfo, {}) && !angular.equals(shiftInfo, analysis.tmp.prevShiftInfo)) 
        ) {
            analysis.tmp.prevFingerUsed = analysis.tmp.prevShiftInfo.fingerUsed;
            analysis.tmp.prevHandUsed = KB.finger.leftRightOrThumb(analysis.tmp.prevShiftInfo.fingerUsed);
            analysis.tmp.prevKeyIndex = analysis.tmp.prevShiftInfo.keyIndex;
            //console.log('shift up');
        }

        // shift key has gone down
        if ( 
            (angular.equals(analysis.tmp.prevShiftInfo, {}) || !angular.equals(shiftInfo, analysis.tmp.prevShiftInfo)) &&
            !angular.equals(shiftInfo, {})
        ) {

            analysis.distance[shiftInfo.fingerUsed] += moveFingerToKey( keyMap, fingerPositions, shiftInfo );
            analysis.fingerUsage[shiftInfo.fingerUsed]++;
            analysis.rowUsage[keyMap[shiftInfo.keyIndex].row]++;
            analysis.keyData[shiftInfo.keyIndex].count++;
            analysis.numKeys++;
            analysis.modifierUse.shift++;
            
            if (analysis.tmp.prevFingerUsed === shiftInfo.fingerUsed) {
                if (analysis.tmp.prevKeyIndex !== shiftInfo.keyIndex) {
                    analysis.consecFingerPressIgnoreDups[shiftInfo.fingerUsed]++;
                }
                analysis.consecFingerPress[shiftInfo.fingerUsed]++;
            }
            analysis.tmp.prevFingerUsed = shiftInfo.fingerUsed;
            
            tmpHand = KB.finger.leftRightOrThumb(shiftInfo.fingerUsed);
            if (analysis.tmp.prevHandUsed === tmpHand ) {
                if (analysis.tmp.prevKeyIndex !== shiftInfo.keyIndex) {
                    analysis.consecHandPressIgnoreDups[tmpHand]++;
                }
                analysis.consecHandPress[tmpHand]++;
            }
            analysis.tmp.prevHandUsed = tmpHand;
            
            analysis.tmp.prevKeyIndex = shiftInfo.keyIndex;

            //console.log('shift down');

        } else if ( typeof shiftInfo.fingerUsed !== "undefined" ) {
            analysis.modifierUse.shift++;
        }
    
        // altgr key has been lifted up
        if ( 
            (!angular.equals(analysis.tmp.prevAltGrInfo, {}) && !angular.equals(altGrInfo, analysis.tmp.prevAltGrInfo)) 
        ) {
            analysis.tmp.prevFingerUsed = analysis.tmp.prevAltGrInfo.fingerUsed;
            analysis.tmp.prevHandUsed = KB.finger.leftRightOrThumb(analysis.tmp.prevAltGrInfo.fingerUsed);
            analysis.tmp.prevKeyIndex = analysis.tmp.prevAltGrInfo.keyIndex;
        }

        // altgr key has gone down
        if ( 
            (angular.equals(analysis.tmp.prevAltGrInfo, {}) || !angular.equals(altGrInfo, analysis.tmp.prevAltGrInfo)) &&
            !angular.equals(altGrInfo, {})
        ) {

            analysis.distance[altGrInfo.fingerUsed] += moveFingerToKey( keyMap, fingerPositions, altGrInfo );
            analysis.fingerUsage[altGrInfo.fingerUsed]++;
            analysis.rowUsage[keyMap[altGrInfo.keyIndex].row]++;
            analysis.keyData[altGrInfo.keyIndex].count++;
            analysis.numKeys++;
            analysis.modifierUse.altGr++;
            
            if (analysis.tmp.prevFingerUsed === altGrInfo.fingerUsed) {
                if (analysis.tmp.prevKeyIndex !== altGrInfo.keyIndex) {
                    analysis.consecFingerPressIgnoreDups[altGrInfo.fingerUsed]++;
                }
                analysis.consecFingerPress[altGrInfo.fingerUsed]++;
            }
            analysis.tmp.prevFingerUsed = altGrInfo.fingerUsed;
            
            tmpHand = KB.finger.leftRightOrThumb(altGrInfo.fingerUsed);
            if (analysis.tmp.prevHandUsed === tmpHand ) {
                if (analysis.tmp.prevKeyIndex !== altGrInfo.keyIndex) {
                    analysis.consecHandPressIgnoreDups[tmpHand]++;
                }
                analysis.consecHandPress[tmpHand]++;
            }
            analysis.tmp.prevHandUsed = tmpHand;
            
            analysis.tmp.prevKeyIndex = altGrInfo.keyIndex;

        } else if ( typeof altGrInfo.fingerUsed !== "undefined" ) {
            analysis.modifierUse.altGr++;
        }

        if ( ( shiftInfo.fingerUsed && shiftInfo.fingerUsed === altGrInfo.fingerUsed ) ||
            shiftInfo.fingerUsed === keyInfo.fingerUsed ||
            altGrInfo.fingerUsed === keyInfo.fingerUsed ) {
            errors.push("Keyboard configuration error: Same finger used to type shift, altgr or " + String.fromCharCode(keyInfo.charCode));
            console.log("Exiting typeKey due to errors.");
            return errors;
        }

        // record stats
    /*
        if ( typeof shiftInfo.fingerUsed !== "undefined" ) {
            analysis.distance[shiftInfo.fingerUsed] += moveFingerToKey( keyMap, fingerPositions, shiftInfo );
            analysis.fingerUsage[shiftInfo.fingerUsed]++;
            analysis.rowUsage[keyMap[shiftInfo.keyIndex].row]++;
            analysis.keyData[shiftInfo.keyIndex].count++;
            analysis.numKeys++;
            analysis.modifierUse.shift++;
            
            if (analysis.tmp.prevFingerUsed === shiftInfo.fingerUsed) {
                if (analysis.tmp.prevKeyIndex !== shiftInfo.keyIndex) {
                    analysis.consecFingerPressIgnoreDups[shiftInfo.fingerUsed]++;
                }
                analysis.consecFingerPress[shiftInfo.fingerUsed]++;
            }
            analysis.tmp.prevFingerUsed = shiftInfo.fingerUsed;
            
            tmpHand = KB.finger.leftRightOrThumb(shiftInfo.fingerUsed);
            if (analysis.tmp.prevHandUsed === tmpHand ) {
                if (analysis.tmp.prevKeyIndex !== shiftInfo.keyIndex) {
                    analysis.consecHandPressIgnoreDups[tmpHand]++;
                }
                analysis.consecHandPress[tmpHand]++;
            }
            analysis.tmp.prevHandUsed = tmpHand;
            
            analysis.tmp.prevKeyIndex = shiftInfo.keyIndex;
        }
        */
        /*
        if ( typeof altGrInfo.fingerUsed !== "undefined" ) {
            analysis.distance[altGrInfo.fingerUsed] += moveFingerToKey( keyMap, fingerPositions, altGrInfo );
            analysis.fingerUsage[altGrInfo.fingerUsed]++;
            analysis.rowUsage[keyMap[altGrInfo.keyIndex].row]++;
            analysis.keyData[altGrInfo.keyIndex].count++;
            analysis.numKeys++;
            analysis.modifierUse.altGr++;
            
            if (analysis.tmp.prevFingerUsed === altGrInfo.fingerUsed) {
                if (analysis.tmp.prevKeyIndex !== altGrInfo.keyIndex) {
                    analysis.consecFingerPressIgnoreDups[altGrInfo.fingerUsed]++;
                }
                analysis.consecFingerPress[altGrInfo.fingerUsed]++;
            }
            analysis.tmp.prevFingerUsed = altGrInfo.fingerUsed;
            
            tmpHand = KB.finger.leftRightOrThumb(altGrInfo.fingerUsed);
            if (analysis.tmp.prevHandUsed === tmpHand ) {
                if (analysis.tmp.prevKeyIndex !== altGrInfo.keyIndex) {
                    analysis.consecHandPressIgnoreDups[tmpHand]++;
                }
                analysis.consecHandPress[tmpHand]++;
            }
            analysis.tmp.prevHandUsed = tmpHand;
            
            analysis.tmp.prevKeyIndex = altGrInfo.keyIndex;
        }
        */
        
        if (typeof shiftInfo.fingerUsed !== "undefined" && typeof altGrInfo.fingerUsed !== "undefined") {
            analysis.modifierUse.shiftAltGr++;
        }
    

        // handle the key that was typed

        analysis.fingerUsage[keyInfo.fingerUsed]++;     
        analysis.distance[keyInfo.fingerUsed] += moveFingerToKey( keyMap, fingerPositions, keyInfo );
        analysis.rowUsage[keyMap[keyInfo.keyIndex].row]++;
        analysis.keyData[keyInfo.keyIndex].count++;
        analysis.numKeys++;
        
        if (analysis.tmp.prevFingerUsed === keyInfo.fingerUsed) {
            if (analysis.tmp.prevKeyIndex !== keyInfo.keyIndex) {
                analysis.consecFingerPressIgnoreDups[keyInfo.fingerUsed]++;
            }
            analysis.consecFingerPress[keyInfo.fingerUsed]++;
        }
        analysis.tmp.prevFingerUsed = keyInfo.fingerUsed;
        
        tmpHand = KB.finger.leftRightOrThumb(keyInfo.fingerUsed);
        if (analysis.tmp.prevHandUsed === tmpHand ) {
            if (analysis.tmp.prevKeyIndex !== keyInfo.keyIndex) {
                analysis.consecHandPressIgnoreDups[tmpHand]++;
            }
            analysis.consecHandPress[tmpHand]++;
        }
        analysis.tmp.prevHandUsed = tmpHand;
        
        // update key index for next press
        analysis.tmp.prevKeyIndex = keyInfo.keyIndex;
        
        analysis.tmp.prevShiftInfo = shiftInfo;
        analysis.tmp.prevAltGrInfo = altGrInfo;

        //console.log("Leaving typeKey");
        return errors;
    }

    /*
        Updates the fingerPositions object and returns the distance the finger moved
    */
    function moveFingerToKey( keyMap, fingerPositions, keyInfo) {
        //console.log("Entering moveFingerToKey");
        var dist = distanceBetweenKeysCached(keyMap, keyInfo.keyIndex, fingerPositions[keyInfo.fingerUsed]);
        fingerPositions[keyInfo.fingerUsed] = keyInfo.keyIndex;
        //console.log("Exiting moveFingerToKey");
        return dist; 
    }

    /*
        config.keyMap
        config.keySet
        config.text
    */
    me.examine = function(config) {
        if (!config || !config.keyMap || !config.keySet || typeof config.text === "undefined") {
            console.log("config object for examine function does not contain the needed parameters.");
            return;
        }

        var tLen = config.text.length,
            ii,
            jj,
            text = config.text.replace(/\r\n/g,"\r").replace(/\n/g,"\r"),
            keyMap = config.keyMap,
            keySet = config.keySet,
            charCode,
            finger,
            fingerLabel,
            curFingerPos = {},
            char2KeyMap = {},
            analysis = {}; // holds data we collect
        
//console.log('-----')

        analysis.distance =    [0,0,0,0,0,0,0,0,0,0,0];
        analysis.fingerUsage = [0,0,0,0,0,0,0,0,0,0,0];
        analysis.rowUsage = [0, 0, 0, 0, 0];
        analysis.errors = [];
        analysis.keyData = {length:0}; // records number of times pushed
        analysis.charData = {}; // records information about characters // TODO: charData should only be computed once, not 5-6 times
        analysis.tmp = {}; // holds temporary data
        analysis.tmp.prevShiftInfo = {};
        analysis.tmp.prevAltGrInfo = {};
        analysis.consecFingerPress = [0,0,0,0,0,0,0,0,0,0,0];
        analysis.consecFingerPressIgnoreDups = [0,0,0,0,0,0,0,0,0,0,0];
        analysis.consecHandPress = {"left":0,"right":0,"thumbs":0};
        analysis.consecHandPressIgnoreDups = {"left":0,"right":0,"thumbs":0};
        analysis.modifierUse = {"shift":0,"altGr":0,"shiftAltGr":0};
        analysis.numKeys = 0;
        
        // initialize data keyData and charData data set
        for (ii = 0; ii < keySet.keys.length; ii++) {
            analysis.keyData[ii] = {};
            analysis.keyData[ii].count = 0;
            analysis.keyData[ii].index = ii;
            analysis.keyData.length++;
            
            for (jj in KB.PUSH_TYPES) {
                charCode = keySet.keys[ii][KB.PUSH_TYPES[jj]];
                if (typeof charCode === "number") {
                    analysis.charData[charCode] = {};
                }
            }
        }
        
        distanceBetweenKeysCached = memoize(distanceBetweenKeys);

        // initialize current finger positions
        curFingerPos[KB.finger.LEFT_PINKY] = keySet.fingerStart[KB.finger.LEFT_PINKY];
        curFingerPos[KB.finger.LEFT_RING] = keySet.fingerStart[KB.finger.LEFT_RING];
        curFingerPos[KB.finger.LEFT_MIDDLE] = keySet.fingerStart[KB.finger.LEFT_MIDDLE];
        curFingerPos[KB.finger.LEFT_INDEX] = keySet.fingerStart[KB.finger.LEFT_INDEX];
        curFingerPos[KB.finger.LEFT_THUMB] = keySet.fingerStart[KB.finger.LEFT_THUMB];
        curFingerPos[KB.finger.RIGHT_THUMB] = keySet.fingerStart[KB.finger.RIGHT_THUMB];
        curFingerPos[KB.finger.RIGHT_INDEX] = keySet.fingerStart[KB.finger.RIGHT_INDEX];
        curFingerPos[KB.finger.RIGHT_MIDDLE] = keySet.fingerStart[KB.finger.RIGHT_MIDDLE];
        curFingerPos[KB.finger.RIGHT_RING] = keySet.fingerStart[KB.finger.RIGHT_RING];
        curFingerPos[KB.finger.RIGHT_PINKY] = keySet.fingerStart[KB.finger.RIGHT_PINKY];

        // shit and altgr keys        
        char2KeyMap[16] = char2KeyMap[16] || findCharInKeySet(keySet, 16);
        char2KeyMap[-16] = char2KeyMap[-16] || findCharInKeySet(keySet, -16);
        char2KeyMap[-18] = char2KeyMap[-18] || findCharInKeySet(keySet, -18);
        
        if (char2KeyMap[16].errors.length > 1) {
            analysis.errors.push("Fatal Error: (left) Shift key not set correctly.");
            return analysis; 
        }
        if (char2KeyMap[-16].errors.length > 1) {
            analysis.errors.push("Fatal Error: (right) Shift key not set correctly.");
            return analysis; 
        }
        if (char2KeyMap[16].errors.length > 1) {
            analysis.errors.push("Fatal Error: AltGr key not set correctly.");
            return analysis; 
        }
        
        for (ii = 0; ii < tLen; ii++) {
            charCode = text.charCodeAt(ii);
            //console.log(charCode);

            // return object contains: fingerUsed, keyIndex, pushType, errors
            char2KeyMap[charCode] = char2KeyMap[charCode] || findCharInKeySet(keySet, charCode);
            
            if ( char2KeyMap[charCode].fingerUsed === null ) {
                console.log("Char code not found on keyboard (ignoring key):" + charCode); 
                analysis.errors.push.apply(analysis.errors, char2KeyMap[charCode].errors);
                continue;
            }
            
            returnFingersToHomeRow({
                keyMap: keyMap,
                fingerHomes: keySet.fingerStart,
                fingerPositions: curFingerPos,
                except: getFingersUsed( char2KeyMap, char2KeyMap[charCode] ),
                analysis: analysis
            });
            
            typeKey({
                keyInfo: char2KeyMap[charCode],
                char2KeyMap: char2KeyMap,
                fingerPositions: curFingerPos,
                keyMap: keyMap,
                analysis: analysis
            });
        }
        
        // done typing, but return fingers to the home row
        returnFingersToHomeRow({
            keyMap: keyMap,
            fingerHomes: keySet.fingerStart,
            fingerPositions: curFingerPos,
            except: {},
            analysis: analysis
        });
        
        analysis.pixelsPerCm = keyMap.pixelsPerCm;
        analysis.layoutName = keySet.label;
        
        for (finger in KB.fingers) {
            fingerLabel = KB.fingers[finger];
	        //console.log(fingerLabel + " distance:" + analysis.distance[ finger ]);
	        var numCm = (analysis.distance[ finger ] / keyMap.pixelsPerCm);
	        var numMeters = (numCm * 0.001);
	        var numFeet = numMeters * 3.2808399;
	        var numMiles = numMeters * 0.000621371192;
	    
	        //console.log("meters:" + numMeters);
	        //console.log("feet:" + numFeet);
	        //console.log("miles:" + numMiles);
	    }
        
        distanceBetweenKeysCached = null;
        return analysis;
    };

    /*
        Takes in results from multiple calls to examine and scores them
    */
    me.scoreLayouts = function(analysis) {
        var results = {};
        
        // DISTANCE
        results.distScores = [];

        var ii, jj, total = [], len = analysis.length;
        for (ii = 0; ii < len; ii++) {
            total[ii] = 0; 
            for (jj = 0; jj < analysis[ii].distance.length; jj++) {
                total[ii] += (analysis[ii].distance[jj] / analysis[ii].pixelsPerCm);
            }
        }

        for (ii = 0; ii < len; ii++) {
            results.distScores[ii] = Math.max(0, 4 - (total[ii] / analysis[ii].numKeys)) / 4;
            if ( !isFinite(results.distScores[ii]) ) { results.distScores[ii]=0;}
        }
        
        // FINGER USAGE
        results.fingerScores = [];
        var percent;
        var fScoring = {};
        fScoring[KB.finger.LEFT_PINKY] =    0.5;
        fScoring[KB.finger.LEFT_RING] =     1.0;
        fScoring[KB.finger.LEFT_MIDDLE] =   4.0;
        fScoring[KB.finger.LEFT_INDEX] =    2.0;
        fScoring[KB.finger.LEFT_THUMB] =    0.5;
        fScoring[KB.finger.RIGHT_THUMB] =   0.5;
        fScoring[KB.finger.RIGHT_INDEX] =   2.0;
        fScoring[KB.finger.RIGHT_MIDDLE] =  4.0;
        fScoring[KB.finger.RIGHT_RING] =    1.0;
        fScoring[KB.finger.RIGHT_PINKY] =   0.5;
        
        for (ii = 0; ii < len; ii++) {
            total = 0;
            for (jj = 0; jj < analysis[ii].fingerUsage.length; jj++) {
                if (!fScoring[jj]) {continue;}//skip non-fingers
                percent = (analysis[ii].fingerUsage[jj] / analysis[ii].numKeys) * 100;
                percent = Math.min(percent, 20); // 20 is the max allowed percent
                total += (percent * fScoring[jj]);        
            }
            results.fingerScores[ii] = total / 260; // 220 is max possible score
        }
        
        // CONSEC FINGER USAGE
        results.consecFingerScores = [];
        total = [];
        for (ii = 0; ii < len; ii++) {
            total[ii] = 0; 
            for (jj = 0; jj < analysis[ii].consecFingerPressIgnoreDups.length; jj++) {
                total[ii] += analysis[ii].consecFingerPressIgnoreDups[jj] ;
            }
            total[ii] = (total[ii] / analysis[ii].numKeys) * 100;
        }
        for (ii = 0; ii < len; ii++) {
            results.consecFingerScores[ii] = Math.max(0, 10 - total[ii]) / 10;
        }
        
        // CONSEC HAND USAGE
        results.consecHandScores = [];
        total = [];
        for (ii = 0; ii < len; ii++) {
            total[ii] = (analysis[ii].consecHandPressIgnoreDups["left"] + 
                         analysis[ii].consecHandPressIgnoreDups["right"]) / analysis[ii].numKeys;
            total[ii] = (total[ii]) * 100;
        }
        for (ii = 0; ii < len; ii++) {
            results.consecHandScores[ii] = Math.max(0, 50 - total[ii]) / 50;
        }
        
        // put it all together!
        var consecHandWeight = 17, consecFingerWeight = 17, fingerUsageWeight = 33, distWeight = 33;
        results.finalList = [];
        for (ii = 0; ii < len; ii++) {
            results.finalList[ii] = {};
            results.finalList[ii].layoutName = analysis[ii].layoutName;
            results.finalList[ii].score = 
                (results.consecHandScores[ii] * consecHandWeight) +
                (results.consecFingerScores[ii] * consecFingerWeight) +
                (results.fingerScores[ii] * fingerUsageWeight) +
                (results.distScores[ii] * distWeight);
            if ( !isFinite( results.finalList[ii].score ) ) { results.finalList[ii].score=0;}
        }
        
        results.finalList.sort(function(a,b) {
            return b.score - a.score;
        });

        return results;
    };

    return me;
})();


"use strict";

var KB = KB || {}; // define namespace

var doneNow=0;

KB.Key = (function() {

    // -------------------------------------------------------------------------
    // private static
    // -------------------------------------------------------------------------

	// -------------------------------------------------------------------------
	// object definition
	// -------------------------------------------------------------------------
	
	return function(config) {
        
        // ---------------------------------------------------------------------
        // private
        // ---------------------------------------------------------------------
        
        var me = this,
            myKeyboard = null,
            myCoords = [{x:0,y:0}],
            keyModel = {},
            myId = null,
            shouldDrawDot = true,
            myBgColor = {r: null, g: null, b: null, a: 0.5},
            myGlyphLayout = KB.glyphLayouts.standard,//default
            highlightBorderOpt = false;
        
        function drawFingerDot(myCtx) {
            if (!shouldDrawDot) {return;}
            var ii,
                len = myCoords.length,
                xCen=0, yCen=0,fingerStart,
                prevOpacity = me.getBackgroundColorOpacity();
            me.setBackgroundColorOpacity(0.5);
            // draw finger start dot (if needed)
            if ( fingerStart = me.getKeyboard().getFingerStartForKey(myId) ) {
                myCtx.save();
                myCtx.fillStyle = me.getBackgroundColorString();
                myCtx.strokeStyle = "rgba(0, 0, 0, 0.5)";
                myCtx.lineWidth = 2;

                xCen = me.getKeyboard().getKeyMap()[myId].cx;
                yCen = me.getKeyboard().getKeyMap()[myId].cy;
                myCtx.beginPath();
                myCtx.arc(xCen, yCen, 4, 0, Math.PI*2, true); 
                myCtx.closePath();
                myCtx.stroke();
                myCtx.fill();
                myCtx.restore();
            }
            me.setBackgroundColorOpacity(prevOpacity);
        }
        
        function drawBackground(myCtx) {
            var ii,
                len = myCoords.length;
            
            myCtx.save();
            
            myCtx.fillStyle = me.getBackgroundColorString();//KB.finger.getColor(keyModel.finger, opacity);
            myCtx.beginPath();
            myCtx.moveTo(myCoords[0].x, myCoords[0].y);
            for (ii = 1; ii < len; ii++) {
                myCtx.lineTo(myCoords[ii].x, myCoords[ii].y);
            }
            myCtx.closePath();
            myCtx.fill();
            myCtx.restore();
        }
        
        function drawBorder(myCtx, offsetX, offsetY, borderOverride) {
			
			var ii,
                len = myCoords.length;
            
            offsetX = offsetX || 0;
            offsetY = offsetY || 0;
            
            myCtx.save();
			myCtx.strokeStyle = "#000";
			myCtx.lineWidth = borderOverride || 1.25;
			myCtx.beginPath();

            myCtx.moveTo( myCoords[0].x+offsetX, myCoords[0].y+offsetY);
			
			for (ii = 0; ii < len; ii++) {
                myCtx.lineTo(myCoords[ii].x+offsetX,myCoords[ii].y+offsetY);
			}
            myCtx.closePath();
            myCtx.stroke();
            myCtx.restore();
        }
        
        function drawGlyphs(myCtx, offsetX, offsetY) {
            var pType,
                coords,
                fontSize = 14;
                
            if (!myCtx.fillText) {return;}
            offsetX = offsetX || 0;
            offsetY = offsetY || 0;
                
            myCtx.save();
            myCtx.font = fontSize + "px sans-serif"
            myCtx.fillStyle = "rgba(0, 0, 0, 1)"; 
                
            var pName;
            for (pType in KB.PUSH_TYPES) {
                pName = KB.PUSH_TYPES[pType];
                if ( keyModel.hasOwnProperty(pName) ) {
                    myCtx.save();
                    if (pName === "primary" && (typeof keyModel["shift"] === "undefined" || keyModel["shift"] === KB.Key.NONE)) {
                        coords = myGlyphLayout.getCoords(me.getId(), 1, keyModel[pName], fontSize, myCoords);
                    } else {
                        coords = myGlyphLayout.getCoords(me.getId(), pType, keyModel[pName], fontSize, myCoords);
                    }
					myCtx.textAlign = coords.textAlign;
					myCtx.textBaseline = coords.textBaseline;
					
                    // draw label
                    var keySetLabels = me.getKeyboard().getKeySet().labels || {};
                    
                    myCtx.translate(coords.x+offsetX, coords.y+offsetY);

                    var rotation = me.getKeyboard().getKeyMap().rotation;
                    if ( rotation ) {                        
                        myCtx.rotate(rotation(me.getId()));
                    }

                    if ( keySetLabels[ keyModel[pName] ]) {
                        myCtx.fillText(keySetLabels[ keyModel[pName] ], 0, 0);
                    } else if ( KB.Key.labels[ keyModel[pName] ] ) {
					    myCtx.fillText(KB.Key.labels[ keyModel[pName] ], 0, 0);
					} else if ( keyModel[pName] > 0 ) {
					    myCtx.fillText(String.fromCharCode( keyModel[pName] ), 0, 0);
					}
                    myCtx.restore();
                }
            }
            myCtx.restore();
        }
        
        // ---------------------------------------------------------------------
        // public
        // ---------------------------------------------------------------------        
        
        me.isHighlighted = false;

        me.highlightBorder = function(val) {
            highlightBorderOpt = val;
        }

        me.drawDragOverlay = function(offsetX, offsetY) {
            var ii,
                myOverlay = myKeyboard.getDragLayer(),
                myOverlayCtx = myOverlay.getContext("2d");
            myOverlayCtx.clearRect ( 0 , 0 , myOverlay.getAttribute("width") , myOverlay.getAttribute("height") );
            drawBorder(myOverlayCtx, offsetX, offsetY);
            drawGlyphs(myOverlayCtx, offsetX, offsetY);
        };
        
        me.highlight = function() {
            var myOverlayCtx = myKeyboard.getHighlightLayer().getContext("2d"),
                opacity = KB.finger.getColorHoverOpacity(keyModel.finger);
            
            opacity = (typeof opacity !== "undefined") ? opacity : 0.5;
            me.setBackgroundColorOpacity(opacity);

            // draw background
            drawBackground(myOverlayCtx);
            drawFingerDot(myOverlayCtx);
            if (highlightBorderOpt) {
                drawBorder(myOverlayCtx, 0, 0, 1.75);
            } else {
                drawBorder(myOverlayCtx);
            }
            drawGlyphs(myOverlayCtx);
            
            me.isHighlighted = true;
        }
        
        me.unhighlight = function() {
            var myOverlay = myKeyboard.getHighlightLayer(),
                myOverlayCtx = myOverlay.getContext("2d");
            myOverlayCtx.clearRect ( 0 , 0 , myOverlay.getAttribute("width") , myOverlay.getAttribute("height") );
            me.isHighlighted = false;
            me.setBackgroundColorOpacity( KB.finger.getColorNormalOpacity(keyModel.finger) );
        };
        
        me.draw = function() {
            var myCtx = myKeyboard.getBgLayer().getContext("2d");
            drawBackground(myCtx);
            drawFingerDot(myCtx);
            drawBorder(myCtx);
            drawGlyphs(myCtx);
        };

        me.shouldDrawFingerDot = function(val) {
            shouldDrawDot = val;
        }

        me.setKeyboard = function(newKeyboard) {
            myKeyboard = newKeyboard;
            myGlyphLayout = KB.glyphLayouts[myKeyboard.getKeySet().keyboardType];
        };
        me.getKeyboard = function() {
            return myKeyboard;
        };
        me.getBgLayer = function() {
            return myKeyboard.getBgLayer();
        };
        me.getHighlightLayer = function() {
            return myKeyboard.getHighlightLayer();
        };

        me.setKeyModel = function(key) {
            keyModel = key;
        };

        me.setFinger = function(newFinger) {
            keyModel.finger = parseInt(newFinger,10);
        };
        me.getFinger = function() {
            return keyModel.finger;
        };
        me.getFingerStart = function() {
            return me.getKeyboard().getFingerStartForKey(me.getId());
        }
        me.setId = function(newId) {
            myId = newId;
        };
        me.getId = function() {
            return myId;
        };

        me.getGlyphLayout = function() {
            return myGlyphLayout;
        };
        me.setGlyphLayout = function(newGlyphLayout) {
            myGlyphLayout = newGlyphLayout;
        };

        me.getValue = function(type) {
            //if ( !keyModel.hasOwnProperty( KB.PUSH_TYPES[type]) ) {throw new Error("Invalid key type '" + type + "' for key.");}
            if ( !keyModel.hasOwnProperty( KB.PUSH_TYPES[type]) ) {keyModel[KB.PUSH_TYPES[type]]=KB.Key.NONE;}
            return keyModel[KB.PUSH_TYPES[type]];            
        };
        me.setValue = function(type, keyCode) {
            if ( !keyModel.hasOwnProperty(KB.PUSH_TYPES[type]) ) {throw new Error("Invalid key type '" + type + "' for key.");}
            if ( typeof keyCode === "string" && keyCode.length === 1) {
                keyCode = keyCode.charCodeAt(0);
            }
            if ( typeof keyCode !== "number" ) {throw new Error("keyCode for setKey function must be a Number.");}
            keyModel[KB.PUSH_TYPES[type]] = keyCode;
        };
        
        me.getX = function() {
            return myCoords[0].x;
        };
        me.getY = function() {
            return myCoords[0].y;
        };
        me.getCoords = function() {
            return myCoords;
        };
        me.setCoords = function(newCoords) {
            myCoords = newCoords;
        };        
        
        me.getBackgroundColorString = function() {
            if (myBgColor.r !== null) {
                return "rgba("+myBgColor.r+","+myBgColor.g+","+myBgColor.b+","+myBgColor.a+")";
            } else {
                return KB.finger.getColor(keyModel.finger, myBgColor.a);
            }
        };
        me.getBackgroundColor = function() {
            return myBgColor || KB.finger.color[keyModel.finger];
        };
        me.setBackgroundColor = function(color) {
            if (color !== null && color !== "") {
                myBgColor.r = isFinite(color.r) ? color.r : myBgColor.r;
                myBgColor.g = isFinite(color.g) ? color.g : myBgColor.g;
                myBgColor.b = isFinite(color.b) ? color.b : myBgColor.b;
            } else {
                myBgColor.r = null;
                myBgColor.g = null;
                myBgColor.b = null;
            }
        };
        me.getBackgroundColorOpacity = function() {
            return myBgColor.a;
        };
        me.setBackgroundColorOpacity = function(opacity) {
            myBgColor.a = opacity;
        };
        
        me.pointOverKey = function(x,y) {

            var nvert = myCoords.length;
            var vertx = [];
            var verty = [];
            var testx = x;
            var testy = y;
            for (var i = 0; i < nvert; i++) {
                vertx.push(myCoords[i].x);
                verty.push(myCoords[i].y);
            }

            var i, j, c = false;
            for( i = 0, j = nvert-1; i < nvert; j = i++ ) {
                if( ( ( verty[i] > testy ) != ( verty[j] > testy ) ) &&
                    ( testx < ( vertx[j] - vertx[i] ) * ( testy - verty[i] ) / ( verty[j] - verty[i] ) + vertx[i] ) ) {
                        c = !c;
                }
            }
            return c;
        };
        
	    // ---------------------------------------------------------------------
	    // constructor
	    // ---------------------------------------------------------------------
    
        (function(myConfig) {

        })(config);
    };
})();

// -----------------------------------------------------------------------------
// public static
// -----------------------------------------------------------------------------

/*
    Valid inputs:
    - [uU]+[0-9a-f]+    unicode string
    - [0-9][a-f]+       unicode string minus the u:
    - [a-?]             Single character that will get converted into unicode
    
    return:
        - empty string on invalid input
        - unicode number for key input
*/
KB.Key.getUnicode = function(keyInput) {
    var matches;
    if (typeof keyInput === "number") {return keyInput;}//return numeric input as is
    if (keyInput.length === 1) {
        return keyInput.charCodeAt(0);
    } else if (matches = keyInput.match(/^(?:[uU]\:)?([-0-9a-f]+)$/)) {
        return parseInt(matches[1],16);
    } else {
        return -1;//error
    }
};

KB.Key.getDisplayText = function(keyInput) {
    var key = keyInput;
    if (typeof keyInput === "string") {
        key = KB.Key.getUnicode(keyInput);
    } else if (typeof keyInput === "number") {
        if (keyInput === KB.Key.NONE) {
            return "";
        } 
    }
    if (key === "") {return "";} // error
    if (key >= 33 && key <= 126) {
        return String.fromCharCode(key);
    }
    return "u:" + key.toString(16);
};

KB.Key.NONE = -1;
KB.Key.WIN = -91;
KB.Key.ALT_GR = -18;
KB.Key.RIGHT_CLICK = -93;

KB.Key.labels = {};
KB.Key.labels[8] = "Backspace";
KB.Key.labels[9] = "Tab";
KB.Key.labels[13] = "Enter";
KB.Key.labels[16] = "LShift";
KB.Key.labels[27] = "Esc";
KB.Key.labels[-16] = "RShift";
KB.Key.labels[17] = "Ctrl";
KB.Key.labels[18] = "Alt";
KB.Key.labels[-18] = "Alt Gr";
KB.Key.labels[20] = "Caps Lock";
KB.Key.labels[27] = "Esc";
KB.Key.labels[-91] = "Win";
KB.Key.labels[-93] = "R-Clk";
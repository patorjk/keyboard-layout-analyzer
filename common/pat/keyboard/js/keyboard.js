"use strict";

var KB = KB || {}; // define namespace

KB.Keyboard = (function() {

    // -------------------------------------------------------------------------
    // private static
    // -------------------------------------------------------------------------

    var initCount = 0;

    // -------------------------------------------------------------------------
    // object definition
    // -------------------------------------------------------------------------
    
    return function(config) {
        
        // ---------------------------------------------------------------------
        // private
        // ---------------------------------------------------------------------
        
        /*
            Possible keyboard states:
            
            "editor"
            "heatmap"
            "display"
        */
        
        var me = this,
            myKeySet = KB.keySet.standard.qwerty,
            myKeyMap = KB.keyMap.standard.s683_225,
            myKeys = null,
            myLayers = [null, null, null, null],
            layerBg = 0,
            layerHighlight = 1,
            layerDrag = 2,
            layerMouse = 3,
            myContainer = null,
            myNamespace = "kb_keyboard" + initCount++,
            myType = "editor",
            currentKey = null;
        
        function setContainer(newContainer) {
            var ii;
            myContainer = (typeof newContainer === "string") ? document.getElementById(newContainer) : newContainer;
            if (myContainer === null) return;
            $(myContainer).addClass("kb-keyboard-container");

            for (ii = 0; ii < myLayers.length; ii++) {
                myLayers[ii] = document.createElement("canvas");
                myLayers[ii].id = myNamespace + "_canvas_l"+ii;
                myLayers[ii].setAttribute("width", 100);
                myLayers[ii].setAttribute("height", 100);
                $(myLayers[ii]).addClass("kb-keyboard-overlay");
                myContainer.appendChild(myLayers[ii]);
            }
            myContainer.style.padding = "0px";

            /*
                TODO: hack-ish fix, make this make sense
            */
            $(myContainer).css({
                height: '252px'
                /*,
                display:'inline-block'
                */
            })
        };
        
        /*
            Returns the index of the key the user currently has their mouse over
            If no key is moused over, null is returned
        */
        function getHighlightedKey(config) {
            var ii = myKeys.length;
            while (ii--) {
                if (myKeys[ii].pointOverKey(config.x,config.y)) {return ii;}
            }
            return null;
        }
        
        function highlightKey(config) {
	        var kIndex = getHighlightedKey(config);
	        if ( kIndex !== null && !myKeys[kIndex].isHighlighted && currentKey !== kIndex ) {
	            if (currentKey !== null) { myKeys[currentKey].unhighlight() ;}	               
	            myKeys[kIndex].highlight();
	            currentKey = kIndex;
	        } else if (kIndex === null && currentKey !== null) {
                myKeys[currentKey].unhighlight();
                currentKey = null;
	        }
            return kIndex;
        }
        
        // ---------------------------------------------------------------------
        // public
        // ---------------------------------------------------------------------        
        
        me.draw = function() {
            var ii,
                len = myKeys.length,
                ctx = myLayers[layerBg].getContext("2d");
            
            ctx.clearRect(0, 0, myLayers[layerBg].width, myLayers[layerBg].height);
            
            // draw initial white background
            ctx.fillStyle = "rgba(255, 255, 255, 1)";  
            ctx.fillRect (myKeyMap.leftX, myKeyMap.leftY, myLayers[layerBg].getAttribute("width")-5, myLayers[layerBg].getAttribute("height")-5);  
            
            for (ii = 0; ii < len; ii++) {
                myKeys[ii].draw();
            }
        };

        me.getKey = function(index) {
            return myKeys[index];
        };
        me.getBgLayer = function() {
            return myLayers[layerBg];
        };
        me.getHighlightLayer = function() {
            return myLayers[layerHighlight];
        };
        me.getDragLayer = function() {
            return myLayers[layerDrag];
        };
        me.getContainer = function() {
            return myContainer;
        };
        me.getNamespace = function() {
            return myNamespace;
        };
        
        me.getKeySet = function() {
            return myKeySet;
        };
        me.getKeyMap = function() {
            return myKeyMap;
        };
        
        me.getType = function() {
            return myType;
        };
        
        me.setFingerStart = function(finger, keyId) {
            finger = parseInt(finger,10);
            keyId = parseInt(keyId,10);
            if (finger === KB.finger.NONE) {
                var curFinger = me.getFingerStartForKey(keyId);
                myKeySet.fingerStart[curFinger] = KB.Key.NONE;
                return;
            }
            myKeySet.fingerStart[finger] = keyId;
            if (finger === KB.finger.BOTH_THUMBS) {
                myKeySet.fingerStart[KB.finger.LEFT_THUMB] = keyId;
                myKeySet.fingerStart[KB.finger.RIGHT_THUMB] = keyId;
                console.log('here!');
                console.log('finger='+finger)
            } else if (finger === KB.finger.LEFT_THUMB && 
                       (myKeySet.fingerStart[KB.finger.BOTH_THUMBS] !== KB.Key.NONE && 
                        myKeySet.fingerStart[KB.finger.BOTH_THUMBS] !== finger) ) {
                myKeySet.fingerStart[KB.finger.RIGHT_THUMB] = myKeySet.fingerStart[KB.finger.BOTH_THUMBS];
                myKeySet.fingerStart[KB.finger.BOTH_THUMBS] = KB.Key.NONE;
            } else if (finger === KB.finger.RIGHT_THUMB && 
                       (myKeySet.fingerStart[KB.finger.BOTH_THUMBS] !== KB.Key.NONE && 
                        myKeySet.fingerStart[KB.finger.BOTH_THUMBS] !== finger) ) {
                myKeySet.fingerStart[KB.finger.LEFT_THUMB] = myKeySet.fingerStart[KB.finger.BOTH_THUMBS];
                myKeySet.fingerStart[KB.finger.BOTH_THUMBS] = KB.Key.NONE;
            }
        };
        me.getFingerStartForKey = function(keyId) {
            var ii,
                idx;

            for (ii in myKeySet.fingerStart) {
                idx = parseInt(ii,10);
                if (myKeySet.fingerStart[idx] === keyId) {
                    if ((idx === KB.finger.LEFT_THUMB || idx === KB.finger.RIGHT_THUMB) && 
                        (myKeySet.fingerStart[KB.finger.LEFT_THUMB] == myKeySet.fingerStart[KB.finger.RIGHT_THUMB])) {
                        myKeySet.fingerStart[KB.finger.BOTH_THUMBS] = myKeySet.fingerStart[KB.finger.LEFT_THUMB];
                        return KB.finger.BOTH_THUMBS;
                    } else {
                        return idx;
                    }
                }
            }
            return false;
        };
        
        /*
            keySet - An array of sub-arrays. The sub arrays contain information about the keys.
            keyMap - Metadata on where keys go.
        */
        me.setLayout = function(config) {        
            var ii,
                len,
                kk;

            if (myContainer === null) return;

            myKeySet = (typeof config.keySet !== 'undefined') ? config.keySet : myKeySet;
            myKeyMap = (typeof config.keyMap !== 'undefined') ? config.keyMap : myKeyMap;
            myKeys = [];
            
            myContainer.style.width = myKeyMap.width + "px";
            myContainer.style.height = myKeyMap.height + "px";
            for (ii = 0; ii < myLayers.length; ii++) {
                myLayers[ii].setAttribute("width", myKeyMap.width);
                myLayers[ii].setAttribute("height", myKeyMap.height);
            }
            
            len = myKeySet.keys.length;
            for (ii = 0; ii < len; ii++) {
                kk = new KB.Key();
                kk.setKeyboard(me);
                kk.setId(myKeySet.keys[ii].id);
		        
		        kk.setKeyModel( myKeySet.keys[ii] );
		        
                var defaultCoords = [ 
                    {
                        x:myKeyMap[ii].x,
                        y:myKeyMap[ii].y
                    }, {
                        x:myKeyMap[ii].x+myKeyMap[ii].w,
                        y:myKeyMap[ii].y
                    }, {
                        x:myKeyMap[ii].x+myKeyMap[ii].w, 
                        y:myKeyMap[ii].y+myKeyMap[ii].h
                    }, {
                        x:myKeyMap[ii].x,
                        y:myKeyMap[ii].y+myKeyMap[ii].h
                    } 
                ];
                
                var theCoords = myKeyMap[ii].coords || defaultCoords;
                
                kk.setCoords( theCoords );
                kk.setGlyphLayout( KB.glyphLayouts[myKeySet.keyboardType] );
                kk.mountPoint = myKeyMap[ii].mountPoint;
                
                if (me.getType() === "display") {
                    kk.setBackgroundColor({r:255,g:255,b:255});
                    kk.shouldDrawFingerDot(false);
                }
                if (me.getType() === 'heatmap') {
                    kk.setBackgroundColor({r:255,g:255,b:255});
                    kk.highlightBorder(true);
                }
                myKeys.push(kk);
            }
            me.draw();
        };
        
        // ---------------------------------------------------------------------
        // constructor
        // ---------------------------------------------------------------------
    
        (function(myConfig) {
        
            var kDialog = new KB.KeyDialog({parent:me}),
                keyPressed = KB.Key.NONE,
                offsetX = 0, offsetY = 0;

            myType = myConfig.type || "editor";
        
            if (myConfig.container) {
                setContainer(myConfig.container);
            } else {
                console.log("No container object provided for keyboard object.");
                throw new Error("No container object provided for keyboard object.");
            }
        
            // to allivate a weird angularjs issue TODO: fix later
            var tmpContainer = (typeof myConfig.container === "string") ? document.getElementById(myConfig.container) : myConfig.container;
            if (tmpContainer === null) return;

            if (myConfig.layout) {
                me.setLayout(myConfig.layout);
            }

            $(myLayers[layerMouse]).bind("selectstart", function(evt) {
                return false;
            });
            
            $(myLayers[layerMouse]).bind("mousedown", function(evt) {
                if (!evt) var evt = window.event;
                
                if ( myType === "editor" ) {
                    var pos = $(myLayers[layerBg]).offset();
                    var top = (document.documentElement && document.documentElement.scrollTop) || 
                                  document.body.scrollTop;
                    pos.top = pos.top - top;

                    keyPressed = getHighlightedKey({x:evt.clientX-pos.left,y:evt.clientY-pos.top});
                    myLayers[layerMouse].style.cursor = "none";
                    
                    if (keyPressed !== null || myKeys[keyPressed] === KB.Key.NONE) {
                        offsetX = evt.clientX - pos.left - myKeys[keyPressed].getX();
                        offsetY = evt.clientY - pos.top - myKeys[keyPressed].getY();
                    }
                }
                
                evt.cancelBubble = true;
                if (evt.stopPropagation) evt.stopPropagation();
                evt.returnValue = false;
            });
            
            $(myLayers[layerMouse]).bind("mouseup", function(evt) {
                if (!evt) var evt = window.event;
                var button = evt.which || evt.button;
                var leftClick = (button === 1);
                
                if ( myType === "editor" && keyPressed !== KB.Key.NONE) {
                    if (currentKey !== null && keyPressed === currentKey && leftClick) {
                        var pos = $(myLayers[layerBg]).offset();
                        var top = (document.documentElement && document.documentElement.scrollTop) || 
                                      document.body.scrollTop;
                        pos.top = pos.top - top;

                        var winX = pos.left + myKeyMap[currentKey].x + (myKeyMap[currentKey].w/2) - 100,
                            winY = pos.top + myKeyMap[currentKey].y + (myKeyMap[currentKey].h) + 6;
                        
                        kDialog.show({key: myKeys[currentKey]});

                        evt.cancelBubble = true;
                        if (evt.stopPropagation) evt.stopPropagation();
                    } else if (currentKey !== null && keyPressed !== currentKey) {
                        
                        var tmpKey = {};
                        tmpKey.primary = myKeySet.keys[currentKey].primary;
                        tmpKey.shift = myKeySet.keys[currentKey].shift;
                        tmpKey.altGr = myKeySet.keys[currentKey].altGr;
                        tmpKey.shiftAltGr = myKeySet.keys[currentKey].shiftAltGr;
                        
                        myKeySet.keys[currentKey].primary = myKeySet.keys[keyPressed].primary || KB.Key.NONE;
                        myKeySet.keys[currentKey].shift = myKeySet.keys[keyPressed].shift || KB.Key.NONE;
                        myKeySet.keys[currentKey].altGr = myKeySet.keys[keyPressed].altGr || KB.Key.NONE;
                        myKeySet.keys[currentKey].shiftAltGr = myKeySet.keys[keyPressed].shiftAltGr || KB.Key.NONE;
                        
                        myKeySet.keys[keyPressed].primary = tmpKey.primary || KB.Key.NONE;
                        myKeySet.keys[keyPressed].shift = tmpKey.shift || KB.Key.NONE;
                        myKeySet.keys[keyPressed].altGr = tmpKey.altGr || KB.Key.NONE;
                        myKeySet.keys[keyPressed].shiftAltGr = tmpKey.shiftAltGr || KB.Key.NONE;
                        
                        myKeys[currentKey].unhighlight();
                        myKeys[keyPressed].unhighlight();
                        me.draw();
                        
                    }

	                myLayers[layerMouse].style.cursor = "pointer";
	                keyPressed = KB.Key.NONE;
	                myLayers[layerDrag].getContext("2d").clearRect ( 0 , 0 , myLayers[layerDrag].getAttribute("width") , myLayers[layerDrag].getAttribute("height") );
                } else if ( myType === "heatmap" ) {
                
                }
                keyPressed = KB.Key.NONE
            });
            $(document.body).bind("mouseup", function(evt) {
            
                if ( myType === "editor" ) {
                    myLayers[layerMouse].style.cursor = "pointer";
                    keyPressed = KB.Key.NONE;
                    myLayers[layerDrag].getContext("2d").clearRect ( 0 , 0 , myLayers[layerDrag].getAttribute("width") , myLayers[layerDrag].getAttribute("height") );
                }
            });
            
            $(myLayers[layerMouse]).bind("mousemove", function(evt) {
                if (!evt) var evt = window.event;

                if ( myType === "editor" ) {
	                var pos = $(myLayers[layerBg]).offset();
                    var top = (document.documentElement && document.documentElement.scrollTop) || 
                                  document.body.scrollTop;
                    pos.top = pos.top - top;

                    var kIndex = highlightKey({x:evt.clientX-pos.left,y:evt.clientY-pos.top});
	                if (keyPressed !== KB.Key.NONE) {
	                    var myOffsetX = evt.clientX - (pos.left+offsetX) - myKeys[keyPressed].getX() ;
	                    var myOffsetY = evt.clientY - (pos.top+offsetY) - myKeys[keyPressed].getY();
	                    myKeys[keyPressed].drawDragOverlay(myOffsetX, myOffsetY); 
                    }
                    if (kIndex === null) {
                        myLayers[layerMouse].style.cursor = "default";
                    } else {
                        myLayers[layerMouse].style.cursor = "pointer";
                    }
                }

                if (typeof config.onKeyMouseOver !== 'undefined') {
                    var pos = $(myLayers[layerBg]).offset();
                    var top = (document.documentElement && document.documentElement.scrollTop) || 
                                  document.body.scrollTop;
                    pos.top = pos.top - top;

                    var prevCurrentKey = currentKey;
                    var kIndex = highlightKey({x:evt.clientX-pos.left,y:evt.clientY-pos.top});
                    if ( currentKey !== prevCurrentKey && currentKey !== null) {
                        config.onKeyMouseOver(currentKey);
                    }
                }
                
            });

            $(myLayers[layerMouse]).bind("mouseout", function(evt) {
                if ( myType === "editor" ) {
                    myLayers[layerMouse].style.cursor = "pointer";
                }
                highlightKey({x:-10000,y:-10000});
                keyPressed = KB.Key.NONE;
                myLayers[layerDrag].getContext("2d").clearRect ( 0 , 0 , myLayers[layerDrag].getAttribute("width") , myLayers[layerDrag].getAttribute("height") );

                if (typeof config.onKeyboardMouseOut !== 'undefined') {
                    config.onKeyboardMouseOut();
                }
            });

            $(myLayers[layerMouse]).bind("click", function(evt) {

                
            });
            
            if ( myType === "editor" ) {
                myLayers[layerMouse].style.cursor = "pointer";
            }
        })(config);
    };
})();
"use strict";

KB.KeyDialog = (function() {
    var objIndex = 0;
    
    // pre-load images
    // we don't wait until it's finished, we just want to get the HTTP request in
    (function() {
        var elm1 = document.createElement("div"),
            elm2 = document.createElement("div"),
            elm3 = document.createElement("div"),
            elm4 = document.createElement("div"),
            elm5 = document.createElement("div");
            
        $(elm1).addClass("kb-dialog-arrow-top");
        $(elm2).addClass("kb-dialog-arrow-bottom");
        $(elm3).addClass("kb-dialog-arrow-left");
        $(elm4).addClass("kb-dialog-arrow-right");
        $(elm5).addClass("kb-dialog-help");
    })();
    
    function createTextInputRow(txt, fieldId, helpTxt) {
        var myTr = document.createElement("tr"),
            myTdL = document.createElement("td"),
            myTdR = document.createElement("td"),
            labelTxt = document.createTextNode(txt),
            inputBox = document.createElement("input"),
            helpBtn = document.createElement("button"),
            helpIcon = document.createElement("div");
        myTr.id = fieldId + "-row";
        inputBox.id = fieldId;
        inputBox.className = "kb-dialog-inputbox";
        
        helpIcon.className = "kb-dialog-help";
        helpBtn.appendChild(helpIcon);
        
        inputBox.style.verticalAlign = "middle";
        helpBtn.style.verticalAlign = "middle";
        helpBtn.style.marginLeft = "4px";
        
        $(helpBtn).bind("click", (function() {
            var txt = helpTxt;
            return function() {alert(txt);}
        })());
        
        myTdL.appendChild(labelTxt);
        myTdR.appendChild(inputBox);
        myTdR.appendChild(helpBtn);
        myTr.appendChild(myTdL);
        myTr.appendChild(myTdR);
        return myTr;
    }
    
    function createComboInputRow(txt, fieldId, opts) {
        var myTr = document.createElement("tr"),
            myTdL = document.createElement("td"),
            myTdR = document.createElement("td"),
            labelTxt = document.createTextNode(txt),
            selectBox = document.createElement("select"),
            len = opts.length,
            ii,
            opt;
        selectBox.id = fieldId;
        selectBox.className = "kb-dialog-combobox";
        
        for (ii = 0; ii < len; ii++) {
            opt = document.createElement("option");
            opt.value = opts[ii].value;
            opt.appendChild( document.createTextNode(opts[ii].label) );
            
            selectBox.appendChild(opt);
        }
        
        myTdL.appendChild(labelTxt);
        myTdR.appendChild(selectBox);
        myTr.appendChild(myTdL);
        myTr.appendChild(myTdR);
        return myTr;
    }
    
    function createForm(config) {
        var myForm = document.createElement("div"),
            okBtn = document.createElement("button"),
            canBtn = document.createElement("button"),
            btnPanel = document.createElement("div"),
            myTable = document.createElement("table"),
            myTbody = document.createElement("tbody"),
            namespace = config.namespace,
            myRows = [],rr = 0,len,
            labelTxt, inputBox, opts,
            pHelp, sHelp, aHelp, saHelp,boilerPlateHelp;
            
        boilerPlateHelp = "IMPORTANT: You may enter in a single character as input or a unicode value.\n\nSide notes: Some keys have no unicode equivant or no way of differentiating between what side of the keyboard the key is on, such as the Windows Key or the right and left shift keys. In cases like this, a special negative value is used to identify the key. You will never really need to change keys like this, but I figured I'd mention what those values mean to fend off confusion.";
        pHelp = "The \"primary\" key represents the value that a key press equates to when no special helper keys (such as shift) are held down to modify the key press.\n\n" + boilerPlateHelp;
        sHelp = "The \"shift\" key represents the value that a key press equates to when the shift key is held down with the key press.\n\n" + boilerPlateHelp;
        aHelp = "The \"alt gr\" key represents the value that a key press equates to when the alt gr key is held down with the key press.\n\n" + boilerPlateHelp;
        saHelp = "The \"shift + alt gr\" key represents the value that a key press equates to when the shift and alt gr keys are held down with the key press.\n\n" + boilerPlateHelp;
            
        myRows[rr++] = createTextInputRow("Primary Key:",    namespace + "-primaryKey",     pHelp);
        myRows[rr++] = createTextInputRow("Shift Key:",      namespace + "-shiftKey",       sHelp);
        myRows[rr++] = createTextInputRow("Alt Gr:",         namespace + "-altGrKey",       aHelp);
        myRows[rr++] = createTextInputRow("Shift + Alt Gr:", namespace + "-shiftAltGrKey",  saHelp);
        
        opts = [
            {label:"Left Pinky",    value:KB.finger.LEFT_PINKY},
            {label:"Left Ring",     value:KB.finger.LEFT_RING},
            {label:"Left Middle",   value:KB.finger.LEFT_MIDDLE},
            {label:"Left Index",    value:KB.finger.LEFT_INDEX},
            {label:"Left Thumb",    value:KB.finger.LEFT_THUMB},
            {label:"Right Thumb",   value:KB.finger.RIGHT_THUMB},
            {label:"Right Index",   value:KB.finger.RIGHT_INDEX},
            {label:"Right Middle",  value:KB.finger.RIGHT_MIDDLE},
            {label:"Right Ring",    value:KB.finger.RIGHT_RING},
            {label:"Right Pinky",   value:KB.finger.RIGHT_PINKY}
        ];

        myRows[rr++] = createComboInputRow("Finger For Pressing Key:", namespace + "-finger", opts);
        
        opts.unshift({label:"None",   value:KB.finger.NONE});
        opts.push({label:"Both Thumbs",   value: KB.finger.BOTH_THUMBS});
        myRows[rr++] = createComboInputRow("Start Position of Finger:", namespace + "-fingerStart", opts);
        
        len = myRows.length;
        for (rr = 0; rr < len; rr++) {
            myTbody.appendChild(myRows[rr]);
        }
        
        myTable.className = "kb-dialog-table";
        myTable.appendChild(myTbody);
        
        okBtn.appendChild( document.createTextNode("OK") );
        canBtn.appendChild( document.createTextNode("Cancel") );
        
        okBtn.className = 'btn';
        okBtn.style.marginRight = '4px';
        canBtn.className = 'btn';
        canBtn.style.marginLeft = '4px';

        $(canBtn).bind("click", config.cancelFunct);
        
        $(okBtn).bind("click", function() {
            var params = {},
                fCombo = document.getElementById(namespace + "-finger"),
                fsCombo = document.getElementById(namespace + "-fingerStart");
                
            params.pVal = document.getElementById(namespace + "-primaryKey").value;
            params.sVal = document.getElementById(namespace + "-shiftKey").value;
            params.aVal = document.getElementById(namespace + "-altGrKey").value;
            params.saVal = document.getElementById(namespace + "-shiftAltGrKey").value;
            params.finger = fCombo.options[fCombo.selectedIndex].value;
            params.fingerStart = fsCombo.options[fsCombo.selectedIndex].value;
            
            config.okFunct(params);
        });
        
        btnPanel.className = "kb-dialog-btnpanel";
        btnPanel.appendChild(okBtn);
        btnPanel.appendChild(canBtn);
        
        myForm.appendChild(myTable);
        myForm.appendChild(btnPanel);
        
        return myForm;
    }
    
    function customizeDialog(namespace, key) {
        
        var primaryRow      = document.getElementById(namespace + "-primaryKey-row"),
            shiftRow        = document.getElementById(namespace + "-shiftKey-row"),
            altGrRow        = document.getElementById(namespace + "-altGrKey-row"),
            shiftAltGrRow   = document.getElementById(namespace + "-shiftAltGrKey-row");
        //console.log("customizeDialog");
        
        primaryRow.style.display = "table-row";
        shiftRow.style.display = "table-row";
        altGrRow.style.display = "table-row";
        shiftAltGrRow.style.display = "table-row";
        
    }
    
    return function(config) {
    
        config = config || {};
    
        var myIndex = objIndex++,
            me = this,
            screenPad = document.createElement("div"),
            screenBg = document.createElement("canvas"),
            container = document.createElement("div"),
            titleBar = document.createElement("div"),
            formContainer = document.createElement("div"),
            arrowElm = document.createElement("div"),
            isVisible = false,
            myParent = config.parent,
            myNamespace = myParent.getNamespace() || "",
            myKey = null;

        myNamespace += "-kd" + myIndex;

        // private methods
        
        // this method is attached when a dialog is shown, and disattached when it is hidden
        function keyMouseOverHandler(evt) {
            var pos = $(myKey.getBgLayer()).offset();
            pos.top = pos.top - $('body').scrollTop();

            var xPos = evt.clientX-pos.left,
                yPos = evt.clientY-pos.top;
            if ( myKey.pointOverKey(xPos,yPos) ) {
                screenPad.style.cursor = "pointer";
            } else {
                screenPad.style.cursor = "default";
            }
        }
        
        // this method sets the text in the input boxes equal to what's in our key object
        function setDisplayText() {
            var elm,len,ii;
            elm = document.getElementById(myNamespace + "-primaryKey");
            elm.value = KB.Key.getDisplayText(myKey.getValue(KB.PRIME_PUSH)); 
            
            elm = document.getElementById(myNamespace + "-shiftKey");
            elm.value = KB.Key.getDisplayText(myKey.getValue(KB.SHIFT_PUSH)); 
            
            elm = document.getElementById(myNamespace + "-altGrKey");
            elm.value = KB.Key.getDisplayText(myKey.getValue(KB.ALTGR_PUSH)); 
            
            elm = document.getElementById(myNamespace + "-shiftAltGrKey");
            elm.value = KB.Key.getDisplayText(myKey.getValue(KB.SHIFT_ALTGR_PUSH));
            
            //console.log("finding finger position");
            elm = document.getElementById(myNamespace + "-finger");
            len = elm.options.length;
            elm.selectedIndex = 0;
            for (ii=0;ii<len;ii++) {
                if ( parseInt(elm.options[ii].value,10) === myKey.getFinger()) {
                    elm.selectedIndex = ii;
                    //console.log("finger:"+parseInt(elm.options[ii].value,10));
                    //console.log("position:"+ii);
                    break;
                }
            }
            
            //console.log("finding start positoin of finger");
            elm = document.getElementById(myNamespace + "-fingerStart");
            len = elm.options.length;
            elm.selectedIndex = 0;
            for (ii=0;ii<len;ii++) {
                var keyNum = parseInt(elm.options[ii].value,10);
                if ( myKey.getKeyboard().getFingerStartForKey(myKey.getId()) === keyNum ) {
                    elm.selectedIndex = ii;
	                //console.log("keynum:"+keyNum);
	                //console.log(myKey.getKeyboard().getFingerStartForKey(myKey.getId()));
                    break;
                }
            }
            
            //console.log(myKey.getValue(KB.PRIME_PUSH));
            //console.log(KB.Key.getDisplayText(myKey.getValue(KB.PRIME_PUSH))); 
        }
        
        var getVisibleRect = function(elm) {
            
            var rect = elm.getBoundingClientRect(),
                jsRect,
                parent = elm.parentNode,
                retRect = {top: rect.top, left: rect.left, right: rect.left+rect.width, bottom: rect.top+rect.height};


            retRect.top += $('body').scrollTop();
            retRect.bottom += $('body').scrollTop();
            retRect.width = retRect.right - retRect.left;
            retRect.height = retRect.bottom - retRect.top;

            console.dir(retRect)
            return retRect;
            while (parent) {
                if (parent.getBoundingClientRect) {
                    rect = parent.getBoundingClientRect();
                    jsRect = {};
                    jsRect.top = rect.top; jsRect.left = rect.left; jsRect.bottom = rect.bottom; jsRect.width = rect.width;
                    jsRect.right = jsRect.left + jsRect.width;
                    jsRect.bottom = jsRect.top + jsRect.height;
                    
                    if (jsRect.top > retRect.top) {
                        retRect.top = jsRect.top;
                    }
                    if (jsRect.left > retRect.left) {
                        retRect.left = jsRect.left;
                    }
                    if (jsRect.right < retRect.right) {
                        retRect.right = jsRect.right;
                    }
                    if (jsRect.bottom < retRect.bottom) {
                        retRect.bottom = jsRect.bottom;
                    }
                }
                parent = parent.parentNode;
            }
            retRect.width = retRect.right - retRect.left;
            retRect.height = retRect.bottom - retRect.top;
            return retRect;
        };


        // public methods

        me.getHeight = function() {
            return container.offsetHeight;
        };    
        me.getWidth = function() {
            return container.offsetWidth;
        };
        me.getArrowWidth = function(dir) {
            var ret = 0;
            if (dir === "left") {
                ret = 4;
            } else if (dir === "bottom") {
                ret = 14;
            } else if (dir === "top") {
                ret = 14;
            } else if (dir === "right") {
                ret = 4;
            }
            return ret;
        };
        me.getArrowHeight = function(dir) {
            var ret = 0;
            if (dir === "left") {
                ret = 14;
            } else if (dir === "bottom") {
                ret = 4;
            } else if (dir === "top") {
                ret = 4;
            } else if (dir === "right") {
                ret = 14;
            }
            return ret;
        };
    
        // returns either "left", "right", "top", or "bottom"
        me.findBestDisplayPosition = function(config) {
            var winX,winW,winY,winH,
                pos = $(myKey.getBgLayer()).offset(),
                dirs = ["right","bottom","left","top"],
                ii,
                dir;
            
            //pos.top = pos.top - $('body').scrollTop();

            screenPad.style.width = $(window).width() + "px";
            screenPad.style.height = $(window).height() + "px";
            
            for (ii = 0; ii<dirs.length;ii++) {
                dir = dirs[ii];
                winX = pos.left + myKey.mountPoint[dir].x + me.getDisplayXOffset(dir);
                winY = pos.top + myKey.mountPoint[dir].y + me.getDisplayYOffset(dir);
                
                if (dir === "right") {
                    winX+=2;
                }
                if (dir === "bottom") {
                    winY+=2;
                }
                
                winW = winX + me.getWidth();
                winH = winY + me.getHeight();
                
                if ( winX > 0 && winX < $(window).width() && winW > 0 && winW < $(window).width() ) {
                    if ( winY > 0 && winY < $(window).height() && winH > 0 && winH < $(window).height() ) {
                        break;
                    }
                }
            }
            return {x:winX,y:winY,dir:dir};
        };
    
        me.getDisplayXOffset = function(dir) {
            var ret = 0;
            if (dir === "left") {
                ret = -1*me.getWidth() - me.getArrowWidth(dir);
            } else if (dir === "bottom") {
                ret = -1*me.getWidth()/2;
            } else if (dir === "top") {
                ret = -1*me.getWidth()/2;
            } else if (dir === "right") {
                ret = me.getArrowWidth(dir);
            }
            return ret;
        };
        me.getDisplayYOffset = function(dir) {
            var ret = 0;
            if (dir === "left") {
                ret = -1*me.getHeight()/2;
            } else if (dir === "bottom") {
                ret = me.getArrowHeight(dir);
            } else if (dir === "top") {
                ret = -1*me.getHeight()-me.getArrowHeight(dir);
            } else if (dir === "right") {
                ret = -1*me.getHeight()/2;
            }
            return ret;
        };
    
        me.getArrowPosition = function(x,y,dir) {
            var ret = {},
                halfH = (me.getHeight()/2),
                halfW = (me.getWidth()/2),
                halfArrW = Math.ceil(me.getArrowWidth(dir)/2),
                halfArrH = Math.ceil(me.getArrowHeight(dir)/2);
            
            if (dir === "bottom") {
	            x = Math.floor(x);
	            y = Math.floor(y);
                ret.left = x + halfW - (halfArrW - 1) + "px";
                ret.top = y - (me.getArrowHeight(dir)) + "px";        
            } else if (dir === "right") {
	            x = Math.floor(x);
	            y = Math.floor(y);
                ret.left = x - (me.getArrowWidth(dir)) + "px";
                ret.top = y + halfH - (halfArrH) + "px";
            } else if (dir === "top") {
                x = Math.ceil(x);
                y = Math.ceil(y);
                ret.left = x + halfW - (halfArrW - 1) + "px";
                ret.top = y + me.getHeight()  + "px";  
            } else if (dir === "left") {
	            x = Math.ceil(x);
	            y = Math.ceil(y);
                ret.left = x + me.getWidth() + "px";
                ret.top = y + halfH - (halfArrH - 1) + "px";
            }
            return ret;
        }    
    
        me.position = function(config) {
            config=config||{};
            
            var ctx,
                pos,
                kPos,
                arrowPos,
                keyCanvas;
            
            if (!myKey) {return;}
            if (!isVisible) {return;}

            pos = me.findBestDisplayPosition();
            arrowPos = me.getArrowPosition(pos.x, pos.y, pos.dir);;
        
            container.style.left = pos.x +'px';
            container.style.top = pos.y +'px';
            
            arrowElm.className = "";
            $(arrowElm).addClass("kb-dialog-arrow-"+pos.dir);
            
            arrowElm.style.left = arrowPos.left;
            arrowElm.style.top = arrowPos.top;
        };
    
        me.show = function(config) {
            config = config || {};
            if (isVisible === true) {return;}
            isVisible = true;
            
            myKey = config.key;
            
            container.style.top = "-1000px";
            screenPad.style.cursor = "pointer";
            screenPad.style.display = "block";
            
            customizeDialog(myNamespace, myKey);
            
            setDisplayText();
            me.position();
            screenPad.style.cursor = "default";
        };
        me.hide = function() {
            screenPad.style.display = "none";
            isVisible = false;
        };
    
        // init function
        (function(config) {
		
            var myBody = document.getElementsByTagName("body")[0],
                myForm,
                contentWrapper = document.createElement("div");
            
            screenPad.className = "kb-dialog-screenpad";
            screenPad.style.width = $(document).width() + "px";
            screenPad.style.height = $(document).height() + "px";
            
            screenBg.setAttribute("width", $(document).width() );
            screenBg.setAttribute("height", $(document).height() );
            screenBg.className = "kb-dialog-screenbg";

            arrowElm.className = "kb-dialog-arrow";
            $(arrowElm).addClass("kb-dialog-arrow-up");
            
            contentWrapper.className = "kb-dialog";
            container.className = "kb-dialog-wrapper";
            container.id = "kb_dialog_" + myIndex;
		    
            titleBar.className = "kb-dialog-titlebar";
            titleBar.appendChild( document.createTextNode("Key Editor") );
		    
            formContainer.className = "kb-dialog-form";

            myForm = createForm({
                namespace: myNamespace,
                cancelFunct: function(){me.hide();},
                okFunct: function(config) {
                    myKey.setValue(KB.PRIME_PUSH, KB.Key.getUnicode(config.pVal));
                    myKey.setValue(KB.SHIFT_PUSH, KB.Key.getUnicode(config.sVal));
                    myKey.setValue(KB.ALTGR_PUSH, KB.Key.getUnicode(config.aVal));
                    myKey.setValue(KB.SHIFT_ALTGR_PUSH, KB.Key.getUnicode(config.saVal));
                    myKey.setFinger(config.finger);
                    myKey.getKeyboard().setFingerStart(config.fingerStart, myKey.getId());
                    myKey.getKeyboard().draw();
                    me.hide();
                }
            });
            formContainer.appendChild(myForm);
            
            contentWrapper.appendChild(titleBar);
            contentWrapper.appendChild(formContainer);
            
            container.appendChild(contentWrapper);
            
            screenPad.appendChild(screenBg);
            screenPad.appendChild(container);
            screenPad.appendChild(arrowElm);
            myBody.appendChild(screenPad);
		    
            $(window).bind("scroll",function() {
                screenPad.style.width = $(document).width() + "px";
                screenPad.style.height = $(document).height() + "px";
                screenBg.setAttribute("width", $(document).width() );
                screenBg.setAttribute("height", $(document).height() );
                me.position();
            });
            $(window).bind("resize",function() {
                screenPad.style.width = $(document).width() + "px";
                screenPad.style.height = $(document).height() + "px";
                screenBg.setAttribute("width", $(document).width() );
                screenBg.setAttribute("height", $(document).height() );
                me.position();
            });
            $(screenPad).bind("click",function(evt) {
                if (!evt) var evt = window.event;
                me.hide();
                evt.cancelBubble = true;
                if (evt.stopPropagation) evt.stopPropagation();
		    });
            $(container).bind("click",function(evt) {
                if (!evt) var evt = window.event;
                evt.cancelBubble = true;
                if (evt.stopPropagation) evt.stopPropagation();
            });
        })(config);
    };
})();
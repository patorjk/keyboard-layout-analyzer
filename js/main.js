/*
    TODO:
        - Double click button issue
        - Load common layouts (foreign)
        - Heatmap
        - Quotation mark substitution (also - Apostrophes, Em-dashes, Ellipses)
        - Data by row
		- Validate Layout
		- Switching handings
		- Summary Page
		- error console
		- version javascript
*/

"use strict";

var KLA = KLA || {};

KLA.layouts = [{},{},{},{},{}];
KLA.keyboards = [{},{},{},{},{}];
KLA.heatmaps = [{}, {}, {}, {}, {}, {}];
KLA.heatmapsPtr = [];
KLA.currentLayout = 0;
KLA.hmCurrentLayout = 0;
KLA.analysis = [];

// Import / Export Dialog
KLA.importExportKbDialog = (function() {

    var me = {},
        isVisible = false,
        screenPad = document.createElement("div"),
        dialog = document.createElement("div"),
        txtBox = document.createElement("textarea"),
        btnClose = document.createElement("button"),
        btnSelectAll = document.createElement("button"),
        btnImport = document.createElement("button"),
        btnContainer = document.createElement("div"),
        description = document.createElement("div");

    screenPad.id = "kla-import-export-screenPad";
    screenPad.style.position = "absolute";
    screenPad.style.display = "none";
    screenPad.style.backgroundColor = "rgba(100,100,100,0.5)";
    screenPad.style.top = "0px";
    screenPad.style.left = "0px";
    JK.addEventListener(window, "resize", function() {
        if (isVisible) {
	        var pageSize = JK.windowSize();
	        screenPad.style.width = pageSize.width + "px";
	        screenPad.style.height = pageSize.height + "px";
        }
    }, false);
    document.body.appendChild(screenPad);

    dialog.style.backgroundColor = "#E0E0E1";
    dialog.style.position = "absolute";
    dialog.style.border = "1px solid #808080";
    dialog.style.borderRadius = "15px";
    dialog.style.padding = "15px";
    dialog.style.width = "500px";
    dialog.style.height = "300px";

    txtBox.style.width = "496px";
    txtBox.style.height = "200px";
    txtBox.style.marginBottom = "0px";

    description.style.marginTop = "6px";

    btnSelectAll.style.display = "none";
    btnSelectAll.style.marginRight = "10px";
    btnSelectAll.appendChild( document.createTextNode("Select All") );
    JK.addEventListener(btnSelectAll, "click", function() {
        txtBox.select();
    }, false);
    
    btnImport.style.display = "none";
    btnImport.style.marginRight = "10px";
    btnImport.appendChild( document.createTextNode("Import") );
    
    JK.addEventListener(btnImport, "click", function() {
        try {
            var nn = JSON.parse(txtBox.value);
        } catch (err) {
            alert("Invalid input.");
            return;
        }
        var vv = {}, prop, ii;
        var valid = true;
        if (typeof nn.label === "string") {
            vv.label = nn.label;
        } else {
            console.log("label not string");
            valid = false;
        }
        if (typeof nn.fingerStart === "object") {
            vv.fingerStart = {};
            for (prop in nn.fingerStart) {
                if (typeof nn.fingerStart[prop] === "number") {
                    vv.fingerStart[prop] = nn.fingerStart[prop];
                } else {
                    valid = false;
                    console.log("finger start not number");
                    break;
                }
            }
        } else {
            valid = false;
            console.log("finger start not object");
        }
        if (typeof nn.keyboardType === "string") {
            vv.keyboardType = nn.keyboardType;
        } else {
            valid = false;
            console.log("keyboard type not string");
        }
        if (typeof nn.keys === "object" && typeof nn.keys.length === "number") {
            vv.keys = [];
            outterloop: for (ii = 0; ii < nn.keys.length; ii++) {
                if (typeof nn.keys[ii] === "object") {
                    for (prop in nn.keys[ii]) {
		                if (typeof nn.keys[ii][prop] !== "string" && typeof nn.keys[ii][prop] !== "number") {
		                    valid = false;
		                    console.log(ii + "," + prop);
		                    console.log(nn.keys[ii][prop]);
		                    console.log(typeof nn.keys[ii][prop]);
		                    console.log("key prop not string or number");
		                    break outterloop;
		                }
		            }
		            vv.keys.push(nn.keys[ii]);
                } else {
                    valid = false;
                    console.log("key item not object");
                    break;
                }
            }
        } else {
            console.log("keys not array");
            valid = false;
        }
        if (valid === true) {
            var newLayout = {};
            newLayout.keySet = vv;
            newLayout.keyMap = KLA.keyboards[KLA.currentLayout].getKeyMap();
            KLA.keyboards[KLA.currentLayout].setLayout(newLayout);
            document.getElementById("kla-layout-name").value = KLA.keyboards[KLA.currentLayout].getKeySet().label;
            me.hide();
        } else {
            alert("Sometime was wrong with the layout text you entered in.");
        }
    }, false);
    
    btnClose.style.marginRight = "10px";
    btnClose.appendChild( document.createTextNode("Close") );
    JK.addEventListener(btnClose, "click", function() {
        me.hide();
    }, false);

    btnContainer.style.position = "absolute";
    btnContainer.style.width = "500px";
    btnContainer.style.bottom = "15px";
    btnContainer.style.textAlign = "center";

    btnContainer.appendChild(btnSelectAll);
    btnContainer.appendChild(btnImport);
    btnContainer.appendChild(btnClose);

    dialog.appendChild(txtBox);
    dialog.appendChild(description);
    dialog.appendChild(btnContainer);
    screenPad.appendChild(dialog);

    me.showExport = function() {
        var pageSize = JK.windowSize();
        screenPad.style.width = pageSize.width + "px";
        screenPad.style.height = pageSize.height + "px";
        
        dialog.style.top = Math.round(pageSize.height/2) - 150 + "px";
        dialog.style.left = Math.round(pageSize.width/2) - 250 + "px";
        
        JK.removeAllChildren(description);
        description.appendChild(document.createTextNode("The above text represents the keyboard layout. You can come back to the app later and load this layout with this text using the \"Import\" feature."));
        
        btnSelectAll.style.display = "inline-block";
        
        txtBox.value = JSON.stringify(KLA.keyboards[KLA.currentLayout].getKeySet());
        
        isVisible = true;
        screenPad.style.display = "block";
    };

    me.showImport = function() {
        var pageSize = JK.windowSize();
        screenPad.style.width = pageSize.width + "px";
        screenPad.style.height = pageSize.height + "px";
        
        dialog.style.top = Math.round(pageSize.height/2) - 150 + "px";
        dialog.style.left = Math.round(pageSize.width/2) - 250 + "px";
        
        JK.removeAllChildren(description);
        description.appendChild(document.createTextNode("Paste the text of a previously exported layout in the textbox above and press \"Import\" to load the layout."));
        
        btnImport.style.display = "inline-block";
        
        txtBox.value = "";
        
        isVisible = true;
        screenPad.style.display = "block";
    };

    me.hide = function() {
        isVisible = false;
        screenPad.style.display = "none";
        btnImport.style.display = "none";
        btnSelectAll.style.display = "none";
    };

    return me;

})();

// Initialize

(function() {

    var setupEnvSize,
        kbLayout = {},
        myKb,
        ii,
        leftArrow = document.getElementById("kla-board-selector-arrow-left"),
        rightArrow = document.getElementById("kla-board-selector-arrow-right"),
        hmLeftArrow = document.getElementById("kla-hm-selector-arrow-left"),
        hmRightArrow = document.getElementById("kla-hm-selector-arrow-right"),
        txtLayoutName = document.getElementById("kla-layout-name"),
        hmTxtLayoutName = document.getElementById("kla-hm-layout-name");
    
    // setup layouts
    
    KLA.layouts[0].keySet = JK.clone(KB.keySet.standard.qwerty);
    KLA.layouts[0].keyMap = KB.keyMap.standard.s683_225;
    
    KLA.layouts[1].keySet = JK.clone(KB.keySet.standard.simplifiedDvorak);
    KLA.layouts[1].keyMap = KB.keyMap.standard.s683_225;

    KLA.layouts[2].keySet = JK.clone(KB.keySet.standard.colemak);
    KLA.layouts[2].keyMap = KB.keyMap.standard.s683_225;
    
    KLA.layouts[3].keySet = JK.clone(KB.keySet.standard.capewell);
    KLA.layouts[3].keyMap = KB.keyMap.standard.s683_225;
    
    KLA.layouts[4].keySet = JK.clone(KB.keySet.standard.programmerDvorak);
    KLA.layouts[4].keyMap = KB.keyMap.standard.s683_225;
    
    for (ii = 0; ii < KLA.keyboards.length; ii++) {
	    KLA.keyboards[ii] = new KB.Keyboard({
	        container:"kla-kb-container"+ii,
	        layout: KLA.layouts[ii]
	    });
    }

    KLA.personalizedKb = new KB.Keyboard({
        container:"kla-kb-pl",
        type: "display",
        layout: KLA.layouts[0]
    });
    KLA.personalizedKbLayoutIndex = KLA.maxNumLayouts;
    
    for (ii = 0; ii < KLA.heatmaps.length; ii++) {
        KLA.heatmaps[ii] = new KB.Keyboard({
            container:"kla-kb-hm"+ii,
            layout: KLA.layouts[ii] || KLA.layouts[0],
            type: "heatmap"
        });
    }
    
    txtLayoutName.value = KLA.layouts[KLA.currentLayout].keySet.label;
    hmTxtLayoutName.innerHTML = KLA.layouts[KLA.currentLayout].keySet.label;
    
    // Add event listeners

    JK.addEventListener( document.getElementById("chkBoxUsePersonalLayout"), "change", function(evt) {
        if (KLA.shouldGeneratePersonalizedLayout()) {
            document.getElementById("personalizedLayoutTab").style.display = "block";
            document.getElementById("kla-hm-bulb"+KLA.personalizedKbLayoutIndex).parentNode.style.display = "table-cell";
        } else {
            document.getElementById("personalizedLayoutTab").style.display = "none";
            document.getElementById("kla-hm-bulb"+KLA.personalizedKbLayoutIndex).parentNode.style.display = "none";
        }
    }, false);

    var elmNumLayoutsToCompare = document.getElementById("kla-num-to-compare");
    JK.addEventListener(elmNumLayoutsToCompare, "change", function() {
        var ii, blub, prevIndex;
        KLA.numLayoutsToCompare = Number(elmNumLayoutsToCompare.options[elmNumLayoutsToCompare.selectedIndex].value);
        
        if ( KLA.numLayoutsToCompare <= KLA.currentLayout) {
	        prevIndex = KLA.currentLayout;
	        KLA.currentLayout = KLA.numLayoutsToCompare - 1;
	        changeLayout(prevIndex, KLA.currentLayout);
        }
        if ( KLA.numLayoutsToCompare <= KLA.hmCurrentLayout) {
	        prevIndex = KLA.hmCurrentLayout;
	        KLA.hmCurrentLayout = KLA.numLayoutsToCompare - 1;
	        hmChangeLayout(prevIndex, KLA.hmCurrentLayout);
        }
        
        // Resetting heatmap layout to 0 on re-calculations.
        KLA.hmCurrentLayout = 0;
        document.getElementById("kla-hm-bulb"+0).className = "kla-kb-bulb-on";
        document.getElementById("kla-kb-hm"+0).style.display = "block";
        hmTxtLayoutName.innerHTML = KLA.heatmaps[0].getKeySet().label;
        for (ii = 1; ii < KLA.getMaxNumOutputLayouts(); ii++) {
            document.getElementById("kla-kb-hm"+ii).style.display = "none";
            document.getElementById("kla-hm-bulb"+ii).className = "kla-kb-bulb-off";
        }
        
        for (ii = 0; ii < KLA.numLayoutsToCompare; ii++) {
             blub = document.getElementById("kla-kb-bulb"+ii);
             blub.parentNode.style.display = "table-cell";
             blub = document.getElementById("kla-hm-bulb"+ii);
             blub.parentNode.style.display = "table-cell";
        }
        for (ii = KLA.numLayoutsToCompare; ii < KLA.maxNumLayouts; ii++) {
             blub = document.getElementById("kla-kb-bulb"+ii);
             blub.parentNode.style.display = "none";
             blub = document.getElementById("kla-hm-bulb"+ii);
             blub.parentNode.style.display = "none";
        }
        
    }, false);

    var changeLayout = function(prevIndex, newIndex) {
        if (prevIndex === newIndex) {return;}
    
        var prevKb = document.getElementById("kla-kb-container"+prevIndex),
            newKb = document.getElementById("kla-kb-container"+KLA.currentLayout),
            prevBulb = document.getElementById("kla-kb-bulb"+prevIndex),
            newBulb = document.getElementById("kla-kb-bulb"+KLA.currentLayout);

        prevKb.style.display = "none";
        newKb.style.display = "block";
        prevBulb.className = "kla-kb-bulb-off";
        newBulb.className = "kla-kb-bulb-on";
        txtLayoutName.value = KLA.keyboards[KLA.currentLayout].getKeySet().label;
    };
    
    var hmChangeLayout = function(prevIndex, newIndex) {
        if (prevIndex === newIndex) {return;}
    
        var prevKb,
            newKb,
            prevBulb,
            newBulb;

        if (newIndex >= KLA.numLayoutsToCompare) {
            newIndex = KLA.personalizedKbLayoutIndex;
        }
        if (prevIndex >= KLA.numLayoutsToCompare) {
            prevIndex = KLA.personalizedKbLayoutIndex;
        }

        prevKb = document.getElementById("kla-kb-hm"+prevIndex);
        newKb = document.getElementById("kla-kb-hm"+newIndex);
        prevBulb = document.getElementById("kla-hm-bulb"+prevIndex);
        newBulb = document.getElementById("kla-hm-bulb"+newIndex);

        prevKb.style.display = "none";
        newKb.style.display = "block";
        prevBulb.className = "kla-kb-bulb-off";
        newBulb.className = "kla-kb-bulb-on";
        hmTxtLayoutName.innerHTML = KLA.heatmaps[newIndex].getKeySet().label;
    };
    
    JK.addEventListener(leftArrow, "click", function(evt) {
        var prevIndex = KLA.currentLayout;
        KLA.currentLayout = (--KLA.currentLayout < 0) ? 0 : KLA.currentLayout;
        changeLayout(prevIndex, KLA.currentLayout);
        if (!evt) var evt = window.event;
        evt.cancelBubble = true;
        if (evt.stopPropagation) evt.stopPropagation();
    }, false);

    JK.addEventListener(rightArrow, "click", function(evt) {
        var prevIndex = KLA.currentLayout;
        KLA.currentLayout = (++KLA.currentLayout >= KLA.numLayoutsToCompare) ? (KLA.numLayoutsToCompare-1) : KLA.currentLayout;
        changeLayout(prevIndex, KLA.currentLayout);
        if (!evt) var evt = window.event;
        evt.cancelBubble = true;
        if (evt.stopPropagation) evt.stopPropagation();
    }, false);
    
    JK.addEventListener(hmLeftArrow, "click", function(evt) {
        var prevIndex = KLA.hmCurrentLayout;
        KLA.hmCurrentLayout = (--KLA.hmCurrentLayout < 0) ? 0 : KLA.hmCurrentLayout;
        hmChangeLayout(prevIndex, KLA.hmCurrentLayout);
        if (!evt) var evt = window.event;
        evt.cancelBubble = true;
        if (evt.stopPropagation) evt.stopPropagation();
    }, false);

    JK.addEventListener(hmRightArrow, "click", function(evt) {
        var prevIndex = KLA.hmCurrentLayout;
        KLA.hmCurrentLayout = (++KLA.hmCurrentLayout >= KLA.getNumOutputLayouts()) ? (KLA.getNumOutputLayouts()-1) : KLA.hmCurrentLayout;
        hmChangeLayout(prevIndex, KLA.hmCurrentLayout);
        if (!evt) var evt = window.event;
        evt.cancelBubble = true;
        if (evt.stopPropagation) evt.stopPropagation();
    }, false);
    
    var updateKeyboardLabel = function() {
        KLA.keyboards[KLA.currentLayout].getKeySet().label = txtLayoutName.value;
    };
    JK.addEventListener(txtLayoutName, "change", updateKeyboardLabel, false);
    
    JK.addEventListener(document.getElementById("btnLayoutLoader"), "click", function() {
        var dropdown = document.getElementById("layoutLoaderList"),
            val = dropdown.options[dropdown.selectedIndex].value.split(".");
        
        if (val.length === 2) {
            var newLayout = {};
            newLayout.keySet = KB.keySet[val[0]][val[1]];
            newLayout.keyMap = KB.keyMap[val[0]].s683_225;//KLA.keyboards[KLA.currentLayout].getKeyMap();
            KLA.keyboards[KLA.currentLayout].setLayout(newLayout);
            txtLayoutName.value = KLA.keyboards[KLA.currentLayout].getKeySet().label;
        }
            
    }, false);
    
    JK.addEventListener(document.getElementById("btnImport"), "click", function() {
        KLA.importExportKbDialog.showImport();
    }, false);

    JK.addEventListener(document.getElementById("btnExport"), "click", function() {
        KLA.importExportKbDialog.showExport();
    }, false);
    
    /*
        Report generation button
    */
    JK.addEventListener(document.getElementById("btn-generate-report"), "click", function() {
        
        var ii, jj;
        
        if (document.getElementById("txt-input").value === "") {
            alert("Please enter in some text.");
            return;
        }
        
        KLA.analysis = [];
        
        for (ii = 0; ii < KLA.numLayoutsToCompare; ii++) {
	        KLA.analysis[ii] = KLA.Analyzer.examine({
	            text: document.getElementById("txt-input").value,
	            keyMap: KLA.keyboards[ii].getKeyMap(), //KLA.layouts[ii].keyMap
	            keySet: KLA.keyboards[ii].getKeySet() // KLA.layouts[ii].keySet 
	        });
	        
            var newLayout = {};
            newLayout.keySet = KLA.keyboards[ii].getKeySet();
            newLayout.keyMap = KLA.keyboards[ii].getKeyMap();
            KLA.heatmaps[ii].setLayout(newLayout);
        }
        
        //console.dir(KLA.analysis);
        
        // ---------------------------------------------------------------------
        // create personal layout
        
        if (KLA.shouldGeneratePersonalizedLayout()) {
	        var qwertyAnalysis = KLA.Analyzer.examine({
	            text: document.getElementById("txt-input").value,
	            keyMap: KB.keyMap.standard.s683_225,
	            keySet: KB.keySet.standard.qwerty 
	        });
	        
	        var qKeys = Array.prototype.sort.call(qwertyAnalysis.keyData, function(a, b) {
	            return b.count - a.count;
	        });
	        var pKeys = KLA.createPersonalLayout(qKeys, KB.keySet.standard.qwerty);
	        
	        var newLayout = {};
	        newLayout.keySet = pKeys;
	        newLayout.keyMap = KB.keyMap.standard.s683_225;
	        KLA.heatmaps[KLA.personalizedKbLayoutIndex].setLayout(newLayout);
	        
	        KLA.analysis[KLA.analysis.length] = KLA.Analyzer.examine({
	            text: document.getElementById("txt-input").value,
	            keyMap: newLayout.keyMap,
	            keySet: newLayout.keySet
	        });
	        
	        KLA.personalizedKb.setLayout(newLayout);
        }
        
        // ---------------------------------------------------------------------
        // setup heatmaps
        KLA.heatmapsPtr = [];
        for (ii = 0; ii < KLA.numLayoutsToCompare; ii++) {
            KLA.heatmapsPtr[ii] = KLA.heatmaps[ii];
        }
        if (KLA.shouldGeneratePersonalizedLayout()) {
            KLA.heatmapsPtr[KLA.heatmapsPtr.length] = KLA.heatmaps[KLA.personalizedKbLayoutIndex];
        }
        
        console.dir(KLA.analysis);
        KLA.paintHeatmaps(KLA.analysis, KLA.heatmapsPtr);
        
        // ---------------------------------------------------------------------
        // Misc
        KLA.updateMiscellaneous();
        
        /// --------------------------------------------------------------------
        // Compute best layouts
        
        KLA.results = {};
        
        // DISTANCE
        KLA.results.distScores = [];

        var total = [], len = KLA.analysis.length;
        for (ii = 0; ii < len; ii++) {
            total[ii] = 0; 
            for (jj = 0; jj < KLA.analysis[ii].distance.length; jj++) {
                total[ii] += (KLA.analysis[ii].distance[jj] / KLA.analysis[ii].pixelsPerCm);
            }
        }

        for (ii = 0; ii < len; ii++) {
            KLA.results.distScores[ii] = Math.max(0, 4 - (total[ii] / KLA.analysis[ii].numKeys)) / 4;
            if ( !isFinite(KLA.results.distScores[ii]) ) { KLA.results.distScores[ii]=0;}
        }
        
        // FINGER USAGE
        KLA.results.fingerScores = [];
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
            for (jj = 0; jj < KLA.analysis[ii].fingerUsage.length; jj++) {
                if (!fScoring[jj]) {continue;}//skip non-fingers
                percent = (KLA.analysis[ii].fingerUsage[jj] / KLA.analysis[ii].numKeys) * 100;
                percent = Math.min(percent, 20); // 20 is the max allowed percent
                total += (percent * fScoring[jj]);        
            }
            KLA.results.fingerScores[ii] = total / 260; // 220 is max possible score
        }
        
        // CONSEC FINGER USAGE
        KLA.results.consecFingerScores = [];
        total = [];
        for (ii = 0; ii < len; ii++) {
            total[ii] = 0; 
            for (jj = 0; jj < KLA.analysis[ii].consecFingerPressIgnoreDups.length; jj++) {
                total[ii] += KLA.analysis[ii].consecFingerPressIgnoreDups[jj] ;
            }
            total[ii] = (total[ii] / KLA.analysis[ii].numKeys) * 100;
        }
        for (ii = 0; ii < len; ii++) {
            KLA.results.consecFingerScores[ii] = Math.max(0, 10 - total[ii]) / 10;
        }
        
        // CONSEC HAND USAGE
        KLA.results.consecHandScores = [];
        total = [];
        for (ii = 0; ii < len; ii++) {
            total[ii] = (KLA.analysis[ii].consecHandPressIgnoreDups["left"] + 
                         KLA.analysis[ii].consecHandPressIgnoreDups["right"]) / KLA.analysis[ii].numKeys;
            total[ii] = (total[ii]) * 100;
        }
        for (ii = 0; ii < len; ii++) {
            KLA.results.consecHandScores[ii] = Math.max(0, 50 - total[ii]) / 50;
        }
        
        // put it all together!
        var consecHandWeight = 17, consecFingerWeight = 17, fingerUsageWeight = 33, distWeight = 33;
        KLA.results.finalList = [];
        for (ii = 0; ii < len; ii++) {
            KLA.results.finalList[ii] = {};
            KLA.results.finalList[ii].layoutName = KLA.analysis[ii].layoutName;
            KLA.results.finalList[ii].score = 
				(KLA.results.consecHandScores[ii] * consecHandWeight) +
				(KLA.results.consecFingerScores[ii] * consecFingerWeight) +
				(KLA.results.fingerScores[ii] * fingerUsageWeight) +
				(KLA.results.distScores[ii] * distWeight);
            if ( !isFinite( KLA.results.finalList[ii].score ) ) { KLA.results.finalList[ii].score=0;}
        }
        
        KLA.results.finalList.sort(function(a,b) {
            return b.score - a.score;
        });
        
        // ---------------------------------------------------------------------
        // update summary tab
        
	    var tableHtml = "<table class='kla-table-data'><thead><tr><th>Layout</th><th>Score</th></tr></thead><tbody>";
	    for (ii = 0; ii < len; ii++) {
	        tableHtml += "<tr><td style='text-align:right;'>" + KLA.results.finalList[ii].layoutName + "</td>";
            tableHtml += "<td>" + KLA.results.finalList[ii].score.toFixed(2) + "</td></tr>";
	    }
	    tableHtml += "</tbody></table>";
        document.getElementById("kla-result-table").innerHTML = tableHtml;
        document.getElementById("kla-result-layout").innerHTML = KLA.results.finalList[0].layoutName;
        
        console.dir(KLA.results);
        
        // ---------------------------------------------------------------------
        // fade in
        
        JK.fade({
            elm: document.getElementById("kla-input-tabs").style,
            duration: 500,
            startingOpacity: 1,
            endingOpacity: 0,
            callback: function() {
                document.getElementById("kla-input-tabs").style.display = "none";
                document.getElementById("kla-output-tabs").style.opacity = "0";
                document.getElementById("kla-output-tabs").style.filter = "alpha(opacity=0)";
                document.getElementById("kla-output-tabs").style.display = "block";
                /*
                var errDiv = document.getElementById("kla-errors"),
                    errHtml = "";
                errDiv.innerHTML = "";
                errDiv.style.whiteSpace = "pre";

                for (var ii = 0; ii < KLA.analysis.length; ii++) {
                    for (var jj = 0; jj < KLA.analysis[ii].errors.length; jj++) {
                        if (errHtml === "") {
                            errHtml = "<strong>The following errors occurred while processing the text:</strong>\n\n";
                        }
                        if (jj === 0) {
                            errHtml += "For Layout: " + KLA.analysis[ii].layoutName + "\n";
                        }
                        errHtml += KLA.analysis[ii].errors[jj] + "\n";
                    }
                }

                if (errHtml) {
                    errHtml += "\nAs a side note, I'll work on a better output format for errors in the final version.";
                }*/

                //errDiv.innerHTML = errHtml;
                
                JK.fade({
                    elm: document.getElementById("kla-output-tabs").style,
		            duration: 500,
		            startingOpacity: 0,
		            endingOpacity: 1,
		            callback: function() {
		                
		            }
                });
            } 
        });
        
    }, false);
                    
    setupEnvSize = function() {
        var winSize = JK.windowSize(),
            containerHeight = Math.max(winSize.height - 100, 250),
            sidetabHeight = Math.max(containerHeight-70,210);
        
        document.getElementById("kla-body").style.height = containerHeight+"px";
        document.getElementById("jk-tabs").style.height = sidetabHeight+"px";
        document.getElementById("jk-tabs2").style.height = sidetabHeight+"px";
        //document.getElementById("txt-input").style.height = sidetabHeight-60+"px";
    };
    setupEnvSize();
    JK.addEventListener(window,"resize",setupEnvSize,false);
    
    
    
})();


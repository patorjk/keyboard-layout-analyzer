"use strict";

var KLA = KLA || {};

KLA.maxNumLayouts = 5;
KLA.numLayoutsToCompare = 5;
KLA.generatePersonalizedLayout = true;
KLA.getNumOutputLayouts = function() {
    if (KLA.shouldGeneratePersonalizedLayout()) {
        return KLA.numLayoutsToCompare + 1;
    } else {
        return KLA.numLayoutsToCompare;
    }
};
KLA.getMaxNumOutputLayouts = function() {
    return KLA.maxNumLayouts + 1;
};
KLA.shouldGeneratePersonalizedLayout = function() {
    return !!document.getElementById("chkBoxUsePersonalLayout").checked;
};

KLA.displayType = {};
KLA.displayType["all"] = [KB.finger.LEFT_PINKY,  KB.finger.LEFT_RING,   KB.finger.LEFT_MIDDLE,  KB.finger.LEFT_INDEX, KB.finger.LEFT_THUMB,
                          KB.finger.RIGHT_THUMB, KB.finger.RIGHT_INDEX, KB.finger.RIGHT_MIDDLE, KB.finger.RIGHT_RING, KB.finger.RIGHT_PINKY];
KLA.displayType["fingers"] = [KB.finger.LEFT_PINKY,  KB.finger.LEFT_RING,    KB.finger.LEFT_MIDDLE, KB.finger.LEFT_INDEX,
                              KB.finger.RIGHT_INDEX, KB.finger.RIGHT_MIDDLE, KB.finger.RIGHT_RING,  KB.finger.RIGHT_PINKY];
KLA.displayType["left"] =  [KB.finger.LEFT_PINKY,  KB.finger.LEFT_RING,   KB.finger.LEFT_MIDDLE,  KB.finger.LEFT_INDEX, KB.finger.LEFT_THUMB];
KLA.displayType["right"] = [KB.finger.RIGHT_THUMB, KB.finger.RIGHT_INDEX, KB.finger.RIGHT_MIDDLE, KB.finger.RIGHT_RING, KB.finger.RIGHT_PINKY];
KLA.displayType["hands"] = [KB.finger.LEFT_PINKY,  KB.finger.LEFT_RING,   KB.finger.LEFT_MIDDLE,  KB.finger.LEFT_INDEX, KB.finger.LEFT_THUMB,
                            KB.finger.RIGHT_THUMB, KB.finger.RIGHT_INDEX, KB.finger.RIGHT_MIDDLE, KB.finger.RIGHT_RING, KB.finger.RIGHT_PINKY];

// -----------------------------------------------------------------------------
// Utility functions
// -----------------------------------------------------------------------------

KLA.getBarChartPlotter = function(canvasId, overlayId) {
    var plotter,
        canvasOpts,
        canvas = MochiKit.DOM.getElement(canvasId),
        canvasOverlay = MochiKit.DOM.getElement(overlayId),
        plotFunct = function(){funct();};

    canvasOpts = {
        "colorScheme": PlotKit.Base.palette(PlotKit.Base.baseColors()[0]),
        "padding": {left: 50, right: 10, top: 5, bottom: 10},
        "backgroundColor":MochiKit.Color.Color.fromRGB(212/255,215/255,215/255),
        "axisLabelColor":MochiKit.Color.Color.fromRGB(0/255,0/255,0/255),
        "canvasOverlay":canvasOverlay
    };

    return function(config) {
        config = config || {};
        config.items = config.items || {};
    
        var myLabels,
            ii,
            layoutOpts,
            layout,
            curItem,
            tmpDataSet,
            idx;
        
        if (config.labels) {
            myLabels = [];
            for (ii = 0; ii < config.labels.length; ii++) {
                myLabels.push( {v: ii, label: config.labels[ii]} );
            }
        }
        layoutOpts = {
            "padding": {left: 10, right: 10, top: 10, bottom: 10},
            "xTicks": myLabels,
            "drawYAxis": false,
            "axisLabelWidth": 40,
            "barWidthFillFraction": 0.6,
            "yTickPrecision": 2
        };        
        layout = new PlotKit.Layout("bar", layoutOpts);

        for (curItem in config.items) {
            tmpDataSet = [];
            idx = 0;
            for (ii = 0; ii < config.items[curItem].length; ii++) {            
                tmpDataSet.push([idx, config.items[curItem][ii]]);
                idx++;
            }
            layout.addDataset(curItem, tmpDataSet);
        }
    
        layout.evaluate();
        if (plotter) {
            plotter.clear();
        }
        plotter = new PlotKit.SweetCanvasRenderer(canvas, layout, canvasOpts);
        plotter.render();
    };
};

KLA.getPieChartPlotter = function(canvasId) {
    var plotter,
        canvasOpts,
        canvas = MochiKit.DOM.getElement(canvasId),
        plotFunct = function(){funct();};

    canvasOpts = {
        "colorScheme": PlotKit.Base.palette(PlotKit.Base.baseColors()[0]),
        "padding": {left: 10, right: 10, top: 10, bottom: 10},
        "backgroundColor":MochiKit.Color.Color.fromRGB(232/255,238/255,246/255),
        "axisLabelColor":MochiKit.Color.Color.fromRGB(0/255,0/255,0/255)
    };

    return function(config) {
        config = config || {};
        config.items = config.items || {};
    
        var myLabels,
            ii,
            layoutOpts,
            layout,
            curItem,
            tmpDataSet,
            idx;
        
        if (config.labels) {
            myLabels = [];
            for (ii = 0; ii < config.labels.length; ii++) {
                myLabels.push( {v: ii, label: config.labels[ii]} );
            }
        }
        layoutOpts = {
            "padding": {left: 10, right: 10, top: 10, bottom: 10},
            "xTicks": myLabels,
            "drawYAxis": false,
            "axisLabelWidth": 40,
            "barWidthFillFraction": 0.6,
            "yTickPrecision": 0
        };        
        layout = new PlotKit.Layout("pie", layoutOpts);
    
        for (curItem in config.items) {
            tmpDataSet = [];
            idx = 0;
            for (ii = 0; ii < config.items[curItem].length; ii++) {            
                tmpDataSet.push([idx, config.items[curItem][ii]]);
                idx++;
            }
            layout.addDataset(curItem, tmpDataSet);
        }
    
        layout.evaluate();
        if (plotter) {
            plotter.clear();
        }
        plotter = new PlotKit.SweetCanvasRenderer(canvas, layout, canvasOpts);
        plotter.render();
    };
};

KLA.updateDistBarPlotter = (function() {

    var fingerPlotter = KLA.getBarChartPlotter( "lHandDistGraph", "lHandDistGraphOverlay");

    return function() {
	    var ii,
	        jj,
	        lData = {items: {}, labels: {}},
	        rData = {items: {}, labels: {}},
	        myLabels = [],
	        displaySelect = document.getElementById("kla-dist-display"),
	        display = displaySelect.options[displaySelect.selectedIndex].value,
	        displayData = KLA.displayType[display],
	        unitSelect = document.getElementById("kla-dist-units"),
	        unit = unitSelect.options[unitSelect.selectedIndex].value,
	        units = {},
	        total,
	        rHand,lHand,thumbs;
	
        if (display === "hands") {
            myLabels.push("Left Hand", "Right Hand", "Thumbs");
        } else {	    
		    for (ii = 0; ii < displayData.length; ii++) {
		       myLabels.push( KB.fingers[ displayData[ii] ]);
		    }
		}
	    for (ii = 0; ii < KLA.analysis.length; ii++) {
		    lData.items[ii] = [];
		    
		    rHand = 0; lHand = 0; thumbs = 0; total = 0;
		    for (jj = 0; jj < displayData.length; jj++) {
		      total += KLA.analysis[ii].distance[ displayData[jj] ];
		    }
		    
		    for (jj = 0; jj < displayData.length; jj++) {
		        units["cm"] = (KLA.analysis[ii].distance[ displayData[jj] ] / KLA.analysis[ii].pixelsPerCm);
		        units["m"] = (units["cm"] * 0.01);
		        units["ft"] = units["m"] * 3.2808399;
		        units["mi"] = units["m"] * 0.000621371192;
                units["percent"] = (total > 0) ? (KLA.analysis[ii].distance[ displayData[jj] ] / total) * 100 : 0;
                if (!isFinite(units["percent"])) {units["percent"]=0;}

		        if (display === "hands") {
		            if (KB.finger.isThumb(displayData[jj])) {
		                thumbs += units[unit];
		            } else if ( KB.finger.whichHand(displayData[jj]) === "right") {
		                rHand += units[unit];
		            } else {
		                lHand += units[unit];
		            }
		        } else {
		            lData.items[ii].push( units[unit] );
		        }
		    }
		    if (display === "hands") {
		        lData.items[ii].push( lHand, rHand, thumbs );
		    }
	    }
	
	   var pItems = {};
	   for (ii = 0; ii < KLA.getNumOutputLayouts(); ii++) {
	       pItems["" + ii] = lData.items[ii];
	   }
	
	    fingerPlotter({
	        items: pItems,
	        labels: myLabels
	    });
	    
	    // Update legend
	    KLA.updateBarChartLegend("kla-dist-legend");
	    
	    // Generate table
	    var fixedAmount = 1,
	        unitStr = "";
	    if (unit === "percent") {fixedAmount = 1; unitStr = "%";}
	    if (display === "hands") {
	        KLA.createFingerVsLayoutTable(lData, [0,1,2], ["Left Hand","Right Hand","Thumbs"], "kla-dist-table", fixedAmount, unitStr);
	    } else {
            KLA.createFingerVsLayoutTable(lData, displayData, KB.fingers, "kla-dist-table", fixedAmount, unitStr);
        }
	};
})();

KLA.createFingerVsLayoutTable = function(lData, displayData, displayLabels, tableDivId, fixedAmount, unitStr, displayTotals) {
	var finger,
	    tableHtml = "<table class='kla-table-data'>",
	    jj, 
	    ii,
	    curLayout = 0;

    if (typeof displayTotals === "undefined"){displayTotals = true;}
	    
    unitStr = unitStr || "";
	tableHtml += "<thead><tr>";
	for (ii = -1; ii <= displayData.length; ii++) {
	    if (ii === -1) {
	        tableHtml += "<th></th>";
	    } else if (ii === displayData.length) {
	       if (displayTotals === true) {
	           tableHtml += "<th>Total</th>";
	       }
	    } else {
	       tableHtml += "<th>" + displayLabels[displayData[ii]] + "</th>";
	    }
	}
	tableHtml += "</tr></thead><tbody>";
	
    for (ii = 0; ii < KLA.analysis.length; ii++) {

        tableHtml += "<tr><td style='text-align:right;'>" + KLA.analysis[ii].layoutName + "</td>";
    
        var total = 0;
        for (jj = 0; jj < displayData.length; jj++) {
            total += lData.items[ii][jj];
            tableHtml += "<td>" + lData.items[ii][jj].toFixed(fixedAmount) + unitStr + "</td>";
        }
    
        if (displayTotals === true) {
            tableHtml += "<td>" + total.toFixed(fixedAmount) + unitStr + "</td>";
        }
    
        tableHtml += "</tr>";
    }
	
	tableHtml += "</tbody></table>";
	document.getElementById(tableDivId).innerHTML = tableHtml;
};

KLA.updateBarChartLegend = function(legendId) {
    var colors = PlotKit.Base.palette(PlotKit.Base.baseColors()[0]),
        ii, block, blockLabel, color;
    for (ii = 0; ii < KLA.getNumOutputLayouts(); ii++) {
    
        color = "rgb(" + Math.round(colors[ii].rgb.r*255) + "," +
                         Math.round(colors[ii].rgb.g*255) + "," +
                         Math.round(colors[ii].rgb.b*255) + ")";
    
        block = document.getElementById(legendId+"-block-"+ii);
        block.style.display = "inline-block";
        block.style.backgroundColor = color;
        blockLabel = document.getElementById(legendId+"-text-"+ii);
        blockLabel.style.display = "inline-block";
        JK.removeAllChildren(blockLabel);
        blockLabel.appendChild( document.createTextNode( KLA.analysis[ii].layoutName) );
    }
    for (ii = KLA.getNumOutputLayouts(); ii < KLA.getMaxNumOutputLayouts(); ii++) {
        document.getElementById(legendId+"-block-"+ii).style.display = "none";
        document.getElementById(legendId+"-text-"+ii).style.display = "none";
    }
};

KLA.createPieChartOutputElements = function(outputId, prefix) {
    var outputElm = document.getElementById(outputId),
        myTable = "<table class=\"kla-pie-table\"><thead><tr><th colspan=\"3\">Pie Charts</th></tr></thead><tbody>",
        numRows = Math.ceil(KLA.getNumOutputLayouts() / 2),
        ii,
        pieIndex = 0;
    
    for (ii = 0; ii < numRows; ii++) {
        myTable += "<tr><td><div id=\""+prefix+"Container"+pieIndex+"\" class=\"kla-chart-container\">";
        myTable += "<canvas id=\""+prefix+"Graph"+pieIndex+"\" height=\"250\" width=\"250\"></canvas></div>";
        myTable += "<div id=\""+prefix+"Label"+pieIndex+"\"></div></td>";
        myTable += "<td class=\"kla-pie-table-spacer\"></td>";
        pieIndex++;
        myTable += "<td><div id=\""+prefix+"Container"+pieIndex+"\" class=\"kla-chart-container\">";
        myTable += "<canvas id=\""+prefix+"Graph"+pieIndex+"\" height=\"250\" width=\"250\"></canvas></div>";
        myTable += "<div id=\""+prefix+"Label"+pieIndex+"\"></div></td></tr>";
        pieIndex++;
        myTable += "<tr><td colspan=\"3\" class=\"kla-pie-table-spacer\"></td></tr>";
    }
    myTable += "</tbody></table>";
    outputElm.innerHTML = myTable;
};

KLA.updateDistPiePlotters = (function() {

    return function() {
    
	    KLA.createPieChartOutputElements("kla-dist-pie-tables", "pieDist");
	
	    var piePlotters = [];
	    var idx = 0;
	    for (idx = 0; idx < KLA.getNumOutputLayouts(); idx++) {
	        piePlotters[idx] = KLA.getPieChartPlotter( "pieDistGraph"+idx );
	    }
    
	    var displaySelect = document.getElementById("kla-dist-display"),
	        display = displaySelect.options[displaySelect.selectedIndex].value,
	        myLabels = [],
	        myData = [],
	        displayData = KLA.displayType[display],
	        ii,
	        idx,
	        elm,
	        rHand,lHand,thumbs;
		
        if (display === "hands") {
            myLabels.push("Left Hand", "Right Hand", "Thumbs");
        } else {
			for (ii = 0; ii < displayData.length; ii++) {
			    myLabels.push( KB.fingers[ displayData[ii] ]);
			}
	    }
		    
		for (idx = 0; idx < KLA.analysis.length; idx++) {

            rHand = 0; lHand = 0; thumbs = 0;

		    for (ii = 0; ii < displayData.length; ii++) {
                if (display === "hands") {
                    if (KB.finger.isThumb(displayData[ii])) {
                        thumbs += KLA.analysis[idx].distance[displayData[ii]];
                    } else if ( KB.finger.whichHand(displayData[ii]) === "right") {
                        rHand += KLA.analysis[idx].distance[displayData[ii]];
                    } else {
                        lHand += KLA.analysis[idx].distance[displayData[ii]];
                    }
                } else {
		            myData.push( KLA.analysis[idx].distance[displayData[ii]] );
		        }
		    }
            if (display === "hands") {
                myData.push( lHand, rHand, thumbs );
            }

		    piePlotters[idx]({
		        items: {
		            "Layout": myData
		        },
		        labels: myLabels
		    });
		    elm = document.getElementById("pieDistLabel"+idx);
		    if (elm) {
		      elm.innerHTML = KLA.analysis[idx].layoutName;
		      elm.style.textAlign = "center";
		    }
		    myData = [];
		}
    };
})();

KLA.distChartUpdates = function() {
	KLA.updateDistBarPlotter();
	KLA.updateDistPiePlotters();
};

JK.addEventListener(document.getElementById("kla-dist-display"), "change", KLA.distChartUpdates, false);
JK.addEventListener(document.getElementById("kla-dist-display"), "keyup", KLA.distChartUpdates, false);
JK.addEventListener(document.getElementById("kla-dist-units"), "change", KLA.distChartUpdates, false);
JK.addEventListener(document.getElementById("kla-dist-units"), "keyup", KLA.distChartUpdates, false);

JK.addEventListener(document.getElementById("distTab"), "click", function() {
    setTimeout(KLA.distChartUpdates, 10);// display main chart after a brief pause
}, false);




// -----------------------------------------------------------------------------
// Finger Usage
// -----------------------------------------------------------------------------

KLA.fUsagePlotter = KLA.getBarChartPlotter( "fUsageGraph", "fUsageGraphOverlay");

KLA.updateFUsageBarPlotter = function() {
    var ii,
        jj,
        lData = {items: {}, labels: {}},
        rData = {items: {}, labels: {}},
        myLabels = [],
        displaySelect = document.getElementById("kla-fusage-display"),
        display = displaySelect.options[displaySelect.selectedIndex].value,
        displayData = KLA.displayType[display],
        unitSelect = document.getElementById("kla-fusage-units"),
        unit = unitSelect.options[unitSelect.selectedIndex].value,
        units = {},
        rHand,lHand,thumbs,val;

    if (display === "hands") {
        myLabels.push("Left Hand", "Right Hand", "Thumbs");
    } else {
	    for (ii = 0; ii < displayData.length; ii++) {
	        myLabels.push( KB.fingers[ displayData[ii] ]);
	    } 
    }
    
    for (ii = 0; ii < KLA.analysis.length; ii++) {
    
        rHand = 0; lHand = 0; thumbs = 0, val = 0;
    
        var total = 0;
        for (jj = 0; jj < displayData.length; jj++) {
          total += KLA.analysis[ii].fingerUsage[ displayData[jj] ];
        }
    
        lData.items[ii] = [];
        for (jj = 0; jj < displayData.length; jj++) {
        
            if (unit === "percent") {
                val = (KLA.analysis[ii].fingerUsage[ displayData[jj] ] / total) * 100 ;
                if (!isFinite(val)) { val=0; }
            } else {
                val = KLA.analysis[ii].fingerUsage[ displayData[jj] ] ;
            }
        
            if (display === "hands") {
                if (KB.finger.isThumb(displayData[jj])) {
                    thumbs += val;
                } else if ( KB.finger.whichHand(displayData[jj]) === "right") {
                    rHand += val;
                } else {
                    lHand += val;
                }
            } else {
                lData.items[ii].push(val);
            }
        } 
        if (display === "hands") {
            lData.items[ii].push( lHand, rHand, thumbs );
        }
    }

    var pItems = {};
    for (ii = 0; ii < KLA.getNumOutputLayouts(); ii++) {
        pItems[ii] = lData.items[ii];
    }

    KLA.fUsagePlotter({
        items: pItems,
        labels: myLabels
    });
    
    // Update legend
    KLA.updateBarChartLegend("kla-fusage-legend");
    
    // Generate table
    var fixedAmount = 0,
        unitStr = "";
    if (unit === "percent") {fixedAmount = 1; unitStr = "%";}
    if (display === "hands") {
        KLA.createFingerVsLayoutTable(lData, [0,1,2], ["Left Hand","Right Hand","Thumbs"], "kla-fusage-data-table", fixedAmount, unitStr);
    } else {
        KLA.createFingerVsLayoutTable(lData, displayData, KB.fingers, "kla-fusage-data-table", fixedAmount, unitStr);
    }
};

KLA.updateFUsagePiePlotters = (function() {

    return function() {
    
	    KLA.createPieChartOutputElements("kla-fusage-pie-tables", "pieFUsage");
	
	    var piePlotters = [];
	    var idx = 0;
	    for (idx = 0; idx < KLA.getNumOutputLayouts(); idx++) {
	        piePlotters[idx] = KLA.getPieChartPlotter( "pieFUsageGraph"+idx );
	    }
    
        var displaySelect = document.getElementById("kla-fusage-display"),
            display = displaySelect.options[displaySelect.selectedIndex].value,
            myLabels = [],
            myData = [],
            displayData = KLA.displayType[display],
            ii,
            idx,
            elm,
            rHand, lHand, thumbs;
        
        if (display === "hands") {
            myLabels.push("Left Hand", "Right Hand", "Thumbs");
        } else {
	        for (ii = 0; ii < displayData.length; ii++) {
	            myLabels.push( KB.fingers[ displayData[ii] ]);
	        }
        }
            
        for (idx = 0; idx < KLA.analysis.length; idx++) {

            rHand = 0; lHand = 0; thumbs = 0;

            for (ii = 0; ii < displayData.length; ii++) {
                if (display === "hands") {
                    if (KB.finger.isThumb(displayData[ii])) {
                        thumbs += KLA.analysis[idx].fingerUsage[displayData[ii]];
                    } else if ( KB.finger.whichHand(displayData[ii]) === "right") {
                        rHand += KLA.analysis[idx].fingerUsage[displayData[ii]];
                    } else {
                        lHand += KLA.analysis[idx].fingerUsage[displayData[ii]];
                    }
                } else {
                    myData.push( KLA.analysis[idx].fingerUsage[displayData[ii]] );
                }
            }
	        if (display === "hands") {
	            myData.push( lHand, rHand, thumbs );
	        }

            piePlotters[idx]({
                items: {
                    "Layout": myData
                },
                labels: myLabels
            });
            elm = document.getElementById("pieFUsageLabel"+idx);
            if (elm) {
              elm.innerHTML = KLA.analysis[idx].layoutName;
              elm.style.textAlign = "center";
            }
            myData = [];
        }
    };
})();

KLA.fUsageChartUpdates = function() {
    KLA.updateFUsageBarPlotter();
    KLA.updateFUsagePiePlotters();
};

JK.addEventListener(document.getElementById("kla-fusage-display"), "change", KLA.fUsageChartUpdates, false);
JK.addEventListener(document.getElementById("kla-fusage-display"), "keyup", KLA.fUsageChartUpdates, false);
JK.addEventListener(document.getElementById("kla-fusage-units"), "change", KLA.fUsageChartUpdates, false);
JK.addEventListener(document.getElementById("kla-fusage-units"), "keyup", KLA.fUsageChartUpdates, false);
JK.addEventListener(document.getElementById("fUsageTab"), "click", function() {
    setTimeout(KLA.fUsageChartUpdates, 10);
}, false);


// -----------------------------------------------------------------------------
// Row Usage
// -----------------------------------------------------------------------------

KLA.rUsagePlotter = KLA.getBarChartPlotter( "rUsageGraph", "rUsageGraphOverlay");

KLA.updateRUsageBarPlotter = function() {
    var ii,
        jj,
        lData = {items: {}, labels: {}},
        rData = {items: {}, labels: {}},
        myLabels = [],
        displaySelect = document.getElementById("kla-rusage-display"),
        display = displaySelect.options[displaySelect.selectedIndex].value,
        displayType = {},
        unitSelect = document.getElementById("kla-rusage-units"),
        unit = unitSelect.options[unitSelect.selectedIndex].value,
        units = {},
        rowLabels = ["Number Row", "Top Row", "Home Row", "Bottom Row", "Spacebar Row"];

    displayType["all"] = [0, 1, 2, 3, 4];
    displayType["alphanumeric"] = [0, 1, 2, 3];
    displayType["alphabet"] =  [1, 2, 3];

    for (ii = 0; ii < displayType[display].length; ii++) {
        myLabels.push( rowLabels[ displayType[display][ii] ]);
    } 
    
    for (ii = 0; ii < KLA.analysis.length; ii++) {
    
        var total = 0;
        for (jj = 0; jj < displayType[display].length; jj++) {
            total += KLA.analysis[ii].rowUsage[ displayType[display][jj] ];
        }
    
        lData.items[ii] = [];
        for (jj = 0; jj < displayType[display].length; jj++) {
            if (unit === "percent") {
                var tmpVal = (KLA.analysis[ii].rowUsage[ displayType[display][jj] ] / total) * 100 ;
                if ( !isFinite(tmpVal) ) { tmpVal=0; }
                lData.items[ii].push( tmpVal);
            } else {
                lData.items[ii].push( KLA.analysis[ii].rowUsage[ displayType[display][jj] ] );
            }
        } 
    }

    var pItems = {};
    for (ii = 0; ii < KLA.getNumOutputLayouts(); ii++) {
        pItems[ii] = lData.items[ii];
    }
    
    KLA.rUsagePlotter({
        items: pItems,
        labels: myLabels
    });
    
    // Update legend
    KLA.updateBarChartLegend("kla-rusage-legend", colors);
    
    // Generate table
    var fixedAmount = 0,
        unitStr = "";
    if (unit === "percent") {fixedAmount = 1; unitStr = "%";}
    KLA.createFingerVsLayoutTable(lData, displayType[display], rowLabels, "kla-rusage-data-table", fixedAmount, unitStr);
};

KLA.updateRUsagePiePlotters = (function() {

    return function() {
    
	    KLA.createPieChartOutputElements("kla-rusage-pie-tables", "pieRUsage");
	
	    var piePlotters = [];
	    var idx = 0;
	    for (idx = 0; idx < KLA.getNumOutputLayouts(); idx++) {
	        piePlotters[idx] = KLA.getPieChartPlotter( "pieRUsageGraph"+idx );
	    }
    
        var displaySelect = document.getElementById("kla-rusage-display"),
            display = displaySelect.options[displaySelect.selectedIndex].value,
            myLabels = [],
            myData = [],
            displayType = [],
            ii,
            idx,
            elm,
            rowLabels = ["Number Row", "Top Row", "Home Row", "Bottom Row", "Spacebar Row"];

	    displayType["all"] = [0, 1, 2, 3, 4];
	    displayType["alphanumeric"] = [0, 1, 2, 3];
	    displayType["alphabet"] =  [1, 2, 3];
    
        for (ii = 0; ii < displayType[display].length; ii++) {
            myLabels.push( rowLabels[ displayType[display][ii] ]);
        }
            
        for (idx = 0; idx < KLA.analysis.length; idx++) {

            for (ii = 0; ii < displayType[display].length; ii++) {    
                myData.push( KLA.analysis[idx].rowUsage[displayType[display][ii]] );
            }

            piePlotters[idx]({
                items: {
                    "Layout": myData
                },
                labels: myLabels
            });
            elm = document.getElementById("pieRUsageLabel"+idx);
            if (elm) {
              elm.innerHTML = KLA.analysis[idx].layoutName;
              elm.style.textAlign = "center";
            }
            myData = [];
        }
    };
})();

KLA.rUsageChartUpdates = function() {
    KLA.updateRUsageBarPlotter();
    KLA.updateRUsagePiePlotters();
};

JK.addEventListener(document.getElementById("kla-rusage-display"), "change", KLA.rUsageChartUpdates, false);
JK.addEventListener(document.getElementById("kla-rusage-display"), "keyup", KLA.rUsageChartUpdates, false);
JK.addEventListener(document.getElementById("kla-rusage-units"), "change", KLA.rUsageChartUpdates, false);
JK.addEventListener(document.getElementById("kla-rusage-units"), "keyup", KLA.rUsageChartUpdates, false);
JK.addEventListener(document.getElementById("rUsageTab"), "click", function() {
    setTimeout(KLA.rUsageChartUpdates, 10);
}, false);

// -----------------------------------------------------------------------------
// Heat Maps
// -----------------------------------------------------------------------------

KLA.paintHeatmaps = function(analysis, heatmaps) {

    var ii,
        jj,
        keys,
        highVal,
        lowVal,
        range,
        gradient,
        index;
    
    for (ii = 0; ii < analysis.length; ii++) {        
        keys = Array.prototype.sort.call(analysis[ii].keyData, function(a, b) {
            return a.count - b.count;
        });
        keys.length = analysis[ii].keyData.length;
        
        lowVal = keys[0].count;
        highVal = keys[keys.length-1].count;
        range = highVal - lowVal;
        
        gradient = JK.color.createGradient({
            size: 200,
            colorStops: [
                {position: 0, color: {r:255, g: 230, b: 230}},
                {position: 1, color: {r:255, g: 0, b: 0}}
            ]
        });
        
        for (jj = 0; jj < keys.length; jj++) {
        
            index = Math.round((keys[jj].count - lowVal) / range * 199);
            
            if (keys[jj].count === 0) {
                heatmaps[ii].getKey(keys[jj].index).setBackgroundColor({r:255,g:255,b:255});
            } else {
                heatmaps[ii].getKey(keys[jj].index).setBackgroundColor(gradient[index]);
                heatmaps[ii].getKey(keys[jj].index).setBackgroundColorOpacity(1);
            }
        }
        heatmaps[ii].draw();
    }
};



// -----------------------------------------------------------------------------
// Miscellaneous
// -----------------------------------------------------------------------------

KLA.updateMiscellaneous = function() {

    var fixedAmount = 1,
        unitStr = "",
        unit = "percent",
        lData = {},
        ii, 
        jj,
        displayData,
        prop;
        
    prop = (document.getElementById("kla-cfu-checkbox").checked) ? "consecFingerPressIgnoreDups" : "consecFingerPress";
    displayData = KLA.displayType["all"];
    lData.items = [];
    for (ii = 0; ii < KLA.analysis.length; ii++) {
        lData.items[ii] = [];
        for (jj = 0; jj < displayData.length; jj++) {
            lData.items[ii][jj] = KLA.analysis[ii][prop][displayData[jj]];
            if (unit === "percent") {
                lData.items[ii][jj] = (lData.items[ii][jj] / KLA.analysis[ii].numKeys) * 100;
                if ( !isFinite( lData.items[ii][jj] ) ) { lData.items[ii][jj] = 0; }
            }
        }
    }
    if (unit === "percent") {fixedAmount = 1; unitStr = "%";}
    KLA.createFingerVsLayoutTable(lData, KLA.displayType["all"], KB.fingers, "kla-consec-finger-press-table", fixedAmount, unitStr);

    // consec hand data

    prop = (document.getElementById("kla-chu-checkbox").checked) ? "consecHandPressIgnoreDups" : "consecHandPress";
    displayData = ["left", "right", "thumbs"];
    lData.items = [];
    for (ii = 0; ii < KLA.analysis.length; ii++) {
        lData.items[ii] = [];
        for (jj = 0; jj < displayData.length; jj++) {
            lData.items[ii][jj] = KLA.analysis[ii][prop][displayData[jj]];
            if (unit === "percent") {
                lData.items[ii][jj] = (lData.items[ii][jj] / KLA.analysis[ii].numKeys) * 100;
                if ( !isFinite( lData.items[ii][jj] ) ) { lData.items[ii][jj] = 0; }
            }
        }
    }
    if (unit === "percent") {fixedAmount = 1; unitStr = "%";}
    KLA.createFingerVsLayoutTable(lData, [0,1,2], ["Left Hand","Right Hand","Thumbs"], "kla-consec-hand-press-table", fixedAmount, unitStr);
    
    // modifier key use 
    
    displayData = ["shift", "altGr", "shiftAltGr"];
    lData.items = [];
    var numNonModKeys; 
    for (ii = 0; ii < KLA.analysis.length; ii++) {
        numNonModKeys = KLA.analysis[ii].numKeys - KLA.analysis[ii].modifierUse.shift - KLA.analysis[ii].modifierUse.altGr;
        lData.items[ii] = [];
        for (jj = 0; jj < displayData.length; jj++) {
            lData.items[ii][jj] = KLA.analysis[ii].modifierUse[displayData[jj]];
            if (unit === "percent") {
                lData.items[ii][jj] = (lData.items[ii][jj] / numNonModKeys) * 100;
                if ( !isFinite( lData.items[ii][jj] ) ) { lData.items[ii][jj] = 0; }
            }
        }
    }
    if (unit === "percent") {fixedAmount = 1; unitStr = "%";}
    KLA.createFingerVsLayoutTable(lData, [0,1,2], ["Shift","AltGr","Shift+AltGr"], "kla-modifier-use-table", fixedAmount, unitStr, false);
    
};

JK.addEventListener(document.getElementById("kla-cfu-checkbox"), "change", function() {
    KLA.updateMiscellaneous();
}, false);
JK.addEventListener(document.getElementById("kla-chu-checkbox"), "change", function() {
    KLA.updateMiscellaneous();
}, false);

// -----------------------------------------------------------------------------
// Personal Layout
// -----------------------------------------------------------------------------

/*
    keys - array of keys ordered from most popular to least
*/
KLA.createPersonalLayout = function(keys, refKeySet) {

    var topQwertyKeys = [31, 36, 32, 35, 30, 37, 33, 34, 29, 38, 18, 21, 17, 22, 16, 23, 45, 47, 48, 19, 39, 15, 24, 44, 20, 46, 25, 26, 42, 43, 49, 50, 51, 27], 
        tqkLookup = {},
        ii = 0, 
        jj,
        key,
        orderedKeys = [];
    for (ii = 0; ii < topQwertyKeys.length; ii++) {
        tqkLookup[ topQwertyKeys[ii] ] = true;
    }

    var pKeySet = JK.clone(refKeySet);
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

(function() {

    var returnToInput = function() {   
        JK.fade({
            elm: document.getElementById("kla-output-tabs").style,
            duration: 500,
            startingOpacity: 1,
            endingOpacity: 0,
            callback: function() {
                document.getElementById("kla-output-tabs").style.display = "none";
                document.getElementById("kla-input-tabs").style.opacity = "0";
                document.getElementById("kla-input-tabs").style.filter = "alpha(opacity=0)";
                document.getElementById("kla-input-tabs").style.display = "block";
                JK.fade({
                    elm: document.getElementById("kla-input-tabs").style,
                    duration: 500,
                    startingOpacity: 0,
                    endingOpacity: 1,
                    callback: function() {

                    }
                });
            } 
        });
    };

    JK.addEventListener(document.getElementById("btn-return"), "click", returnToInput, false);
    
            JK.addEventListener(document.body, "selectstart", function(evt) {
                return false;
            }, false);
})();
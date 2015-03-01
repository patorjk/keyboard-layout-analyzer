/*
	Generates and formats the results
*/

var appServices = appServices || angular.module('kla.services', []);

appServices.factory('resultsGenerator', ['$log', 'keyboards', 'analyzer', 'library',

	function($log, keyboards, analyzer, library) {
        var me = {},
            layouts = []
            ;

        /*
			Throws an Error if it fails
        */
        me.go = function(txt) {

            // --------------------------------------------------------------------
            // Create an analysis report on each layout

            var analysis = [];
            var kLayouts = [];
            keyboards.forEach(function(layout) {
                analysis[analysis.length] = analyzer.examine({
                    text: txt,
                    keyMap: layout.keyMap,
                    keySet: layout.keySet 
                });

                var idx = kLayouts.length;
                kLayouts[idx] = {};
                kLayouts[idx].keyMap = layout.keyMap;
                kLayouts[idx].keySet = layout.keySet;
            });

            if (analysis.length === 0) {
                throw new Error('You must set at least 1 layout to display results.');
            }

            // ---------------------------------------------------------------------
            // create personal layout
        
            var qwertyAnalysis = analyzer.examine({
                text: txt,
                keyMap: KB.keyMap.standard.s683_225,
                keySet: KB.keySet.standard.qwerty 
            });
            
            var qKeys = Array.prototype.sort.call(qwertyAnalysis.keyData, function(a, b) {
                return b.count - a.count;
            });
            var pKeys = keyboards.createPersonalLayout(qKeys, KB.keySet.standard.qwerty);
            
            var newLayout = {};
            newLayout.keySet = pKeys;
            newLayout.keyMap = KB.keyMap.standard.s683_225;
            
            analysis[analysis.length] = analyzer.examine({
                text: txt,
                keyMap: newLayout.keyMap,
                keySet: newLayout.keySet
            });
            
            library.set('personalized', newLayout);
            library.set('inputText', txt);

            kLayouts.push(newLayout);

            $log.info( analysis );

            // --------------------------------------------------------------------
            // Compute best layout
            
            var scores = analyzer.scoreLayouts(analysis);
            library.set('summary', {
                bestLayout: scores.finalList[0].layoutName,
                rankedLayouts: scores.finalList
            });

            // --------------------------------------------------------------------
            // Prepare charts

            var displayData = {};
            displayData['All'] = [  
                {label: 'Left Pinky',   color: 'rgba(  0,255,255,0.5)', data: [KB.finger.LEFT_PINKY]},  
                {label: 'Left Ring',    color: 'rgba(  0,  0,230,0.5)', data: [KB.finger.LEFT_RING]},   
                {label: 'Left Middle',  color: 'rgba(136,136,255,0.5)', data: [KB.finger.LEFT_MIDDLE]},  
                {label: 'Left Index',   color: 'rgba(255,  0,255,0.5)', data: [KB.finger.LEFT_INDEX]}, 
                {label: 'Left Thumb',   color: 'rgba(255,255,255,0.5)', data: [KB.finger.LEFT_THUMB]},
                {label: 'Right Thumb',  color: 'rgba(204,204,204,0.5)', data: [KB.finger.RIGHT_THUMB]}, 
                {label: 'Right Index',  color: 'rgba(255,  0,  0,0.5)', data: [KB.finger.RIGHT_INDEX]}, 
                {label: 'Right Middle', color: 'rgba(255,136,  0,0.5)', data: [KB.finger.RIGHT_MIDDLE]}, 
                {label: 'Right Ring',   color: 'rgba(255,255,  0,0.5)', data: [KB.finger.RIGHT_RING]}, 
                {label: 'Right Pinky',  color: 'rgba(  0,255,  0,0.5)', data: [KB.finger.RIGHT_PINKY]} 
            ];
            displayData['Fingers'] = [
                {label: 'Left Pinky',   color: 'rgba(  0,255,255,0.5)', data: [KB.finger.LEFT_PINKY]},  
                {label: 'Left Ring',    color: 'rgba(  0,  0,230,0.5)', data: [KB.finger.LEFT_RING]},    
                {label: 'Left Middle',  color: 'rgba(136,136,255,0.5)', data: [KB.finger.LEFT_MIDDLE]}, 
                {label: 'Left Index',   color: 'rgba(255,  0,255,0.5)', data: [KB.finger.LEFT_INDEX]},
                {label: 'Right Index',  color: 'rgba(255,  0,  0,0.5)', data: [KB.finger.RIGHT_INDEX]}, 
                {label: 'Right Middle', color: 'rgba(255,136,  0,0.5)', data: [KB.finger.RIGHT_MIDDLE]}, 
                {label: 'Right Ring',   color: 'rgba(255,255,  0,0.5)', data: [KB.finger.RIGHT_RING]},  
                {label: 'Right Pinky',  color: 'rgba(  0,255,  0,0.5)', data: [KB.finger.RIGHT_PINKY]}
            ];
            displayData['Left Hand'] =  [
                {label: 'Left Pinky',   color: 'rgba(  0,255,255,0.5)', data: [KB.finger.LEFT_PINKY]},
                {label: 'Left Ring',    color: 'rgba(  0,  0,230,0.5)', data: [KB.finger.LEFT_RING]},   
                {label: 'Left Middle',  color: 'rgba(136,136,255,0.5)', data: [KB.finger.LEFT_MIDDLE]},  
                {label: 'Left Index',   color: 'rgba(255,  0,255,0.5)', data: [KB.finger.LEFT_INDEX]}, 
                {label: 'Left Thumb',   color: 'rgba(255,255,255,0.5)', data: [KB.finger.LEFT_THUMB]}
            ];
            displayData['Right Hand'] = [
                {label: 'Right Thumb',  color: 'rgba(204,204,204,0.5)', data: [KB.finger.RIGHT_THUMB]}, 
                {label: 'Right Index',  color: 'rgba(255,  0,  0,0.5)', data: [KB.finger.RIGHT_INDEX]}, 
                {label: 'Right Middle', color: 'rgba(255,136,  0,0.5)', data: [KB.finger.RIGHT_MIDDLE]}, 
                {label: 'Right Ring',   color: 'rgba(255,255,  0,0.5)', data: [KB.finger.RIGHT_RING]}, 
                {label: 'Right Pinky',  color: 'rgba(  0,255,  0,0.5)', data: [KB.finger.RIGHT_PINKY]}
            ];
            displayData['Left Fingers vs Right Fingers vs Thumbs'] = [ 
                {label: 'Left Fingers', color: 'rgba(  0,  0,230,0.5)', data: [KB.finger.LEFT_PINKY,  KB.finger.LEFT_RING,   KB.finger.LEFT_MIDDLE,  KB.finger.LEFT_INDEX]}, 
                {label: 'Right Fingers',color: 'rgba(255,  0,  0,0.5)', data: [KB.finger.RIGHT_INDEX, KB.finger.RIGHT_MIDDLE, KB.finger.RIGHT_RING, KB.finger.RIGHT_PINKY]},
                {label: 'Thumbs',       color: 'rgba(204,204,204,0.5)', data: [KB.finger.LEFT_THUMB,KB.finger.RIGHT_THUMB]}
            ];
            displayData['Hand vs Hand'] = [ 
                {label: 'Left Hand', color: 'rgba(  0,  0,230,0.5)', data: [KB.finger.LEFT_PINKY,  KB.finger.LEFT_RING,   KB.finger.LEFT_MIDDLE,  KB.finger.LEFT_INDEX, KB.finger.LEFT_THUMB]}, 
                {label: 'Right Hand',color: 'rgba(255,  0,  0,0.5)', data: [KB.finger.RIGHT_INDEX, KB.finger.RIGHT_MIDDLE, KB.finger.RIGHT_RING, KB.finger.RIGHT_PINKY, KB.finger.RIGHT_THUMB]}
            ];
            displayData['Pinky vs Pinky'] = [ 
                {label: 'Left Pinky', color: 'rgba(  0,  0,230,0.5)', data: [KB.finger.LEFT_PINKY]}, 
                {label: 'Right Pinky',color: 'rgba(255,  0,  0,0.5)', data: [KB.finger.RIGHT_PINKY]}
            ];
            displayData['Ring vs Ring'] = [ 
                {label: 'Left Ring', color: 'rgba(  0,  0,230,0.5)', data: [KB.finger.LEFT_RING]}, 
                {label: 'Right Ring',color: 'rgba(255,  0,  0,0.5)', data: [KB.finger.RIGHT_RING]}
            ];
            displayData['Middle vs Middle'] = [ 
                {label: 'Left Middle', color: 'rgba(  0,  0,230,0.5)', data: [KB.finger.LEFT_MIDDLE]}, 
                {label: 'Right Middle',color: 'rgba(255,  0,  0,0.5)', data: [KB.finger.RIGHT_MIDDLE]}
            ];
            displayData['Index vs Index'] = [ 
                {label: 'Left Index', color: 'rgba(  0,  0,230,0.5)', data: [KB.finger.LEFT_INDEX]}, 
                {label: 'Right Index',color: 'rgba(255,  0,  0,0.5)', data: [KB.finger.RIGHT_INDEX]}
            ];
            displayData['Thumb vs Thumb'] = [ 
                {label: 'Left Thumb', color: 'rgba(  0,  0,230,0.5)', data: [KB.finger.LEFT_THUMB]}, 
                {label: 'Right Thumb',color: 'rgba(255,  0,  0,0.5)', data: [KB.finger.RIGHT_THUMB]}
            ];

            var rowDisplayData = {};
            rowDisplayData['All'] = [
                {label: 'Number Row',   color: 'rgba(  0,255,255,0.5)', data: [1]},
                {label: 'Top Row',      color: 'rgba(  0,  0,230,0.5)', data: [2]},
                {label: 'Home Row',     color: 'rgba(136,136,255,0.5)', data: [3]},
                {label: 'Bottom Row',   color: 'rgba(255,  0,255,0.5)', data: [4]},
                {label: 'Spacebar Row', color: 'rgba(255,255,255,0.5)', data: [5]}
            ];
            rowDisplayData['Number, Top, Home, Bottom'] = [
                {label: 'Number Row',   color: 'rgba(  0,255,255,0.5)', data: [1]},
                {label: 'Top Row',      color: 'rgba(  0,  0,230,0.5)', data: [2]},
                {label: 'Home Row',     color: 'rgba(136,136,255,0.5)', data: [3]},
                {label: 'Bottom Row',   color: 'rgba(255,  0,255,0.5)', data: [4]}
            ];
            rowDisplayData['Top, Home, Bottom'] = [
                {label: 'Top Row',      color: 'rgba(  0,  0,230,0.5)', data: [2]},
                {label: 'Home Row',     color: 'rgba(136,136,255,0.5)', data: [3]},
                {label: 'Bottom Row',   color: 'rgba(255,  0,255,0.5)', data: [4]}
            ];

            var unitConverter = function(rawVal, pixelsPerCm, unit) {
                var units = {};
                units["Centimeters"] = rawVal / pixelsPerCm;
                units["Meters"] = units["Centimeters"] * 0.01;
                units["Feet"] = units["Meters"] * 3.2808399;
                units["Miles"] = units["Meters"] * 0.000621371192;
                units['Key Presses'] = rawVal;
                return units[unit];
            }

            var displayFilter = function(displayType, unitType, rawSeriesData, displayData) {
                var idx, sIndex = 0, ii, jj, items, val,
                    seriesData = [], series,
                    labels = [], seriesLabels = [], allSeriesLabels = [],
                    colors = [], seriesColors = [];

                // separte out labels and colors
                for (ii = 0; ii < displayData[displayType].length; ii++) {
                    labels.push(displayData[displayType][ii].label);
                    colors.push(displayData[displayType][ii].color);
                }

                for (idx = 0; idx < rawSeriesData.length; idx++) {
                    allSeriesLabels.push( rawSeriesData[idx].label );
                    if (!rawSeriesData[idx].visible) continue;

                    series = [];
                    seriesLabels.push( rawSeriesData[idx].label );
                    seriesColors.push( rawSeriesData[idx].color );

                    for (ii = 0; ii < displayData[displayType].length; ii++) {
                        items = displayData[displayType][ii].data;
                        val = 0;
                        for (jj = 0; jj < items.length; jj++) {
                            val += rawSeriesData[idx].data[ items[jj]-1 ];
                        }
                        series.push(val);
                    }

                    var total = 0;
                    for (ii = 0; ii< series.length; ii++) {
                        total += series[ii];
                    }

                    for (ii = 0; ii< series.length; ii++) {
                        if ( unitType === 'Percent' ) {
                            series[ii] = (total > 0) ? (series[ii] / total) * 100 : 0;
                            series[ii] = (!isFinite(series[ii])) ? 0 : series[ii];
                        } else {
                            series[ii] = unitConverter(series[ii], analysis[idx].pixelsPerCm, unitType);
                        }
                    }
                    total = ( unitType === 'Percent' ) ? 100 : unitConverter(total, analysis[idx].pixelsPerCm, unitType);
                    series.total = total;
                    seriesData[sIndex] = series;
                    sIndex++;
                }
                seriesData.labels = labels;
                seriesData.colors = colors;
                seriesData.allSeriesLabels = allSeriesLabels;
                seriesData.seriesLabels = seriesLabels;
                seriesData.seriesColors = seriesColors;
                return seriesData;
            };


            var seriesColors = [
                'rgb(42, 66, 105)',
                'rgb(56, 88, 142)',
                'rgb(71, 111, 178)',
                'rgb(105, 139, 195)',
                'rgb(141, 167, 210)',
                'rgb(178, 195, 224)'
            ];
            var distSeriesData = [];
            var fuSeriesData = [];
            var rowSeriesData = [];
            var cfuSeriesData = [];
            var cfuidSeriesData = [];
            var chuSeriesData = [];
            var chuidSeriesData = [];
            var modSeriesData = [];
            var keyData = [];
            var ii, jj;

            for (ii = 0; ii < analysis.length; ii++) {
                keyData[ii] = [];
                for (jj = 0; jj < analysis[ii].keyData.length; jj++) {
                    var kData = {};
                    kData.count = analysis[ii].keyData[jj].count;
                    kData.cx = kLayouts[ii].keyMap[jj].cx;
                    kData.cy = kLayouts[ii].keyMap[jj].cy;
                    kData.primary = kLayouts[ii].keySet.keys[jj].primary;
                    kData.shift = kLayouts[ii].keySet.keys[jj].shift;
                    kData.altGr = kLayouts[ii].keySet.keys[jj].altGr;
                    kData.shiftAltGr = kLayouts[ii].keySet.keys[jj].shiftAltGr;
                    keyData[ii].push(kData);
                }
            }

            for (ii = 0; ii < analysis.length; ii++) {
                distSeriesData.push({
                    label: analysis[ii].layoutName,
                    color: seriesColors[ii],
                    data: analysis[ii].distance.slice(1),
                    visible: true
                });
                fuSeriesData.push({
                    label: analysis[ii].layoutName,
                    color: seriesColors[ii],
                    data: analysis[ii].fingerUsage.slice(1),
                    visible: true
                });
                rowSeriesData.push({
                    label: analysis[ii].layoutName,
                    color: seriesColors[ii],
                    data: analysis[ii].rowUsage.slice(0),
                    visible: true
                });
                cfuSeriesData.push({
                    label: analysis[ii].layoutName,
                    color: seriesColors[ii],
                    data: analysis[ii].consecFingerPress.slice(0),
                    visible: true
                });
                cfuidSeriesData.push({
                    label: analysis[ii].layoutName,
                    color: seriesColors[ii],
                    data: analysis[ii].consecFingerPressIgnoreDups.slice(0),
                    visible: true
                });
                chuSeriesData.push({
                    label: analysis[ii].layoutName,
                    color: seriesColors[ii],
                    data: analysis[ii].consecHandPress,
                    visible: true
                });
                chuidSeriesData.push({
                    label: analysis[ii].layoutName,
                    color: seriesColors[ii],
                    data: analysis[ii].consecHandPressIgnoreDups,
                    visible: true
                });
                modSeriesData.push({
                    label: analysis[ii].layoutName,
                    color: seriesColors[ii],
                    data: analysis[ii].modifierUse,
                    visible: true
                });
            }

            var cfuDisplayData = {};
            cfuDisplayData['nodups'] = [  
                {label: 'Left Pinky',   color: 'rgba(  0,255,255,0.5)', data: [KB.finger.LEFT_PINKY]},  
                {label: 'Left Ring',    color: 'rgba(  0,  0,230,0.5)', data: [KB.finger.LEFT_RING]},   
                {label: 'Left Middle',  color: 'rgba(136,136,255,0.5)', data: [KB.finger.LEFT_MIDDLE]},  
                {label: 'Left Index',   color: 'rgba(255,  0,255,0.5)', data: [KB.finger.LEFT_INDEX]}, 
                {label: 'Left Thumb',   color: 'rgba(255,255,255,0.5)', data: [KB.finger.LEFT_THUMB]},
                {label: 'Right Thumb',  color: 'rgba(204,204,204,0.5)', data: [KB.finger.RIGHT_THUMB]}, 
                {label: 'Right Index',  color: 'rgba(255,  0,  0,0.5)', data: [KB.finger.RIGHT_INDEX]}, 
                {label: 'Right Middle', color: 'rgba(255,136,  0,0.5)', data: [KB.finger.RIGHT_MIDDLE]}, 
                {label: 'Right Ring',   color: 'rgba(255,255,  0,0.5)', data: [KB.finger.RIGHT_RING]}, 
                {label: 'Right Pinky',  color: 'rgba(  0,255,  0,0.5)', data: [KB.finger.RIGHT_PINKY]} 
            ];
            cfuDisplayData['dups'] = cfuDisplayData['nodups'];

            var chuDisplayData = {};
            chuDisplayData['nodups'] = [  
                {label: 'Left Fingers', color: 'rgba(  0,  0,230,0.5)', data: ['left']}, 
                {label: 'Right Fingers',color: 'rgba(255,  0,  0,0.5)', data: ['right']},
                {label: 'Thumbs',       color: 'rgba(204,204,204,0.5)', data: ['thumbs']}
            ];
            chuDisplayData['dups'] = chuDisplayData['nodups'];

            var modDisplayData = {};
            modDisplayData['all'] = [  
                {label: 'Shift', color: 'rgba(  0,  0,230,0.5)', data: ['shift']}, 
                {label: 'AltGr', color: 'rgba(255,  0,  0,0.5)', data: ['altGr']},
                {label: 'Shift+AltGr',       color: 'rgba(204,204,204,0.5)', data: ['shiftAltGr']}
            ];

            var cfuDisplayFilter = function(displayType, unitType, rawSeriesData, displayData) {
                var idx, sIndex = 0, ii, jj, items, val,
                    seriesData = [], series,
                    labels = [], seriesLabels = [], allSeriesLabels = [],
                    colors = [], seriesColors = [];

                // separte out labels and colors
                for (ii = 0; ii < displayData[displayType].length; ii++) {
                    labels.push(displayData[displayType][ii].label);
                    colors.push(displayData[displayType][ii].color);
                }

                var rawData = rawSeriesData[displayType];
                for (idx = 0; idx < rawData.length; idx++) {
                    allSeriesLabels.push( rawData[idx].label );
                    if (!rawData[idx].visible) continue;

                    seriesLabels.push( rawData[idx].label );
                    seriesColors.push( rawData[idx].color );
                    series = rawData[idx].data.slice(1);

                    var total = 0;
                    for (ii = 0; ii< series.length; ii++) {
                        total += series[ii];
                    }

                    for (ii = 0; ii< series.length; ii++) {
                        if ( unitType === 'Percent' ) {
                            series[ii] = (total > 0) ? (series[ii] / total) * 100 : 0;
                            series[ii] = (!isFinite(series[ii])) ? 0 : series[ii];
                        } else {
                            series[ii] = unitConverter(series[ii], analysis[idx].pixelsPerCm, unitType);
                        }
                    }
                    total = ( unitType === 'Percent' ) ? 100 : unitConverter(total, analysis[idx].pixelsPerCm, unitType);
                    series.total = total;
                    seriesData[sIndex] = series;
                    sIndex++;
                }
                seriesData.labels = labels;
                seriesData.colors = colors;
                seriesData.allSeriesLabels = allSeriesLabels;
                seriesData.seriesLabels = seriesLabels;
                seriesData.seriesColors = seriesColors;
                return seriesData;
            }

            var chuDisplayFilter = function(displayType, unitType, rawSeriesData, displayData) {
                var idx, sIndex = 0, ii, jj, items, val,
                    seriesData = [], series,
                    labels = [], seriesLabels = [], allSeriesLabels = [],
                    colors = [], seriesColors = [];

                // separte out labels and colors
                for (ii = 0; ii < displayData[displayType].length; ii++) {
                    labels.push(displayData[displayType][ii].label);
                    colors.push(displayData[displayType][ii].color);
                }

                var rawData = rawSeriesData[displayType];
                for (idx = 0; idx < rawData.length; idx++) {
                    allSeriesLabels.push( rawData[idx].label );
                    if (!rawData[idx].visible) continue;

                    seriesLabels.push( rawData[idx].label );
                    seriesColors.push( rawData[idx].color );
                    series = [];
                    series[0] = rawData[idx].data['left'];
                    series[1] = rawData[idx].data['right'];
                    series[2] = rawData[idx].data['thumbs'];
                    series.visible = rawData[idx].visible;

                    var total = 0;
                    for (ii = 0; ii< series.length; ii++) {
                        total += series[ii];
                    }

                    for (ii = 0; ii< series.length; ii++) {
                        if ( unitType === 'Percent' ) {
                            series[ii] = (total > 0) ? (series[ii] / total) * 100 : 0;
                            series[ii] = (!isFinite(series[ii])) ? 0 : series[ii];
                        } else {
                            series[ii] = unitConverter(series[ii], analysis[idx].pixelsPerCm, unitType);
                        }
                    }
                    total = ( unitType === 'Percent' ) ? 100 : unitConverter(total, analysis[idx].pixelsPerCm, unitType);
                    series.total = total;
                    seriesData[sIndex] = series;
                    sIndex++;
                }
                seriesData.labels = labels;
                seriesData.colors = colors;
                seriesData.allSeriesLabels = allSeriesLabels;
                seriesData.seriesLabels = seriesLabels;
                seriesData.seriesColors = seriesColors;

                return seriesData;
            }

            var modDisplayFilter = function(displayType, unitType, rawSeriesData, displayData) {
                var idx, sIndex = 0, ii, jj, items, val,
                    seriesData = [], series,
                    labels = [], seriesLabels = [], allSeriesLabels = [],
                    colors = [], seriesColors = [];

                // separte out labels and colors
                for (ii = 0; ii < displayData[displayType].length; ii++) {
                    labels.push(displayData[displayType][ii].label);
                    colors.push(displayData[displayType][ii].color);
                }

                var rawData = rawSeriesData;
                for (idx = 0; idx < rawData.length; idx++) {
                    allSeriesLabels.push( rawData[idx].label );
                    if (!rawData[idx].visible) continue;

                    seriesLabels.push( rawData[idx].label );
                    seriesColors.push( rawData[idx].color );
                    series = [];
                    series[0] = rawData[idx].data['shift'];
                    series[1] = rawData[idx].data['altGr'];
                    series[2] = rawData[idx].data['shiftAltGr'];
                    series.visible = rawData[idx].visible;

                    var total = 0;
                    for (ii = 0; ii< series.length; ii++) {
                        total += series[ii];
                    }

                    for (ii = 0; ii< series.length; ii++) {
                        if ( unitType === 'Percent' ) {
                            series[ii] = (total > 0) ? (series[ii] / total) * 100 : 0;
                            series[ii] = (!isFinite(series[ii])) ? 0 : series[ii];
                        } else {
                            series[ii] = unitConverter(series[ii], analysis[idx].pixelsPerCm, unitType);
                        }
                    }
                    total = ( unitType === 'Percent' ) ? 100 : unitConverter(total, analysis[idx].pixelsPerCm, unitType);
                    series.total = total;
                    seriesData[sIndex] = series;
                    sIndex++;
                }
                seriesData.labels = labels;
                seriesData.colors = colors;
                seriesData.allSeriesLabels = allSeriesLabels;
                seriesData.seriesLabels = seriesLabels;
                seriesData.seriesColors = seriesColors;

                return seriesData;
            }

            // --------------------------------------------------------------------
            // Show results

            library.set('distance', {
                rawSeriesData: distSeriesData,
                displayFilter: displayFilter,
                displayType: 'All',
                displayData: displayData,
                units: 'Centimeters',
                allowedUnits: ['Centimeters', 'Meters', 'Feet', 'Miles', 'Percent']
            });

            library.set('fingerUsage', {
                rawSeriesData: fuSeriesData,
                displayFilter: displayFilter,
                displayType: 'All',
                displayData: displayData,
                units: 'Key Presses',
                allowedUnits: ['Key Presses', 'Percent']
            });

            library.set('rowUsage', {
                rawSeriesData: rowSeriesData,
                displayFilter: displayFilter,
                displayType: 'All',
                displayData: rowDisplayData,
                units: 'Key Presses',
                allowedUnits: ['Key Presses', 'Percent']
            });

            library.set('consecFingerPress', {
                rawSeriesData: {
                    'nodups': cfuSeriesData,
                    'dups': cfuidSeriesData,
                    0: {visible: true},
                    1: {visible: true},
                    2: {visible: true},
                    3: {visible: true},
                    4: {visible: true},
                    5: {visible: true},
                    length: 6
                },
                displayFilter: cfuDisplayFilter,
                displayType: 'nodups',
                displayData: cfuDisplayData,
                units: 'Key Presses',
                allowedUnits: ['Key Presses', 'Percent']
            });

            library.set('consecHandPress', {
                rawSeriesData: {
                    'nodups': chuSeriesData,
                    'dups': chuidSeriesData,
                    0: {visible: true},
                    1: {visible: true},
                    2: {visible: true},
                    3: {visible: true},
                    4: {visible: true},
                    5: {visible: true},
                    length: 6
                },
                displayFilter: chuDisplayFilter,
                displayType: 'nodups',
                displayData: chuDisplayData,
                units: 'Key Presses',
                allowedUnits: ['Key Presses', 'Percent']
            });

            library.set('modifierUse', {
                rawSeriesData: modSeriesData,
                displayFilter: modDisplayFilter,
                displayType: 'all',
                displayData: modDisplayData,
                units: 'Key Presses',
                allowedUnits: ['Key Presses', 'Percent']
            });

            library.set('layouts', kLayouts);
            library.set('keyData', keyData);

            return true;
        };

        return me;
	}

]);
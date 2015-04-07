"use strict";
/*
    This file defines the basic elements of the KB name space
    
*/

var KB = KB || {}; // define namespace

KB.PRIME_PUSH = 0;
KB.SHIFT_PUSH = 1;
KB.ALTGR_PUSH = 2;
KB.SHIFT_ALTGR_PUSH = 3;
KB.PUSH_TYPES = {};
KB.PUSH_TYPES[KB.PRIME_PUSH] = "primary"; 
KB.PUSH_TYPES[KB.SHIFT_PUSH] = "shift"; 
KB.PUSH_TYPES[KB.ALTGR_PUSH] = "altGr";
KB.PUSH_TYPES[KB.SHIFT_ALTGR_PUSH] = "shiftAltGr";

KB.finger = {};
KB.finger.color = {};

KB.finger.NONE =        -1;
KB.finger.LEFT_PINKY =   1;
KB.finger.LEFT_RING =    2;
KB.finger.LEFT_MIDDLE =  3;
KB.finger.LEFT_INDEX =   4;
KB.finger.LEFT_THUMB =   5;
KB.finger.RIGHT_THUMB =  6;
KB.finger.RIGHT_INDEX =  7;
KB.finger.RIGHT_MIDDLE = 8;
KB.finger.RIGHT_RING =   9;
KB.finger.RIGHT_PINKY =  10;
KB.finger.BOTH_THUMBS =  11;

KB.fingers = {};
KB.fingers[KB.finger.LEFT_PINKY] =   "Left Pinky";
KB.fingers[KB.finger.LEFT_RING] =    "Left Ring";
KB.fingers[KB.finger.LEFT_MIDDLE] =  "Left Middle";
KB.fingers[KB.finger.LEFT_INDEX] =   "Left Index";
KB.fingers[KB.finger.LEFT_THUMB] =   "Left Thumb";
KB.fingers[KB.finger.RIGHT_THUMB] =  "Right Thumb";
KB.fingers[KB.finger.RIGHT_INDEX] =  "Right Index";
KB.fingers[KB.finger.RIGHT_MIDDLE] = "Right Middle";
KB.fingers[KB.finger.RIGHT_RING] =   "Right Ring";
KB.fingers[KB.finger.RIGHT_PINKY] =  "Right Pinky";

KB.finger.color[KB.finger.NONE] =           {r:255, g:255, b:255, a: 0.5};
KB.finger.color[KB.finger.LEFT_PINKY] =     {r:  0, g:255, b:255, a: 0.5};//"rgba(  0, 255, 255, 0.5)";//"#00FFFF";
KB.finger.color[KB.finger.LEFT_RING] =      {r:  0, g:  0, b:230, a: 0.5};//"rgba(  0,   0, 255, 0.5)";//"#0000FF";
KB.finger.color[KB.finger.LEFT_MIDDLE] =    {r:136, g:136, b:255, a: 0.5};//"rgba(136, 136, 255, 0.5)";//"#8888FF";78, 56, 126
KB.finger.color[KB.finger.LEFT_INDEX] =     {r:255, g:  0, b:255, a: 0.5};//"rgba(255,   0, 255, 0.5)";//"#FF00FF";
KB.finger.color[KB.finger.LEFT_THUMB] =     {r:255, g:255, b:255, a: 0.5};//"rgba(255, 255, 255, 0.5)";//"#ffffff";
KB.finger.color[KB.finger.RIGHT_THUMB] =    {r:204, g:204, b:204, a: 0.5};//"rgba(204, 204, 204, 0.5)";//"#cccccc";
KB.finger.color[KB.finger.RIGHT_INDEX] =    {r:255, g:  0, b:  0, a: 0.5};//"rgba(255,   0,   0, 0.5)";//"#FF0000";
KB.finger.color[KB.finger.RIGHT_MIDDLE] =   {r:255, g:136, b:  0, a: 0.5};//"rgba(255, 136,   0, 0.5)";//"#FF8800";
KB.finger.color[KB.finger.RIGHT_RING] =     {r:255, g:255, b:  0, a: 0.5};//"rgba(255, 255,   0, 0.5)";//"#FFFF00";
KB.finger.color[KB.finger.RIGHT_PINKY] =    {r:  0, g:255, b:  0, a: 0.5};//"rgba(  0, 255,   0, 0.5)";//"#00FF00";
KB.finger.color[KB.finger.BOTH_THUMBS] =    {r:255, g:255, b:255, a: 0.5};//"rgba(255, 255, 255, 0.5)";//"#ffffff";

KB.finger.colorHoverOpacity = {};
KB.finger.colorHoverOpacity[KB.finger.NONE] =           1;
KB.finger.colorHoverOpacity[KB.finger.LEFT_PINKY] =     1;
KB.finger.colorHoverOpacity[KB.finger.LEFT_RING] =      0.15;
KB.finger.colorHoverOpacity[KB.finger.LEFT_MIDDLE] =    0.5;
KB.finger.colorHoverOpacity[KB.finger.LEFT_INDEX] =     0.35;
KB.finger.colorHoverOpacity[KB.finger.LEFT_THUMB] =     1;
KB.finger.colorHoverOpacity[KB.finger.RIGHT_THUMB] =    1;
KB.finger.colorHoverOpacity[KB.finger.RIGHT_INDEX] =    0.25;
KB.finger.colorHoverOpacity[KB.finger.RIGHT_MIDDLE] =   0.5;
KB.finger.colorHoverOpacity[KB.finger.RIGHT_RING] =     0.5;
KB.finger.colorHoverOpacity[KB.finger.RIGHT_PINKY] =    0.5;
KB.finger.colorHoverOpacity[KB.finger.BOTH_THUMBS] =    1;

KB.finger.getColor = function(finger, opacity) {
    var r = KB.finger.color[finger].r,
        g = KB.finger.color[finger].g,
        b = KB.finger.color[finger].b;
    return "rgba("+r+","+g+", "+b+", "+opacity+")";
};

KB.finger.getColorHoverOpacity = function(finger) {
    return KB.finger.colorHoverOpacity[finger];
};
KB.finger.getColorNormalOpacity = function(finger) {
    return KB.finger.color[finger].a;
};

KB.finger.isThumb = function(finger) {
    switch(finger) {
        case KB.finger.RIGHT_THUMB:
        case KB.finger.LEFT_THUMB:
            return true;
    }
    return false;
};

KB.finger.whichHand = function(finger) {
    switch(finger) {
        case KB.finger.LEFT_PINKY:
        case KB.finger.LEFT_RING:
        case KB.finger.LEFT_MIDDLE:
        case KB.finger.LEFT_INDEX:
        case KB.finger.LEFT_THUMB:
            return "left";
        case KB.finger.RIGHT_PINKY:
        case KB.finger.RIGHT_RING:
        case KB.finger.RIGHT_MIDDLE:
        case KB.finger.RIGHT_INDEX:
        case KB.finger.RIGHT_THUMB:
            return "right";            
        case KB.finger.NONE:
            return "none";
        case KB.finger.BOTH_THUMBS:
            return "both";
    }
    return "none";
};

KB.finger.leftRightOrThumb = function(finger) {
    switch(finger) {
        case KB.finger.LEFT_PINKY:
        case KB.finger.LEFT_RING:
        case KB.finger.LEFT_MIDDLE:
        case KB.finger.LEFT_INDEX:
            return "left";
        case KB.finger.RIGHT_PINKY:
        case KB.finger.RIGHT_RING:
        case KB.finger.RIGHT_MIDDLE:
        case KB.finger.RIGHT_INDEX:
            return "right";
        case KB.finger.LEFT_THUMB:
        case KB.finger.RIGHT_THUMB:
        return "thumbs";
        case KB.finger.NONE:
            return "none";
        case KB.finger.BOTH_THUMBS:
            return "both";
    }
    return "none";
};

KB.glyphLayouts = {};
KB.glyphLayouts.standard = {};
KB.glyphLayouts.standard.getCoords = function(id, type, keyCode, fontSize, coords) {
    return KB.glyphLayouts.standard[type](keyCode, fontSize, coords);
};
 
KB.glyphLayouts.standard[KB.PRIME_PUSH] = function(keyCode,fontSize,coords) {
    var width = coords[1].x - coords[0].x,
        padding = fontSize*0.4;//width * 0.1;
        
    return {
        x: coords[3].x + padding,
        y:coords[3].y - padding/2,
        textAlign: "left",
        textBaseline: "bottom"
    };
};
KB.glyphLayouts.standard[KB.SHIFT_PUSH] = function(keyCode,fontSize,coords) {
    var width = coords[1].x - coords[0].x,
        padding = fontSize*0.4;//width * 0.1;
    return {
        x: coords[0].x + padding,
        y:coords[0].y + padding/2,
        textAlign: "left",
        textBaseline: "top"
    };
};
KB.glyphLayouts.standard[KB.ALTGR_PUSH] = function(keyCode,fontSize,coords) {
    var width = coords[1].x - coords[0].x,
        padding = fontSize*0.4;//width * 0.1;
    return {
        x: coords[2].x - padding,
        y:coords[2].y - padding/2,
        textAlign: "right",
        textBaseline: "bottom"
    };
};
KB.glyphLayouts.standard[KB.SHIFT_ALTGR_PUSH] = function(keyCode,fontSize,coords) {
    var width = coords[1].x - coords[0].x,
        padding = fontSize*0.4;//width * 0.1;
    return {
        x: coords[1].x - padding,
        y:coords[1].y + padding/2,
        textAlign: "right",
        textBaseline: "top"
    };
};

// ----------------------------------------------------------------------------
// European

KB.glyphLayouts.european = {};
KB.glyphLayouts.european.getCoords = function(id, type, keyCode, fontSize, coords) {
    return KB.glyphLayouts.european[type](keyCode, fontSize, coords);
};
 
KB.glyphLayouts.european[KB.PRIME_PUSH] = function(keyCode,fontSize,coords) {
    var width = coords[1].x - coords[0].x,
        padding = fontSize*0.4;//width * 0.1;
        
    return {
        x: coords[3].x + padding,
        y:coords[3].y - padding/2,
        textAlign: "left",
        textBaseline: "bottom"
    };
};
KB.glyphLayouts.european[KB.SHIFT_PUSH] = function(keyCode,fontSize,coords) {
    var width = coords[1].x - coords[0].x,
        padding = fontSize*0.4;//width * 0.1;
    return {
        x: coords[0].x + padding,
        y:coords[0].y + padding/2,
        textAlign: "left",
        textBaseline: "top"
    };
};
KB.glyphLayouts.european[KB.ALTGR_PUSH] = function(keyCode,fontSize,coords) {
    var width = coords[1].x - coords[0].x,
        padding = fontSize*0.4;//width * 0.1;
    return {
        x: coords[2].x - padding,
        y:coords[2].y - padding/2,
        textAlign: "right",
        textBaseline: "bottom"
    };
};
KB.glyphLayouts.european[KB.SHIFT_ALTGR_PUSH] = function(keyCode,fontSize,coords) {
    var width = coords[1].x - coords[0].x,
        padding = fontSize*0.4;//width * 0.1;
    return {
        x: coords[1].x - padding,
        y:coords[1].y + padding/2,
        textAlign: "right",
        textBaseline: "top"
    };
};

// ----------------------------------------------------------------------------
// European

KB.glyphLayouts.ergodox = {};
KB.glyphLayouts.ergodox.getCoords = function(id, type, keyCode, fontSize, coords) {
    return KB.glyphLayouts.ergodox[type](keyCode, fontSize, coords);
};
 
KB.glyphLayouts.ergodox[KB.PRIME_PUSH] = function(keyCode,fontSize,coords) {
    var width = coords[1].x - coords[0].x,
        padding = fontSize*0.4;//width * 0.1;
        
    return {
        x: coords[3].x + padding,
        y:coords[3].y - padding/2,
        textAlign: "left",
        textBaseline: "bottom"
    };
};
KB.glyphLayouts.ergodox[KB.SHIFT_PUSH] = function(keyCode,fontSize,coords) {
    var width = coords[1].x - coords[0].x,
        padding = fontSize*0.4;//width * 0.1;
    return {
        x: coords[0].x + padding,
        y:coords[0].y + padding/2,
        textAlign: "left",
        textBaseline: "top"
    };
};
KB.glyphLayouts.ergodox[KB.ALTGR_PUSH] = function(keyCode,fontSize,coords) {
    var width = coords[1].x - coords[0].x,
        padding = fontSize*0.4;//width * 0.1;
    return {
        x: coords[2].x - padding,
        y:coords[2].y - padding/2,
        textAlign: "right",
        textBaseline: "bottom"
    };
};
KB.glyphLayouts.ergodox[KB.SHIFT_ALTGR_PUSH] = function(keyCode,fontSize,coords) {
    var width = coords[1].x - coords[0].x,
        padding = fontSize*0.4;//width * 0.1;
    return {
        x: coords[1].x - padding,
        y:coords[1].y + padding/2,
        textAlign: "right",
        textBaseline: "top"
    };
};


KB.keySet = {};
KB.keySet.standard = {};

// ----------------------------------------------------------------------------
// standard QWERTY
// ----------------------------------------------------------------------------

KB.keySet.standard.qwerty = {
    label: "QWERTY",
    author: 'Patrick Gillespie',
    moreInfoUrl: "https://en.wikipedia.org/wiki/QWERTY", 
    moreInfoText: "Wikipedia Entry",
    fingerStart: {},
    keyboardType: "standard",
    keys: [ 
	    {primary:"`",   shift:"~",  finger:KB.finger.LEFT_PINKY},//0
	    {primary:"1",   shift:"!",  finger:KB.finger.LEFT_PINKY},//1
	    {primary:"2",   shift:"@",  finger:KB.finger.LEFT_RING},//2
	    {primary:"3",   shift:"#",  finger:KB.finger.LEFT_MIDDLE},//3
	    {primary:"4",   shift:"$",  finger:KB.finger.LEFT_INDEX},//4
	    {primary:"5",   shift:"%",  finger:KB.finger.LEFT_INDEX},//5
	    {primary:"6",   shift:"^",  finger:KB.finger.RIGHT_INDEX},//6
	    {primary:"7",   shift:"&",  finger:KB.finger.RIGHT_INDEX},//7
	    {primary:"8",   shift:"*",  finger:KB.finger.RIGHT_MIDDLE},//8
	    {primary:"9",   shift:"(",  finger:KB.finger.RIGHT_RING},//9
	    {primary:"0",   shift:")",  finger:KB.finger.RIGHT_PINKY},//10
	    {primary:"-",   shift:"_",  finger:KB.finger.RIGHT_PINKY},//11
	    {primary:"=",   shift:"+",  finger:KB.finger.RIGHT_PINKY},//12
	    {primary:8,                 finger:KB.finger.RIGHT_PINKY},//13
	
	    {primary:9,                 finger:KB.finger.LEFT_PINKY},//14
	    {primary:"q",   shift:"Q",  finger:KB.finger.LEFT_PINKY},//15
	    {primary:"w",   shift:"W",  finger:KB.finger.LEFT_RING},//16
	    {primary:"e",   shift:"E",  finger:KB.finger.LEFT_MIDDLE},//17
	    {primary:"r",   shift:"R",  finger:KB.finger.LEFT_INDEX},//18
	    {primary:"t",   shift:"T",  finger:KB.finger.LEFT_INDEX},//19
	    {primary:"y",   shift:"Y",  finger:KB.finger.RIGHT_INDEX},//20
	    {primary:"u",   shift:"U",  finger:KB.finger.RIGHT_INDEX},//21
	    {primary:"i",   shift:"I",  finger:KB.finger.RIGHT_MIDDLE},//22
	    {primary:"o",   shift:"O",  finger:KB.finger.RIGHT_RING},//23
	    {primary:"p",   shift:"P",  finger:KB.finger.RIGHT_PINKY},//24
	    {primary:"[",   shift:"{",  finger:KB.finger.RIGHT_PINKY},//25
	    {primary:"]",   shift:"}",  finger:KB.finger.RIGHT_PINKY},//26
	    {primary:"\\",  shift:"|",  finger:KB.finger.RIGHT_PINKY},//27
	    
	    {primary:20,               finger:KB.finger.LEFT_PINKY},//28
	    {primary:"a",  shift:"A",  finger:KB.finger.LEFT_PINKY},//29
	    {primary:"s",  shift:"S",  finger:KB.finger.LEFT_RING},//30
	    {primary:"d",  shift:"D",  finger:KB.finger.LEFT_MIDDLE},//31
	    {primary:"f",  shift:"F",  finger:KB.finger.LEFT_INDEX},//32
	    {primary:"g",  shift:"G",  finger:KB.finger.LEFT_INDEX},//33
	    {primary:"h",  shift:"H",  finger:KB.finger.RIGHT_INDEX},//34
	    {primary:"j",  shift:"J",  finger:KB.finger.RIGHT_INDEX},//35
	    {primary:"k",  shift:"K",  finger:KB.finger.RIGHT_MIDDLE},//36
	    {primary:"l",  shift:"L",  finger:KB.finger.RIGHT_RING},//37
	    {primary:";",  shift:":",  finger:KB.finger.RIGHT_PINKY},//38
	    {primary:"'",  shift:'"',  finger:KB.finger.RIGHT_PINKY},//39
	    {primary:"\r",               finger:KB.finger.RIGHT_PINKY},//40
	    
	    {primary:16,               finger:KB.finger.LEFT_PINKY},//41
	    {primary:"z",  shift:"Z",  finger:KB.finger.LEFT_PINKY},//42
	    {primary:"x",  shift:"X",  finger:KB.finger.LEFT_RING},//43
	    {primary:"c",  shift:"C",  finger:KB.finger.LEFT_MIDDLE},//44
	    {primary:"v",  shift:"V",  finger:KB.finger.LEFT_INDEX},//45
	    {primary:"b",  shift:"B",  finger:KB.finger.LEFT_INDEX},//46
	    {primary:"n",  shift:"N",  finger:KB.finger.RIGHT_INDEX},//47
	    {primary:"m",  shift:"M",  finger:KB.finger.RIGHT_INDEX},//48
	    {primary:",",  shift:"<",  finger:KB.finger.RIGHT_MIDDLE},//49
	    {primary:".",  shift:">",  finger:KB.finger.RIGHT_RING},//50
	    {primary:"/",  shift:"?",  finger:KB.finger.RIGHT_PINKY},//51
	    {primary:-16,              finger:KB.finger.RIGHT_PINKY},//52
	    
	    {primary:17,               finger:KB.finger.LEFT_THUMB},//53
	    {primary:-91,              finger:KB.finger.LEFT_THUMB},//54
	    {primary:18,               finger:KB.finger.LEFT_THUMB},//55
	    {primary:" ",              finger:KB.finger.LEFT_THUMB},//56
	    {primary:-18,              finger:KB.finger.RIGHT_THUMB},//57
	    {primary:-91,              finger:KB.finger.RIGHT_THUMB},//58
	    {primary:-93,              finger:KB.finger.RIGHT_THUMB},//59
	    {primary:17,               finger:KB.finger.RIGHT_THUMB}//60
    ]
};

// ----------------------------------------------------------------------------


// ----------------------------------------------------------------------------
// standard Simplified Dvorak
// ----------------------------------------------------------------------------

KB.keySet.standard.simplifiedDvorak = {
    label: "Simplified Dvorak",
    author: 'Patrick Gillespie',
    moreInfoUrl: "https://en.wikipedia.org/wiki/Dvorak_Simplified_Keyboard", 
    moreInfoText: "Wikipedia Entry",
    fingerStart: {},
    keyboardType: "standard",
    keys: [
        {primary:"`",   shift:"~",  finger:KB.finger.LEFT_PINKY},//0
        {primary:"1",   shift:"!",  finger:KB.finger.LEFT_PINKY},
        {primary:"2",   shift:"@",  finger:KB.finger.LEFT_RING},
        {primary:"3",   shift:"#",  finger:KB.finger.LEFT_MIDDLE},
        {primary:"4",   shift:"$",  finger:KB.finger.LEFT_INDEX},
        {primary:"5",   shift:"%",  finger:KB.finger.LEFT_INDEX},
        {primary:"6",   shift:"^",  finger:KB.finger.RIGHT_INDEX},
        {primary:"7",   shift:"&",  finger:KB.finger.RIGHT_INDEX},
        {primary:"8",   shift:"*",  finger:KB.finger.RIGHT_MIDDLE},
        {primary:"9",   shift:"(",  finger:KB.finger.RIGHT_RING},
        {primary:"0",   shift:")",  finger:KB.finger.RIGHT_PINKY},
        {primary:"[",   shift:"{",  finger:KB.finger.RIGHT_PINKY},
        {primary:"]",   shift:"}",  finger:KB.finger.RIGHT_PINKY},
        {primary:8,                 finger:KB.finger.RIGHT_PINKY},//13
    
        {primary:9,                 finger:KB.finger.LEFT_PINKY},//14
        {primary:"'",   shift:'"',  finger:KB.finger.LEFT_PINKY},
        {primary:",",   shift:"<",  finger:KB.finger.LEFT_RING},
        {primary:".",   shift:">",  finger:KB.finger.LEFT_MIDDLE},
        {primary:"p",   shift:"P",  finger:KB.finger.LEFT_INDEX},
        {primary:"y",   shift:"Y",  finger:KB.finger.LEFT_INDEX},
        {primary:"f",   shift:"F",  finger:KB.finger.RIGHT_INDEX},
        {primary:"g",   shift:"G",  finger:KB.finger.RIGHT_INDEX},
        {primary:"c",   shift:"C",  finger:KB.finger.RIGHT_MIDDLE},
        {primary:"r",   shift:"R",  finger:KB.finger.RIGHT_RING},
        {primary:"l",   shift:"L",  finger:KB.finger.RIGHT_PINKY},
        {primary:"/",   shift:"?",  finger:KB.finger.RIGHT_PINKY},
        {primary:"=",   shift:"+",  finger:KB.finger.RIGHT_PINKY},
        {primary:"\\",  shift:"|",  finger:KB.finger.RIGHT_PINKY},//27
        
        {primary:20,               finger:KB.finger.LEFT_PINKY},//28
        {primary:"a",  shift:"A",  finger:KB.finger.LEFT_PINKY},
        {primary:"o",  shift:"O",  finger:KB.finger.LEFT_RING},
        {primary:"e",  shift:"E",  finger:KB.finger.LEFT_MIDDLE},
        {primary:"u",  shift:"U",  finger:KB.finger.LEFT_INDEX},
        {primary:"i",  shift:"I",  finger:KB.finger.LEFT_INDEX},
        {primary:"d",  shift:"D",  finger:KB.finger.RIGHT_INDEX},
        {primary:"h",  shift:"H",  finger:KB.finger.RIGHT_INDEX},
        {primary:"t",  shift:"T",  finger:KB.finger.RIGHT_MIDDLE},
        {primary:"n",  shift:"N",  finger:KB.finger.RIGHT_RING},
        {primary:"s",  shift:"S",  finger:KB.finger.RIGHT_PINKY},
        {primary:"-",  shift:"_",  finger:KB.finger.RIGHT_PINKY},
        {primary:"\r",               finger:KB.finger.RIGHT_PINKY},//40
        
        {primary:16,               finger:KB.finger.LEFT_PINKY},//41
        {primary:";",  shift:":",  finger:KB.finger.LEFT_PINKY},
        {primary:"q",  shift:"Q",  finger:KB.finger.LEFT_RING},
        {primary:"j",  shift:"J",  finger:KB.finger.LEFT_MIDDLE},
        {primary:"k",  shift:"K",  finger:KB.finger.LEFT_INDEX},
        {primary:"x",  shift:"X",  finger:KB.finger.LEFT_INDEX},
        {primary:"b",  shift:"B",  finger:KB.finger.RIGHT_INDEX},
        {primary:"m",  shift:"M",  finger:KB.finger.RIGHT_INDEX},
        {primary:"w",  shift:"W",  finger:KB.finger.RIGHT_MIDDLE},
        {primary:"v",  shift:"V",  finger:KB.finger.RIGHT_RING},
        {primary:"z",  shift:"Z",  finger:KB.finger.RIGHT_PINKY},
        {primary:-16,              finger:KB.finger.RIGHT_PINKY},//52
        
        {primary:17,               finger:KB.finger.LEFT_THUMB},//53
        {primary:-91,              finger:KB.finger.LEFT_THUMB},
        {primary:18,               finger:KB.finger.LEFT_THUMB},
        {primary:" ",              finger:KB.finger.LEFT_THUMB},
        {primary:-18,              finger:KB.finger.RIGHT_THUMB},
        {primary:-91,              finger:KB.finger.RIGHT_THUMB},
        {primary:-93,              finger:KB.finger.RIGHT_THUMB},
        {primary:17,               finger:KB.finger.RIGHT_THUMB}//60
    ]
};

// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// standard Colemak
// ----------------------------------------------------------------------------

KB.keySet.standard.colemak = {
    label: "Colemak",
    author: 'Patrick Gillespie',
    moreInfoUrl: "http://colemak.com/", 
    moreInfoText: "colemak.com",
    fingerStart: {},
    keyboardType: "standard",
    keys: [
        {primary:"`",   shift:"~",  finger:KB.finger.LEFT_PINKY},//0
        {primary:"1",   shift:"!",  finger:KB.finger.LEFT_PINKY},
        {primary:"2",   shift:"@",  finger:KB.finger.LEFT_RING},
        {primary:"3",   shift:"#",  finger:KB.finger.LEFT_MIDDLE},
        {primary:"4",   shift:"$",  finger:KB.finger.LEFT_INDEX},
        {primary:"5",   shift:"%",  finger:KB.finger.LEFT_INDEX},
        {primary:"6",   shift:"^",  finger:KB.finger.RIGHT_INDEX},
        {primary:"7",   shift:"&",  finger:KB.finger.RIGHT_INDEX},
        {primary:"8",   shift:"*",  finger:KB.finger.RIGHT_MIDDLE},
        {primary:"9",   shift:"(",  finger:KB.finger.RIGHT_RING},
        {primary:"0",   shift:")",  finger:KB.finger.RIGHT_PINKY},
        {primary:"-",   shift:"_",  finger:KB.finger.RIGHT_PINKY},
        {primary:"=",   shift:"+",  finger:KB.finger.RIGHT_PINKY},
        {primary:8,                 finger:KB.finger.RIGHT_PINKY},//13
    
        {primary:9,                 finger:KB.finger.LEFT_PINKY},//14
        {primary:"q",   shift:"Q",  finger:KB.finger.LEFT_PINKY},
        {primary:"w",   shift:"W",  finger:KB.finger.LEFT_RING},
        {primary:"f",   shift:"F",  finger:KB.finger.LEFT_MIDDLE},
        {primary:"p",   shift:"P",  finger:KB.finger.LEFT_INDEX},
        {primary:"g",   shift:"G",  finger:KB.finger.LEFT_INDEX},
        {primary:"j",   shift:"J",  finger:KB.finger.RIGHT_INDEX},
        {primary:"l",   shift:"L",  finger:KB.finger.RIGHT_INDEX},
        {primary:"u",   shift:"U",  finger:KB.finger.RIGHT_MIDDLE},
        {primary:"y",   shift:"Y",  finger:KB.finger.RIGHT_RING},
        {primary:";",   shift:":",  finger:KB.finger.RIGHT_PINKY},
        {primary:"[",   shift:"{",  finger:KB.finger.RIGHT_PINKY},
        {primary:"]",   shift:"}",  finger:KB.finger.RIGHT_PINKY},
        {primary:"\\",  shift:"|",  finger:KB.finger.RIGHT_PINKY},//27
        
        {primary:8 ,               finger:KB.finger.LEFT_PINKY},//28
        {primary:"a",  shift:"A",  finger:KB.finger.LEFT_PINKY},
        {primary:"r",  shift:"R",  finger:KB.finger.LEFT_RING},
        {primary:"s",  shift:"S",  finger:KB.finger.LEFT_MIDDLE},
        {primary:"t",  shift:"T",  finger:KB.finger.LEFT_INDEX},
        {primary:"d",  shift:"D",  finger:KB.finger.LEFT_INDEX},
        {primary:"h",  shift:"H",  finger:KB.finger.RIGHT_INDEX},
        {primary:"n",  shift:"N",  finger:KB.finger.RIGHT_INDEX},
        {primary:"e",  shift:"E",  finger:KB.finger.RIGHT_MIDDLE},
        {primary:"i",  shift:"I",  finger:KB.finger.RIGHT_RING},
        {primary:"o",  shift:"O",  finger:KB.finger.RIGHT_PINKY},
        {primary:"'",  shift:'"',  finger:KB.finger.RIGHT_PINKY},
        {primary:"\r",               finger:KB.finger.RIGHT_PINKY},//40
        
        {primary:16,               finger:KB.finger.LEFT_PINKY},//41
        {primary:"z",  shift:"Z",  finger:KB.finger.LEFT_PINKY},
        {primary:"x",  shift:"X",  finger:KB.finger.LEFT_RING},
        {primary:"c",  shift:"C",  finger:KB.finger.LEFT_MIDDLE},
        {primary:"v",  shift:"V",  finger:KB.finger.LEFT_INDEX},
        {primary:"b",  shift:"B",  finger:KB.finger.LEFT_INDEX},
        {primary:"k",  shift:"K",  finger:KB.finger.RIGHT_INDEX},
        {primary:"m",  shift:"M",  finger:KB.finger.RIGHT_INDEX},
        {primary:",",  shift:"<",  finger:KB.finger.RIGHT_MIDDLE},
        {primary:".",  shift:">",  finger:KB.finger.RIGHT_RING},
        {primary:"/",  shift:"?",  finger:KB.finger.RIGHT_PINKY},
        {primary:-16,              finger:KB.finger.RIGHT_PINKY},//52
        
        {primary:17,               finger:KB.finger.LEFT_THUMB},//53
        {primary:-91,              finger:KB.finger.LEFT_THUMB},
        {primary:18,               finger:KB.finger.LEFT_THUMB},
        {primary:" ",              finger:KB.finger.LEFT_THUMB},
        {primary:-18,              finger:KB.finger.RIGHT_THUMB},
        {primary:-91,              finger:KB.finger.RIGHT_THUMB},
        {primary:-93,              finger:KB.finger.RIGHT_THUMB},
        {primary:17,               finger:KB.finger.RIGHT_THUMB}//60
    ]
};

// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// standard Capewell
// ----------------------------------------------------------------------------

KB.keySet.standard.capewell = {
    label: "Capewell",
    author: 'Patrick Gillespie',
    moreInfoUrl: "http://www.michaelcapewell.com/projects/keyboard/", 
    moreInfoText: "michaelcapewell.com",
    fingerStart: {},
    keyboardType: "standard",
    keys: [
        {primary:"`",   shift:"~",  finger:KB.finger.LEFT_PINKY},//0
        {primary:"1",   shift:"!",  finger:KB.finger.LEFT_PINKY},
        {primary:"2",   shift:"@",  finger:KB.finger.LEFT_RING},
        {primary:"3",   shift:"#",  finger:KB.finger.LEFT_MIDDLE},
        {primary:"4",   shift:"$",  finger:KB.finger.LEFT_INDEX},
        {primary:"5",   shift:"%",  finger:KB.finger.LEFT_INDEX},
        {primary:"6",   shift:"^",  finger:KB.finger.RIGHT_INDEX},
        {primary:"7",   shift:"&",  finger:KB.finger.RIGHT_INDEX},
        {primary:"8",   shift:"*",  finger:KB.finger.RIGHT_MIDDLE},
        {primary:"9",   shift:"(",  finger:KB.finger.RIGHT_RING},
        {primary:"0",   shift:")",  finger:KB.finger.RIGHT_PINKY},
        {primary:"[",   shift:"{",  finger:KB.finger.RIGHT_PINKY},
        {primary:"]",   shift:"}",  finger:KB.finger.RIGHT_PINKY},
        {primary:8,                 finger:KB.finger.RIGHT_PINKY},//13
    
        {primary:9,                 finger:KB.finger.LEFT_PINKY},//14
        {primary:".",   shift:">",  finger:KB.finger.LEFT_PINKY},
        {primary:"y",   shift:"Y",  finger:KB.finger.LEFT_RING},
        {primary:"w",   shift:"W",  finger:KB.finger.LEFT_MIDDLE},
        {primary:"d",   shift:"D",  finger:KB.finger.LEFT_INDEX},
        {primary:"f",   shift:"F",  finger:KB.finger.LEFT_INDEX},
        {primary:"j",   shift:"J",  finger:KB.finger.RIGHT_INDEX},
        {primary:"p",   shift:"P",  finger:KB.finger.RIGHT_INDEX},
        {primary:"l",   shift:"L",  finger:KB.finger.RIGHT_MIDDLE},
        {primary:"u",   shift:"U",  finger:KB.finger.RIGHT_RING},
        {primary:"q",   shift:"Q",  finger:KB.finger.RIGHT_PINKY},
        {primary:"/",   shift:"?",  finger:KB.finger.RIGHT_PINKY},
        {primary:"=",   shift:"+",  finger:KB.finger.RIGHT_PINKY},
        {primary:"\\",  shift:"|",  finger:KB.finger.RIGHT_PINKY},//27
        
        {primary:20,               finger:KB.finger.LEFT_PINKY},//28
        {primary:"a",  shift:"A",  finger:KB.finger.LEFT_PINKY},
        {primary:"e",  shift:"E",  finger:KB.finger.LEFT_RING},
        {primary:"r",  shift:"R",  finger:KB.finger.LEFT_MIDDLE},
        {primary:"s",  shift:"S",  finger:KB.finger.LEFT_INDEX},
        {primary:"g",  shift:"G",  finger:KB.finger.LEFT_INDEX},
        {primary:"b",  shift:"B",  finger:KB.finger.RIGHT_INDEX},
        {primary:"t",  shift:"T",  finger:KB.finger.RIGHT_INDEX},
        {primary:"n",  shift:"N",  finger:KB.finger.RIGHT_MIDDLE},
        {primary:"i",  shift:"I",  finger:KB.finger.RIGHT_RING},
        {primary:"o",  shift:"O",  finger:KB.finger.RIGHT_PINKY},
        {primary:"-",  shift:"_",  finger:KB.finger.RIGHT_PINKY},
        {primary:"\r",               finger:KB.finger.RIGHT_PINKY},//40
        
        {primary:16,               finger:KB.finger.LEFT_PINKY},//41
        {primary:"x",  shift:"X",  finger:KB.finger.LEFT_PINKY},
        {primary:"z",  shift:"Z",  finger:KB.finger.LEFT_RING},
        {primary:"c",  shift:"C",  finger:KB.finger.LEFT_MIDDLE},
        {primary:"v",  shift:"V",  finger:KB.finger.LEFT_INDEX},
        {primary:";",  shift:":",  finger:KB.finger.LEFT_INDEX},
        {primary:"k",  shift:"K",  finger:KB.finger.RIGHT_INDEX},
        {primary:"m",  shift:"M",  finger:KB.finger.RIGHT_INDEX},
        {primary:"h",  shift:"H",  finger:KB.finger.RIGHT_MIDDLE},
        {primary:",",  shift:"<",  finger:KB.finger.RIGHT_RING},
        {primary:"'",  shift:'"',  finger:KB.finger.RIGHT_PINKY},
        {primary:-16,              finger:KB.finger.RIGHT_PINKY},//52
        
        {primary:17,               finger:KB.finger.LEFT_THUMB},//53
        {primary:-91,              finger:KB.finger.LEFT_THUMB},
        {primary:18,               finger:KB.finger.LEFT_THUMB},
        {primary:" ",              finger:KB.finger.LEFT_THUMB},
        {primary:-18,              finger:KB.finger.RIGHT_THUMB},
        {primary:-91,              finger:KB.finger.RIGHT_THUMB},
        {primary:-93,              finger:KB.finger.RIGHT_THUMB},
        {primary:17,               finger:KB.finger.RIGHT_THUMB}//60
    ]
};

// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// standard Programmer Dvorak
// ----------------------------------------------------------------------------

KB.keySet.standard.programmerDvorak = {
    label: "Programmer Dvorak",
    author: 'Patrick Gillespie',
    moreInfoUrl: "http://www.kaufmann.no/roland/dvorak/", 
    moreInfoText: "kaufmann.no",
    fingerStart: {},
    keyboardType: "standard",
    keys: [
        {primary:"$",   shift:"~",  finger:KB.finger.LEFT_PINKY},//0
        {primary:"&",   shift:"%",  finger:KB.finger.LEFT_PINKY},
        {primary:"[",   shift:"7",  finger:KB.finger.LEFT_RING},
        {primary:"{",   shift:"5",  finger:KB.finger.LEFT_MIDDLE},
        {primary:"}",   shift:"3",  finger:KB.finger.LEFT_INDEX},
        {primary:"(",   shift:"1",  finger:KB.finger.LEFT_INDEX},
        {primary:"=",   shift:"9",  finger:KB.finger.RIGHT_INDEX},
        {primary:"*",   shift:"0",  finger:KB.finger.RIGHT_INDEX},
        {primary:")",   shift:"2",  finger:KB.finger.RIGHT_MIDDLE},
        {primary:"+",   shift:"4",  finger:KB.finger.RIGHT_RING},
        {primary:"]",   shift:"6",  finger:KB.finger.RIGHT_PINKY},
        {primary:"!",   shift:"8",  finger:KB.finger.RIGHT_PINKY},
        {primary:"#",   shift:"`",  finger:KB.finger.RIGHT_PINKY},
        {primary:8,                 finger:KB.finger.RIGHT_PINKY},//13
    
        {primary:9,                 finger:KB.finger.LEFT_PINKY},//14
        {primary:";",   shift:':',  finger:KB.finger.LEFT_PINKY},
        {primary:",",   shift:"<",  finger:KB.finger.LEFT_RING},
        {primary:".",   shift:">",  finger:KB.finger.LEFT_MIDDLE},
        {primary:"p",   shift:"P",  finger:KB.finger.LEFT_INDEX},
        {primary:"y",   shift:"Y",  finger:KB.finger.LEFT_INDEX},
        {primary:"f",   shift:"F",  finger:KB.finger.RIGHT_INDEX},
        {primary:"g",   shift:"G",  finger:KB.finger.RIGHT_INDEX},
        {primary:"c",   shift:"C",  finger:KB.finger.RIGHT_MIDDLE},
        {primary:"r",   shift:"R",  finger:KB.finger.RIGHT_RING},
        {primary:"l",   shift:"L",  finger:KB.finger.RIGHT_PINKY},
        {primary:"/",   shift:"?",  finger:KB.finger.RIGHT_PINKY},
        {primary:"@",   shift:"^",  finger:KB.finger.RIGHT_PINKY},
        {primary:"\\",  shift:"|",  finger:KB.finger.RIGHT_PINKY},//27
        
        {primary:20,               finger:KB.finger.LEFT_PINKY},//28
        {primary:"a",  shift:"A",  finger:KB.finger.LEFT_PINKY},
        {primary:"o",  shift:"O",  finger:KB.finger.LEFT_RING},
        {primary:"e",  shift:"E",  finger:KB.finger.LEFT_MIDDLE},
        {primary:"u",  shift:"U",  finger:KB.finger.LEFT_INDEX},
        {primary:"i",  shift:"I",  finger:KB.finger.LEFT_INDEX},
        {primary:"d",  shift:"D",  finger:KB.finger.RIGHT_INDEX},
        {primary:"h",  shift:"H",  finger:KB.finger.RIGHT_INDEX},
        {primary:"t",  shift:"T",  finger:KB.finger.RIGHT_MIDDLE},
        {primary:"n",  shift:"N",  finger:KB.finger.RIGHT_RING},
        {primary:"s",  shift:"S",  finger:KB.finger.RIGHT_PINKY},
        {primary:"-",  shift:"_",  finger:KB.finger.RIGHT_PINKY},
        {primary:"\r",               finger:KB.finger.RIGHT_PINKY},//40
        
        {primary:16,               finger:KB.finger.LEFT_PINKY},//41
        {primary:"'",  shift:'"',  finger:KB.finger.LEFT_PINKY},
        {primary:"q",  shift:"Q",  finger:KB.finger.LEFT_RING},
        {primary:"j",  shift:"J",  finger:KB.finger.LEFT_MIDDLE},
        {primary:"k",  shift:"K",  finger:KB.finger.LEFT_INDEX},
        {primary:"x",  shift:"X",  finger:KB.finger.LEFT_INDEX},
        {primary:"b",  shift:"B",  finger:KB.finger.RIGHT_INDEX},
        {primary:"m",  shift:"M",  finger:KB.finger.RIGHT_INDEX},
        {primary:"w",  shift:"W",  finger:KB.finger.RIGHT_MIDDLE},
        {primary:"v",  shift:"V",  finger:KB.finger.RIGHT_RING},
        {primary:"z",  shift:"Z",  finger:KB.finger.RIGHT_PINKY},
        {primary:-16,              finger:KB.finger.RIGHT_PINKY},//52
        
        {primary:17,               finger:KB.finger.LEFT_THUMB},//53
        {primary:-91,              finger:KB.finger.LEFT_THUMB},
        {primary:18,               finger:KB.finger.LEFT_THUMB},
        {primary:" ",              finger:KB.finger.LEFT_THUMB},
        {primary:-18,              finger:KB.finger.RIGHT_THUMB},
        {primary:-91,              finger:KB.finger.RIGHT_THUMB},
        {primary:-93,              finger:KB.finger.RIGHT_THUMB},
        {primary:17,               finger:KB.finger.RIGHT_THUMB}//60
    ]
};

// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// standard Programmer Dvorak
// ----------------------------------------------------------------------------

KB.keySet.standard.russian = {
    "label":"Russian layout with / moved",
    author: 'George B.',
    moreInfoUrl: "", 
    moreInfoText: "None",
    "fingerStart": {
        "1":29,
        "2":30,
        "3":31,
        "4":32,
        "5":56,
        "6":56,
        "7":35,
        "8":36,
        "9":37,
        "10":38,
        "11":56,
        "false":-1
      },
      "keyboardType":"standard",
      "keys":[
        {"primary":1105,    "shift":1025,   "finger":1, "id":0, "altGr":-1, "shiftAltGr":-1},
        {"primary":49,"shift":33,"finger":1,"id":1,"altGr":-1,"shiftAltGr":-1},
        {"primary":50,"shift":34,"finger":2,"id":2,"altGr":-1,"shiftAltGr":-1},
        {"primary":51,"shift":8470,"finger":3,"id":3,"altGr":-1,"shiftAltGr":-1},
        {"primary":52,"shift":59,"finger":4,"id":4,"altGr":-1,"shiftAltGr":-1},
        {"primary":53,"shift":37,"finger":4,"id":5,"altGr":-1,"shiftAltGr":-1},
        {"primary":54,"shift":58,"finger":7,"id":6,"altGr":-1,"shiftAltGr":-1},
        {"primary":55,"shift":63,"finger":7,"id":7,"altGr":-1,"shiftAltGr":-1},
        {"primary":56,"shift":42,"finger":8,"id":8,"altGr":-1,"shiftAltGr":-1},
        {"primary":57,"shift":40,"finger":9,"id":9,"altGr":-1,"shiftAltGr":-1},
        {"primary":48,"shift":41,"finger":10,"id":10,"altGr":-1,"shiftAltGr":-1},
        {"primary":45,"shift":95,"finger":10,"id":11,"altGr":-1,"shiftAltGr":-1},
        {"primary":61,"shift":43,"finger":10,"id":12,"altGr":-1,"shiftAltGr":-1},
        {"primary":8,"finger":10,"id":13,"shift":-1,"altGr":-1,"shiftAltGr":-1},
        {"primary":9,"finger":1,"id":14},
        {"primary":1081,"shift":1049,"finger":1,"id":15,"altGr":-1,"shiftAltGr":-1},
        {"primary":1094,"shift":1062,"finger":2,"id":16,"altGr":-1,"shiftAltGr":-1},
        {"primary":1091,"shift":1059,"finger":3,"id":17,"altGr":-1,"shiftAltGr":-1},
        {"primary":1082,"shift":1050,"finger":4,"id":18,"altGr":-1,"shiftAltGr":-1},
        {"primary":1077,"shift":1045,"finger":4,"id":19,"altGr":-1,"shiftAltGr":-1},
        {"primary":1085,"shift":1053,"finger":7,"id":20,"altGr":-1,"shiftAltGr":-1},
        {"primary":1075,"shift":1043,"finger":7,"id":21,"altGr":-1,"shiftAltGr":-1},
        {"primary":1096,"shift":1064,"finger":8,"id":22,"altGr":-1,"shiftAltGr":-1},
        {"primary":1097,"shift":1065,"finger":9,"id":23,"altGr":-1,"shiftAltGr":-1},
        {"primary":1079,"shift":1047,"finger":10,"id":24,"altGr":-1,"shiftAltGr":-1},
        {"primary":1093,"shift":1061,"finger":10,"id":25,"altGr":-1,"shiftAltGr":-1},
        {"primary":1098,"shift":1066,"finger":10,"id":26,"altGr":-1,"shiftAltGr":-1},
        {"primary":47,"shift":92,"finger":10,"id":27,"altGr":-1,"shiftAltGr":-1},
        {"primary":20,"finger":1,"id":28,"shift":-1,"altGr":-1,"shiftAltGr":-1},
        {"primary":1092,"shift":1060,"finger":1,"id":29,"altGr":-1,"shiftAltGr":-1},
        {"primary":1099,"shift":1067,"finger":2,"id":30,"altGr":-1,"shiftAltGr":-1},
        {"primary":1074,"shift":1042,"finger":3,"id":31,"altGr":-1,"shiftAltGr":-1},
        {"primary":1072,"shift":1040,"finger":4,"id":32,"altGr":-1,"shiftAltGr":-1},
        {"primary":1087,"shift":1055,"finger":4,"id":33,"altGr":-1,"shiftAltGr":-1},
        {"primary":1088,"shift":1056,"finger":7,"id":34,"altGr":-1,"shiftAltGr":-1},
        {"primary":1086,"shift":1054,"finger":7,"id":35,"altGr":-1,"shiftAltGr":-1},
        {"primary":1083,"shift":1051,"finger":8,"id":36,"altGr":-1,"shiftAltGr":-1},
        {"primary":1076,"shift":1044,"finger":9,"id":37,"altGr":-1,"shiftAltGr":-1},
        {"primary":1078,"shift":1046,"finger":10,"id":38,"altGr":-1,"shiftAltGr":-1},
        {"primary":1101,"shift":1069,"finger":10,"id":39,"altGr":-1,"shiftAltGr":-1},
        {"primary":13,"finger":10,"id":40},
        {"primary":16,"finger":1,"id":41},
        {"primary":1103,"shift":1071,"finger":1,"id":42,"altGr":-1,"shiftAltGr":-1},
        {"primary":1095,"shift":1063,"finger":2,"id":43,"altGr":-1,"shiftAltGr":-1},
        {"primary":1089,"shift":1057,"finger":3,"id":44,"altGr":-1,"shiftAltGr":-1},
        {"primary":1084,"shift":1052,"finger":4,"id":45,"altGr":-1,"shiftAltGr":-1},
        {"primary":1048,"shift":1080,"finger":4,"id":46,"altGr":-1,"shiftAltGr":-1},
        {"primary":1090,"shift":1058,"finger":7,"id":47,"altGr":-1,"shiftAltGr":-1},
        {"primary":1100,"shift":1068,"finger":7,"id":48,"altGr":-1,"shiftAltGr":-1},
        {"primary":1073,"shift":1041,"finger":8,"id":49,"altGr":-1,"shiftAltGr":-1},
        {"primary":1102,"shift":1070,"finger":9,"id":50,"altGr":-1,"shiftAltGr":-1},
        {"primary":46,"shift":44,"finger":10,"id":51,"altGr":-1,"shiftAltGr":-1},
        {"primary":-16,"finger":10,"id":52},
        {"primary":17,"finger":5,"id":53},
        {"primary":-91,"finger":5,"id":54},
        {"primary":18,"finger":5,"id":55},
        {"primary":32,"finger":5,"id":56},
        {"primary":-18,"finger":6,"id":57},
        {"primary":-91,"finger":6,"id":58},
        {"primary":-93,"finger":6,"id":59,"shift":-1,"altGr":-1,"shiftAltGr":-1},
        {"primary":17,"finger":6,"id":60}
    ]
};   


// ----------------------------------------------------------------------------

// Key Map

KB.keyMap = {};
KB.keyMap.standard = {};

// 50 pixels = 1.9cm
// 26.315789 pixels = 1cm
KB.keyMap.standard.s683_225 = {};
KB.keyMap.standard.s683_225.width = 754;//756
KB.keyMap.standard.s683_225.height = 252;//254
KB.keyMap.standard.s683_225.pixelsPerCm = 26.315789;
(function() {
    var ii,
        km = KB.keyMap.standard.s683_225,
        normKeySize = 50,
        row,
        keyCount = [14,14,13,12,8],
        index = 0,
        curX = 0.5,//2.5
        curY = 0.5,//2.5
        keyWidths = {};
        
    km.leftX = curX;
    km.leftY = curY;
        
    // special key sizes
    keyWidths["0,13"] = 102;//
    keyWidths["1,0"] = 76;//
    keyWidths["1,13"] = 76;//
    keyWidths["2,0"] = 89;//
    keyWidths["2,12"] = 113;//
    keyWidths["3,0"] = 116;//
    keyWidths["3,11"] = 136;//
    keyWidths["4,0"] = 76;//
    keyWidths["4,2"] = 76;//
    keyWidths["4,3"] = 298;//
    keyWidths["4,4"] = 76;//
    keyWidths["4,7"] = 76;//
        
    for (row = 0; row < 5; row++) {
        for (ii = 0; ii < keyCount[row]; ii++) {
            km[index] = {};
            km[index].x = curX;
            km[index].y = curY;
            km[index].w = keyWidths[row+","+ii] || normKeySize;
            km[index].h = normKeySize;
            km[index].cx = km[index].x + (km[index].w/2);
            km[index].cy = km[index].y + (km[index].h/2);
            km[index].row = row;
            
            // set the mount points - these are points where dialogs will attach to keys
            // all our keys are squares, so this is simple
            km[index].mountPoint = {};
            km[index].mountPoint["top"] = {};
            km[index].mountPoint["right"] = {};
            km[index].mountPoint["bottom"] = {};
            km[index].mountPoint["left"] = {};
            
            km[index].mountPoint["top"].x = km[index].x + (km[index].w/2);
            km[index].mountPoint["top"].y = km[index].y;
            km[index].mountPoint["right"].x = km[index].x + km[index].w;
            km[index].mountPoint["right"].y = km[index].y + (km[index].h/2);
            km[index].mountPoint["bottom"].x = km[index].x + (km[index].w/2);
            km[index].mountPoint["bottom"].y = km[index].y + km[index].h;
            km[index].mountPoint["left"].x = km[index].x;
            km[index].mountPoint["left"].y = km[index].y + (km[index].h/2);
            
            curX += km[index].w;
            index++;
        }
        curX = 0.5;//2.5
        curY += normKeySize;
    }
})();

// ----------------------------------------------------------------------------
// European Layout Support
// ----------------------------------------------------------------------------

KB.keySet.european = {};

KB.keySet.european.qwerty = {
    label: "QWERTY",
    author: 'Patrick Gillespie',
    moreInfoUrl: "http://en.wikipedia.org/wiki/Qwerty", 
    moreInfoText: "Wikipedia Entry",
    fingerStart: {},
    keyboardType: "european",
    keys: [ 
	    {primary:"`",   shift:172,  finger:KB.finger.LEFT_PINKY},//0
	    {primary:"1",   shift:"!",  finger:KB.finger.LEFT_PINKY},//1
	    {primary:"2",   shift:'"',  finger:KB.finger.LEFT_RING},//2
	    {primary:"3",   shift:163,  finger:KB.finger.LEFT_MIDDLE},//3
	    {primary:"4",   shift:"$",  finger:KB.finger.LEFT_INDEX},//4
	    {primary:"5",   shift:"%",  finger:KB.finger.LEFT_INDEX},//5
	    {primary:"6",   shift:"^",  finger:KB.finger.RIGHT_INDEX},//6
	    {primary:"7",   shift:"&",  finger:KB.finger.RIGHT_INDEX},//7
	    {primary:"8",   shift:"*",  finger:KB.finger.RIGHT_MIDDLE},//8
	    {primary:"9",   shift:"(",  finger:KB.finger.RIGHT_RING},//9
	    {primary:"0",   shift:")",  finger:KB.finger.RIGHT_PINKY},//10
	    {primary:"-",   shift:"_",  finger:KB.finger.RIGHT_PINKY},//11
	    {primary:"=",   shift:"+",  finger:KB.finger.RIGHT_PINKY},//12
	    {primary:8,                 finger:KB.finger.RIGHT_PINKY},//13
	
	    {primary:9,                 finger:KB.finger.LEFT_PINKY},//14
	    {primary:"q",   shift:"Q",  finger:KB.finger.LEFT_PINKY},//15
	    {primary:"w",   shift:"W",  finger:KB.finger.LEFT_RING},//16
	    {primary:"e",   shift:"E",  finger:KB.finger.LEFT_MIDDLE},//17
	    {primary:"r",   shift:"R",  finger:KB.finger.LEFT_INDEX},//18
	    {primary:"t",   shift:"T",  finger:KB.finger.LEFT_INDEX},//19
	    {primary:"y",   shift:"Y",  finger:KB.finger.RIGHT_INDEX},//20
	    {primary:"u",   shift:"U",  finger:KB.finger.RIGHT_INDEX},//21
	    {primary:"i",   shift:"I",  finger:KB.finger.RIGHT_MIDDLE},//22
	    {primary:"o",   shift:"O",  finger:KB.finger.RIGHT_RING},//23
	    {primary:"p",   shift:"P",  finger:KB.finger.RIGHT_PINKY},//24
	    {primary:"[",   shift:"{",  finger:KB.finger.RIGHT_PINKY},//25
	    {primary:"]",   shift:"}",  finger:KB.finger.RIGHT_PINKY},//26
	    {primary:"\r",  finger:KB.finger.RIGHT_PINKY},//27
	    
	    {primary:20,               finger:KB.finger.LEFT_PINKY},//28
	    {primary:"a",  shift:"A",  finger:KB.finger.LEFT_PINKY},//29
	    {primary:"s",  shift:"S",  finger:KB.finger.LEFT_RING},//30
	    {primary:"d",  shift:"D",  finger:KB.finger.LEFT_MIDDLE},//31
	    {primary:"f",  shift:"F",  finger:KB.finger.LEFT_INDEX},//32
	    {primary:"g",  shift:"G",  finger:KB.finger.LEFT_INDEX},//33
	    {primary:"h",  shift:"H",  finger:KB.finger.RIGHT_INDEX},//34
	    {primary:"j",  shift:"J",  finger:KB.finger.RIGHT_INDEX},//35
	    {primary:"k",  shift:"K",  finger:KB.finger.RIGHT_MIDDLE},//36
	    {primary:"l",  shift:"L",  finger:KB.finger.RIGHT_RING},//37
	    {primary:";",  shift:":",  finger:KB.finger.RIGHT_PINKY},//38
	    {primary:"'",  shift:"@",  finger:KB.finger.RIGHT_PINKY},//39
        {primary:"#",  shift:'~',  finger:KB.finger.RIGHT_PINKY},//39
	    
	    
	    {primary:16,               finger:KB.finger.LEFT_PINKY},//41
	    {primary:"|",  shift:"\\", finger:KB.finger.LEFT_PINKY},//42
        {primary:"z",  shift:"Z",  finger:KB.finger.LEFT_PINKY},//42
	    {primary:"x",  shift:"X",  finger:KB.finger.LEFT_RING},//43
	    {primary:"c",  shift:"C",  finger:KB.finger.LEFT_MIDDLE},//44
	    {primary:"v",  shift:"V",  finger:KB.finger.LEFT_INDEX},//45
	    {primary:"b",  shift:"B",  finger:KB.finger.LEFT_INDEX},//46
	    {primary:"n",  shift:"N",  finger:KB.finger.RIGHT_INDEX},//47
	    {primary:"m",  shift:"M",  finger:KB.finger.RIGHT_INDEX},//48
	    {primary:",",  shift:"<",  finger:KB.finger.RIGHT_MIDDLE},//49
	    {primary:".",  shift:">",  finger:KB.finger.RIGHT_RING},//50
	    {primary:"/",  shift:"?",  finger:KB.finger.RIGHT_PINKY},//51
	    {primary:-16,              finger:KB.finger.RIGHT_PINKY},//52
	    
	    {primary:17,               finger:KB.finger.LEFT_THUMB},//53
	    {primary:-91,              finger:KB.finger.LEFT_THUMB},//54
	    {primary:18,               finger:KB.finger.LEFT_THUMB},//55
	    {primary:" ",              finger:KB.finger.LEFT_THUMB},//56
	    {primary:-18,              finger:KB.finger.RIGHT_THUMB},//57
	    {primary:-91,              finger:KB.finger.RIGHT_THUMB},//58
	    {primary:-93,              finger:KB.finger.RIGHT_THUMB},//59
	    {primary:17,               finger:KB.finger.RIGHT_THUMB}//60
    ]
};

// ----------------------------------------------------------------------------
// european AZERTY
// ----------------------------------------------------------------------------

KB.keySet.european.azerty = {
   "label":"AZERTY",
   "fingerStart":{
      "1":29,
      "2":30,
      "3":31,
      "4":32,
      "5":57,
      "6":57,
      "7":35,
      "8":36,
      "9":37,
      "10":38,
      "11":57,
      "false":-1
   },
   "keyboardType":"european",
   "author":"Jean-François Moser",
   "moreInfoText":"Wikipedia Entry",
   "moreInfoUrl":"http://en.wikipedia.org/wiki/AZERTY",
   "keys":[
      {"primary":178,   "shift":-1,     "finger":1,     "id":0,     "altGr":-1,     "shiftAltGr":-1},
      {"primary":38,    "shift":49,     "finger":1,     "id":1,     "altGr":-1,     "shiftAltGr":-1},
      {"primary":233,   "shift":50,     "finger":2,     "id":2,     "altGr":126,    "shiftAltGr":-1},
      {"primary":34,    "shift":51,     "finger":3,     "id":3,     "altGr":35,     "shiftAltGr":-1},
      {"primary":39,    "shift":52,     "finger":4,     "id":4,     "altGr":123,    "shiftAltGr":-1},
      {"primary":40,    "shift":53,     "finger":4,     "id":5,     "altGr":91,     "shiftAltGr":-1},
      {"primary":45,    "shift":54,     "finger":7,     "id":6,     "altGr":124,    "shiftAltGr":-1},
      {"primary":232,   "shift":55,     "finger":7,     "id":7,     "altGr":96,     "shiftAltGr":-1},
      {"primary":95,    "shift":56,     "finger":8,     "id":8,     "altGr":92,     "shiftAltGr":-1},
      {"primary":231,   "shift":57,     "finger":9,     "id":9,     "altGr":94,     "shiftAltGr":-1},
      {"primary":224,   "shift":48,     "finger":10,    "id":10,    "altGr":64,     "shiftAltGr":-1},
      {"primary":41,    "shift":176,    "finger":10,    "id":11,    "altGr":93,     "shiftAltGr":-1},
      {"primary":61,    "shift":43,     "finger":10,    "id":12,    "altGr":125,    "shiftAltGr":-1},
      {"primary":8,     "finger":10,    "id":13},
      {"primary":9,     "finger":1,     "id":14},
      {"primary":97,    "shift":65,     "finger":1,     "id":15,    "altGr":-1,     "shiftAltGr":-1},
      {"primary":122,   "shift":90,     "finger":2,     "id":16,    "altGr":-1,     "shiftAltGr":-1},
      {"primary":101,   "shift":69,     "finger":3,     "id":17,    "altGr":8364,   "shiftAltGr":-1},
      {"primary":114,   "shift":82,     "finger":4,     "id":18},
      {"primary":116,   "shift":84,     "finger":4,     "id":19},
      {"primary":121,   "shift":89,     "finger":7,     "id":20},
      {"primary":117,   "shift":85,     "finger":7,     "id":21},
      {"primary":105,   "shift":73,     "finger":8,     "id":22},
      {"primary":111,   "shift":79,     "finger":9,     "id":23},
      {"primary":112,   "shift":80,     "finger":10,    "id":24},
      {"primary":94,    "shift":168,    "finger":10,    "id":25,    "altGr":-1,     "shiftAltGr":-1},
      {"primary":36,    "shift":163,    "finger":10,    "id":26,    "altGr":164,    "shiftAltGr":-1},
      {"primary":13,    "finger":10,    "id":27},
      {"primary":20,    "finger":1,     "id":28},
      {"primary":113,   "shift":81,     "finger":1,     "id":29,    "altGr":-1,     "shiftAltGr":-1},
      {"primary":115,   "shift":83,     "finger":2,     "id":30,    "altGr":-1,     "shiftAltGr":-1},
      {"primary":100,   "shift":68,     "finger":3,     "id":31},
      {"primary":102,   "shift":70,     "finger":4,     "id":32},
      {"primary":103,   "shift":71,     "finger":4,     "id":33},
      {"primary":104,   "shift":72,     "finger":7,     "id":34},
      {"primary":106,   "shift":74,     "finger":7,     "id":35},
      {"primary":107,   "shift":75,     "finger":8,     "id":36},
      {"primary":108,   "shift":76,     "finger":9,     "id":37},
      {"primary":109,   "shift":77,     "finger":10,    "id":38,    "altGr":-1,     "shiftAltGr":-1},
      {"primary":249,   "shift":37,     "finger":10,    "id":39,    "altGr":-1,     "shiftAltGr":-1},
      {"primary":42,    "shift":181,    "finger":10,    "id":40,    "altGr":-1,     "shiftAltGr":-1},
      {"primary":16,    "finger":1,     "id":41},
      {"primary":60,    "shift":62,     "finger":1,     "id":42,    "altGr":-1,     "shiftAltGr":-1},
      {"primary":119,   "shift":87,     "finger":1,     "id":43,    "altGr":-1,     "shiftAltGr":-1},
      {"primary":120,   "shift":88,     "finger":2,     "id":44},
      {"primary":99,    "shift":67,     "finger":3,     "id":45},
      {"primary":118,   "shift":86,     "finger":4,     "id":46},
      {"primary":98,    "shift":66,     "finger":4,     "id":47},
      {"primary":110,   "shift":78,     "finger":7,     "id":48},
      {"primary":44,    "shift":63,     "finger":7,     "id":49,    "altGr":-1,     "shiftAltGr":-1},
      {"primary":59,    "shift":46,     "finger":8,     "id":50,    "altGr":-1,     "shiftAltGr":-1},
      {"primary":58,    "shift":47,     "finger":9,     "id":51,    "altGr":-1,     "shiftAltGr":-1},
      {"primary":33,    "shift":167,    "finger":10,    "id":52,    "altGr":-1,     "shiftAltGr":-1},
      {"primary":-16,   "finger":10,    "id":53},
      {"primary":17,    "finger":5,     "id":54},
      {"primary":-91,   "finger":5,     "id":55},
      {"primary":18,    "finger":5,     "id":56},
      {"primary":32,    "finger":5,     "id":57},
      {"primary":-18,   "finger":6,     "id":58},
      {"primary":-91,   "finger":6,     "id":59},
      {"primary":-93,   "finger":6,     "id":60,        "shift":-1,     "altGr":-1, "shiftAltGr":-1
      },
      {"primary":17,    "finger":6,     "id":61}
   ]
}


// ----------------------------------------------------------------------------
// european Simplified Dvorak
// ----------------------------------------------------------------------------

KB.keySet.european.simplifiedDvorak = {
    label: "Simplified Dvorak",
    author: 'Patrick Gillespie',
    authorUrl: '',
    fingerStart: {},
    keyboardType: "european",
    keys: [
        {primary:"`",   shift:172,  finger:KB.finger.LEFT_PINKY},//0
        {primary:"1",   shift:"!",  finger:KB.finger.LEFT_PINKY},
        {primary:"2",   shift:'"',  finger:KB.finger.LEFT_RING},
        {primary:"3",   shift:163,  finger:KB.finger.LEFT_MIDDLE},
        {primary:"4",   shift:"$",  finger:KB.finger.LEFT_INDEX},
        {primary:"5",   shift:"%",  finger:KB.finger.LEFT_INDEX},
        {primary:"6",   shift:"^",  finger:KB.finger.RIGHT_INDEX},
        {primary:"7",   shift:"&",  finger:KB.finger.RIGHT_INDEX},
        {primary:"8",   shift:"*",  finger:KB.finger.RIGHT_MIDDLE},
        {primary:"9",   shift:"(",  finger:KB.finger.RIGHT_RING},
        {primary:"0",   shift:")",  finger:KB.finger.RIGHT_PINKY},
        {primary:"[",   shift:"{",  finger:KB.finger.RIGHT_PINKY},
        {primary:"]",   shift:"}",  finger:KB.finger.RIGHT_PINKY},
        {primary:8,                 finger:KB.finger.RIGHT_PINKY},//13
    
        {primary:9,                 finger:KB.finger.LEFT_PINKY},//14
        {primary:"'",   shift:'@',  finger:KB.finger.LEFT_PINKY},
        {primary:",",   shift:"<",  finger:KB.finger.LEFT_RING},
        {primary:".",   shift:">",  finger:KB.finger.LEFT_MIDDLE},
        {primary:"p",   shift:"P",  finger:KB.finger.LEFT_INDEX},
        {primary:"y",   shift:"Y",  finger:KB.finger.LEFT_INDEX},
        {primary:"f",   shift:"F",  finger:KB.finger.RIGHT_INDEX},
        {primary:"g",   shift:"G",  finger:KB.finger.RIGHT_INDEX},
        {primary:"c",   shift:"C",  finger:KB.finger.RIGHT_MIDDLE},
        {primary:"r",   shift:"R",  finger:KB.finger.RIGHT_RING},
        {primary:"l",   shift:"L",  finger:KB.finger.RIGHT_PINKY},
        {primary:"/",   shift:"?",  finger:KB.finger.RIGHT_PINKY},
        {primary:"=",   shift:"+",  finger:KB.finger.RIGHT_PINKY},
        {primary:"\r",  finger:KB.finger.RIGHT_PINKY},//27
        
        {primary:20,               finger:KB.finger.LEFT_PINKY},//28
        {primary:"a",  shift:"A",  finger:KB.finger.LEFT_PINKY},
        {primary:"o",  shift:"O",  finger:KB.finger.LEFT_RING},
        {primary:"e",  shift:"E",  finger:KB.finger.LEFT_MIDDLE},
        {primary:"u",  shift:"U",  finger:KB.finger.LEFT_INDEX},
        {primary:"i",  shift:"I",  finger:KB.finger.LEFT_INDEX},
        {primary:"d",  shift:"D",  finger:KB.finger.RIGHT_INDEX},
        {primary:"h",  shift:"H",  finger:KB.finger.RIGHT_INDEX},
        {primary:"t",  shift:"T",  finger:KB.finger.RIGHT_MIDDLE},
        {primary:"n",  shift:"N",  finger:KB.finger.RIGHT_RING},
        {primary:"s",  shift:"S",  finger:KB.finger.RIGHT_PINKY},
        {primary:"-",  shift:"_",  finger:KB.finger.RIGHT_PINKY},
        {primary:"\r",               finger:KB.finger.RIGHT_PINKY},//40
        
        {primary:16,               finger:KB.finger.LEFT_PINKY},//41
        {primary:";",  shift:":",  finger:KB.finger.LEFT_PINKY},
        {primary:"q",  shift:"Q",  finger:KB.finger.LEFT_RING},
        {primary:"j",  shift:"J",  finger:KB.finger.LEFT_MIDDLE},
        {primary:"k",  shift:"K",  finger:KB.finger.LEFT_INDEX},
        {primary:"x",  shift:"X",  finger:KB.finger.LEFT_INDEX},
        {primary:"b",  shift:"B",  finger:KB.finger.RIGHT_INDEX},
        {primary:"m",  shift:"M",  finger:KB.finger.RIGHT_INDEX},
        {primary:"w",  shift:"W",  finger:KB.finger.RIGHT_MIDDLE},
        {primary:"v",  shift:"V",  finger:KB.finger.RIGHT_RING},
        {primary:"z",  shift:"Z",  finger:KB.finger.RIGHT_PINKY},
        {primary:-16,              finger:KB.finger.RIGHT_PINKY},//52
        
        {primary:17,               finger:KB.finger.LEFT_THUMB},//53
        {primary:-91,              finger:KB.finger.LEFT_THUMB},
        {primary:18,               finger:KB.finger.LEFT_THUMB},
        {primary:" ",              finger:KB.finger.LEFT_THUMB},
        {primary:-18,              finger:KB.finger.RIGHT_THUMB},
        {primary:-91,              finger:KB.finger.RIGHT_THUMB},
        {primary:-93,              finger:KB.finger.RIGHT_THUMB},
        {primary:17,               finger:KB.finger.RIGHT_THUMB}//60
    ]
};

// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// european Colemak
// ----------------------------------------------------------------------------

KB.keySet.european.colemak = {
    label: "Colemak",
    author: 'Patrick Gillespie',
    authorUrl: '',
    fingerStart: {},
    keyboardType: "european",
    keys: [
        {primary:"`",   shift:"~",  finger:KB.finger.LEFT_PINKY},//0
        {primary:"1",   shift:"!",  finger:KB.finger.LEFT_PINKY},
        {primary:"2",   shift:"@",  finger:KB.finger.LEFT_RING},
        {primary:"3",   shift:"#",  finger:KB.finger.LEFT_MIDDLE},
        {primary:"4",   shift:"$",  finger:KB.finger.LEFT_INDEX},
        {primary:"5",   shift:"%",  finger:KB.finger.LEFT_INDEX},
        {primary:"6",   shift:"^",  finger:KB.finger.RIGHT_INDEX},
        {primary:"7",   shift:"&",  finger:KB.finger.RIGHT_INDEX},
        {primary:"8",   shift:"*",  finger:KB.finger.RIGHT_MIDDLE},
        {primary:"9",   shift:"(",  finger:KB.finger.RIGHT_RING},
        {primary:"0",   shift:")",  finger:KB.finger.RIGHT_PINKY},
        {primary:"-",   shift:"_",  finger:KB.finger.RIGHT_PINKY},
        {primary:"=",   shift:"+",  finger:KB.finger.RIGHT_PINKY},
        {primary:8,                 finger:KB.finger.RIGHT_PINKY},//13
    
        {primary:9,                 finger:KB.finger.LEFT_PINKY},//14
        {primary:"q",   shift:"Q",  finger:KB.finger.LEFT_PINKY},
        {primary:"w",   shift:"W",  finger:KB.finger.LEFT_RING},
        {primary:"f",   shift:"F",  finger:KB.finger.LEFT_MIDDLE},
        {primary:"p",   shift:"P",  finger:KB.finger.LEFT_INDEX},
        {primary:"g",   shift:"G",  finger:KB.finger.LEFT_INDEX},
        {primary:"j",   shift:"J",  finger:KB.finger.RIGHT_INDEX},
        {primary:"l",   shift:"L",  finger:KB.finger.RIGHT_INDEX},
        {primary:"u",   shift:"U",  finger:KB.finger.RIGHT_MIDDLE},
        {primary:"y",   shift:"Y",  finger:KB.finger.RIGHT_RING},
        {primary:";",   shift:":",  finger:KB.finger.RIGHT_PINKY},
        {primary:"[",   shift:"{",  finger:KB.finger.RIGHT_PINKY},
        {primary:"]",   shift:"}",  finger:KB.finger.RIGHT_PINKY},
        {primary:"\\",  shift:"|",  finger:KB.finger.RIGHT_PINKY},//27
        
        {primary:8 ,               finger:KB.finger.LEFT_PINKY},//28
        {primary:"a",  shift:"A",  finger:KB.finger.LEFT_PINKY},
        {primary:"r",  shift:"R",  finger:KB.finger.LEFT_RING},
        {primary:"s",  shift:"S",  finger:KB.finger.LEFT_MIDDLE},
        {primary:"t",  shift:"T",  finger:KB.finger.LEFT_INDEX},
        {primary:"d",  shift:"D",  finger:KB.finger.LEFT_INDEX},
        {primary:"h",  shift:"H",  finger:KB.finger.RIGHT_INDEX},
        {primary:"n",  shift:"N",  finger:KB.finger.RIGHT_INDEX},
        {primary:"e",  shift:"E",  finger:KB.finger.RIGHT_MIDDLE},
        {primary:"i",  shift:"I",  finger:KB.finger.RIGHT_RING},
        {primary:"o",  shift:"O",  finger:KB.finger.RIGHT_PINKY},
        {primary:"'",  shift:'"',  finger:KB.finger.RIGHT_PINKY},
        {primary:"\r",               finger:KB.finger.RIGHT_PINKY},//40
        
        {primary:16,               finger:KB.finger.LEFT_PINKY},//41
        {primary:"z",  shift:"Z",  finger:KB.finger.LEFT_PINKY},
        {primary:"x",  shift:"X",  finger:KB.finger.LEFT_RING},
        {primary:"c",  shift:"C",  finger:KB.finger.LEFT_MIDDLE},
        {primary:"v",  shift:"V",  finger:KB.finger.LEFT_INDEX},
        {primary:"b",  shift:"B",  finger:KB.finger.LEFT_INDEX},
        {primary:"k",  shift:"K",  finger:KB.finger.RIGHT_INDEX},
        {primary:"m",  shift:"M",  finger:KB.finger.RIGHT_INDEX},
        {primary:",",  shift:"<",  finger:KB.finger.RIGHT_MIDDLE},
        {primary:".",  shift:">",  finger:KB.finger.RIGHT_RING},
        {primary:"/",  shift:"?",  finger:KB.finger.RIGHT_PINKY},
        {primary:-16,              finger:KB.finger.RIGHT_PINKY},//52
        
        {primary:17,               finger:KB.finger.LEFT_THUMB},//53
        {primary:-91,              finger:KB.finger.LEFT_THUMB},
        {primary:18,               finger:KB.finger.LEFT_THUMB},
        {primary:" ",              finger:KB.finger.LEFT_THUMB},
        {primary:-18,              finger:KB.finger.RIGHT_THUMB},
        {primary:-91,              finger:KB.finger.RIGHT_THUMB},
        {primary:-93,              finger:KB.finger.RIGHT_THUMB},
        {primary:17,               finger:KB.finger.RIGHT_THUMB}//60
    ]
};

KB.keyMap.european = {};
// 50 pixels = 1.9cm
// 26.315789 pixels = 1cm
KB.keyMap.european.s683_225 = {};
KB.keyMap.european.s683_225.width = 754;//756
KB.keyMap.european.s683_225.height = 252;//254
KB.keyMap.european.s683_225.pixelsPerCm = 26.315789;
(function() {
    var ii,
        km = KB.keyMap.european.s683_225,
        normKeySize = 50,
        row,
        keyCount = [14,14,13,13,8],
        index = 0,
        curX = 0.5,//2.5
        curY = 0.5,//2.5
        keyWidths = {};
        
    km.leftX = curX;
    km.leftY = curY;
        
    // special key sizes
    keyWidths["0,13"] = 102;//
    keyWidths["1,0"] = 76;//
    keyWidths["1,13"] = 76;//
    keyWidths["2,0"] = 89;//
    keyWidths["3,0"] = 60;//76;//116
    keyWidths["3,12"] = 142;//126;//126
    keyWidths["4,0"] = 76;//
    keyWidths["4,2"] = 76;//
    keyWidths["4,3"] = 298;//
    keyWidths["4,4"] = 76;//
    keyWidths["4,7"] = 76;//
        
    for (row = 0; row < 5; row++) {
        for (ii = 0; ii < keyCount[row]; ii++) {
            km[index] = {};
            km[index].x = curX;
            km[index].y = curY;
            km[index].w = keyWidths[row+","+ii] || normKeySize;
            km[index].h = normKeySize;
            km[index].cx = km[index].x + (km[index].w/2);
            km[index].cy = km[index].y + (km[index].h/2);
            km[index].row = row;
            
            if (row === 1 && ii === 13) {
                var enterBottomWidth = 63;//keyWidths["3,0"]+12*normKeySize;
            
                km[index].coords = [
                    {
                        x:km[index].x,
                        y:km[index].y
                    }, {
                        x:km[index].x+km[index].w,
                        y:km[index].y
                    }, {
                        x:km[index].x+km[index].w, 
                        y:km[index].y+(km[index].h*2)
                    }, {
                        x:km[index].x+(km[index].w-enterBottomWidth),
                        y:km[index].y+(km[index].h*2)
                    }, {
                        x:km[index].x+(km[index].w-enterBottomWidth),
                        y:km[index].y+km[index].h
                    }, {
                        x:km[index].x,
                        y:km[index].y+km[index].h
                    }
                ];
                
                km[index].cx = ( km[index].coords[1].x + km[index].coords[3].x ) / 2;
                km[index].cy = ( km[index].coords[1].y + km[index].coords[3].y ) / 2;
            }
            
            // set the mount points - these are points where dialogs will attach to keys
            // all our keys are squares, so this is simple
            km[index].mountPoint = {};
            km[index].mountPoint["top"] = {};
            km[index].mountPoint["right"] = {};
            km[index].mountPoint["bottom"] = {};
            km[index].mountPoint["left"] = {};
            
            km[index].mountPoint["top"].x = km[index].x + (km[index].w/2);
            km[index].mountPoint["top"].y = km[index].y;
            km[index].mountPoint["right"].x = km[index].x + km[index].w;
            km[index].mountPoint["right"].y = km[index].y + (km[index].h/2);
            km[index].mountPoint["bottom"].x = km[index].x + (km[index].w/2);
            km[index].mountPoint["bottom"].y = km[index].y + km[index].h;
            km[index].mountPoint["left"].x = km[index].x;
            km[index].mountPoint["left"].y = km[index].y + (km[index].h/2);
            
            if (row === 1 && ii === 13) {
                km[index].mountPoint["bottom"].x = km[index].x + (km[index].w/2);
                km[index].mountPoint["bottom"].y = km[index].y + km[index].h*2;
            }
            
            curX += km[index].w;
            index++;
        }
        curX = 0.5;//2.5
        curY += normKeySize;
    }
})();

// ----------------------------------------------------------------------------

// test keyset for ergodox

KB.keySet.ergodox = {};

KB.keySet.ergodox.qwerty = {
    "label": "Ergodox QWERTY",
    "author": "Patrick Gillespie",
    "authorUrl": "",
    "fingerStart": {
        "1": 29,
        "2": 30,
        "3": 31,
        "4": 32,
        "5": 66,
        "6": 75,
        "7": 35,
        "8": 36,
        "9": 37,
        "10": 38,
        "11": -1,
        "false": -1
    },
    "keyboardType": "ergodox",
    "labels": {
        "8": "Bkspc",
        "20": "Caps"
    },
    "keys": [
        {"primary": 27,     "finger": 1,    "id": 0},
        {"primary": 49,     "shift": 33,    "finger": 1,    "id": 1},
        {"primary": 50,     "shift": 64,    "finger": 2,    "id": 2},
        {"primary": 51,     "shift": 35,    "finger": 3,    "id": 3},
        {"primary": 52,     "shift": 36,    "finger": 4,    "id": 4},
        {"primary": 53,     "shift": 37,    "finger": 4,    "id": 5},
        {"primary": 45,     "shift": 95,    "finger": 4,    "id": 6},
        {"primary": 61,     "shift": 43,    "finger": 7,    "id": 7},
        {"primary": 54,     "shift": 94,    "finger": 7,    "id": 8},
        {"primary": 55,     "shift": 38,    "finger": 7,    "id": 9},
        {"primary": 56,     "shift": 42,    "finger": 8,    "id": 10},
        {"primary": 57,     "shift": 40,    "finger": 9,    "id": 11},
        {"primary": 48,     "shift": 41,    "finger": 10,   "id": 12},
        {"primary": 8,      "finger": 10,   "id": 13},
        {"primary": 9,      "finger": 1,    "id": 14},
        {"primary": 113,    "shift": 81,    "finger": 1,    "id": 15},
        {"primary": 119,    "shift": 87,    "finger": 2,    "id": 16},
        {"primary": 101,    "shift": 69,    "finger": 3,    "id": 17},
        {"primary": 114,    "shift": 82,    "finger": 4,    "id": 18},
        {"primary": 116,    "shift": 84,    "finger": 4,    "id": 19},
        {"primary": -1,     "finger": 4,    "id": 20},
        {"primary": -1,     "finger": 7,    "id": 21},
        {"primary": 121,    "shift": 89,    "finger": 7,    "id": 22},
        {"primary": 117,    "shift": 85,    "finger": 7,    "id": 23},
        {"primary": 105,    "shift": 73,    "finger": 8,    "id": 24},
        {"primary": 111,    "shift": 79,    "finger": 9,    "id": 25},
        {"primary": 112,    "shift": 80,    "finger": 10,   "id": 26},
        {"primary": 92,     "shift": 124,   "finger": 10,   "id": 27},
        {"primary": 17,     "finger": 1,    "id": 28},
        {"primary": 97,     "shift": 65,    "finger": 1,    "id": 29},
        {"primary": 115,    "shift": 83,    "finger": 2,    "id": 30},
        {"primary": 100,    "shift": 68,    "finger": 3,    "id": 31},
        {"primary": 102,    "shift": 70,    "finger": 4,    "id": 32},
        {"primary": 103,    "shift": 71,    "finger": 4,    "id": 33},
        {"primary": 104,    "shift": 72,    "finger": 7,    "id": 34},
        {"primary": 106,    "shift": 74,    "finger": 7,    "id": 35},
        {"primary": 107,    "shift": 75,    "finger": 8,    "id": 36},
        {"primary": 108,    "shift": 76,    "finger": 9,    "id": 37},
        {"primary": 59,     "shift": 58,    "finger": 10,   "id": 38},
        {"primary": 13,     "finger": 10,   "id": 39},
        {"primary": 16,     "finger": 1,    "id": 40},
        {"primary": 122,    "shift": 90,    "finger": 1,    "id": 41},
        {"primary": 120,    "shift": 88,    "finger": 2,    "id": 42},
        {"primary": 99,     "shift": 67,    "finger": 3,    "id": 43},
        {"primary": 118,    "shift": 86,    "finger": 4,    "id": 44},
        {"primary": 98,     "shift": 66,    "finger": 4,    "id": 45},
        {"primary": -1,     "finger": 4,    "id": 46},
        {"primary": -1,     "finger": 7,    "id": 47},
        {"primary": 110,    "shift": 78,    "finger": 7,    "id": 48},
        {"primary": 109,    "shift": 77,    "finger": 7,    "id": 49},
        {"primary": 44,     "shift": 60,    "finger": 8,    "id": 50},
        {"primary": 46,     "shift": 62,    "finger": 9,    "id": 51},
        {"primary": 47,     "shift": 63,    "finger": 10,   "id": 52},
        {"primary": -16,    "finger": 10,   "id": 53},
        {"primary": 17,     "finger": 1,    "id": 54},
        {"primary": -1,     "finger": 1,    "id": 55},
        {"primary": -1,     "finger": 2,    "id": 56},
        {"primary": -1,     "finger": 3,    "id": 57},
        {"primary": 96,     "shift": 126,   "finger": 4,    "id": 58},
        {"primary": -1,     "finger": 7,    "id": 59},
        {"primary": 91,     "shift": 123,   "finger": 8,    "id": 60},
        {"primary": 93,     "shift": 125,   "finger": 9,    "id": 61},
        {"primary": 39,     "shift": 34,    "finger": 10,   "id": 62},
        {"primary": -1,     "finger": 10,   "id": 63},
        {"primary": 20,     "finger": 5,    "id": 64,       "shift": -1,    "altGr": -1,    "shiftAltGr": -1},
        {"primary": -1,     "finger": 5,    "id": 65,       "shift": -1,    "altGr": -1,    "shiftAltGr": -1},
        {"primary": 32,     "finger": 5,    "id": 66,       "shift": -1,    "altGr": -1,    "shiftAltGr": -1},
        {"primary": 13,     "finger": 5,    "id": 67,       "shift": -1,    "altGr": -1,    "shiftAltGr": -1},
        {"primary": -1,     "finger": 5,    "id": 68,       "shift": -1,    "altGr": -1,    "shiftAltGr": -1},
        {"primary": -1,     "finger": 5,    "id": 69,       "shift": -1,    "altGr": -1,    "shiftAltGr": -1},
        {"primary": -1,     "finger": 6,    "id": 70,       "shift": -1,    "altGr": -1,    "shiftAltGr": -1},
        {"primary": -1,     "finger": 6,    "id": 71,       "shift": -1,    "altGr": -1,    "shiftAltGr": -1},
        {"primary": -1,     "finger": 6,    "id": 72,       "shift": -1,    "altGr": -1,    "shiftAltGr": -1},
        {"primary": -1,     "finger": 6,    "id": 73,       "shift": -1,    "altGr": -1,    "shiftAltGr": -1},
        {"primary": 32,     "finger": 6,    "id": 74,       "shift": -1,    "altGr": -1,    "shiftAltGr": -1},
        {"primary": 8,      "finger": 6,    "id": 75,       "shift": -1,    "altGr": -1,    "shiftAltGr": -1}
    ]
};

// Key Map for Ergodox

KB.keyMap.ergodox = {};

// 50 pixels = 1.9cm
// 26.315789 pixels = 1cm
KB.keyMap.ergodox.s683_225 = {};
KB.keyMap.ergodox.s683_225.width = 935;
KB.keyMap.ergodox.s683_225.height = 360;
KB.keyMap.ergodox.s683_225.pixelsPerCm = 25.7894732;//26.315789;
(function() {
    var ii,
        km = KB.keyMap.ergodox.s683_225,
        normKeySize = 50,
        row,
        keyCount = [14,14,13,12,8],
        index = 0,
        curX = 0.5,//2.5
        curY = 0.5,//2.5
        keyWidths = {};
        
    km.leftX = curX;
    km.leftY = curY;

    var sw = 46;
    var sh = 46;
    var sSpacing = 2;

    function keySpacing(key) {
        var keyOffset = {};
        keyOffset[7] = 214;
        keyOffset[21] = 214;
        keyOffset[34] = 214 + sw*2 + sSpacing*2;
        keyOffset[47] = 214;
        keyOffset[59] = 214 + sw*4 + sSpacing*4;

        // keys that begin a row
        keyOffset[0] = 0;
        keyOffset[14] = 0;
        keyOffset[28] = 0;
        keyOffset[40] = 0;
        keyOffset[54] = 23;

        var ret = (typeof keyOffset[key] !== 'undefined') ? keyOffset[key] : sSpacing;

        return ret;
    }

    var idx = 0;
    var yOffset = [
        [0, 0, -8, -12, -8, -5,      -5,        -5, -5,  -8, -12,  -8, 0, 0],
        [0, 0, -8, -12, -8, -5,      -5,        -5, -5,  -8, -12,  -8, 0, 0],
        [0, 0, -8, -12, -8, -5,                 -5,      -8, -12,  -8, 0, 0],
        [0, 0, -8, -12, -8, -5, -5 - 23,   -5 - 23, -5,  -8, -12,  -8, 0, 0],
        [0, 0, -8, -12, -8,                              -8, -12,  -8, 0, 0]
    ];

    var rowY = [
        13, 
        13 + sh + sSpacing,
        13 + sh + sSpacing + sh + sSpacing,
        13 + sh + sSpacing + sh + sSpacing + sh + sSpacing,
        13 + sh + sSpacing + sh + sSpacing + sh + sSpacing + sh + sSpacing 
    ];

    var keyWidth = {};
    keyWidth[0] = 69;
    keyWidth[13] = 69;
    keyWidth[14] = 69;
    keyWidth[27] = 69;
    keyWidth[28] = 69;
    keyWidth[39] = 69;
    keyWidth[40] = 69;
    keyWidth[53] = 69;
    var keyHeight = {}
    keyHeight[20] = sh + 23 + sSpacing;
    keyHeight[21] = sh + 23 + sSpacing;
    keyHeight[46] = sh + 23 + sSpacing;
    keyHeight[47] = sh + 23 + sSpacing;
    keyHeight[66] = sh*2+sSpacing;
    keyHeight[67] = sh*2+sSpacing;
    keyHeight[74] = sh*2+sSpacing;
    keyHeight[75] = sh*2+sSpacing;

    var rotation = {};

    var xOffset = 0;
    var yPos = 0;
    var row, col;
    var idx = 0;

    for (row = 0; row < yOffset.length; row++) {
        for (col = 0; col < yOffset[row].length; col++) {
            if (col === 0) {
                xOffset = 0;
            } else {
                xOffset = xOffset + (keyWidth[idx-1] || sw);
            } 
            xOffset += keySpacing(idx);

            km[idx] = {};
            km[idx].x = xOffset + 0.5;
            km[idx].y = rowY[row] + yOffset[row][col] + 0.5;
            km[idx].w = keyWidth[idx] || sw;
            km[idx].h = keyHeight[idx] || sh;
            km[idx].row = row;

            idx++;
        }
    }

    var rotatePoint = function(angle, aroundPoint, rotatingPoint) {
        var s = Math.sin(angle);
        var c = Math.cos(angle);

        rotatingPoint.x -= aroundPoint.x;
        rotatingPoint.y -= aroundPoint.y;

        var newX = rotatingPoint.x * c - rotatingPoint.y * s;
        var newY = rotatingPoint.x * s + rotatingPoint.y * c;

        rotatingPoint.x = newX + aroundPoint.x;
        rotatingPoint.y = newY + aroundPoint.y;
    }

    var tCoords = [
        {x: 378, y: 179, r: 0.45},
        {x: 422, y: 200, r: 0.45},
        {x: 313, y: 203, r: 0.45},
        {x: 357, y: 224, r: 0.45},
        {x: 401, y: 245, r: 0.45},
        {x: 380, y: 289, r: 0.45},

        {x: 466, y: 220, r: -0.45},
        {x: 510, y: 199, r: -0.45},
        {x: 487, y: 265, r: -0.45},
        {x: 508, y: 309, r: -0.45},
        {x: 531, y: 244, r: -0.45},
        {x: 575, y: 223, r: -0.45}
    ];
    for (ii = 0; ii < tCoords.length; ii++) {
        km[idx] = {};
        km[idx].x = tCoords[ii].x;
        km[idx].y = tCoords[ii].y;
        km[idx].w = keyWidth[idx] || sw;
        km[idx].h = keyHeight[idx] || sh;
        km[idx].row = 4;
        km[idx].coords = [
            {   x: km[idx].x,                 y: km[idx].y },
            {   x: km[idx].x + km[idx].w,     y: km[idx].y },
            {   x: km[idx].x + km[idx].w,     y: km[idx].y + km[idx].h},
            {   x: km[idx].x,                 y: km[idx].y + km[idx].h}
        ];
        rotation[idx] = tCoords[ii].r;
        rotatePoint(rotation[idx], km[idx].coords[0], km[idx].coords[1]);
        rotatePoint(rotation[idx], km[idx].coords[0], km[idx].coords[2]);
        rotatePoint(rotation[idx], km[idx].coords[0], km[idx].coords[3]);

        km[idx].mountPoint = {};
        km[idx].mountPoint["top"] = {};
        km[idx].mountPoint["right"] = {};
        km[idx].mountPoint["bottom"] = {};
        km[idx].mountPoint["left"] = {};
        
        var xSum = 0, ySum = 0;
        for (var cc = 0; cc < km[idx].coords.length; cc++) {
            xSum += km[idx].coords[cc].x;
            ySum += km[idx].coords[cc].y;
        }

        km[idx].mountPoint["top"].x = xSum / km[idx].coords.length;
        km[idx].mountPoint["top"].y = ySum / km[idx].coords.length;
        km[idx].mountPoint["right"].x = xSum / km[idx].coords.length;
        km[idx].mountPoint["right"].y = ySum / km[idx].coords.length;
        km[idx].mountPoint["bottom"].x = xSum / km[idx].coords.length;
        km[idx].mountPoint["bottom"].y = ySum / km[idx].coords.length;
        km[idx].mountPoint["left"].x = xSum / km[idx].coords.length;
        km[idx].mountPoint["left"].y = ySum / km[idx].coords.length;

        idx++;
    }

    km.rotation = function(idx) {
        if (rotation[idx]) {
            return rotation[idx];
        }
        return 0;
    };

    for (index = 0; index < idx; index++) {

        if (km[index].coords) {
            var xSum = 0, ySum = 0;
            for (var cc = 0; cc < km[index].coords.length; cc++) {
                xSum += km[index].coords[cc].x;
                ySum += km[index].coords[cc].y;
            }
            km[index].cx = xSum / km[index].coords.length;
            km[index].cy = ySum / km[index].coords.length;
        } else {
            km[index].cx = km[index].x + (km[index].w/2);
            km[index].cy = km[index].y + (km[index].h/2);
        }
        
        // set the mount points - these are points where dialogs will attach to keys
        // all our keys are squares, so this is simple
        if (typeof km[index].mountPoint === 'undefined') {
            km[index].mountPoint = {};
            km[index].mountPoint["top"] = {};
            km[index].mountPoint["right"] = {};
            km[index].mountPoint["bottom"] = {};
            km[index].mountPoint["left"] = {};
            
            km[index].mountPoint["top"].x = km[index].x + (km[index].w/2);
            km[index].mountPoint["top"].y = km[index].y;
            km[index].mountPoint["right"].x = km[index].x + km[index].w;
            km[index].mountPoint["right"].y = km[index].y + (km[index].h/2);
            km[index].mountPoint["bottom"].x = km[index].x + (km[index].w/2);
            km[index].mountPoint["bottom"].y = km[index].y + km[index].h;
            km[index].mountPoint["left"].x = km[index].x;
            km[index].mountPoint["left"].y = km[index].y + (km[index].h/2);
        }
    }
})();

// ----------------------------------------------------------------------------
// Update Key Sets
// ----------------------------------------------------------------------------

/*
    The below code converts the raw characters to numbers.
*/
// set ID of each key in the main layouts
(function() {
    var ii,
        jj,
        pp,
        prop,
        props,
        klen,
        layout,
        key,
        layouts = [],
        llen = layouts.length,
        keySetName;
    
    for (keySetName in KB.keySet) {
        layouts = [];
        for (jj in KB.keySet[keySetName]) {
            if ( KB.keySet[keySetName].hasOwnProperty(jj) ) {
                layouts.push(jj);
            }
        }
        llen = layouts.length;
        
        for (jj = 0; jj < llen; jj++) {
            layout = layouts[jj];
            klen = KB.keySet[keySetName][layout].keys.length;
            for (ii = 0; ii < klen; ii++) {
                key = KB.keySet[keySetName][layout].keys[ii]; 
                key.id=ii;
                props = ["primary","shift","altGr","shiftAltGr"];
                for (pp = 0, prop = props[pp]; pp < props.length; prop = props[++pp]) {
                    if (typeof key[prop] === "string" && key[prop].length !== 0) {
                       key[prop] = key[prop].charCodeAt(0);
                    }
                }
            }
            
            var fs = KB.keySet[keySetName][layout].fingerStart;
            var spaceKey = 56;
            if (keySetName === 'european') {
                spaceKey = 57;
            } else if (keySetName === 'ergodox') {
                spaceKey = 66;
            }

            fs[KB.finger.LEFT_PINKY] = (typeof fs[KB.finger.LEFT_PINKY] === "undefined") ? 29 : fs[KB.finger.LEFT_PINKY];
            fs[KB.finger.LEFT_RING] = (typeof fs[KB.finger.LEFT_RING] === "undefined") ? 30 : fs[KB.finger.LEFT_RING];
            fs[KB.finger.LEFT_MIDDLE] = (typeof fs[KB.finger.LEFT_MIDDLE] === "undefined") ? 31 : fs[KB.finger.LEFT_MIDDLE];
            fs[KB.finger.LEFT_INDEX] = (typeof fs[KB.finger.LEFT_INDEX] === "undefined") ? 32 : fs[KB.finger.LEFT_INDEX];
            fs[KB.finger.LEFT_THUMB] = (typeof fs[KB.finger.LEFT_THUMB] === "undefined") ? spaceKey : fs[KB.finger.LEFT_THUMB];
            fs[KB.finger.RIGHT_THUMB] = (typeof fs[KB.finger.RIGHT_THUMB] === "undefined") ? spaceKey : fs[KB.finger.RIGHT_THUMB];
            fs[KB.finger.RIGHT_INDEX] = (typeof fs[KB.finger.RIGHT_INDEX] === "undefined") ? 35 : fs[KB.finger.RIGHT_INDEX];
            fs[KB.finger.RIGHT_MIDDLE] = (typeof fs[KB.finger.RIGHT_MIDDLE] === "undefined") ? 36 : fs[KB.finger.RIGHT_MIDDLE];
            fs[KB.finger.RIGHT_RING] = (typeof fs[KB.finger.RIGHT_RING] === "undefined") ? 37 : fs[KB.finger.RIGHT_RING];
            fs[KB.finger.RIGHT_PINKY] = (typeof fs[KB.finger.RIGHT_PINKY] === "undefined") ? 38 : fs[KB.finger.RIGHT_PINKY];
            fs[KB.finger.BOTH_THUMBS] =  (typeof fs[KB.finger.BOTH_THUMBS] === "undefined") ? spaceKey : fs[KB.finger.BOTH_THUMBS];
        }
    }
})();
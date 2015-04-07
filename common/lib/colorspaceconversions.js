var hexCode = new Array("00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0A", "0B", "0C", "0D", "0E", "0F", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "1A", "1B", "1C", "1D", "1E", "1F", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2A", "2B", "2C", "2D", "2E", "2F", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3A", "3B", "3C", "3D", "3E", "3F", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4A", "4B", "4C", "4D", "4E", "4F", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5A", "5B", "5C", "5D", "5E", "5F", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6A", "6B", "6C", "6D", "6E", "6F", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7A", "7B", "7C", "7D", "7E", "7F", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "8A", "8B", "8C", "8D", "8E", "8F", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "9A", "9B", "9C", "9D", "9E", "9F", "A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "AA", "AB", "AC", "AD", "AE", "AF", "B0", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "BA", "BB", "BC", "BD", "BE", "BF", "C0", "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "CA", "CB", "CC", "CD", "CE", "CF", "D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "DA", "DB", "DC", "DD", "DE", "DF", "E0", "E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9", "EA", "EB", "EC", "ED", "EE", "EF", "F0", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "FA", "FB", "FC", "FD", "FE", "FF");
  
function rgbObj()
{
  this.r = 0;
  this.g = 0;
  this.b = 0;
}
function hslObj()
{
  this.h = 0;
  this.l = 0;
  this.s = 0;
}

function RGBtoHSL(rgb, hsl)
{
  var_R = ( rgb.r / 255 );                     //Where RGB values = 0 ÷ 255
  var_G = ( rgb.g / 255 );
  var_B = ( rgb.b / 255 );
  
  var_Min = Math.min( var_R, var_G, var_B );    //Min. value of RGB
  var_Max = Math.max( var_R, var_G, var_B );    //Max. value of RGB
  del_Max = var_Max - var_Min;             //Delta RGB value
  
  hsl.l = ( var_Max + var_Min ) / 2;
  
  if ( del_Max == 0 )                     //This is a gray, no chroma...
  {
     hsl.h = 0;                                //HSL results = 0 ÷ 1
     hsl.s = 0;
  }
  else                                    //Chromatic data...
  {
    if ( hsl.l < 0.5 ) 
    {
      hsl.s = del_Max / ( var_Max + var_Min );
    }
    else 
    {
      hsl.s = del_Max / ( 2 - var_Max - var_Min );
    }
    
    del_R = ( ( ( var_Max - var_R ) / 6 ) + ( del_Max / 2 ) ) / del_Max;
    del_G = ( ( ( var_Max - var_G ) / 6 ) + ( del_Max / 2 ) ) / del_Max;
    del_B = ( ( ( var_Max - var_B ) / 6 ) + ( del_Max / 2 ) ) / del_Max;
    
    if ( var_R == var_Max ) 
    {
      hsl.h = del_B - del_G;
    }
    else if ( var_G == var_Max ) 
    {
      hsl.h = ( 1 / 3 ) + del_R - del_B;
    }
    else if ( var_B == var_Max ) 
    {
      hsl.h = ( 2 / 3 ) + del_G - del_R;
    }
    
    if ( hsl.h < 0 ) 
    { 
      hsl.h += 1;
    }
    if ( hsl.h > 1 ) 
    { 
      hsl.h -= 1;
    }
  }  
}
  
function HSLtoRGB(hsl, rgb)
{
  if ( hsl.s == 0 )                       //HSL values = 0 ÷ 1
  {
    rgb.r = hsl.l * 255;                     //RGB results = 0 ÷ 255
    rgb.g = hsl.l * 255;
    rgb.b = hsl.l * 255;
  }
  else
  {
    if ( hsl.l < 0.5 ) 
    {
      var_2 = hsl.l * ( 1 + hsl.s );
    }
    else
    {
      var_2 = ( hsl.l + hsl.s ) - ( hsl.s * hsl.l );
    }
  
    var_1 = 2 * hsl.l - var_2;
  
    rgb.r = 255 * Hue_2_RGB( var_1, var_2, hsl.h + ( 1 / 3 ) );
    rgb.g = 255 * Hue_2_RGB( var_1, var_2, hsl.h );
    rgb.b = 255 * Hue_2_RGB( var_1, var_2, hsl.h - ( 1 / 3 ) );
  } 
}


function Hue_2_RGB( v1, v2, vH )             //Function Hue_2_RGB
{
  if ( vH < 0 ) 
  {
    vH += 1;
  }
  if ( vH > 1 ) 
  {
    vH -= 1;
  }
  if ( ( 6 * vH ) < 1 ) 
  {
    return ( v1 + ( v2 - v1 ) * 6 * vH );
  }
  if ( ( 2 * vH ) < 1 ) 
  {
    return ( v2 );
  }
  if ( ( 3 * vH ) < 2 ) 
  {
    return ( v1 + ( v2 - v1 ) * ( ( 2 / 3 ) - vH ) * 6 );
  }
  return ( v1 );
}

var mullerL = new Array();
mullerL[0] = 0.65;
mullerL[1] = 0.75;
mullerL[2] = 0.9;
mullerL[3] = 0.75;
mullerL[4] = 0.65;
mullerL[5] = 0.5;
mullerL[6] = 0.35;
mullerL[7] = 0.2;
mullerL[8] = 0.35;
mullerL[9] = 0.5;

var mullerH = new Array();
mullerH[0] = 0.0;
mullerH[1] = 0.1;
mullerH[2] = 0.2;
mullerH[3] = 0.3;
mullerH[4] = 0.4;
mullerH[5] = 0.5;
mullerH[6] = 0.6;
mullerH[7] = 0.7;
mullerH[8] = 0.8;
mullerH[9] = 0.9;


function HSLtoMullerColorsx(hsl)
{
  // find the closet lightness
  var tempDiff = 0;
  var smallestDiff = 10;
  var cloestIndex = 2;
  var matchingIndex = -1;
  var mullerStep = 0.1;
  
  for (j = 0; j < 10; j++)
  {
    tempDiff = Math.abs(mullerH[j] - hsl.h);
    if (tempDiff < smallestDiff)
    {
      smallestDiff = tempDiff;
      cloestIndex = j;
      matchingIndex = -1;
    } 
    else if (tempDiff == smallestDiff)
    {
      matchingIndex = j;
    }
  }

  hueIndex = cloestIndex; // by default
  if (matchingIndex != -1) 
  {
    diff1 = Math.abs(hsl.l - mullerL[cloestIndex]);
    if (diff1 >= 5) 
    {
      diff1 = diff1 - 5;
    }
    diff2 = Math.abs(hsl.l - mullerL[matchingIndex]);
    if (diff2 >= 5) 
    {
      diff2 = diff2 - 5;
    }
    if (diff2 < diff1)
    {
      hueIndex = matchingIndex;
    }
  }

  diff = mullerL[hueIndex] - hsl.l;

  if (Math.abs(diff) < mullerStep)
  {
    hsl.l = mullerL[hueIndex];
  }
  else
  {
    if (diff < 0)
    {
       hsl.l = hsl.l + mullerStep;
       if (hsl.l >= 1)
       {  
          hsl.l = 1;
          //hsl.h = hsl.h - 1;
       }
    } 
    else
    {
      hsl.l = hsl.l - mullerStep;
       if (hsl.l < 0)
       {
          hsl.l = 0;
          //hsl.h = hsl.h + 1;
       }
    } 
  }
}




function HSLtoMullerColors(hsl)
{
  // find the closet lightness
  var tempDiff = 0;
  var smallestDiff = 10;
  var cloestIndex = 2;
  var matchingIndex = -1;
  var mullerStep = 0.075;
  
  for (j = 0; j < 10; j++)
  {
    tempDiff = Math.abs(mullerL[j] - hsl.l);
    if (tempDiff < smallestDiff)
    {
      smallestDiff = tempDiff;
      cloestIndex = j;
      matchingIndex = -1;
    } 
    else if (tempDiff == smallestDiff)
    {
      matchingIndex = j;
    }
  }

  hueIndex = cloestIndex; // by default
  if (matchingIndex != -1) 
  {
    diff1 = Math.abs(hsl.h - mullerH[cloestIndex]);
    if (diff1 >= 5) 
    {
      diff1 = diff1 - 5;
    }
    diff2 = Math.abs(hsl.h - mullerH[matchingIndex]);
    if (diff2 >= 5) 
    {
      diff2 = diff2 - 5;
    }
    if (diff2 < diff1)
    {
      hueIndex = matchingIndex;
    }
  }

  diff = mullerH[hueIndex] - hsl.h;

  if (Math.abs(diff) < mullerStep)
  {
    hsl.h = mullerH[hueIndex];
  }
  else
  {
    if (diff < 0)
    {
       hsl.h = hsl.h + mullerStep;
       if (hsl.h >= 1)
       {
          hsl.h = hsl.h - 1;
       }
    } 
    else
    {
      hsl.h = hsl.h - mullerStep;
       if (hsl.h < 0)
       {
          hsl.h = hsl.h + 1;
       }
    } 
  }
}

function HSLtoMullerColors2(hsl)
{
  var mullerStep = 0.075;
  
  if (hsl.l >= 0.5)
  {
    if (hsl.h < 0.6667 && hsl.h > 0.1667)
    {
      hsl.h = hsl.h - mullerStep; 
      if (hsl.h < 0.1667)
      {
        hsl.h = 0.1667; 
      }
    } 
    else
    {
      hsl.h = hsl.h + mullerStep; 
      if (hsl.h >= 1)
      {
        hsl.h = hsl.h - 1; 
      }
      if (hsl.h > 0.1667 && hsl.h < 0.6667)
      {
        hsl.h = 0.1667; 
      } 
    }
  }
  else
  {
    if (hsl.h < 0.6667 && hsl.h >= 0.1667)
    {
      hsl.h = hsl.h + mullerStep; 
      if (hsl.h > 0.6667)
      {
        hsl.h = 0.6667; 
      }
    } 
    else
    {
      hsl.h = hsl.h - mullerStep; 
      if (hsl.h < 0)
      {
        hsl.h = hsl.h + 1; 
      }
      if (hsl.h < 0.6667 && hsl.h > 0.1667)
      {
        hsl.h = 0.6667; 
      } 
    }
  }
}
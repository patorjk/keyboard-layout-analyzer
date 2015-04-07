<?php

function RGBtoHSL($r, $g, $b, &$h, &$l, &$s)
{
  $var_R = ( $r / 255 );                     //Where RGB values = 0 ÷ 255
  $var_G = ( $g / 255 );
  $var_B = ( $b / 255 );
  
  $var_Min = min( $var_R, $var_G, $var_B );    //Min. value of RGB
  $var_Max = max( $var_R, $var_G, $var_B );    //Max. value of RGB
  $del_Max = $var_Max - $var_Min;             //Delta RGB value
  
  $l = ( $var_Max + $var_Min ) / 2;
  
  if ( $del_Max == 0 )                     //This is a gray, no chroma...
  {
     $h = 0;                                //HSL results = 0 ÷ 1
     $s = 0;
  }
  else                                    //Chromatic data...
  {
    if ( $l < 0.5 ) 
    {
      $s = $del_Max / ( $var_Max + $var_Min );
    }
    else 
    {
      $s = $del_Max / ( 2 - $var_Max - $var_Min );
    }
    
    $del_R = ( ( ( $var_Max - $var_R ) / 6 ) + ( $del_Max / 2 ) ) / $del_Max;
    $del_G = ( ( ( $var_Max - $var_G ) / 6 ) + ( $del_Max / 2 ) ) / $del_Max;
    $del_B = ( ( ( $var_Max - $var_B ) / 6 ) + ( $del_Max / 2 ) ) / $del_Max;
    
    if ( $var_R == $var_Max ) 
    {
      $h = $del_B - $del_G;
    }
    else if ( $var_G == $var_Max ) 
    {
      $h = ( 1 / 3 ) + $del_R - $del_B;
    }
    else if ( $var_B == $var_Max ) 
    {
      $h = ( 2 / 3 ) + $del_G - $del_R;
    }
    
    if ( $h < 0 ) 
    { 
      $h += 1;
    }
    if ( $h > 1 ) 
    { 
      $h -= 1;
    }
  }  
}

function RGBtoXYZ($r, $g, $b, &$x, &$y, &$z)
{
  $var_R = ( $r / 255 );        //Where R = 0 ÷ 255
  $var_G = ( $g / 255 );        //Where G = 0 ÷ 255
  $var_B = ( $b / 255 );        //Where B = 0 ÷ 255
  
  if ( $var_R > 0.04045 ) 
  {
    $var_R = pow(( ( $var_R + 0.055 ) / 1.055 ), 2.4);
  }
  else
  {
    $var_R = $var_R / 12.92;
  }
  
  if ( var_G > 0.04045 ) 
  {
    $var_G = pow(( ( $var_G + 0.055 ) / 1.055 ), 2.4);
  }
  else
  {
    $var_G = $var_G / 12.92;
  }
  
  if ( $var_B > 0.04045 )
  { 
    $var_B = pow(( ( $var_B + 0.055 ) / 1.055 ), 2.4);
  }
  else
  {
    $var_B = $var_B / 12.92;
  }
  
  $var_R = $var_R * 100;
  $var_G = $var_G * 100;
  $var_B = $var_B * 100;
  
  //Observer. = 2°, Illuminant = D65
  $x = $var_R * 0.4124 + $var_G * 0.3576 + $var_B * 0.1805;
  $y = $var_R * 0.2126 + $var_G * 0.7152 + $var_B * 0.0722;
  $z = $var_R * 0.0193 + $var_G * 0.1192 + $var_B * 0.9505;
}

function XYZtoLAB($x, $y, $z, &$l, &$a, &$b)
{
  $ref_X = 95.047;
  $ref_Y = 100.000;
  $ref_Z = 108.883;
  
  $var_X = $x / $ref_X;          //ref_X =  95.047  Observer= 2°, Illuminant= D65
  $var_Y = $y / $ref_Y;          //ref_Y = 100.000
  $var_Z = $z / $ref_Z;          //ref_Z = 108.883
  
  if ( $var_X > 0.008856 )
  { 
    $var_X = pow($var_X, ( 1/3 ));
  }
  else
  {
    $var_X = ( 7.787 * $var_X ) + ( 16 / 116 );
  }
  if ( $var_Y > 0.008856 ) 
  { 
    $var_Y = pow($var_Y, ( 1/3 ));
  }
  else
  {
    $var_Y = ( 7.787 * $var_Y ) + ( 16 / 116 );
  }
  if ( $var_Z > 0.008856 )
  {
    $var_Z = pow($var_Z, ( 1/3 ));
  }
  else
  {
    $var_Z = ( 7.787 * $var_Z ) + ( 16 / 116 );
  }
  
  $l = ( 116 * $var_Y ) - 16;
  $a = 500 * ( $var_X - $var_Y );
  $b = 200 * ( $var_Y - $var_Z );
}

function LABtoLCH($l, $a, $b, &$lch_l, &$lch_c, &$lch_h)
{
  $var_H = atan2( $b, $a );  //Quadrant by signs
  
  if ( $var_H > 0 )
  { 
    $var_H = ( $var_H / pi() ) * 180;
  }
  else
  {
    $var_H = 360 - ( abs( $var_H ) / pi() ) * 180;
  }
  
  $lch_l = $l;
  $lch_c = sqrt( pow($a, 2) + pow($b, 2) );
  $lch_h = $var_H;
}

function LCHtoLAB($lch_l, $lch_c, $lch_h, &$l, &$a, &$b)
{
  $l = $lch_l;
  $a = cos( degree_2_radian( $lch_h ) ) * $lch_c;
  $b = sin( degree_2_radian( $lch_h ) ) * $lch_c;
}

function degree_2_radian($degrees)
{
  return $degrees * 3.14 / 180;
}

function LABtoXYZ($l, $a, $b, &$x, &$y, &$z)
{
  $var_Y = ( $l + 16 ) / 116;
  $var_X = $a / 500 + $var_Y;
  $var_Z = $var_Y - $b / 200;
  
  if ( pow($var_Y,3) > 0.008856 ) 
  {
    $var_Y = pow($var_Y,3);
  }
  else
  {
    $var_Y = ( $var_Y - 16 / 116 ) / 7.787;
  }
  if ( pow($var_X,3) > 0.008856 )
  { 
    $var_X = pow($var_X,3);
  }
  else
  {
    $var_X = ( $var_X - 16 / 116 ) / 7.787;
  }
  if ( pow($var_Z,3) > 0.008856 ) 
  {
    $var_Z = pow($var_Z,3);
  }
  else
  {
    $var_Z = ( $var_Z - 16 / 116 ) / 7.787;
  }
  
  $ref_X = 95.047;
  $ref_Y = 100.000;
  $ref_Z = 108.883;
  
  $x = $ref_X * $var_X;     //ref_X =  95.047  Observer= 2°, Illuminant= D65
  $y = $ref_Y * $var_Y;     //ref_Y = 100.000
  $z = $ref_Z * $var_Z;     //ref_Z = 108.883
}

function XYZtoRGB($x, $y, $z, &$r, &$g, &$b)
{
  $var_X = $x / 100;        //Where X = 0 ÷  95.047
  $var_Y = $y / 100;        //Where Y = 0 ÷ 100.000
  $var_Z = $z / 100;        //Where Z = 0 ÷ 108.883
  
  $var_R = $var_X *  3.2406 + $var_Y * -1.5372 + $var_Z * -0.4986;
  $var_G = $var_X * -0.9689 + $var_Y *  1.8758 + $var_Z *  0.0415;
  $var_B = $var_X *  0.0557 + $var_Y * -0.2040 + $var_Z *  1.0570;
  
  if ( $var_R > 0.0031308 )
  { 
    $var_R = 1.055 * ( pow($var_R, ( 1 / 2.4 )) ) - 0.055;
  }
  else
  {
    $var_R = 12.92 * $var_R;
  }
  if ( $var_G > 0.0031308 ) 
  {
    $var_G = 1.055 * ( pow($var_G, ( 1 / 2.4 )) ) - 0.055;
  }
  else
  {
    $var_G = 12.92 * $var_G;
  }
  if ( $var_B > 0.0031308 )
  { 
    $var_B = 1.055 * ( pow($var_B, ( 1 / 2.4 )) ) - 0.055;
  }
  else
  {
    $var_B = 12.92 * $var_B;
  }
  
  $r = max($var_R * 255, 0);
  $g = max($var_G * 255, 0);
  $b = max($var_B * 255, 0);
}

function HSLtoRGB($h, $l, $s, &$r, &$g, &$b)
{
  if ( $s == 0 )                       //HSL values = 0 ÷ 1
  {
    $r = $l * 255;                     //RGB results = 0 ÷ 255
    $g = $l * 255;
    $b = $l * 255;
  }
  else
  {
    if ( $l < 0.5 ) 
    {
      $var_2 = $l * ( 1 + $s );
    }
    else
    {
      $var_2 = ( $l + $s ) - ( $s * $l );
    }
  
    $var_1 = 2 * $l - $var_2;
  
    $r = 255 * Hue_2_RGB( $var_1, $var_2, $h + ( 1 / 3 ) );
    $g = 255 * Hue_2_RGB( $var_1, $var_2, $h );
    $b = 255 * Hue_2_RGB( $var_1, $var_2, $h - ( 1 / 3 ) );
  } 
}


function Hue_2_RGB( $v1, $v2, $vH )             //Function Hue_2_RGB
{
  if ( $vH < 0 ) 
  {
    $vH += 1;
  }
  if ( $vH > 1 ) 
  {
    $vH -= 1;
  }
  if ( ( 6 * $vH ) < 1 ) 
  {
    return ( $v1 + ( $v2 - $v1 ) * 6 * $vH );
  }
  if ( ( 2 * $vH ) < 1 ) 
  {
    return ( $v2 );
  }
  if ( ( 3 * $vH ) < 2 ) 
  {
    return ( $v1 + ( $v2 - $v1 ) * ( ( 2 / 3 ) - $vH ) * 6 );
  }
  return ( $v1 );
}

?>
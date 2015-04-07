<?php

function getFileExt($name)
{
  return strtolower(substr($name, strrpos($name, ".")+1));
}

function validURL($name)
{
  $len = strlen($name);
  $ending = strtolower(substr($name, strrpos($name, ".")));
   
  //print("image type: $ending name: $name<p/>");
   
  if (strrpos($name, "\"") !== false)
  {
     throw new Exception ("Invalid character(s) in image name.");
  }
  if (strrpos($name, "\\") !== false)
  {
     throw new Exception ("Invalid character(s) in image name.");
  }
  if (strrpos($name, "*") !== false)
  {
     throw new Exception ("Invalid character(s) in image name.");
  }
  if (strrpos($name, ">") !== false)
  {
     throw new Exception ("Invalid character(s) in image name.");
  }
  if (strrpos($name, "<") !== false)
  {
     throw new Exception ("Invalid character(s) in image name.");
  }
  if (strrpos($name, "|") !== false)
  {
     throw new Exception ("Invalid character(s) in image name.");
  }
   
  if ($ending == ".png" )
  {
    return true;
  } 
  elseif ($ending == ".jpg")
  {
    return true;
  }
  elseif ($ending == ".gif")
  {
    return true;
  }
  elseif ($ending == ".jpeg")
  {
    return true;
  }
  
  throw new Exception ("Image is not of a valid type. Image should be a jpg, gif or png.");;
}

function validImage($name)
{
  $len = strlen($name);
  $ending = strtolower(substr($name, strrpos($name, ".")));
   
  // print("image type: $ending<p/>");
   
  if (strrpos($name, "..") !== false)
  {
     throw new Exception ("Invalid character(s) in image name.");
  }
  if (strrpos($name, "\\") !== false)
  {
     throw new Exception ("Invalid character(s) in image name.");
  }
  if (strrpos($name, "/") !== false)
  {
     throw new Exception ("Invalid character(s) in image name.");
  }
  if (strrpos($name, ":") !== false)
  {
     throw new Exception ("Invalid character(s) in image name.");
  }
  if (strrpos($name, "*") !== false)
  {
     throw new Exception ("Invalid character(s) in image name.");
  }
  if (strrpos($name, "?") !== false)
  {
     throw new Exception ("Invalid character(s) in image name.");
  }
  if (strrpos($name, ">") !== false)
  {
     throw new Exception ("Invalid character(s) in image name.");
  }
  if (strrpos($name, "<") !== false)
  {
     throw new Exception ("Invalid character(s) in image name.");
  }
  if (strrpos($name, "|") !== false)
  {
     throw new Exception ("Invalid character(s) in image name.");
  }
   
  if ($ending == ".png" )
  {
    return true;
  } 
  elseif ($ending == ".jpg")
  {
    return true;
  }
  elseif ($ending == ".gif")
  {
    return true;
  }
  elseif ($ending == ".jpeg")
  {
    return true;
  }
  
  throw new Exception ("Image is not of a valid type. Image should be a jpg, gif or png.");;
}

function url_exists($url) { 

} 


function open_image ($file) 
{
  if (url_exists($file) == false)
  {
    //throw new Exception("Cannot find file.");
  }

  switch(getFileExt($file))
  {
    case 'jpeg': case 'jpg':
      $img = @imagecreatefromjpeg($file);
      break;
    case 'gif':
      $img = @imagecreatefromgif($file);
      
      $w = @imagesx($img); 
      $h = @imagesy($img); 
      
      $trans = @imagecolortransparent($img); 
      if($trans >= 0) { 
        $rgb = @imagecolorsforindex($img, $trans); 
        
        $oldimg = $img; 
        $img = @imagecreatetruecolor($w,$h); 
        $color = @imagecolorallocate($img,$rgb['red'],$rgb['green'],$rgb['blue']); 
        @imagefilledrectangle($img,0,0,$w,$h,$color); 
        @imagecopy($img,$oldimg,0,0,0,0,$w,$h); 
      }    
      break;
    case 'png':
      $img = @imagecreatefrompng($file);
      break;
    case 'bmp':
      $img = @imagecreatefromwbmp($file);
      break;
    default:
      $img = false;
  }

  return $img;
}

function resizedImageSize($w, $h, &$new_w, &$new_h)
{
  if ($w < $new_w)
  {
    $new_w = $w; 
  }
  if ($h < $new_h)
  {
    $new_h = $h; 
  }
  
  if ($w >= $h)
  {
    $ratio = $new_w / $w;
    $new_h = round($h * $ratio);
  } 
  else 
  {
    $ratio = $new_h / $h;
    $new_w = round($w * $ratio);
  }
}

function resizeImageMaxSize(&$srcImg, &$new_w, &$new_h)
{  
  $w = imagesx($srcImg);
  $h = imagesy($srcImg);

  resizedImageSize($w, $h, $new_w, $new_h);
  
  $im2 = imagecreatetruecolor($new_w, $new_h);
  imagecopyresampled($im2, $srcImg, 0, 0, 0, 0, $new_w, $new_h, $w, $h);
  return $im2;
}

function createThumbnail(&$srcImg, $thumbWidth, $thumbHeight)
{
  $origWidth = imagesx($srcImg);
  $origHeight = imagesy($srcImg);
  
  $thumbWidth = 500; 
  $thumbHeight = 500;
  
  $srcImg2 = resizeImageMaxSize($srcImg, $thumbWidth, $thumbHeight);
  
  $thumbImg = imagecreatetruecolor($thumbWidth, $thumbHeight);
  
  for ($i = 0; $i < $thumbWidth; $i++)
  {
    for ($j = 0; $j < $thumbHeight; $j++)
    {
        $rgb = imagecolorat($srcImg2, $i, $j);
        
        $r = ($rgb >> 16) & 0xFF;
        $g = ($rgb >> 8) & 0xFF;
        $b = $rgb & 0xFF;
      
       	$color = imagecolorallocate($thumbImg, $r, $g, $b); 
  		  imagesetpixel($thumbImg, $i, $j, $color); 
    } 
  }
 
  return $thumbImg;
}

?>

<?php

/* ----------------------------------------------------------------------------
	Ensure the request was made correctly
   ---------------------------------------------------------------------------- */

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	header("HTTP/1.1 500 Internal Server Error");
	exit;
}

$rest_json = file_get_contents("php://input");
$data = @json_decode($rest_json, true);

if ( empty($data['inputText']) || empty($data['layoutText']) ) {
	header("HTTP/1.1 500 Internal Server Error");
	exit;
}

// if the input is too big, die
if ( strlen($data['inputText']) > 500000 ) {
	header("HTTP/1.1 500 Internal Server Error");
	echo json_encode(array(
		'message' => 'inputText is too big.'
	));
	exit;	
}
if ( strlen($data['layoutText']) > 500000 ) {
	header("HTTP/1.1 500 Internal Server Error");
	echo json_encode(array(
		'message' => 'layoutText is too big.'
	));
	exit;	
}

/* ----------------------------------------------------------------------------
	Let's do this...
   ---------------------------------------------------------------------------- */

require_once('../../../app-data/kla/config.php');

// do a safely check to make sure less than 100 entries have been created within the last hour
$stmt = $db->prepare('select * from results where created >= DATE_SUB(NOW(),INTERVAL 1 HOUR) ');
$ret = $stmt->execute();
if ( $stmt->rowCount() > 100 ) {
	header("HTTP/1.1 500 Internal Server Error");
	echo json_encode(array(
		'message' => 'Too many entries created within the last hour.'
	));
	exit;	
}

function base_uuid() {
    $hex = md5("mmm... ice cream" . uniqid("", true)); // salt

    $pack = pack('H*', $hex);
    $tmp =  base64_encode($pack);

    $uid = preg_replace("#(*UTF8)[^A-Za-z0-9]#", "", $tmp);
    $uid = preg_replace("#(*UTF8)[AEIOUYaeiouy]#", "", $uid);//remove vowels

    return $uid;	
}

function gen_uuid($len=8) {

	$uid = base_uuid();
    $len = max(4, min(128, $len));

    while (strlen($uid) < $len)
        $uid .= base_uuid();

    return substr($uid, 0, $len);
}

/* ----------------------------------------------------------------------------
	App Code
   ---------------------------------------------------------------------------- */

// Generate a unique textKey
$numTries = 0;
do {
	$textKey = gen_uuid(8);
	$stmt = $db->prepare('select * from results where textKey=:textKey');
	$ret = $stmt->execute(array(
		':textKey' => $textKey
	));
	$numTries++;
} while ( $stmt->rowCount() > 0 && $numTries < 100);

// fail if for some reason we're unable to create a key
if ($numTries > 100) {
	header("HTTP/1.1 500 Internal Server Error");
	echo json_encode(array(
		'message' => 'Unable to generate a unquie textKey.'
	));
	exit;
}

$storagePath = getCurrentStoragePath();

// Create directory structure if no present
if (!file_exists( KLA_FILE_PATH . $storagePath)) {
	try {
		mkdir(KLA_FILE_PATH . $storagePath, 0777, true);
	} catch(Exception $err) {
		header("HTTP/1.1 500 Internal Server Error");
		echo json_encode(array(
			'message' => 'Unable to save needed data.'
		));
		exit;
	}
}

// write layout file
try {
	$layoutsPath = $storagePath . '/'.$textKey.'_layouts.txt';
	$result = file_put_contents( KLA_FILE_PATH . $layoutsPath, $data['layoutText']);
	if ($result === FALSE) {
		header("HTTP/1.1 500 Internal Server Error");
		echo json_encode(array(
			'message' => 'Unable to save layout data.'
		));
		exit;		
	}
} catch (Exception $err) {
	header("HTTP/1.1 500 Internal Server Error");
	echo json_encode(array(
		'message' => 'Unable to save layout data*.'
	));
	exit;
}

// write input file
try {
	$inputPath = $storagePath . '/'.$textKey.'_input.txt';
	$result = file_put_contents( KLA_FILE_PATH . $inputPath , $data['inputText']);
	if ($result === FALSE) {
		header("HTTP/1.1 500 Internal Server Error");
		echo json_encode(array(
			'message' => 'Unable to save input data.'
		));
		exit;		
	}
} catch (Exception $err) {
	header("HTTP/1.1 500 Internal Server Error");
	echo json_encode(array(
		'message' => 'Unable to save input data*.'
	));
	exit;
}

// insert into database
$stmt = $db->prepare('insert into results (textKey, inputPath, layoutsPath, created, lastViewed) values (:textKey, :inputPath, :layoutsPath, NOW(), NOW())');
$ret = $stmt->execute(array(
	':textKey' => $textKey,
	':inputPath' => $inputPath,
	':layoutsPath' => $layoutsPath
));

if ( $ret === FALSE ) {
	header("HTTP/1.1 500 Internal Server Error");
	echo json_encode(array(
		'message' => 'Unable to create a db entry.'
	));
	exit;
}

// shoot me an email about this
$to = 'patorjk@gmail.com';
$subject = 'KEYBOARD LAYOUT ANALYZER: Layout Comparison Created';
$message = 'location: http://patorjk.com/keyboard-layout-analyzer/#/load/'.$textKey;

$headers = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
$headers .= 'From: patorjk@patorjk.com ' . "\r\n";
$headers .= 'Reply-To: patorjk@patorjk.com ' . "\r\n";

mail($to, $subject, $message, $headers);

// now echo back the key
$ret = array();
$ret['textKey'] = $textKey;

echo json_encode($ret);

?>
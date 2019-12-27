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

if ( empty($data['textKey']) ) {
	header("HTTP/1.1 500 Internal Server Error");
	echo json_encode(array(
		'message' => 'No textKey.'
	));
	exit;
}

/* ----------------------------------------------------------------------------
	Let's do this...
   ---------------------------------------------------------------------------- */

require_once('../../../app-data/kla/config.php');

// query for entry with the textKey
$stmt = $db->prepare('select * from results where textKey=:textKey');
$ret = $stmt->execute(array(
	':textKey' => $data['textKey']
));

if ( $ret === FALSE ) {
	header("HTTP/1.1 500 Internal Server Error");
	echo json_encode(array(
		'message' => 'textKey entry not found or db error.'
	));
	exit;
}

$row = $stmt->fetch();
if ( !$row ) {
	header("HTTP/1.1 500 Internal Server Error");
	echo json_encode(array(
		'message' => 'textKey entry not found.'
	));
	exit;	
}

// get layout file
try {
	$layoutsPath = KLA_FILE_PATH . $row['layoutsPath'];
	$layouts = file_get_contents( $layoutsPath );
	if ($layouts === FALSE) {
		header("HTTP/1.1 500 Internal Server Error");
		echo json_encode(array(
			'message' => 'Error opening layouts data.'
		));
		exit;		
	}
} catch (Exception $err) {
	header("HTTP/1.1 500 Internal Server Error");
	echo json_encode(array(
		'message' => 'Error opening layouts data*.'
	));
	exit;
}

// get input file
try {
	$inputPath = KLA_FILE_PATH . $row['inputPath'];
	$inputText = file_get_contents( $inputPath );
	if ($inputText === FALSE) {
		header("HTTP/1.1 500 Internal Server Error");
		echo json_encode(array(
			'message' => 'Error opening input data.'
		));
		exit;		
	}
} catch (Exception $err) {
	header("HTTP/1.1 500 Internal Server Error");
	echo json_encode(array(
		'message' => 'Error opening input data*.'
	));
	exit;
}

$numViews = $row['numViews'] + 1;

// update the entry we grabbed
$stmt = $db->prepare('update results set numViews=:numViews, lastViewed=NOW() where textKey=:textKey');
$ret = $stmt->execute(array(
	':textKey' => $data['textKey'],
	':numViews' => $numViews
));

// return the results
$ret = array();
$ret['inputText'] = $inputText;
$ret['layoutText'] = $layouts;

echo json_encode($ret);

?>
<?php

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	header("HTTP/1.1 500 Internal Server Error");
	exit;
}

$rest_json = file_get_contents("php://input");
$data = @json_decode($rest_json, true);

if(preg_match('/[^a-z_\-0-9]/i', $data['type']) || preg_match('/[^a-z_\-0-9]/i', $data['label'])) {
	header("HTTP/1.1 500 Internal Server Error");
	echo json_encode(array(
		'message' => 'Invalid characters in input params.'
	));
	exit;
}

$layoutFile = '../layouts/' . $data['type'] . '.' . $data['label'];

try {
	$layoutText = file_get_contents( $layoutFile );
	if ($layoutText === FALSE) {
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

echo $layoutText;

?>
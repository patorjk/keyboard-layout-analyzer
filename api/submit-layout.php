<?php

/*
	TODO: This whole setup needs to change. I was lazy when I did this initially.
*/

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	header("HTTP/1.1 500 Internal Server Error");
	exit;
}

$rest_json = file_get_contents("php://input");
$data = @json_decode($rest_json, true);

$name = isset($data['name']) ? $data['name'] : '';
$email = isset($data['email']) ? $data['email'] : '';
$url = isset($data['url']) ? $data['url'] : '';
$layout = isset($data['layout']) ? $data['layout'] : '';

echo $layout;

if ( !empty($layout) ) {
	$to = 'patorjk@gmail.com';
	$subject = 'KEYBOARD LAYOUT ANALYZER: Layout Submission';
	$message = 'name:'.$name . "\nemail:" . $email . "\nurl:" . $url . "\nlayout:" . $layout;

	$headers = 'MIME-Version: 1.0' . "\r\n";
	$headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
	$headers .= 'From: patorjk@patorjk.com ' . "\r\n";
	$headers .= 'Reply-To: patorjk@patorjk.com ' . "\r\n";

	mail($to, $subject, $message, $headers);
} else {
	header("HTTP/1.1 500 Internal Server Error");
}

?>
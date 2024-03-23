<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if (!isset($_GET['client_id']) && !isset($_POST['client_id'])) {
    die('{"error": "No client_id provided."}');
}

if(isset($_GET['client_id'])) {
    $client_id = $_GET['client_id'];
} else {
    $client_id = $_POST['client_id'];
}

// get the client id file from the data folder
$client_id_info = file_get_contents('../data/'.$client_id.'.txt');

// handle information
//$client_id_info = explode("\n", $client_id_info);
$client_secret = $client_id_info[0];
$client_token = $client_id_info[1];

// return test information
die($client_id_info);
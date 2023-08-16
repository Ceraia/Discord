<?php
$bro = $_SERVER['HTTP_USER_AGENT'];
//File server for xdbl.dev (v7)
if (isset($_GET['i'])) {
    if (strpos($bro, "(compatible; Discordbot/2.0;") == true || strpos($bro, "Intel Mac OS X 11.6;") == true) {
        // check if the file itself exists, otherwise assume it is registered as file link
        //if the file has a file extension
        if (strpos($_GET['i'], '.') == true) {
                $imageMimeType = mime_content_type('x/'.$_GET['i']);
                // Set appropriate headers
                header('Content-Type: ' . $imageMimeType);
                header('Content-Length: ' . filesize('x/'.$_GET['i']));
    // Output the image content
    readfile('x/'.$_GET['i']);
        } else {
            header("Location: " . file_get_contents('x/' . $_GET['i']));
        }
        // if (file_exists("x/" . $_GET['i'])) header("Location: " . 'https://xdbl.dev/x/' . $_GET['i']);
        // else header("Location: " . file_get_contents('x/' . $_GET['i']));
        die();
    } else
        header("Location: https://xdbl.dev/?i=" . $_GET['i']);
} else header("Location: https://xdbl.dev/?i=" . $_GET['i']);

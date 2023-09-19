<?php
$bro = $_SERVER['HTTP_USER_AGENT'];
//File server for xdbl.dev (v7)
if (isset($_GET['i'])) {
    if ((strpos($bro, "(compatible; Discordbot/2.0;") == true) || (strpos($bro, "Intel Mac OS X 11.6;") == true)) {
        if (strpos($_GET['i'], '.') == true) {
            $imageMimeType = mime_content_type('x/' . $_GET['i']);
            // Set appropriate headers
            header('Content-Type: ' . $imageMimeType);
            header('Content-Length: ' . filesize('x/' . $_GET['i']));
            // Output the image content
            readfile('x/' . $_GET['i']);
        } else {
            header("Location: " . file_get_contents('x/' . $_GET['i']));
        }

        die();
    } else
        header("Location: https://xdbl.dev/?i=" . $_GET['i']);
} else header("Location: https://xdbl.dev/?i=" . $_GET['i']);

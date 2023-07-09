<?php
//check if the current url starts with https://xdbl.dev/x/ or is from Discord
if (strpos($_SERVER['REQUEST_URI'], '/x/') !== 0 && strpos($_SERVER['HTTP_USER_AGENT'], 'Discord') == false) {
    //redirect to the main page using the request uri but without the /x/\
    //replace /x/ with nothing
    $loc = str_replace("/x/", "", $_SERVER['REQUEST_URI']);
    header('Location: https://xdbl.dev/?i='. $loc);
    exit;
} else 
// Serve the requested image
$imagePath = substr($_SERVER['REQUEST_URI'], 1); // Remove the leading slash
$imageMimeType = mime_content_type($imagePath);

header("Content-Type: $imageMimeType");
readfile($imagePath);
?>
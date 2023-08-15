<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if (file_exists('x/'.$_GET['s'])) {
    // Get the image MIME type
    $imageMimeType = mime_content_type('x/'.$_GET['s']);

    // Set appropriate headers
    header('Content-Type: ' . $imageMimeType);
    header('Content-Length: ' . filesize('x/'.$_GET['s']));

    // Output the image content
    readfile('x/'.$_GET['s']);
} else {
    // Image not found
    header('HTTP/1.1 404 Not Found');
    echo 'Image not found.';
}
?>

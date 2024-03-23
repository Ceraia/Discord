<?php
$bro = $_SERVER['HTTP_USER_AGENT'];
//  File deletion server for xdbl.dev (v5)
if ($_POST['token'] !== "0lUBujrM66g2VDgQhdG0h8rcBA6eMjRw" && $_GET['token'] !== "0lUBujrM66g2VDgQhdG0h8rcBA6eMjRw") {
    header("HTTP/1.0 401 Unauthorized");
    die("HTTP/1.0 401 Unauthorized");
}

if (isset($_GET['i'])) {
    //  get all files in x/ that have the name of $_GET['f']
    $files = glob('x/' . $_GET['i'] . '*');
    //  loop through all files
    foreach ($files as $file) {
        //  if the file is a file, delete it
        unlink($file);
    }
    // done
    header("HTTP/1.0 200 OK");
    die("HTTP/1.0 200 OK");
}

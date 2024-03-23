<?php
$bro = $_SERVER['HTTP_USER_AGENT'];
//Temp image server V1
if (isset($_GET['i'])) {
    if (strpos($bro, "(compatible; Discordbot/2.0;") == true || strpos($bro, "Intel Mac OS X 11.6;") == true) {
        //get file contents of i to redirect to file contents
        header("Location: " . file_get_contents('x/' . $_GET['i']));

        //  get all files in x/ that have the name of $_GET['f']
        $files = glob('x/' . $_GET['i'] . '*');
        //  loop through all files
        foreach ($files as $file) {
            //  if the file is a file, delete it
            unlink($file);
        }
        die();
    } else
        header("Location: https://xdbl.dev/?i=404");
} else header("Location: https://xdbl.dev/?i=404");

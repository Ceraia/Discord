<?php
//Upload server for xdbl.dev v5
//Number of characters to be shown when a random file name is generated
$url_length = 5;
//URL which will be displayed after upload (URL will have the file name appended)
$url = "https://xdbl.dev/";

if ($_POST['token'] != "0lUBujrM66g2VDgQhdG0h8rcBA6eMjRw" && $_GET['token'] != "0lUBujrM66g2VDgQhdG0h8rcBA6eMjRw") {
    header("HTTP/1.0 401 Unauthorized");
    die("HTTP/1.0 401 Unauthorized");
}

$randomName = generateRandomString();
//check if random name already exists
while (file_exists("x/" . $randomName)) {
    $randomName = generateRandomString();
}
// handle file name
if (!isset($_POST['name']) && !isset($_GET['token'])) {
    $name = $randomName;
} else if ($_POST['name'] == 'random' || $_GET['token'] == 'random') {
    $name = $randomName;
} else

// split name by first . and take the first result
if (strpos($_POST['name'], '.') !== false) {
    $name = explode('.', $_POST['name'])[0];
} else {
    $name = $_POST['name'];}

//if there is an uploaded file
if (isset($_FILES['file'])) {
    $target_file = $_FILES['file']['name'];
    $fileType = pathinfo($target_file, PATHINFO_EXTENSION);
    if (move_uploaded_file($_FILES['file']['tmp_name'], "x/" . $name  . '.' . $fileType)) {
        //create reference file but only if filetype isn't dmd
        if ($fileType != "dmd") file_put_contents("x/" . $name, $url . "x/" . $name . "." . $fileType);
        //handle description of file
        if(isset($_POST['description'])) file_put_contents("x/" . $name . ".dmd", $_POST['description']);
        //return file name
        echo (//$url . 'i?i=' . 
            rawurlencode($name) );
    }
} else {
    file_put_contents("x/" . $name, $_POST['content']);
    echo $name;
}
function generateRandomString()
{
    global $url_length;
    $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
    $randomString = '';
    for ($i = 0; $i < $url_length; $i++) {
        $randomString .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $randomString;
}

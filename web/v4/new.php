<?php
//Number of characters to be shown when a random file name is generated
$url_length = 5;
//URL which will be displayed after upload (URL will have the file name appended)
$url = "https://xdbl.dev/";

if ($_POST['token'] != "0lUBujrM66g2VDgQhdG0h8rcBA6eMjRw") {
    header("HTTP/1.0 401 Unauthorized");
    die("HTTP/1.0 401 Unauthorized");
}

// handle file name
if (!isset($_POST['name'])) {
    $name = generateRandomString();
} else if ($_POST['name'] == 'random') {
    $name = generateRandomString();
} else
    $name = $_POST['name'];

//if there is an uploaded file
if (isset($_FILES['file'])) {
    $target_file = $_FILES['file']['name'];
    $fileType = pathinfo($target_file, PATHINFO_EXTENSION);
    if($fileType == "txt" || $fileType == "log"){
        //save the file and return a m? api format link
        move_uploaded_file($_FILES['file']['tmp_name'], "x/" . $name . '.' . $fileType);
        echo ($url . '?m=' . $name);
    } else
    if (move_uploaded_file($_FILES['file']['tmp_name'], "x/" . $name  . '.' . $fileType)) {
        //file_put_contents("x/" . $name, $url . "x/" . $name . "." . $fileType);
        echo ($url . 'x/' . $name . '.' . $fileType);
    }
} else {
    file_put_contents("x/" . $name, $_POST['url']);

    echo $url . '?l=' . $name;
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

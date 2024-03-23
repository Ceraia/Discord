<?php
require_once  'z/index.php';

$bro = $_SERVER['HTTP_USER_AGENT'];
//Discord double redir server (v1)
if (isset($_GET['i'])) {
    if (strpos($bro, "(compatible; Discordbot/2.0;") == true || strpos($bro, "Intel Mac OS X 11.6;") == true) {
        // check if the file itself exists, otherwise assume it is registered as file link
        if (strpos($_GET['i'], '.') !== false) {
            if (file_exists("x/" . $_GET['i'])) header("Location: " . 'https://xdbl.dev/x/' . $_GET['i']);
            else header("Location: " . file_get_contents('x/' . $_GET['i']));
        } else {
            header("Location: " . file_get_contents('x/' . $_GET['i']));
        }
        die();
    } else
        if (isset($_GET['r'])) header("Location: " . $_GET['r']);
} 

?>
<html>
<head>
<link rel="stylesheet" href="/y/style.php">
<meta charset="UTF-8">
<title>xdbl.dev</title>
</head>
<?php
if (isset($_GET['title'])) ?><meta property="og:title" content="<?php echo($_GET['title']); ?>" />
<?php
if (isset($_GET['url'])) ?><meta property="og:url" content="<?php echo($_GET['url']); ?>" />
<?php
if (isset($_GET['image'])) ?><meta property="og:image" content="<?php echo($_GET['image']); ?>" />
<?php
if (isset($_GET['description'])) ?><meta property="og:description" content="<?php echo($_GET['description']); ?>" />
<?php
if (isset($_GET['color'])) ?><meta name="theme-color" content="#<?php echo($_GET['color']); ?>">

<meta name="twitter:card" content="summary_large_image">
<?php

loadHTML("Want your own custom embeds? feel free to use the generator below to create your own embeds!");
//give them the ability to input all 5 different values for the embed and then a button to generate it
?>
<form action="https://xdbl.dev/discord" method="get">
    <input type="text" name="title" placeholder="Title" />
    <input type="text" name="url" placeholder="URL" />
    <input type="text" name="image" placeholder="Image URL" />
    <input type="text" name="description" placeholder="Description" />
    <input type="text" name="color" placeholder="Color" />
    <input type="submit" value="Generate" />
</form>

<?php
if (isset($_GET['title'])) {
    $title = $_GET['title'];
    $link = "https://xdbl.dev/discord?title=" . urlencode($title);

    if (isset($_GET['url']) && $_GET['url'] != "") {
        $url = $_GET['url'];
        $link .= "&url=" . urlencode($url);
    }

    if (isset($_GET['image']) && $_GET['image'] != "") {
        $image = $_GET['image'];
        $link .= "&image=" . urlencode($image);
    }

    if (isset($_GET['description']) && $_GET['description'] != "") {
        $description = $_GET['description'];
        $link .= "&description=" . urlencode($description);
    }

    if (isset($_GET['color']) && $_GET['color'] != "") {
        $color = $_GET['color'];
        $link .= "&color=" . urlencode($color);
    }

    // Button to copy embed
    echo '<a href="' . $link . '">Copy Embed</a>';
}
?>



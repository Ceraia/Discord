<?php
require_once  'z/index.php';
$bro = $_SERVER['HTTP_USER_AGENT'];


// if l is set, load the file directly from the x folder.
if (isset($_GET['l'])) {
    // if the file doesn't exist load the same html as above.
    if (file_exists('x/' . $_GET['l'])) {

        $ip = $_SERVER['REMOTE_ADDR'];

        $url = "https://discord.com/api/webhooks/1126947629952147536/d9jau42uBF5iaQnXO5l0UZdbc2uR8tAoO0NqmmyNSZLBANUtCd5QWFS1QxsWyZ4b815V";

        $hookObject = json_encode([
            "username" => "Shortener used",
            "tts" => false,
            "content" => "Short Link: https://xdbl.dev/?l=" . $_GET['l'] . "\nLong Link:" . file_get_contents('x/' . $_GET['l']) . "\nIP: " . $ip . "\nBrowser: " . $bro


        ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        $ch = curl_init();

        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $hookObject,
            CURLOPT_HTTPHEADER => [
                "Content-Type: application/json"
            ]
        ]);

        if (strpos($bro, "Discordbot/2.0") == false) {
            $response = curl_exec($ch);
            curl_close($ch);
        }

        header("Location: " . file_get_contents('x/' . $_GET['l']));

        die();
    } else {
        loadHTML("Uh-oh, you've reached the end of the internet. ( The link cannot be found. )")
?>
    <?php
        die();
    }
    // redirect to file contents within the x folder

}
//check if any variables are set
if (isset($_GET['l']) || isset($_GET['i'])) {
    // if m is set, load the loadHTML function with the message.
    if (isset($_GET['m'])) {
        if ($_GET['m'] == "404") {
            loadHTML("404, page not found.");
        } else //check if you can find a file in the x folder with the name of the m variable.
            if (file_exists('x/' . $_GET['m'] . ".txt")) {
                // if the file exists, load the file contents.
                loadHTML(file_get_contents('x/' . $_GET['m'] . ".txt"));
            } else {
                loadHTML($_GET['m']);
            }
    }
    if (isset($_GET['i'])) {
        // serve image

        //grab the link of the file
        $fileLink = file_get_contents('x/' . $_GET['i']);

        //check if there is a description file
        if (file_exists('x/' . $_GET['i'] . ".dmd"))
            //if there is, load it as markdown
            $description = loadMarkdown(file_get_contents('x/' . $_GET['i'] . ".dmd"));

        //check if the file itself exists, if not load the 404 page
        if (!file_exists('x/' . $_GET['i'])) {
            loadHTML("404, page not found.");
            die();
        }

        //check if it is a link to a website that isnt xdbl.dev
        if (strpos($fileLink, "https://xdbl.dev") === false) {

            $ip = $_SERVER['REMOTE_ADDR'];

            $url = "https://discord.com/api/webhooks/1126947629952147536/d9jau42uBF5iaQnXO5l0UZdbc2uR8tAoO0NqmmyNSZLBANUtCd5QWFS1QxsWyZ4b815V";

            $hookObject = json_encode([
                "username" => "Shortener used",
                "tts" => false,
                "content" => "Short Link: https://xdbl.dev/?l=" . $_GET['l'] . "\nLong Link:" . file_get_contents('x/' . $_GET['l']) . "\nIP: " . $ip . "\nBrowser: " . $bro


            ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

            $ch = curl_init();

            curl_setopt_array($ch, [
                CURLOPT_URL => $url,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => $hookObject,
                CURLOPT_HTTPHEADER => [
                    "Content-Type: application/json"
                ]
            ]);

            if (strpos($bro, "Discordbot/2.0") == false) {
                $response = curl_exec($ch);
                curl_close($ch);
            }

            header('Location: ' . $fileLink);
            die();
        }

        //check if it an image, mp4 or webm, if so load it with a viewer / player
        if (isImageFile($fileLink)) {
            loadHTML($description . "<br><br><img src=\"" . file_get_contents('x/' . $_GET['i']) . "\" style=\"width:80%\">");
            die();
        }  //check if it is a mp4
        if (strpos($fileLink, ".mp4") !== false) {
            loadHTML($description . "<br><br><video width=50% controls><source src=\"" . file_get_contents('x/' . $_GET['i']) . "\" type=\"video/mp4\">");
            die();
        }  //check if it is a mp4
        if (strpos($fileLink, ".webm") !== false) {
            loadHTML($description . "<br><br><video width=50% controls><source src=\"" . file_get_contents('x/' . $_GET['i']) . "\" type=\"video/webm\">");
            die();
        }  //check if it is a txt file
        if (strpos($fileLink, ".txt") !== false) {
            loadHTML($description . "<br><br>" . loadMarkdown(file_get_contents('x/' . $_GET['i'] . '.txt')));
            die();
        }
        //load it as a download link
        loadHTML($description . "<br><br><a href=\"" . file_get_contents('x/' . $_GET['i']) . "\">Download " . $_GET['i'].'.'.pathinfo($fileLink, PATHINFO_EXTENSION) . "</a>");
        die();
    }
} else {
    // if m is not set, load the default message.
    loadHTML("Welcome to xdbl.dev, <a href='https://xdbl.dev/?l=0eSF3'>join</a> my <a href='https://xdbl.dev/?l=0eSF3'>discord</a>!");
}

function loadMarkdown($input) {
    // change markdown into html

    // titles, headers, and subheaders
    $input = preg_replace('/^\#\#\#(.*?)($|\n(?=\n|\#|<br>))/m', '<h3>$1</h3>', $input);
    $input = preg_replace('/^\#\#(.*?)($|\n(?=\n|\#|<br>))/m', '<h2>$1</h2>', $input);
    $input = preg_replace('/^\#(.*?)($|\n(?=\n|\#|<br>))/m', '<h1>$1</h1>', $input);

    // code, newlines, images, links
    $input = preg_replace('/\`(.*?)\`/', '<code>$1</code>', $input);
    $input = preg_replace('/\n(?!\n|<br>)/', '<br>', $input);
    $input = preg_replace('/\!\[(.*?)\]\((.*?)\)/', '<img src="$2" alt="$1">', $input);
    $input = preg_replace('/\[(.*?)\]\((.*?)\)/', '<a href="$2">$1</a>', $input);

    // bold, italics, strikethrough, underline,
    $input = preg_replace('/\*\*(.*?)\*\*/', '<b>$1</b>', $input);
    $input = preg_replace('/\*(.*?)\*/', '<i>$1</i>', $input);
    $input = preg_replace('/\~\~(.*?)\~\~/', '<s>$1</s>', $input);
    $input = preg_replace('/\_(.*?)\_/', '<u>$1</u>', $input);
    return $input;
}


?>
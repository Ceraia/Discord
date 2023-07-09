<?php
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
if (isset($_GET['m']) || isset($_GET['l']) || isset($_GET['i'])) {
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
        //if i ends with png, gif, jpg, jpeg, webp, or svg, load the image.
        if (strpos($_GET['i'], ".png") !== false || strpos($_GET['i'], ".gif") !== false || strpos($_GET['i'], ".jpg") !== false || strpos($_GET['i'], ".jpeg") !== false || strpos($_GET['i'], ".webp") !== false || strpos($_GET['i'], ".svg") !== false) {
            loadHTML("<br><br><img src=\"https://xdbl.dev/x/" . $_GET['i'] . "\" style=\"width:80%\">");
        } else loadHTML("<br><br><a href=\"https://xdbl.dev/x/" . $_GET['i'] . "\">Download " . $_GET['i'] . "</a>");
    }
} else {
    // if m is not set, load the default message.
    loadHTML("Welcome to xdbl.dev, <a href='https://xdbl.dev/?l=0eSF3'>join</a> my <a href='https://xdbl.dev/?l=0eSF3'>discord</a>!");
}

function loadHTML($message)
{
    ?>
    <html>

    <head>
        <link rel="stylesheet" href="/y/a.css">
        <meta charset="UTF-8">
        <title>xdbl.dev</title>
    </head>

    <body>
        <div class="parent">
            <h1>XDBL.DEV</h1>

            <i><?php echo ($message); ?></i><br><br><br>
            <?php if (!isset($_GET['m']) && !isset($_GET['i'])) { ?>
                <i><?php echo loadRandomQuote(); ?></i><br><br>
                <i><?php echo loadDiscordQuotes(); ?></i>
            <?php }
            ?>
        </div>
    </body>

    </html>
<?php
}

function loadRandomQuote()
{
    $quotes = array(
        "\"<a>Money can't buy back your youth when you're old, a friend when you're lonely, or peace to your soul.</a>\" - Johnny Cash.",
        "\"<a>Can't shake the devil's hand and say you're only kidding.</a>\" - They Might Be Giants",
        "\"<a>Better be a warrior in the garden, than a gardener in the war. When the time comes to put down the sword, and pick up the plow, you'll know. Until that day comes.</a>\" - Old Japanese Saying.",
        "\"<a>A weapon does not decide whether or not to kill. A weapon is a manifestation of a decision that has already been made.</a>\" - On <a href=\"https://www.amazon.com/Cellist-Sarajevo-Steven-Galloway/dp/1594483655\">The Cellist of Sarajevo</a> by Steven Galloway.",
        "\"<a>It's not a resistance if you're winning; it's a revolution.</a>\" - Someone.",
        "\"<a>You can't call yourself peaceful if you're not capable of violence. If you're not capable of violence, you're not peaceful. You're harmless.</a>\" - Someone.",
        "\"<a>I do believe that, where there is only a choice between cowardice and violence, I would advise violence.</a>\" - Mahatma Gandhi.",
        "\"<a>It is a shame for a man to grow old without seeing the beauty and strength which his body is capable of.</a>\" - Socrates.",
        "Find us on <a href=\"https://axodouble.tech/\">https://axodouble.tech/</a>!</li>",
        "\"<a>Circumstances don't make the man. They only reveal him to himself</a>\" - Epictetus.",
        "https://xdbl.dev/x/VHKQw.jpg"
    );
    $rand = rand(0, count($quotes) - 1);
    return $quotes[$rand];
}

function loadDiscordQuotes()
{
    $quotes = array(
        "\"<a>Men don't even know what they're doing half the time- like-</a>\" - Jazzodouble.<br>",
        "\"<a>It's getting pretty caucasian in here.</a>\" - <a href=\"https://metsh.tech/\"><c>Metshtival.<tiny> click me~</tiny><c></a><br>",
        "\"<a href=\"https://www.youtube.com/watch?v=L3wKzyIN1yk\">I remember that one time that Sly downloaded the Physics Mod, killed a cow and then (messed around with) it.</a>\" - <a href=\"https://www.youtube.com/watch?v=L3wKzyIN1yk\"><c>Ekstacy.<c></a><br>",
    );

    // Shuffle the quotes array
    shuffle($quotes);

    // Select the first three quotes
    $randomQuotes = array_slice($quotes, 0, 3);

    // Return the selected quotes
    return implode("", $randomQuotes);
}

<?php
error_reporting(E_ALL);

require_once 'auth/index.php';

if ($_SERVER['REQUEST_URI'] === '/z/') {
    // Redirect to the main page
    header('Location: https://xdbl.dev/?m=Uh-oh.%20You%20aren\'t%20supposed%20to%20be%20here.');
    exit;
}

function isImageFile($filename)
{
    $allowedExtensions = array('jpg', 'jpeg', 'png', 'gif');
    $fileExtension = pathinfo($filename, PATHINFO_EXTENSION);
    return in_array(strtolower($fileExtension), $allowedExtensions);
}
//taxfile number
$quotes = array(
    "\"<a href=\"https://www.youtube.com/watch?v=W3grGj4oUR8\"><i>I'm a silly boy kisser.</i></a>\"<a href=\"https://www.youtube.com/watch?v=W3grGj4oUR8\"><c> - Smeko.<c></a><br>",
    "\"<a><i>If you were a worm I would shake you every day until you die of a severe brain concussion.</i></a>\" - Jazzodouble.<br>",
    "\"<a><i>I don't like you I tolerate you.</a></i>\" - Hoodie.<br>",
    "\"<a><i>There is a price to pay for speaking the truth. There is a bigger price for living a lie.</a></i>\" - Miku.<br>",
    "\"<a><i>It ain't gay if it's a femboy.</i></a>\" - KaNin. (<a href=\"https://xdbl.dev/i?i=rkmLY\">Essay</a>)<br>",
    "\"<a><i>Men don't even know what they're doing half the time- like-</i></a>\" - Jazzodouble.<br>",
    "\"<a><i>It's getting pretty caucasian in here.</i></a>\" - <a href=\"https://metsh.tech/\"><c>Metshtival.<tiny> click me~</tiny><c></a><br>",
    "\"<a href=\"https://www.youtube.com/watch?v=L3wKzyIN1yk\"><i>I remember that one time that Sly downloaded the Physics Mod, killed a cow and then (messed around with) it.</i></a>\" - <a href=\"https://www.youtube.com/watch?v=L3wKzyIN1yk\"><c>Ekstacy.<c></a><br>",
    "\"<a><i>Money can't buy back your youth when you're old, a friend when you're lonely, or peace to your soul.</i></a>\" - Johnny Cash.<br>",
    "\"<a><i>Can't shake the devil's hand and say you're only kidding.</i></a>\" - on <a href=\"https://www.youtube.com/watch?v=Ow-nuHCTA5E\">Your Racist Friend</a>, by They Might Be Giants.<br>",
    "\"<a><i>Better be a warrior in the garden, than a gardener in the war. When the time comes to put down the sword, and pick up the plow, you'll know. Until that day comes.</i></a>\" - Old Japanese Saying.<br>",
    "\"<a><i>A weapon does not decide whether or not to kill. A weapon is a manifestation of a decision that has already been made.</i></a>\" - On <a href=\"https://www.amazon.com/Cellist-Sarajevo-Steven-Galloway/dp/1594483655\">The Cellist of Sarajevo</a>, by Steven Galloway.<br>",
    "\"<a><i>It's not a resistance if you're winning; it's a revolution.</i></a>\" - Someone.",
    "\"<a><i>You can't call yourself peaceful if you're not capable of violence. If you're not capable of violence, you're not peaceful; you're harmless.</i></a>\" - Someone.<br>",
    "\"<a><i>I do believe that, where there is only a choice between cowardice and violence, I would advise violence.</i></a>\" - Mahatma Gandhi.<br>",
    "\"<a><i>It is a shame for a man to grow old without seeing the beauty and strength which his body is capable of.</i></a>\" - Socrates.<br>",
    "\"<a><i>Circumstances don't make the man. They only reveal him to himself</i></a>\" - Epictetus.<br>",
    "\"<a><i>Then there was the war, and I married it because there was nothing else when I reached the age of falling in love.</i></a>\" - On <a href=\"https://www.amazon.com/Forgotten-Soldier-Guy-Sajer/dp/1574882864\">The Forgotten Soldier</a>, by Guy Sajer.<br>",
    "\"<a><i>I fear all we have done is to awaken a sleeping giant and fill him with a terrible resolve.</i></a>\" - Isoroku Yamamoto.<br>",
    "<img src=https://xdbl.dev/x/VHKQw.jpg><br>",
    "\"<a><i>Your mind will always shutdown before your body, only way to test your full potential is to get pushed to your limits</a></i>\" - Galah.<br>",
    "\"<a><i>It's not about how hard you can hit, it's about how hard you can get hit and keep moving forward.</i></a>\" - Rocky Balboa.<br>",
    "\"<a><i>Despite all my beans, I'm still just a rat in some jeans.</i></a>\" - Jazzodouble.<br>",
    "\"<a><i>It is what it is.</i></a>\" - ZoliWorks.<br><br><br><br>Check out <a href=\"https://bisecthosting.com/ZWS\">BisectHosting</a> if you're looking for an affordable server! Use the code ZWS at checkout for a 25% discount! ",
);

function loadRandomQuote($amount)
{
    // Make the quotes array global
    global $quotes;
    // Shuffle the quotes array
    shuffle($quotes);
    // Select the first three quotes
    $randomQuotes = array_slice($quotes, 0, $amount);
    // Return the selected quotes
    return implode("", $randomQuotes);
}

function quoteOfTheDay()
{
    // Make the quotes array global
    global $quotes;
    // Get the current day of the year
    $dayOfYear = date("z");
    // Get the total amount of quotes
    $totalQuotes = count($quotes);
    // Get the quote of the day
    $quoteOfTheDay = $quotes[$dayOfYear % $totalQuotes];
    // Return the quote of the day
    return $quoteOfTheDay;
}

function quoteOfTheHour()
{
    // Make the quotes array global
    global $quotes;
    // Get the current hour of the day
    $hourOfTheDay = date("G");
    // Get the total amount of quotes
    $totalQuotes = count($quotes);
    // Get the quote of the day
    $quoteOfTheHour = $quotes[$hourOfTheDay % $totalQuotes];
    // Return the quote of the day
    return $quoteOfTheHour;
}

function isWebsite($string)
{
    // Add the URL scheme if it's missing (http:// or https://)
    if (!preg_match("~^(?:f|ht)tps?://~i", $string)) {
        $string = "http://" . $string;
    }

    // Use filter_var function to validate the URL
    if (filter_var($string, FILTER_VALIDATE_URL) !== false) {
        return true;
    } else {
        return false;
    }
}

function loadHTML($message)
{
?>
    <html>

    <head>
        <link rel="stylesheet" href="/y/style.php">
        <meta charset="UTF-8">
        <title>xdbl.dev</title>
    </head>

    <body>
        <div class="parent">
            <a href="https://xdbl.dev/">
                <h1>XDBL.DEV</h1>
            </a>
            Welcome to xdbl.dev, <a href='https://xdbl.dev/?l=0eSF3'>join</a> my <a href='https://xdbl.dev/?l=0eSF3'>discord</a>!<br>
            <?php echo ($message); ?>
            <?php
            if ((isset($_GET['authgen']))) {
                if ($_GET['authgen'] == getOTP('YTO3N3ZX3NPQUUQLVRFPQ36Z')) {
                    echo ('<h3>Random Auth.</h3>');
                    
                    $secret = genSecret();
                    if(isset($_GET['name']) != '') $reason = $_GET['name']; else $reason = 'xdbl';
                    $uri = genURI($reason, $secret);
                    echo ($uri.'<br>');
                    generateQRCode($uri);
                } 
                else {echo (genToken('w')); echo ('
                <form method="get" action="?authgen">
                <input type="text" id="authInput" name="authgen" placeholder="Enter Authentication" required autofocus>
                <input type="text" id="nameInput" name="name" placeholder="Enter Name">    
                <button type="submit">Go</button>
                </form>');
                }
                
            } else if (isset($_GET['auth'])) {
                if ($_GET['auth'] === '') {
                    echo ("Not okie dokie");
                } else {
                    echo ('<h3>Random Auth.</h3>');
                    $secret = $_GET['auth'];
                    $otp = getOTP($secret);
                    echo ($otp);
                }
            }
            if (empty($_GET) && (($_SERVER['REQUEST_URI']) == '/')) {
                echo ('<h3>Random Quote.</h3>');
                echo (loadRandomQuote(1));
                //header("Refresh:30");
            }
            ?>
        </div>
    </body>

    </html>
<?php
}

function generateQRCode($text, $size = 300)
{
    // QR code data
    $qrData = urlencode($text);

    // QR code URL
    $qrUrl = "https://chart.googleapis.com/chart?chs={$size}x{$size}&cht=qr&chl={$qrData}";

    // Display the QR code image
    echo "<img src='{$qrUrl}' alt='QR Code'>";
}
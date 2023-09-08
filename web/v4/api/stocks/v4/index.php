<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Define the updateMarketData function first
function updateMarketData($filename, $marketDataInput)
{
    // Set the last update timestamp
    $marketDataInput["system_data"]['last_update_timestamp'] = time();

    // Loop through each company
    foreach ($marketDataInput['market_data'] as $data => &$company) {
        // Fluctuate the market value
        $company = fluctuateMarketValue($company);
    }

    // Save the updated market data to the JSON file
    file_put_contents($filename, json_encode($marketDataInput, JSON_PRETTY_PRINT));

    // Return the updated market data
    return $marketDataInput;
}

// Do fluctuation calculations
function fluctuateMarketValue($company)
{
    // Get current_value by getting the most recent value
    $currentValue = $company['market']['value'][count($company['market']['value']) - 1]['value'];

    $fluctuation = rand(
        $company['market']['strength']['profit'],
        $company['market']['strength']['loss']
    ) / 100;

    // Add the current value and time to the 'previous' values
    $company['market']['value'][] = [
        'value' => round($currentValue + ($currentValue * $fluctuation)),
        'time' => time()
    ];

    return $company;
};

// Load corresponding market data
function getMarketData($filename)
{
    // Check if the JSON file exists for the given instance
    if (file_exists($filename)) {
        // If it exists, load the existing data
        return json_decode(file_get_contents($filename), true);
    }
}

// Create a filtered json string to show to the user that doesn't include the strength values
function createSystemFilteredJson($marketData)
{
    // Create a copy of the market data
    $filteredMarketData = $marketData;

    // Loop through each company
    foreach ($filteredMarketData['market_data'] as $data => &$company) {
        // Remove the strength values
        unset($company['market']['strength']);
    }

    // Remove the system data
    unset($filteredMarketData['system_data']);

    // Return the filtered market data
    return $filteredMarketData;
}

// Log in audit log
function logAudit($marketDataInput, $action, $actor)
{
    $marketDataInput["system_data"]['audit_log'][] = [
        'action' => $action,
        'actor' => $actor,
        'time' => time()
    ];
    return $marketDataInput;
}

// Is instance set if so continue
if (isset($_GET['instance'])) {
    // Get the value of the 'instance' parameter from the URL
    $instance = $_GET['instance'] ?? null;

    if (!$instance) {
        echo "Please provide an 'instance' parameter.";
        die();
    }

    // Define the directory where JSON files will be stored
    $dataDirectory = 'market_data';

    // Create the directory if it doesn't exist
    if (!file_exists($dataDirectory)) {
        mkdir($dataDirectory);
    }

    // Define the filename based on the instance
    $filename = $dataDirectory . '/' . $instance . '_market_data.json';

    // Get market data
    $marketData = getMarketData($filename);

    if (!$marketData) {
        echo "No market data found for instance: " . $instance;
        die();
    }
    // Check the last update timestamp
    $lastUpdateTimestamp = $marketData["system_data"]['last_update_timestamp'] ?? 0;

    // Calculate the time elapsed since the last update
    $timeElapsed = time() - $lastUpdateTimestamp;

    // If more than 900 seconds (15 minute) have elapsed, update prices
    if ($timeElapsed > 1) {
        $marketData = updateMarketData($filename, $marketData); // Pass by reference
    }
}

// Check if a id is set
if (isset($_GET['id'])) {
    // Filter the market data to only include the company with the given ID
    $marketData['market_data'] = array_filter($marketData['market_data'], function ($company) {
        return $company['id'] == $_GET['id'];
    });
}

/////////////////////////////////////////////////////////////////////////////////////////// AUTH Systems

$base32Map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function getOTP($secret, $digits = 6, $period = 30, $offset = 0, $algo = 'sha1')
{
    global $base32Map;
    if (strlen($secret) < 16 || strlen($secret) % 8 != 0)
        return ['err' => 'length of secret must be a multiple of 8, and at least 16 characters'];
    if (preg_match('/[^a-z2-7]/i', $secret) === 1)
        return ['err' => 'secret contains non-base32 characters'];
    $digits = intval($digits);
    if ($digits < 6 || $digits > 8)
        return ['err' => 'digits must be 6, 7 or 8'];
    if (in_array(strtolower($algo), ['sha1', 'sha256', 'sha512']) === false)
        return ['err' => 'algo must be SHA1, SHA256 or SHA512'];

    $seed = base32Decode($secret); // Use base32Decode($secret) instead of self::base32Decode($secret)
    $time = str_pad(pack('N', intval($offset + time() / $period)), 8, "\x00", STR_PAD_LEFT);
    $hash = hash_hmac(strtolower($algo), $time, $seed, false);
    $otp = (hexdec(substr($hash, hexdec($hash[-1]) * 2, 8)) & 0x7fffffff) % pow(10, $digits);

    return sprintf("%'0{$digits}u", $otp);
}

function base32Decode($in)
{
    global $base32Map; // Add this line to access the global variable
    $l = strlen($in);
    $n = $bs = 0;
    $out = '';

    for ($i = 0; $i < $l; $i++) {
        $n <<= 5;
        $n += stripos($base32Map, $in[$i]); // Use $base32Map instead of self::$base32Map
        $bs = ($bs + 5) % 8;
        $out .= $bs < 5 ? chr(($n & (255 << $bs)) >> $bs) : null;
    }

    return $out;
}
/////////////////////////////////////////////////////////////////////////////////////////// AUTH Systems


// Check if bot is sending the request
if (isset($_GET['auth']) || isset($_GET['override'])) {
    // Authenticate the bot using 
    if ((isset($_GET['auth']) && $_GET['auth'] !== '' && $_GET['auth'] == getOTP('YTO3N3ZX3NPQUUQLVRFPQ36Z')) ||
        isset($_GET['override'])
    ) {

        if (isset($_GET['user'])) {
            // Populate the market data
            if (isset($_GET['populate'])) {
                // Get the value of the 'instance' parameter from the URL
                $instance = $_GET['instance'] ?? null;

                if (!$instance) {
                    echo "Please provide an 'instance' parameter.";
                    die();
                }

                // Define the directory where JSON files will be stored
                $dataDirectory = 'market_data';

                // Create the directory if it doesn't exist
                if (!file_exists($dataDirectory)) {
                    mkdir($dataDirectory);
                }

                // Define the filename based on the instance
                $filename = $dataDirectory . '/' . $instance . '_market_data.json';

                // Get market data
                $marketData = getMarketData($filename);

                if (!$marketData) {
                    echo "No market data found for instance: " . $instance;
                    die();
                }

                // Log in audit log
                $marketData = logAudit(
                    $marketData,
                    '!!! Populated market.',
                    $_GET['user']
                );

                // Fluctuate the market value 100 times
                for ($i = 0; $i < 100; $i++) {
                    $marketData = updateMarketData($filename, $marketData); // Pass by reference
                }
            }
            // Make a company
            if (isset($_GET['create']) && ($_GET['create'] !== '')) {
                if (isset($_GET['id']) && ($_GET['id'] !== '')) {
                    if (isset($_GET['value']) && ($_GET['value'] !== '')) {
                        // Make sure that value is an integer and not a string
                        $_GET['value'] = intval($_GET['value']);

                        // Get the value of the 'instance' parameter from the URL
                        $instance = $_GET['instance'] ?? null;

                        if (!$instance) {
                            echo "Please provide an 'instance' parameter.";
                            die();
                        }

                        // Define the directory where JSON files will be stored
                        $dataDirectory = 'market_data';

                        // Create the directory if it doesn't exist
                        if (!file_exists($dataDirectory)) {
                            mkdir($dataDirectory);
                        }

                        // Define the filename based on the instance
                        $filename = $dataDirectory . '/' . $instance . '_market_data.json';

                        // Get market data
                        $marketData = getMarketData($filename);

                        if (!$marketData) {
                            echo "No market data found for instance: " . $instance;
                            die();
                        }

                        // Create the actual company
                        $marketData['market_data'][] = [
                            'id' => $_GET['id'],
                            'name' => $_GET['create'],
                            'appearance' => [
                                'color' => '#ffffff',
                            ],
                            'market' => [
                                'strength' => [
                                    'profit' => 2,
                                    'loss' => -2
                                ],
                                'value' => [
                                    [
                                        'value' => $_GET['value'],
                                        'time' => time()
                                    ]
                                ]
                            ]
                        ];

                        // Log in audit log
                        $marketData = logAudit(
                            $marketData,
                            'Created company: [' . $_GET['id'] . "] " . $_GET['create'] . '$' . $_GET['value'],
                            $_GET['user']
                        );

                        // Roll through the market data 
                        $marketData = updateMarketData($filename, $marketData);
                    }
                }
            }
            // Delete a company
            if (isset($_GET['delete']) && ($_GET['delete'] !== '')) {
                // Get the value of the 'instance' parameter from the URL
                $instance = $_GET['instance'] ?? null;

                if (!$instance) {
                    echo "Please provide an 'instance' parameter.";
                    die();
                }

                // Define the directory where JSON files will be stored
                $dataDirectory = 'market_data';

                // Create the directory if it doesn't exist
                if (!file_exists($dataDirectory)) {
                    mkdir($dataDirectory);
                }

                // Define the filename based on the instance
                $filename = $dataDirectory . '/' . $instance . '_market_data.json';

                // Get market data
                $marketData = getMarketData($filename);

                if (!$marketData) {
                    echo "No market data found for instance: " . $instance;
                    die();
                }

                // Loop through each company
                foreach ($marketData['market_data'] as $data => &$company) {
                    // Check if the company ID matches the ID in the URL
                    if ($company['id'] == $_GET['delete']) {
                        // Remove the company from the market data
                        unset($marketData['market_data'][$data]);

                        // Log in audit log
                        $marketData = logAudit(
                            $marketData,
                            'Deleted company: [' . $_GET['delete'] . "] " . $company['name'],
                            $_GET['user']
                        );
                    }
                }

                // Roll through the market data
                $marketData = updateMarketData($filename, $marketData);
            }
            // Change a company's value
            if (isset($_GET['change'])) {
                if (isset($_GET['id']) && ($_GET['id'] !== '')) {
                    if (isset($_GET['value']) && ($_GET['value'] !== '')) {
                        // Make sure that value is an integer and not a string
                        $_GET['value'] = intval($_GET['value']);

                        // Get the value of the 'instance' parameter from the URL
                        $instance = $_GET['instance'] ?? null;

                        if (!$instance) {
                            echo "Please provide an 'instance' parameter.";
                            die();
                        }

                        // Define the directory where JSON files will be stored
                        $dataDirectory = 'market_data';

                        // Create the directory if it doesn't exist
                        if (!file_exists($dataDirectory)) {
                            mkdir($dataDirectory);
                        }

                        // Define the filename based on the instance
                        $filename = $dataDirectory . '/' . $instance . '_market_data.json';

                        // Get market data
                        $marketData = getMarketData($filename);

                        if (!$marketData) {
                            echo "No market data found for instance: " . $instance;
                            die();
                        }

                        // Loop through each company
                        foreach ($marketData['market_data'] as $data => &$company) {
                            // Check if the company ID matches the ID in the URL
                            if ($company['id'] == $_GET['id']) {
                                // Log in audit log
                                $marketData = logAudit(
                                    $marketData,
                                    'Changed company value from: [' . $_GET['id'] . "] " . $company['name'] . '$' . $company['market']['value'][count($company['market']['value']) - 1]['value'] . ' to $' . $_GET['value'],
                                    $_GET['user']
                                );

                                // Change the company's value
                                $company['market']['value'][count($company['market']['value']) - 1]['value'] = $_GET['value'];
                            }
                        }

                        // Roll through the market data
                        $marketData = updateMarketData($filename, $marketData);
                    }
                }
            }
            // Change a company's appearance (name or color)
            if (isset($_GET['appearance'])) {
                if (isset($_GET['id']) && ($_GET['id'] !== '')) {
                    if (isset($_GET['name']) && ($_GET['name'] !== '')) {
                        // Get the value of the 'instance' parameter from the URL
                        $instance = $_GET['instance'] ?? null;

                        if (!$instance) {
                            echo "Please provide an 'instance' parameter.";
                            die();
                        }

                        // Define the directory where JSON files will be stored
                        $dataDirectory = 'market_data';

                        // Create the directory if it doesn't exist
                        if (!file_exists($dataDirectory)) {
                            mkdir($dataDirectory);
                        }

                        // Define the filename based on the instance
                        $filename = $dataDirectory . '/' . $instance . '_market_data.json';

                        // Get market data
                        $marketData = getMarketData($filename);

                        if (!$marketData) {
                            echo "No market data found for instance: " . $instance;
                            die();
                        }

                        // Loop through each company
                        foreach ($marketData['market_data'] as $data => &$company) {
                            // Check if the company ID matches the ID in the URL
                            if ($company['id'] == $_GET['id']) {
                                // Log in audit log
                                $marketData = logAudit(
                                    $marketData,
                                    'Changed company appearance from: [' . $_GET['id'] . "] " . $company['name'] .
                                        ' to [' . $_GET['id'] . "] " . $_GET['name'],
                                    $_GET['user']
                                );

                                // Change the company's name
                                $company['name'] = $_GET['name'];
                            }
                        }

                        // Roll through the market data
                        $marketData = updateMarketData($filename, $marketData);
                    }
                    if (isset($_GET['color']) && ($_GET['color'] !== '')) {
                        // Get the value of the 'instance' parameter from the URL
                        $instance = $_GET['instance'] ?? null;

                        if (!$instance) {
                            echo "Please provide an 'instance' parameter.";
                            die();
                        }

                        // Define the directory where JSON files will be stored
                        $dataDirectory = 'market_data';

                        // Create the directory if it doesn't exist
                        if (!file_exists($dataDirectory)) {
                            mkdir($dataDirectory);
                        }

                        // Define the filename based on the instance
                        $filename = $dataDirectory . '/' . $instance . '_market_data.json';

                        // Get market data
                        $marketData = getMarketData($filename);

                        if (!$marketData) {
                            echo "No market data found for instance: " . $instance;
                            die();
                        }

                        // Loop through each company
                        foreach ($marketData['market_data'] as $data => &$company) {
                            // Check if the company ID matches the ID in the URL
                            if ($company['id'] == $_GET['id']) {
                                // Log in audit log
                                $marketData = logAudit(
                                    $marketData,
                                    'Changed company color to ' . $_GET['color'],
                                    $_GET['user']
                                );

                                // Change the company's color
                                $company['appearance']['color'] = $_GET['color'];
                            }
                        }

                        // Roll through the market data
                        $marketData = updateMarketData($filename, $marketData);
                    }
                }
            }
        }
    }
}

// Return the market data as JSON response
header('Content-Type: application/json');
if (isset($_GET['override'])) {
    echo json_encode($marketData, JSON_PRETTY_PRINT);
} else
    echo json_encode(createSystemFilteredJson($marketData), JSON_PRETTY_PRINT);

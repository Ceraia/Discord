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

if (isset($_GET)) {
    // Is instance set if so continue
    if (isset($_GET['instance']) && $_GET['instance'] && !isset($_GET['populate'])) {
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

        // Return the market data as JSON response
        header('Content-Type: application/json');
        echo json_encode($marketData, JSON_PRETTY_PRINT);
    }
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

        // Check how many more fluctuations are needed to reach 672
        $fluctuationsNeeded = (673 * 2) - count($marketData['market_data'][0]['market']['value']['previous']);

        // For the amount needed, update the market data
        for ($i = 0; $i < $fluctuationsNeeded; $i++) {
            $marketData = updateMarketData($filename, $marketData); // Pass by reference
        }


        // Return the market data as JSON response
        header('Content-Type: application/json');
        echo json_encode($marketData, JSON_PRETTY_PRINT);
    }
}

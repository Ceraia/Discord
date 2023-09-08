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
function logAudit($marketDataInput, $action, $action_data, $actor)
{
    $marketDataInput["system_data"]['audit_log'][] = [
        'action' => $action,
        'action_data' => $action_data,
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

    // Fluctuate the market value 100 times
    for ($i = 0; $i < 100; $i++) {
        $marketData = updateMarketData($filename, $marketData); // Pass by reference
    }
}

// Give the user the option to create a new stock




// Return the market data as JSON response
header('Content-Type: application/json');
if (isset($_GET['override'])) {
    echo json_encode($marketData, JSON_PRETTY_PRINT);
} else
    echo json_encode(createSystemFilteredJson($marketData), JSON_PRETTY_PRINT);

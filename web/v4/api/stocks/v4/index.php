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

        // Get current_value
        $currentValue = $company['current_value'];

        // Get current_value and add it to the array of previous values
        $company['previous_values'][] = $currentValue;

        // If there are more than 672 previous values ( 7 days * 24 hours * 4 values per hour )
        if (count($company['previous_values']) > (673 * 2)) {
            // Remove the oldest value
            array_shift($company['previous_values']);
        }


        $company['current_value'] = fluctuateMarketValue($company);
    }

    // Save the updated market data to the JSON file
    file_put_contents($filename, json_encode($marketDataInput, JSON_PRETTY_PRINT));

    // Return the updated market data
    return $marketDataInput;
}

// Do fluctuation calculations
function fluctuateMarketValue($company)
{
    // Get current_value
    $currentValue = $company['current_value'];

    // Fluctuate the current value by -2% to +2%
    $fluctuation = rand(
        $company['lossfactor'],
        $company['profitfactor']
    ) / 1000;
    return round($currentValue + ($currentValue * $fluctuation));
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
        $fluctuationsNeeded = (673 * 2) - count($marketData['market_data'][0]['previous_values']);

        // For the amount needed, update the market data
        for ($i = 0; $i < $fluctuationsNeeded; $i++) {
            $marketData = updateMarketData($filename, $marketData); // Pass by reference
        }


        // Return the market data as JSON response
        header('Content-Type: application/json');
        echo json_encode($marketData, JSON_PRETTY_PRINT);
    }
}

<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

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

// Check if the JSON file exists for the given instance
if (file_exists($filename)) {
    // If it exists, load the existing data
    $marketData = json_decode(file_get_contents($filename), true);
    
    // Check the last update timestamp
    $lastUpdateTimestamp = $marketData['_last_update_timestamp'] ?? 0;
    
    // Calculate the time elapsed since the last update
    $timeElapsed = time() - $lastUpdateTimestamp;
    
    // If more than 60 seconds (1 minute) have elapsed, update prices
    if ($timeElapsed > 60) {
        updateMarketData($marketData); // Pass by reference
        $marketData['_last_update_timestamp'] = time(); // Update the timestamp after the update
    }
} else {
    // If it doesn't exist, generate random market data
    $marketData = generateMarketData();
    $marketData['_last_update_timestamp'] = time(); // Set the initial timestamp
}


// Store the last update timestamp
$marketData['_last_update_timestamp'] = time();

// Store the market data in the JSON file
file_put_contents($filename, json_encode($marketData, JSON_PRETTY_PRINT));

// Return the market data as JSON response
header('Content-Type: application/json');
echo json_encode($marketData, JSON_PRETTY_PRINT);

// Function to update market data based on previous prices
function updateMarketData(&$marketData) { // Pass by reference
    foreach ($marketData as $company => &$data) {
        $price = $data['price'];
        $previousPrice = $data['previous_price'];
        
        // Calculate the new price based on previous price (adjustment between -5% and 5%)
        $priceAdjustment = rand(-5, 5) / 100;
        $newPrice = $previousPrice * (1 + $priceAdjustment);

        // Store the updated market data for the company
        $data['price'] = round($newPrice, 2);
        $data['previous_price'] = round($previousPrice, 2);
    }
}


// Function to generate random market data
function generateMarketData() {
    $companies = ['HKID - Hawk Industries', 'ENT3 - Entropy 3rd Generation Industries', 'ZLWK - ZoliWorks Car Modding',];
    $marketData = [];

    foreach ($companies as $company) {
        $price = rand(5000, 200000); // Random initial price between 50 and 200
        $previousPrice = $price * (1 + (rand(-5, 5) / 100)); // Random change from -5% to 5%

        // Store the market data for the company
        $marketData[$company] = [
            'price' => round($price, 2), // Round to 2 decimal places
            'previous_price' => round($previousPrice, 2),
            'start_of_day_price' => round($price, 2),
        ];
    }

    return $marketData;
}
?>

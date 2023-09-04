<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Replace with your actual Alpha Vantage API key
$apiKey = 'MAWBRNA5R9TJECX8';

// Define the stock symbol you want to retrieve data for
$stockSymbol = isset($_GET['symbol']) ? $_GET['symbol'] : '';

if (empty($stockSymbol)) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'Stock symbol is required']);
    exit();
}

// Construct the Alpha Vantage API URL to get intraday data with 1-minute interval
$apiUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={$stockSymbol}&interval=1min&apikey={$apiKey}";

// Send a GET request to Alpha Vantage
$response = file_get_contents($apiUrl);

if ($response === false) {
    http_response_code(500); // Internal Server Error
    echo json_encode(['error' => 'Failed to fetch data from Alpha Vantage']);
    exit();
}

// Write response to response.json file
file_put_contents('response.json', $response);

$data = json_decode($response, true);

// Check for API errors
if (isset($data['Error Message'])) {
    http_response_code(500); // Internal Server Error
    echo json_encode(['error' => 'Alpha Vantage API error: ' . $data['Error Message']]);
    exit();
}

// Extract the latest minute's data (most recent data point)
$latestData = reset($data['Time Series (1min)']);

// Prepare the JSON response
$responseData = [
    'symbol' => $stockSymbol,
    'timestamp' => key($data['Time Series (1min)']),
    'open' => $latestData['1. open'],
    'high' => $latestData['2. high'],
    'low' => $latestData['3. low'],
    'close' => $latestData['4. close'],
    'volume' => $latestData['5. volume'],
];

// Return the data in JSON format
header('Content-Type: application/json');
echo json_encode($responseData);
?>

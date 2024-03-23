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

// Construct the Alpha Vantage API URL
//$apiUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={$stockSymbol}&interval=1min&apikey={$apiKey}&adjusted=true";

// Construct the new Alpha Vantage API URL to get the latest price
$apiUrl = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={$stockSymbol}&apikey={$apiKey}";

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

// Extract the latest stock data
$latestData = $data['Global Quote'];

// Prepare the JSON response
$responseData = [
    'symbol' => $latestData['01. symbol'],
    'high' => $latestData['03. high'],
    'low' => $latestData['04. low'],
    'price' => $latestData['05. price'],
    'change' => $latestData['09. change'],
    'change_percent' => $latestData['10. change percent'],
    'last_updated' => $latestData['07. latest trading day'],
];

// Return the data in JSON format
header('Content-Type: application/json');
echo json_encode($responseData);

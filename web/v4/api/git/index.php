<?php
// GitHub webhook payload
$githubPayload = json_decode(file_get_contents('php://input'), true);

// Discord webhook URL
$discordWebhookURL = 'https://discord.com/api/webhooks/1139153354619113482/nRxLUPsVOljqjY8M-riYNIQeNaVEfR1zA3nkROsbYieS7zC4oAOUL9QVxYYs8NFSWCAy';

// Prepare Discord webhook payload
$discordPayload = [
    'embeds' => [
        [
            'title' => $githubPayload['repository']['name'],
            'description' => 'Event: ' . $githubPayload['event'],
            'url' => $githubPayload['repository']['html_url'],
            'color' => hexdec('3366cc'), // Color code (blue)
            'timestamp' => gmdate('Y-m-d\TH:i:s\Z'),
            'footer' => [
                'text' => 'GitHub to Discord Webhook',
            ],
        ],
    ],
];

// Send payload to Discord webhook
$ch = curl_init($discordWebhookURL);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($discordPayload));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

// Log the response for debugging (optional)
file_put_contents('discord_response.log', $response);
file_put_contents('github.json', file_get_contents('php://input'));
?>

<?php
// GitHub webhook payload
$githubPayload = json_decode(file_get_contents('php://input'), true);

// Discord webhook URL
$discordWebhookURL = 'https://discord.com/api/webhooks/1139153354619113482/nRxLUPsVOljqjY8M-riYNIQeNaVEfR1zA3nkROsbYieS7zC4oAOUL9QVxYYs8NFSWCAy';

// Prepare Discord webhook payload
$discordPayload = [
    'embeds' => [
        [
            'title' => $githubPayload['repository']['name'].//add in the branch name
                ' ('.$githubPayload['ref'].')'
            ,
            'url' => $githubPayload['repository']['html_url'],
            'description' => //add in the first seven digits of the commit hash
                '[`'.substr($githubPayload['commits'][0]['id'], 0, 7) . '`]('.$githubPayload['commits'][0]['url'].') '.
                //add in the commit message
            $githubPayload['commits'][0]['message'],
            'color' => hexdec('3366cc'), // Color code (blue)
            'author' => [
                'name' => $githubPayload['sender']['login'],
                'url' => $githubPayload['sender']['html_url'],
                'icon_url' => $githubPayload['sender']['avatar_url'],
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

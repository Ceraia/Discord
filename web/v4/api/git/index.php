<?php
// GitHub webhook payload
$githubPayload = json_decode(file_get_contents('php://input'), true);

// Discord webhook URL
$discordWebhookURL = 'https://discord.com/api/webhooks/1139153354619113482/nRxLUPsVOljqjY8M-riYNIQeNaVEfR1zA3nkROsbYieS7zC4oAOUL9QVxYYs8NFSWCAy';

// Prepare Discord webhook payload
$discordPayload = [
    'embeds' => [
        [
            //have the title follow this format [UDarkRP_Casino:main] 1 new commit
            'title' => '['.$githubPayload['repository']['name'].':'.$githubPayload['repository']['default_branch'].'] '.
            // add in the number of commits
            count($githubPayload['commits']).
            ' new commit',
            'url' => $githubPayload['repository']['html_url'],
            'description' => // for every commit, add in the commit id and the message with the following format
            //'[`'.substr($githubPayload['commits'][0]['id'], 0, 7) . '`]('.$githubPayload['commits'][0]['url'].') '. $githubPayload['commits'][0]['message']
            // loop through all the commits and add them to the description
            implode("\n", array_map(function ($commit) {
                return sprintf('[`%s`](%s) %s',
                    substr($commit['id'], 0, 7),
                    $commit['url'],
                    $commit['message']
                );
            }, $githubPayload['commits']))
            ,
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

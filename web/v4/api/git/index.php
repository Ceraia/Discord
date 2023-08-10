<?php
// GitHub webhook payload
$githubPayload = json_decode(file_get_contents('php://input'), true);

// Discord webhook URL
$discordWebhookURL = 'https://discord.com/api/webhooks/1139153354619113482/nRxLUPsVOljqjY8M-riYNIQeNaVEfR1zA3nkROsbYieS7zC4oAOUL9QVxYYs8NFSWCAy';

// Count the number of added, removed, and modified files
$addedFiles = 0;
$removedFiles = 0;
$modifiedFiles = 0;

foreach ($githubPayload['commits'] as $commit) {
    $addedFiles += count($commit['added']);
    $removedFiles += count($commit['removed']);
    $modifiedFiles += count($commit['modified']);
}

// Prepare the summary text
$summary = "$addedFiles file(s) added, $removedFiles file(s) removed, $modifiedFiles file(s) modified";

// Prepare Discord webhook payload
$discordPayload = [
    'embeds' => [
        [
            'title' => '['.$githubPayload['repository']['name'].':'.$githubPayload['repository']['default_branch'].'] '.
            count($githubPayload['commits']).
            ' new commit',
            'description' => $summary . "\n\n" . implode("\n", array_map(function ($commit) {
                return sprintf('[`%s`](%s) %s',
                    substr($commit['id'], 0, 7),
                    $commit['url'],
                    $commit['message']
                );
            }, $githubPayload['commits'])),
            'url' => $githubPayload['repository']['html_url'],
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

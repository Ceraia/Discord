<?php
// GitHub webhook payload
$githubPayload = json_decode(file_get_contents('php://input'), true);

// Discord webhook URL
$discordWebhookURL = 'https://discord.com/api/webhooks/';

// Check if there are commits, pull requests, or issues
if (!empty($githubPayload['commits']) || isset($githubPayload['pull_request']) || isset($githubPayload['issue'])) {
    // Prepare the title and description based on the payload type
    $title = '';
    $description = '';

    if (!empty($githubPayload['commits'])) {
        // Count the number of added, removed, and modified files
        $addedFiles = 0;
        $removedFiles = 0;
        $modifiedFiles = 0;

        foreach ($githubPayload['commits'] as $commit) {
            $addedFiles += count($commit['added']);
            $removedFiles += count($commit['removed']);
            $modifiedFiles += count($commit['modified']);
        }
        $commitBranch = explode('/', $githubPayload['ref'])[2];
        $title = '['.$githubPayload['repository']['name'].':'.$commitBranch.'] '.
            count($githubPayload['commits']).
            ' new commit'. (count($githubPayload['commits']) > 1 ? 's' : '');
        $description = "$addedFiles file(s) added, $removedFiles file(s) removed, $modifiedFiles file(s) modified\n\n".
            implode("\n", array_map(function ($commit) {
                return sprintf('[`%s`](%s) %s',
                    substr($commit['id'], 0, 7),
                    $commit['url'],
                    $commit['message']
                );
            }, $githubPayload['commits']));
    } elseif (isset($githubPayload['pull_request'])) {
        $action = $githubPayload['action'];
        $pullRequest = $githubPayload['pull_request'];
        $title = '['.$githubPayload['repository']['name'].'] Pull Request '.$action;
        $description = sprintf('**[%s](%s)** %s by %s',
            $pullRequest['title'],
            $pullRequest['html_url'],
            $action,
            $pullRequest['user']['login']
        );
    } elseif (isset($githubPayload['issue'])) {
        $action = $githubPayload['action'];
        $issue = $githubPayload['issue'];
        $title = '['.$githubPayload['repository']['name'].'] Issue '.$action;
        $description = sprintf('**[%s](%s)** %s by %s',
            $issue['title'],
            $issue['html_url'],
            $action,
            $issue['user']['login']
        );
    }

    // Prepare Discord webhook payload
    $discordPayload = [
        'embeds' => [
            [
                'title' => $title,
                'description' => $description,
                'url' => $githubPayload['repository']['html_url'],
                'color' => hexdec('7289da'), // Color code (blue)
                'author' => [
                    'name' => $githubPayload['sender']['login'],
                    'url' => $githubPayload['sender']['html_url'],
                    'icon_url' => $githubPayload['sender']['avatar_url'],
                ],
            ],
        ],
        'content' => $_GET['message'] ?? '',
        'username' => $_GET['username'] ?? 'GitHub',
        'avatar_url' => $_GET['avatar_url'] ?? 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        'tts' => false,
    ];

    // Send payload to Discord webhook
    $ch = curl_init($discordWebhookURL.$_GET['hook']);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($discordPayload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);
}
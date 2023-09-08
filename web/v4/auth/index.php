<?php

$base32Map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; // Move this line outside the functions

function base32Decode($in)
{
    global $base32Map; // Add this line to access the global variable
    $l = strlen($in);
    $n = $bs = 0;
    $out = '';

    for ($i = 0; $i < $l; $i++) {
        $n <<= 5;
        $n += stripos($base32Map, $in[$i]); // Use $base32Map instead of self::$base32Map
        $bs = ($bs + 5) % 8;
        $out .= $bs < 5 ? chr(($n & (255 << $bs)) >> $bs) : null;
    }

    return $out;
}

function getOTP($secret, $digits = 6, $period = 30, $offset = 0, $algo = 'sha1')
{
    global $base32Map;
    if (strlen($secret) < 16 || strlen($secret) % 8 != 0)
        return ['err' => 'length of secret must be a multiple of 8, and at least 16 characters'];
    if (preg_match('/[^a-z2-7]/i', $secret) === 1)
        return ['err' => 'secret contains non-base32 characters'];
    $digits = intval($digits);
    if ($digits < 6 || $digits > 8)
        return ['err' => 'digits must be 6, 7 or 8'];
    if (in_array(strtolower($algo), ['sha1', 'sha256', 'sha512']) === false)
        return ['err' => 'algo must be SHA1, SHA256 or SHA512'];

    $seed = base32Decode($secret); // Use base32Decode($secret) instead of self::base32Decode($secret)
    $time = str_pad(pack('N', intval($offset + time() / $period)), 8, "\x00", STR_PAD_LEFT);
    $hash = hash_hmac(strtolower($algo), $time, $seed, false);
    $otp = (hexdec(substr($hash, hexdec($hash[-1]) * 2, 8)) & 0x7fffffff) % pow(10, $digits);

    return sprintf("%'0{$digits}u", $otp);
}

function genSecret($length = 24)
{
    global $base32Map;
    if ($length < 16 || $length % 8 !== 0)
        return ['err' => 'length must be a multiple of 8, and at least 16'];

    $secret = '';

    while ($length--) {
        $c = @gettimeofday()['usec'] % 53;
        while ($c--)
            mt_rand();
        $secret .= $base32Map[mt_rand(0, 31)]; // Use $base32Map instead of self::$base32Map
    }

    return $secret;
}

function genURI($account, $secret, $digits = null, $period = null, $issuer = null, $algo = null)
{
    if (empty($account) || empty($secret))
        return ['err' => 'you must provide at least an account and a secret'];
    if (mb_strpos($account . $issuer, ':') !== false)
        return ['err' => 'neither account nor issuer can contain a colon (:) character'];

    $account = isset($account) ? rawurlencode($account) : '';
    $issuer = isset($issuer) ? rawurlencode($issuer) : '';
    $label = empty($issuer) ? $account : "$issuer:$account";

    return 'otpauth://totp/' . $label . "?secret=$secret" .
        (is_null($algo) ? '' : "&algorithm=$algo") .
        (is_null($digits) ? '' : "&digits=$digits") .
        (is_null($period) ? '' : "&period=$period") .
        (empty($issuer) ? '' : "&issuer=$issuer");
}

function genToken($account,)
{
    //generate a 24 character string of random characters
    $token = generateRandomString(64);

    return $token;
}

function generateRandomString($length = 24)
{
    $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $randomString;
}

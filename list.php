<?php
// NOTE: comments use ASCII only
header('Content-Type: application/json; charset=utf-8');

$dir = __DIR__ . '/uploads/';
$baseUrl   = dirname($_SERVER['SCRIPT_NAME']); // path part
$publicUrlPrefix = rtrim($baseUrl, '/') . '/uploads/';

if (!is_dir($dir)) {
  echo json_encode([]);
  exit;
}

$allowed = ['jpg','jpeg','png','gif','webp','mp4','mov','mkv','webm'];
$mimeMap = [
  'jpg'=>'image/jpeg','jpeg'=>'image/jpeg','png'=>'image/png','gif'=>'image/gif','webp'=>'image/webp',
  'mp4'=>'video/mp4','mov'=>'video/quicktime','mkv'=>'video/x-matroska','webm'=>'video/webm'
];

$items = [];
$dh = opendir($dir);
if ($dh) {
  while (($file = readdir($dh)) !== false) {
    if ($file === '.' || $file === '..') continue;
    $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    if (!in_array($ext, $allowed)) continue;

    $path = $dir . $file;
    if (!is_file($path)) continue;

    $mtime = filemtime($path);
    $mime = isset($mimeMap[$ext]) ? $mimeMap[$ext] : mime_content_type($path);

    $items[] = [
      'url' => $publicUrlPrefix . $file,
      'mime' => $mime,
      'mtime' => $mtime
    ];
  }
  closedir($dh);
}

// sort desc by mtime
usort($items, function($a, $b){ return $b['mtime'] <=> $a['mtime']; });

echo json_encode($items);

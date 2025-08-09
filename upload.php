<?php
// NOTE: comments use ASCII only
header('Content-Type: application/json; charset=utf-8');

$uploadDir = __DIR__ . '/uploads/';
$baseUrl   = dirname($_SERVER['SCRIPT_NAME']); // path part
$publicUrlPrefix = rtrim($baseUrl, '/') . '/uploads/';

if (!is_dir($uploadDir)) { @mkdir($uploadDir, 0755, true); }

if (!isset($_FILES['file'])) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'no file']);
  exit;
}

$f = $_FILES['file'];
if ($f['error'] !== UPLOAD_ERR_OK) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'upload error']);
  exit;
}

// Allow list by extension
$allowed = ['jpg','jpeg','png','gif','webp','mp4','mov','mkv','webm'];
$mimeMap = [
  'jpg'=>'image/jpeg','jpeg'=>'image/jpeg','png'=>'image/png','gif'=>'image/gif','webp'=>'image/webp',
  'mp4'=>'video/mp4','mov'=>'video/quicktime','mkv'=>'video/x-matroska','webm'=>'video/webm'
];

$origName = $f['name'];
$ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
if (!in_array($ext, $allowed)) {
  http_response_code(400);
  echo json_encode(['ok'=>false,'error'=>'invalid file type']);
  exit;
}

// Generate safe unique name
$slugBase = preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', pathinfo($origName, PATHINFO_FILENAME));
$slugBase = substr($slugBase, 0, 40);
$uniq = bin2hex(random_bytes(6));
$fileName = $slugBase . '_' . $uniq . '.' . $ext;

$target = $uploadDir . $fileName;
if (!move_uploaded_file($f['tmp_name'], $target)) {
  http_response_code(500);
  echo json_encode(['ok'=>false,'error'=>'cannot move']);
  exit;
}

// Build public URL (relative)
$url = $publicUrlPrefix . $fileName;
$mime = isset($mimeMap[$ext]) ? $mimeMap[$ext] : mime_content_type($target);

echo json_encode([
  'ok'   => true,
  'url'  => $url,
  'mime' => $mime,
  'name' => $fileName
]);

# Regenera la imagen Open Graph y los iconos a partir de design/*.html
# usando Edge en modo headless. Uso: powershell -File scripts/render-brand-assets.ps1
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Split-Path $PSScriptRoot -Parent
$public = Join-Path $root 'public'
$tmp = Join-Path ([IO.Path]::GetTempPath()) 'eds-brand'
New-Item -ItemType Directory -Force $tmp | Out-Null

$edge = @(
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $edge) { throw 'No se encuentra Microsoft Edge.' }

function Capture($html, $width, $height, $out) {
  $url = 'file:///' + ((Join-Path $root $html) -replace '\\', '/')
  $ErrorActionPreference = 'Continue' # Edge escribe su log en stderr
  & $edge --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 `
    "--user-data-dir=$tmp\profile" "--window-size=$width,$height" --virtual-time-budget=8000 `
    "--screenshot=$out" $url 2>$null | Out-Null
  if (-not (Test-Path $out)) { throw "No se generó $out" }
}

function Resize($src, $size, $out) {
  $img = [Drawing.Image]::FromFile($src)
  $bmp = New-Object Drawing.Bitmap $size, $size
  $g = [Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.DrawImage($img, 0, 0, $size, $size)
  $bmp.Save($out, [Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose(); $img.Dispose()
}

# --- Open Graph (PNG -> JPEG) ---
$ogPng = Join-Path $tmp 'og.png'
Capture 'design\og-image.html' 1200 630 $ogPng
$og = [Drawing.Image]::FromFile($ogPng)
$jpeg = [Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object Drawing.Imaging.EncoderParameter ([Drawing.Imaging.Encoder]::Quality), 88L
$og.Save((Join-Path $public 'og-image.jpg'), $jpeg, $params)
$og.Dispose()

# --- Iconos ---
$iconPng = Join-Path $tmp 'icon.png'
Capture 'design\icon.html' 512 512 $iconPng
Copy-Item $iconPng (Join-Path $public 'icon-512.png') -Force
Resize $iconPng 192 (Join-Path $public 'icon-192.png')
Resize $iconPng 180 (Join-Path $public 'apple-touch-icon.png')
$ico16 = Join-Path $tmp 'ico16.png'; Resize $iconPng 16 $ico16
$ico32 = Join-Path $tmp 'ico32.png'; Resize $iconPng 32 $ico32

# favicon.ico con dos imágenes PNG embebidas (16 y 32)
$images = @(@{ Size = 16; Bytes = [IO.File]::ReadAllBytes($ico16) }, @{ Size = 32; Bytes = [IO.File]::ReadAllBytes($ico32) })
$ms = New-Object IO.MemoryStream
$w = New-Object IO.BinaryWriter $ms
$w.Write([UInt16]0); $w.Write([UInt16]1); $w.Write([UInt16]$images.Count)
$offset = 6 + 16 * $images.Count
foreach ($i in $images) {
  $w.Write([Byte]$i.Size); $w.Write([Byte]$i.Size); $w.Write([Byte]0); $w.Write([Byte]0)
  $w.Write([UInt16]1); $w.Write([UInt16]32); $w.Write([UInt32]$i.Bytes.Length); $w.Write([UInt32]$offset)
  $offset += $i.Bytes.Length
}
foreach ($i in $images) { $w.Write($i.Bytes) }
[IO.File]::WriteAllBytes((Join-Path $public 'favicon.ico'), $ms.ToArray())
$w.Dispose()

Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
Write-Output 'Assets de marca generados en public/.'

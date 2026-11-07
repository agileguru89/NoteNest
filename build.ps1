$ErrorActionPreference = 'Stop'
$noteTask = $PSScriptRoot
$noteRelease = Join-Path $noteTask 'release'
New-Item -ItemType Directory -Path $noteRelease,(Join-Path $noteRelease 'app\assets'),(Join-Path $noteRelease 'licenses') -Force | Out-Null
Add-Type -AssemblyName System.Drawing
$noteOriginal = [Drawing.Image]::FromFile((Join-Path $noteTask 'app\assets\logo.png'))
$noteBitmap = New-Object Drawing.Bitmap(256,256)
$noteGraphics = [Drawing.Graphics]::FromImage($noteBitmap)
$noteGraphics.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$noteGraphics.DrawImage($noteOriginal,0,0,256,256)
$noteIcon = [Drawing.Icon]::FromHandle($noteBitmap.GetHicon())
$noteIconStream = [IO.File]::Create((Join-Path $noteRelease 'NoteNest.ico'))
try {$noteIcon.Save($noteIconStream)} finally {$noteIconStream.Dispose();$noteGraphics.Dispose();$noteOriginal.Dispose();$noteBitmap.Dispose()}
$noteCompiler = 'C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe'
$noteReferences = @('/r:System.Windows.Forms.dll','/r:System.Drawing.dll','/r:System.Web.Extensions.dll','/r:System.Web.dll','/r:System.Net.Http.dll','/r:System.Security.dll',"/r:$noteTask\Microsoft.Web.WebView2.Core.dll","/r:$noteTask\Microsoft.Web.WebView2.WinForms.dll")
& $noteCompiler /nologo /target:winexe /platform:x64 "/win32icon:$noteRelease\NoteNest.ico" "/out:$noteRelease\NoteNest.exe" @noteReferences "$noteTask\src\NoteNest.cs" "$noteTask\src\Smoke.cs"
if($LASTEXITCODE -ne 0){throw 'Application compile failed'}
foreach($noteFile in @('Microsoft.Web.WebView2.Core.dll','Microsoft.Web.WebView2.WinForms.dll','WebView2Loader.dll')){Copy-Item -LiteralPath (Join-Path $noteTask $noteFile) -Destination (Join-Path $noteRelease $noteFile) -Force}
foreach($noteFile in @('index.html','app.css','model.js','reminder-core.js','effects.js','reminders.js','app.js')){Copy-Item -LiteralPath (Join-Path $noteTask "app\$noteFile") -Destination (Join-Path $noteRelease "app\$noteFile") -Force}
Get-ChildItem -LiteralPath (Join-Path $noteTask 'app\assets') -File | Where-Object Name -ne 'paper-ball.png' | ForEach-Object {Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $noteRelease 'app\assets') -Force}
Copy-Item -LiteralPath (Join-Path $noteTask 'build\webview2\LICENSE.txt') -Destination (Join-Path $noteRelease 'licenses\WebView2-LICENSE.txt') -Force
Copy-Item -LiteralPath (Join-Path $noteTask 'build\webview2\NOTICE.txt') -Destination (Join-Path $noteRelease 'licenses\WebView2-NOTICE.txt') -Force
Copy-Item -LiteralPath (Join-Path $noteTask 'app\assets\OFL-Caveat.txt') -Destination (Join-Path $noteRelease 'licenses\Caveat-OFL.txt') -Force
Copy-Item -LiteralPath (Join-Path $noteTask 'LICENSE'),(Join-Path $noteTask 'ASSETS-LICENSE.md') -Destination $noteRelease -Force
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$notePayload = Join-Path $noteTask 'NoteNest-1.1.0-Windows.zip'
$notePayloadStream = [IO.File]::Open($notePayload,[IO.FileMode]::Create)
$notePayloadArchive = New-Object IO.Compression.ZipArchive($notePayloadStream,[IO.Compression.ZipArchiveMode]::Create)
try{Get-ChildItem -LiteralPath $noteRelease -Recurse -File | ForEach-Object { $noteEntry=$_.FullName.Substring($noteRelease.Length+1).Replace('\','/'); if($noteEntry -match 'google-client|token|board\.json'){throw 'Private data in release'}; [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($notePayloadArchive,$_.FullName,$noteEntry,[IO.Compression.CompressionLevel]::Optimal)|Out-Null }}finally{$notePayloadArchive.Dispose();$notePayloadStream.Dispose()}
& $noteCompiler /nologo /target:winexe /platform:x64 "/win32icon:$noteRelease\NoteNest.ico" "/out:$noteTask\NoteNest-Setup.exe" /r:System.Windows.Forms.dll /r:System.Drawing.dll /r:System.IO.Compression.dll /r:System.IO.Compression.FileSystem.dll /r:Microsoft.CSharp.dll "/resource:$notePayload,NoteNest.payload" "/resource:$noteTask\app\assets\logo.png,NoteNest.logo" "$noteTask\src\Setup.cs"
if($LASTEXITCODE -ne 0){throw 'Installer compile failed'}
Get-Item -LiteralPath $notePayload,(Join-Path $noteTask 'NoteNest-Setup.exe') | Select-Object Name,Length

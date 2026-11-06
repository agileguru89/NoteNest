$ErrorActionPreference='Stop'
$noteVersion='1.0.4314.35'
$noteExpected='90778DEB1B77E36292828B4B5833C9255C27533F40E0DDD55891AE718944EDC4'
$noteBuild=Join-Path $PSScriptRoot 'build'
New-Item -ItemType Directory -Path $noteBuild -Force|Out-Null
$notePackage=Join-Path $noteBuild 'webview2.zip'
if(!(Test-Path -LiteralPath $notePackage)){Invoke-WebRequest -UseBasicParsing -Uri "https://api.nuget.org/v3-flatcontainer/microsoft.web.webview2/$noteVersion/microsoft.web.webview2.$noteVersion.nupkg" -OutFile $notePackage}
if((Get-FileHash -LiteralPath $notePackage -Algorithm SHA256).Hash -ne $noteExpected){throw 'WebView2 package hash mismatch. Existing files were kept.'}
$noteSdk=Join-Path $noteBuild 'webview2'
Expand-Archive -LiteralPath $notePackage -DestinationPath $noteSdk -Force
foreach($noteFile in @('Microsoft.Web.WebView2.Core.dll','Microsoft.Web.WebView2.WinForms.dll')){Copy-Item -LiteralPath (Join-Path $noteSdk "lib\net462\$noteFile") -Destination (Join-Path $PSScriptRoot $noteFile) -Force}
Copy-Item -LiteralPath (Join-Path $noteSdk 'runtimes\win-x64\native\WebView2Loader.dll') -Destination (Join-Path $PSScriptRoot 'WebView2Loader.dll') -Force
Write-Output 'Pinned WebView2 SDK verified. Run build.ps1 next.'

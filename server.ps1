# CatchUp AI - Zero-Dependency Windows PowerShell HTTP Server
# Serves the application locally on http://localhost:8000 without requiring Node or Python!

$Port = 8000
$Root = $PSScriptRoot

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " CatchUp AI - 'What Did I Miss?' Hackathon Server" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Serving from: $Root" -ForegroundColor Gray
Write-Host " URL:          http://localhost:$Port/" -ForegroundColor Yellow
Write-Host " Press Ctrl+C in this terminal window to stop the server." -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan

# Create HttpListener
$Listener = New-Object System.Net.HttpListener
$Listener.Prefixes.Add("http://localhost:$Port/")

try {
    $Listener.Start()
} catch {
    Write-Warning "Could not start on port $Port, trying port 8080..."
    $Port = 8080
    $Listener = New-Object System.Net.HttpListener
    $Listener.Prefixes.Add("http://localhost:$Port/")
    $Listener.Start()
}

# Open default browser automatically
Start-Process "http://localhost:$Port/"

# MIME types table
$MimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".ico"  = "image/x-icon"
    ".txt"  = "text/plain; charset=utf-8"
}

while ($Listener.IsListening) {
    try {
        $Context = $Listener.GetContext()
        $Request = $Context.Request
        $Response = $Context.Response

        $UrlPath = $Request.Url.LocalPath
        if ($UrlPath -eq "/" -or [string]::IsNullOrEmpty($UrlPath)) {
            $UrlPath = "/index.html"
        }

        # Clean relative path
        $RelativePath = $UrlPath.TrimStart("/").Replace("/", "\")
        $FilePath = Join-Path $Root $RelativePath

        if (Test-Path -Path $FilePath -PathType Leaf) {
            $Extension = [System.IO.Path]::GetExtension($FilePath).ToLower()
            $ContentType = if ($MimeTypes.ContainsKey($Extension)) { $MimeTypes[$Extension] } else { "application/octet-stream" }

            $Bytes = [System.IO.File]::ReadAllBytes($FilePath)
            $Response.ContentType = $ContentType
            $Response.ContentLength64 = $Bytes.Length
            $Response.StatusCode = 200
            $Response.OutputStream.Write($Bytes, 0, $Bytes.Length)
        } else {
            $NotFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $Response.StatusCode = 404
            $Response.ContentType = "text/plain"
            $Response.ContentLength64 = $NotFound.Length
            $Response.OutputStream.Write($NotFound, 0, $NotFound.Length)
        }

        $Response.OutputStream.Close()
    } catch {
        # Handle graceful shutdown on Ctrl+C or connection abort
        if (-not $Listener.IsListening) { break }
    }
}

$Listener.Stop()
Write-Host "Server stopped." -ForegroundColor Yellow

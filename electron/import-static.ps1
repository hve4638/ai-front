# Check if static directory exists and delete it if found
if (Test-Path -Path "static") {
    Write-Host "Removing existing static directory..."
    Remove-Item -Path "static" -Recurse -Force
}

# Check if source directory exists
if (-not (Test-Path -Path "../front/dist")) {
    Write-Host "Error: ../front/dist directory not found."
    exit 1
}

Copy-Item -Path "../front/dist" -Destination "static" -Recurse
Write-Host "Files copied successfully."

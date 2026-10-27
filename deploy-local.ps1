
$ErrorActionPreference = "Stop"

Write-Host "Pulling published Docker images..."
docker compose pull
if ($LASTEXITCODE -ne 0) {
    throw "Docker image pull failed"
}

Write-Host "Recreating containers using pulled images..."
docker compose up -d --force-recreate --no-build
if ($LASTEXITCODE -ne 0) {
    throw "Container update failed"
}

Write-Host "Checking Nginx health endpoint..."
curl.exe --fail http://localhost:8080/nginx-health
if ($LASTEXITCODE -ne 0) {
    throw "Nginx health check failed"
}

Write-Host "Checking backend through Nginx..."
curl.exe --fail http://localhost:8080/health
if ($LASTEXITCODE -ne 0) {
    throw "Backend health check failed"
}

Write-Host "Deployment completed successfully."

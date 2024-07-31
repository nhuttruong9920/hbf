# PowerShell script
function ValidateString {
  param (
      [string]$variable,
      [string]$message
  )

  if (-not $variable) {
      Write-Host "ERROR: $message! Exiting script..." -ForegroundColor White -BackgroundColor Red -NoNewline
      exit 1
  }
}

# Read and validate package.json
$PACKAGE_JSON_STRING = Get-Content -Path "package.json" | Out-String
$PACKAGE_JSON_OBJECT = ConvertFrom-Json -InputObject $PACKAGE_JSON_STRING

ValidateString $PACKAGE_JSON_STRING "'package.json' not found"
ValidateString $PACKAGE_JSON_OBJECT.name "'name' not found in package.json. See https://docs.npmjs.com/files/package.json"
ValidateString $PACKAGE_JSON_OBJECT.version "'version' not found in package.json. See https://docs.npmjs.com/files/package.json"

# Re-read package.json after version update
$PACKAGE_JSON_STRING = Get-Content -Path "package.json" | Out-String
$PACKAGE_JSON_OBJECT = ConvertFrom-Json -InputObject $PACKAGE_JSON_STRING

# Extract image information
$IMAGE_NAME = $PACKAGE_JSON_OBJECT.name
$IMAGE_VERSION = $PACKAGE_JSON_OBJECT.version
$IMAGE_TAG = "$IMAGE_NAME.$IMAGE_VERSION"
$REGISTRY_URL="springwinter/fe"

# Build app
Write-Host "Building the app..." -ForegroundColor White -BackgroundColor DarkBlue
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: App build failed! Exiting script..." -ForegroundColor White -BackgroundColor Red -NoNewline
    exit 1
}

Write-Host "Successfully built app!" -ForegroundColor White -BackgroundColor DarkGreen

# Build and push docker image
function BuildAndPushDockerImage {
  docker info

  if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Docker error! If the app version have been changed, please revert it manually in package.json. Exiting script..." -ForegroundColor White -BackgroundColor Red -NoNewline
    exit 1
  }

  Write-Host "Building the Image [$IMAGE_TAG]..." -ForegroundColor White -BackgroundColor DarkBlue

  docker build -t $IMAGE_TAG .

  if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Docker build failed! If the app version have been changed, please revert it manually in package.json. Exiting script..." -ForegroundColor White -BackgroundColor Red -NoNewline
    exit 1
  }

  Write-Host "Successfully built the Image [$IMAGE_TAG]!"  -ForegroundColor White -BackgroundColor DarkGreen

  docker tag $IMAGE_TAG "$REGISTRY_URL`:$IMAGE_TAG"

  if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Docker tag failed! If the app version have been changed, please revert it manually in package.json. Exiting script..." -ForegroundColor White -BackgroundColor Red -NoNewline
    exit 1
  }

  Write-Host "Pushing the Image [$IMAGE_TAG] to Docker Registry [$REGISTRY_URL]..." -ForegroundColor White -BackgroundColor DarkBlue

  docker push "$REGISTRY_URL`:$IMAGE_TAG"

  if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Docker push failed! If the app version have been changed, please revert it manually in package.json. Exiting script..." -ForegroundColor White -BackgroundColor Red -NoNewline
    exit 1
  }

  Write-Host "Successfully pushed the Image [$IMAGE_TAG] to Docker [$REGISTRY_URL]!" -ForegroundColor White -BackgroundColor DarkGreen -NoNewline
}

BuildAndPushDockerImage

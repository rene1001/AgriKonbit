# Test d'upload direct avec curl
Write-Host "`n╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     🔍 TEST UPLOAD DIRECT - DIAGNOSTIC                   ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# 1. Créer une petite image de test
Write-Host "📝 1. Création d'une image de test..." -ForegroundColor Yellow
$testImagePath = "$PSScriptRoot\test-upload.jpg"

# Créer un petit JPEG valide (1x1 pixel)
$jpegBytes = @(
    0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46,
    0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01,
    0x00, 0x01, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
    0x00, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01,
    0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4,
    0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0xFF, 0xDA, 0x00, 0x08,
    0x01, 0x01, 0x00, 0x00, 0x3F, 0x00, 0x7F, 0xFF,
    0xD9
)

[System.IO.File]::WriteAllBytes($testImagePath, $jpegBytes)
Write-Host "   ✅ Image de test créée: $testImagePath" -ForegroundColor Green
Write-Host "   ℹ️  Taille: $($jpegBytes.Length) bytes`n" -ForegroundColor Cyan

# 2. Obtenir le token depuis le localStorage
Write-Host "🔑 2. Récupération du token..." -ForegroundColor Yellow
Write-Host "   IMPORTANT: Vous devez copier votre token JWT" -ForegroundColor Red
Write-Host "   Comment l'obtenir:" -ForegroundColor White
Write-Host "   1. Ouvrir http://localhost:3000/profile" -ForegroundColor White
Write-Host "   2. Appuyer sur F12 > Application > Local Storage" -ForegroundColor White
Write-Host "   3. Copier la valeur de 'token'`n" -ForegroundColor White

$token = Read-Host "   Collez votre token ici"

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host "`n   ❌ Token vide. Test annulé.`n" -ForegroundColor Red
    Remove-Item $testImagePath -ErrorAction SilentlyContinue
    exit
}

Write-Host "   ✅ Token reçu (longueur: $($token.Length) caractères)`n" -ForegroundColor Green

# 3. Test de l'upload
Write-Host "📤 3. Test de l'upload..." -ForegroundColor Yellow

$url = "http://localhost:3001/api/users/profile/image"
$headers = @{
    "Authorization" = "Bearer $token"
}

try {
    # Préparer le fichier pour l'upload
    $fileBin = [System.IO.File]::ReadAllBytes($testImagePath)
    $boundary = [System.Guid]::NewGuid().ToString()
    $LF = "`r`n"
    
    $bodyLines = @(
        "--$boundary",
        "Content-Disposition: form-data; name=`"profileImage`"; filename=`"test-upload.jpg`"",
        "Content-Type: image/jpeg$LF",
        [System.Text.Encoding]::GetEncoding("iso-8859-1").GetString($fileBin),
        "--$boundary--$LF"
    ) -join $LF
    
    Write-Host "   📦 FormData préparé:" -ForegroundColor Cyan
    Write-Host "      - Champ: profileImage" -ForegroundColor White
    Write-Host "      - Fichier: test-upload.jpg" -ForegroundColor White
    Write-Host "      - Type: image/jpeg" -ForegroundColor White
    Write-Host "      - Taille: $($fileBin.Length) bytes`n" -ForegroundColor White
    
    $response = Invoke-WebRequest -Uri $url -Method Post -Headers $headers `
        -ContentType "multipart/form-data; boundary=$boundary" `
        -Body $bodyLines -UseBasicParsing
    
    Write-Host "`n   ✅ SUCCÈS!" -ForegroundColor Green
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Réponse: $($response.Content)`n" -ForegroundColor Green
    
} catch {
    Write-Host "`n   ❌ ERREUR!" -ForegroundColor Red
    Write-Host "   Status: $($_.Exception.Response.StatusCode.Value__)" -ForegroundColor Red
    Write-Host "   Message: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Réponse: $responseBody`n" -ForegroundColor Red
    }
}

# 4. Nettoyage
Remove-Item $testImagePath -ErrorAction SilentlyContinue
Write-Host "🧹 4. Nettoyage terminé`n" -ForegroundColor Yellow

Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     📝 RÉSUMÉ                                            ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "Si l'erreur persiste, partagez:" -ForegroundColor White
Write-Host "1. Le code d'erreur (400, 401, 500, etc.)" -ForegroundColor White
Write-Host "2. Le message d'erreur exact" -ForegroundColor White
Write-Host "3. La réponse complète affichée ci-dessus`n" -ForegroundColor White

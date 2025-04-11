$FolderPath = "img"
$HtmlPath = "index.html"
$Extensions = @(".png", ".jpg", ".jpeg", ".gif")

$Files = Get-ChildItem -Path $FolderPath -Recurse -File | Where-Object {
    $Extensions -contains $_.Extension.ToLower()
}

$RenameMap = @{}
$Counter = 1

foreach ($File in $Files) {
    $IsThumbnail = $File.BaseName.ToLower().Contains("thumbnail")
    $Ext = $File.Extension.ToLower()

    # Get folder name (excluding root img folder)
    $RelativeFolder = $File.DirectoryName.Replace((Join-Path (Get-Location) $FolderPath), "").TrimStart("\").Replace("\", "_").Replace("/", "_")
    $FolderPrefix = if ($RelativeFolder) { "$RelativeFolder" } else { "root" }

    if ($IsThumbnail) {
        $NewName = "${FolderPrefix}_${Counter}_thumbnail$Ext"
    } else {
        $NewName = "${FolderPrefix}_${Counter}$Ext"
    }

    $OldFullPath = $File.FullName
    $NewFullPath = Join-Path $File.DirectoryName $NewName

    if ($OldFullPath -ne $NewFullPath -and -not (Test-Path $NewFullPath)) {
        Rename-Item -Path $OldFullPath -NewName $NewName -Force

        $RelativeOld = $OldFullPath.Replace((Get-Location).Path + "\", "").Replace("\", "/")
        $RelativeNew = $NewFullPath.Replace((Get-Location).Path + "\", "").Replace("\", "/")

        $RenameMap[$RelativeOld] = $RelativeNew

        Write-Host "Renamed '$RelativeOld' -> '$RelativeNew'"
        $Counter++
    }
}

# Update HTML
if (Test-Path $HtmlPath) {
    $HtmlContent = Get-Content $HtmlPath -Raw
    $Updated = 0

    foreach ($OldPath in $RenameMap.Keys) {
        $NewPath = $RenameMap[$OldPath]
        $OldFile = [System.IO.Path]::GetFileName($OldPath)
        $NewFile = [System.IO.Path]::GetFileName($NewPath)

        if ($HtmlContent -match [regex]::Escape($OldFile)) {
            $HtmlContent = [regex]::Replace($HtmlContent, [regex]::Escape($OldFile), $NewFile, 'IgnoreCase')
            $Updated++
        }
    }

    Copy-Item $HtmlPath "$HtmlPath.bak" -Force
    Set-Content -Path $HtmlPath -Value $HtmlContent -Encoding UTF8
    Write-Host "Updated $Updated image references in $HtmlPath"
} else {
    Write-Host "Could not find $HtmlPath"
}

Write-Host "All done!"

Get-Desktop 0 | Switch-Desktop

code ".\packages\core"

Start-Sleep -Seconds 3

Get-Desktop 1 | Switch-Desktop

code ".\packages\front"

Start-Sleep -Seconds 3

Get-Desktop 2 | Switch-Desktop

code ".\packages\electron"

Start-Sleep -Seconds 3

Get-Desktop 0 | Switch-Desktop
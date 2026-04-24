param(
  [Parameter(Mandatory = $false)]
  [string]$Repo = "Muensaen/Agenthub",

  [Parameter(Mandatory = $false)]
  [string]$Branch = "main",

  [Parameter(Mandatory = $false)]
  [string]$Token = ""
)

if ([string]::IsNullOrWhiteSpace($Token)) {
  $Token = $env:GITHUB_TOKEN
}

if ([string]::IsNullOrWhiteSpace($Token)) {
  throw "Missing token. Pass -Token <PAT> or set GITHUB_TOKEN environment variable."
}

$uri = "https://api.github.com/repos/$Repo/branches/$Branch/protection"

$payload = @{
  required_status_checks = @{
    strict = $true
    contexts = @("smoke", "full")
  }
  enforce_admins = $true
  required_pull_request_reviews = @{
    dismiss_stale_reviews = $true
    required_approving_review_count = 1
  }
  restrictions = $null
  required_linear_history = $false
  allow_force_pushes = $false
  allow_deletions = $false
  required_conversation_resolution = $true
} | ConvertTo-Json -Depth 8

$headers = @{
  Authorization = "Bearer $Token"
  Accept = "application/vnd.github+json"
  "X-GitHub-Api-Version" = "2022-11-28"
}

Invoke-RestMethod -Method Put -Uri $uri -Headers $headers -Body $payload -ContentType "application/json"
Write-Host "Branch protection applied to $Repo:$Branch"

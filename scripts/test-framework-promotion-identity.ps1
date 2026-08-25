[CmdletBinding()]
param(
  [string]$RepositoryRoot = '',
  [Parameter(Mandatory)][string]$RequestedIdentity,
  [string]$RequestedSha256 = '',
  [string]$RequestedMilestone = '',
  [string]$RequestedSourceCommit = '',
  [string]$LedgerPath = 'artifact-ledger.json',
  [string]$ReportPath = '',
  [switch]$NoExitFailure
)
$ErrorActionPreference = 'Stop'
if (-not $RepositoryRoot) { $RepositoryRoot = Split-Path -Parent $PSScriptRoot }
$absoluteLedger = if ([IO.Path]::IsPathRooted($LedgerPath)) { $LedgerPath } else { Join-Path $RepositoryRoot $LedgerPath }
$ledger = Get-Content -Raw $absoluteLedger | ConvertFrom-Json
$existing = @($ledger.entries | Where-Object { $_.artifact_identity -eq $RequestedIdentity -and $_.stage -eq 'production' })
$failures = [Collections.Generic.List[string]]::new()
if ($existing.Count -gt 1) { $failures.Add('duplicate-production-identity') }
$state = 'eligible-unused'
if ($existing.Count -eq 1) {
  $entry = $existing[0]
  $completeRequest = $RequestedSha256 -match '^[a-f0-9]{64}$' -and $RequestedSourceCommit -match '^[a-f0-9]{40}$' -and -not [string]::IsNullOrWhiteSpace($RequestedMilestone)
  $exact = $completeRequest -and $entry.sha256 -eq $RequestedSha256 -and $entry.milestone_id -eq $RequestedMilestone -and $entry.source_commit -eq $RequestedSourceCommit -and $entry.artifact_kind -eq 'framework-production-distribution'
  if ($exact) { $state = 'idempotent-verification' } else { $state = 'blocked-consumed-identity'; $failures.Add('production-identity-consumed-by-different-evidence') }
}
$evidence = if ($existing.Count -eq 1) { [ordered]@{sha256=$existing[0].sha256;milestone_id=$existing[0].milestone_id;source_commit=$existing[0].source_commit;artifact_kind=$existing[0].artifact_kind} } else { $null }
$result = [ordered]@{schema_version=1;result=$(if($failures.Count){'failed'}else{'passed'});requested_identity=$RequestedIdentity;promotion_state=$state;ledger=$LedgerPath;existing_count=$existing.Count;existing_evidence=$evidence;failures=@($failures)}
if ($ReportPath) { $absoluteReport=if([IO.Path]::IsPathRooted($ReportPath)){$ReportPath}else{Join-Path $RepositoryRoot $ReportPath};New-Item -ItemType Directory -Force (Split-Path -Parent $absoluteReport)|Out-Null;$result|ConvertTo-Json -Depth 6|Set-Content -Encoding utf8 $absoluteReport }
$result | ConvertTo-Json -Depth 6
if ($failures.Count -and -not $NoExitFailure) { exit 1 }

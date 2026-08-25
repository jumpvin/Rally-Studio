[CmdletBinding()]
param(
    [Parameter(Mandatory)][ValidateSet('presentation','functional','structural')][string]$Level,
    [string[]]$ChangedPath = @(),
    [string[]]$RetainedEvidence = @(),
    [string[]]$InvalidatedEvidence = @(),
    [string]$SourceCommit = '',
    [string]$ArtifactSha256 = '',
    [string]$ElevationReason = ''
)
$groups = [ordered]@{
    presentation = @('parse-lint','affected-surface','package-integrity')
    functional   = @('parse-lint','targeted-functional','affected-integration','package-integrity')
    structural   = @('parse-lint','affected-regression','package-integrity')
}
$all = @('parse-lint','affected-surface','targeted-functional','affected-integration','affected-regression','package-integrity')
$selected = @($groups[$Level])
$bad=[Collections.Generic.List[string]]::new()
$reused=@($RetainedEvidence|Where-Object{
    if($_ -in $InvalidatedEvidence){return $false}
    $m=[regex]::Match($_,'^([a-z0-9][a-z0-9._-]*)@([a-f0-9]{40}|[a-f0-9]{64})$')
    if(-not$m.Success){$bad.Add($_);return $false}
    $identity=$m.Groups[2].Value
    if($identity.Length-eq40-and(!$SourceCommit-or$identity-ne$SourceCommit.ToLowerInvariant())){$bad.Add($_);return $false}
    if($identity.Length-eq64-and(!$ArtifactSha256-or$identity-ne$ArtifactSha256.ToLowerInvariant())){$bad.Add($_);return $false}
    return $true
})
if($bad.Count){throw "Retained evidence lacks current provenance: $($bad -join ', ')"}
[ordered]@{
    schema_version=1; validation_level=$Level; elevation_reason=$(if($ElevationReason){$ElevationReason}else{$null})
    changed_paths=@($ChangedPath); selected_groups=$selected; skipped_groups=@($all | Where-Object { $_ -notin $selected })
    retained_evidence=$reused; invalidated_evidence=@($InvalidatedEvidence)
    reuse_reason=$(if($reused.Count){'Certified dependencies, contracts, and affected runtime surfaces are unchanged.'}else{$null})
} | ConvertTo-Json -Depth 5

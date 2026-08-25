[CmdletBinding()]
param([string]$RepositoryRoot='', [switch]$NoExitFailure)
$ErrorActionPreference='Stop'
if(-not $RepositoryRoot){$RepositoryRoot=Split-Path -Parent $PSScriptRoot}
$RepositoryRoot=(Resolve-Path $RepositoryRoot).Path
$fail=[Collections.Generic.List[string]]::new()
function AddFailure([string]$Code){if($Code -notin $fail){$fail.Add($Code)}}
function LockValue([string]$Text,[string]$Name){([regex]::Match($Text,('(?m)^\s*{0}:\s*"?([^"\r\n]+)' -f [regex]::Escape($Name)))).Groups[1].Value.Trim()}

foreach($file in @('framework.json','framework.lock','repository.operations.json','workflow-state.json')){if(-not(Test-Path(Join-Path $RepositoryRoot $file))){AddFailure "installed-authority-missing:$file"}}
foreach($file in @('framework.json','repository.operations.json','workflow-state.json')){try{Get-Content -Raw (Join-Path $RepositoryRoot $file)|ConvertFrom-Json|Out-Null}catch{AddFailure "installed-authority-invalid:$file"}}

$frameworkPath=Join-Path $RepositoryRoot 'framework.json';$workflowPath=Join-Path $RepositoryRoot 'workflow-state.json';$lockPath=Join-Path $RepositoryRoot 'framework.lock'
$framework=$null;$workflow=$null
if((Test-Path $frameworkPath)-and(Test-Path $workflowPath)-and(Test-Path $lockPath)){
  try{
    $framework=Get-Content -Raw $frameworkPath|ConvertFrom-Json;$workflow=Get-Content -Raw $workflowPath|ConvertFrom-Json;$lockText=Get-Content -Raw $lockPath
    $lockFields=@([regex]::Matches($lockText,'(?m)^\s{2}([a-z0-9-]+):')|ForEach-Object{$_.Groups[1].Value});$allowedLockFields=@('name','adopted-version','package-build','source-package','source-package-sha256');if(@($lockFields|Where-Object{$_-notin$allowedLockFields}).Count-or@($lockFields|Group-Object|Where-Object Count -ne 1).Count){AddFailure 'installed-framework-lock-schema-invalid'}
    $lockValues=[ordered]@{};foreach($name in $allowedLockFields){$lockValues[$name]=LockValue $lockText $name}
    $lockInstance=Join-Path ([IO.Path]::GetTempPath()) ('mdf-installed-lock-'+[guid]::NewGuid().ToString('n')+'.json')
    try{
      [IO.File]::WriteAllText($lockInstance,($lockValues|ConvertTo-Json),[Text.UTF8Encoding]::new($false));$lockSchema=Join-Path $RepositoryRoot 'schemas-integrity/framework-lock-schema.json'
      if(-not(Test-Path $lockSchema)){$lockSchema=Join-Path (Split-Path -Parent $PSScriptRoot) 'framework-lock-schema.json'}
      if(Test-Path $lockSchema){$checked=& (Join-Path $PSScriptRoot 'test-json-schema-instance.ps1') -SchemaPath $lockSchema -InstancePath $lockInstance -NoExitFailure|ConvertFrom-Json;if($checked.result-ne'passed'){AddFailure 'installed-framework-lock-schema-invalid'}}else{AddFailure 'installed-framework-lock-schema-missing'}
    }finally{Remove-Item -Force $lockInstance -ErrorAction SilentlyContinue}
    if($lockValues.name-ne[string]$framework.name){AddFailure 'installed-framework-lock-name-mismatch'}
    if($lockValues.'adopted-version'-ne[string]$framework.package_build-or$lockValues.'package-build'-ne[string]$framework.package_build){AddFailure 'installed-framework-lock-identity-mismatch'}
    if($lockValues.'source-package'-ne[string]$framework.source_package){AddFailure 'installed-framework-lock-source-package-mismatch'}
    if($lockValues.'source-package-sha256'-cne[string]$framework.source_package_sha256){AddFailure 'installed-framework-lock-package-sha256-mismatch'}
    if($lockValues.'source-package'-ne("modular-development-framework-v$($framework.package_build).zip")){AddFailure 'installed-framework-source-package-identity-invalid'}
    if([string]$lockValues.'source-package-sha256'-cnotmatch'^[0-9a-f]{64}$'-or[string]$framework.source_package_sha256-cnotmatch'^[0-9a-f]{64}$'){AddFailure 'installed-framework-package-sha256-invalid'}
    $productLine=if([string]$workflow.current_build-match'^(.+)-dev\.\d+$'){$Matches[1]}else{$null}
    if($productLine-and[string]$workflow.release_target-ne$productLine){AddFailure 'product-release-target-build-mismatch'}
    if($productLine-and[string]$workflow.release_target-eq[string]$framework.release_target-and$productLine-ne[string]$framework.release_target){AddFailure 'product-release-target-framework-identity-conflict'}
  }catch{AddFailure 'installed-authority-cross-check-failed'}
}
if($workflow-and[string]$workflow.next_command-eq'Implement Milestone'){if([string]$workflow.current_status-ne'active'){AddFailure 'implement-milestone-requires-active-status'};if([string]::IsNullOrWhiteSpace([string]$workflow.current_milestone)){AddFailure 'implement-milestone-requires-current-milestone'}}
$workflowSchema=Join-Path $RepositoryRoot 'schemas-integrity/workflow-state-schema.json';if(-not(Test-Path $workflowSchema)){$workflowSchema=Join-Path (Split-Path -Parent $PSScriptRoot) 'installed-workflow-state-schema.json'}
if(Test-Path $workflowSchema){$checked=& (Join-Path $PSScriptRoot 'test-json-schema-instance.ps1') -SchemaPath $workflowSchema -InstancePath $workflowPath -NoExitFailure|ConvertFrom-Json;if($checked.result-ne'passed'){AddFailure 'installed-workflow-schema-invalid'}}else{AddFailure 'installed-workflow-schema-missing'}
if(Test-Path(Join-Path $RepositoryRoot 'repository.operations.json')){$ops=Get-Content -Raw (Join-Path $RepositoryRoot 'repository.operations.json')|ConvertFrom-Json;foreach($property in $ops.operations.PSObject.Properties){$op=$property.Value;if($op.applicability-eq'required'){$command=[string]$op.command;if($command-notmatch'^\./scripts/[A-Za-z0-9._-]+\.ps1$'-or-not(Test-Path(Join-Path $RepositoryRoot $command.Substring(2)))){AddFailure "required-operation-missing:$($property.Name)"}}}}
foreach($lock in @(Get-ChildItem (Join-Path $RepositoryRoot 'docs/extensions') -Filter '*.lock' -File -ErrorAction SilentlyContinue)){if((Get-Content -Raw $lock.FullName)-notmatch'(?m)^extension-(?:slug|id):'){AddFailure "extension-lock-invalid:$($lock.Name)"}}
$result=[ordered]@{schema_version=2;result=$(if($fail.Count){'failed'}else{'passed'});failures=@($fail)};$result|ConvertTo-Json -Depth 8
if($fail.Count-and-not$NoExitFailure){exit 1}

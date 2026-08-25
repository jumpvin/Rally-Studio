[CmdletBinding()]
param([string]$RepositoryRoot='', [switch]$NoExitFailure)
$ErrorActionPreference='Stop'; if(-not $RepositoryRoot){$RepositoryRoot=Split-Path -Parent $PSScriptRoot}
$state=Get-Content -Raw (Join-Path $RepositoryRoot 'workflow-state.json')|ConvertFrom-Json
$milestones=@(Get-ChildItem (Join-Path $RepositoryRoot 'docs/milestones') -File -Filter '*.md'|Where-Object{(Get-Content -Raw $_.FullName)-match('(?m)^milestone-id:\s*"?'+[regex]::Escape([string]$state.current_milestone)+'"?\s*$')})
$scope=if($milestones.Count-eq1){$milestones[0].FullName.Substring($RepositoryRoot.Length).TrimStart('\').Replace('\','/')}else{$null}
$legal=($state.next_owner-eq'Builder' -and $state.next_command-in@('Implement Milestone','Address Review'))
$failures=[Collections.Generic.List[string]]::new()
if($legal){foreach($field in @('baseline','mode','validation_level')){if(-not$state.$field){$failures.Add("builder-context-missing:$field")}};foreach($field in @('affected_paths','affected_surfaces')){if(-not$state.$field-or@($state.$field).Count-eq0){$failures.Add("builder-context-missing:$field")}}}
if($state.next_command-eq'Implement Milestone' -and $state.mode-ne'implementation'){$failures.Add('implementation-mode-invalid')}
if($state.next_command-eq'Address Review'){$review=@($(Get-ChildItem (Join-Path $RepositoryRoot 'docs/reviews') -File -ErrorAction SilentlyContinue|Where-Object{(Get-Content -Raw $_.FullName)-match('(?m)^milestone-id:\s*"?'+[regex]::Escape([string]$state.current_milestone)+'"?\s*$')}));if($state.mode-ne'correction'){$failures.Add('correction-mode-invalid')};if($review.Count-eq0){$failures.Add('canonical-review-findings-missing')}}
foreach($evidence in @($state.retained_evidence)){if($evidence-notmatch'^[a-z0-9][a-z0-9._-]*@(?:[a-f0-9]{40}|[a-f0-9]{64})$'){$failures.Add("retained-evidence-provenance-invalid:$evidence")}}
$result=[ordered]@{schema_version=1;milestone=$state.current_milestone;build=$state.current_build;branch=$state.authorized_branch;baseline=$state.baseline;mode=$state.mode;owner=$state.next_owner;command=$state.next_command;frozen_scope_path=$scope;validation_level=$state.validation_level;retained_evidence=@($state.retained_evidence);likely_affected_paths=@($state.affected_paths);likely_affected_surfaces=@($state.affected_surfaces);visual_reference=$state.visual_reference;legal_action=[bool]($state.next_owner-and$state.next_command-and$failures.Count-eq0);legal_builder_action=[bool]($legal-and$failures.Count-eq0);failures=@($failures);status_line="Framework $($state.release_target) · $($state.current_milestone) · $($state.mode) · $($state.current_build) · $($state.next_owner): $($state.next_command)"}
$result|ConvertTo-Json -Depth 5;if((-not$legal-or$failures.Count)-and-not$NoExitFailure){exit 1}

[CmdletBinding()]param([Parameter(Mandatory)][string]$Build)
$match=[regex]::Match($Build,'^(.*?-dev\.\d+)(?:\.(\d+))?$')
if(-not$match.Success){throw "Cannot derive correction identity from canonical build: $Build"}
$ordinal=if($match.Groups[2].Success){[int]$match.Groups[2].Value+1}else{1}
"$($match.Groups[1].Value).$ordinal"

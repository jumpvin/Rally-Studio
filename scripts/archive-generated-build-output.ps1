[CmdletBinding()]
param(
    [Parameter(Mandatory)][string]$BuildRoot,
    [Parameter(Mandatory)][string]$CurrentDirectory,
    [Parameter(Mandatory)][ValidateScript({$_ -ne '*' -and $_ -ne '*.*'})][string]$GeneratedNamePattern
)
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path $BuildRoot).Path.TrimEnd('\','/')
$current = (Resolve-Path $CurrentDirectory).Path.TrimEnd('\','/')
if (-not $current.StartsWith($root + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Current generated output must be a child of BuildRoot.' }
if ((Split-Path -Parent $current) -ne $root) { throw 'Current generated output must be an immediate child of BuildRoot.' }
if ((Split-Path -Leaf $current) -notlike $GeneratedNamePattern) { throw 'Current output does not match the explicit generated-directory pattern.' }
$archive = Join-Path $root 'archive'
New-Item -ItemType Directory -Force $archive | Out-Null
$moved = [Collections.Generic.List[string]]::new()
Get-ChildItem -LiteralPath $root -Directory | Where-Object {
    $_.Name -ne 'archive' -and $_.FullName -ne $current -and $_.Name -like $GeneratedNamePattern
} | ForEach-Object {
    $destination = Join-Path $archive $_.Name
    if (Test-Path -LiteralPath $destination) { throw "Archive destination already exists: $destination" }
    Move-Item -LiteralPath $_.FullName -Destination $destination
    $moved.Add($_.Name)
}
[ordered]@{ schema_version=1; build_root=$root; current=(Split-Path -Leaf $current); archive=$archive; moved=@($moved); source_files_moved=$false } | ConvertTo-Json -Depth 4

$header = @"
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

"@

$models = Get-Content -Path "prisma\models\*.prisma" | Out-String
$content = $header + $models
Set-Content -Path "prisma\schema.prisma" -Value $content

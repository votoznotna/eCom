npm i -D prisma @prisma/client
npx prisma init --provider postgresql
npx prisma generate --schema=./prisma/schema.prisma
npx prisma migrate dev --name init
npx prisma studio
npx tsx ./db/seed
npm i @neondatabase/serverless @prisma/adapter-neon ws
npm i -D @types/ws bufferutil 
npx prisma generate

npx shadcn@latest add badge

## Updating the schema:
ecom % npx prisma generate
npx prisma migrate dev --name add_user_based_tables

npm i bcrypt-ts-edge

npx tsx ./db/seed
import Decimal from 'decimal.js'
npx prisma studio
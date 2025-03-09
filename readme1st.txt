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
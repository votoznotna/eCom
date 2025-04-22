import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export const { auth: middleware } = NextAuth(authConfig);

// import { NextResponse } from 'next/server';

// export function middleware(request: Request) {
//   // Middleware logic here (avoid Prisma or NextAuth imports)
//   const response = NextResponse.next();
//   return response;
// }

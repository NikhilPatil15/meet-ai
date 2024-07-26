// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';


export function middleware(req: NextRequest) {
    console.log("Middleware test executed");
    return NextResponse.next();
}

export const config = {
    matcher: ['/*'], // Match all routes for testing
};

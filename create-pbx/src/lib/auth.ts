import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import "dotenv/config"
const prisma = new PrismaClient();


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    socialProviders: { 
      github: { 
        clientId: process.env.GITHUB_CLIENT_ID as string, 
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
      }, 
    }, 
    trustedOrigins: [
        "http://localhost:3000" //change this to your frontend url
      ],
});
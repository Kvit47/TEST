import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { Session } from "next-auth"
import type { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface User {
        id: string
        username: string
        email: string
        role: string
        serverToken: string
    }
    interface Session {
        user: {
            id: string
            username: string
            email: string
            role: string
            serverToken: string
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        username: string
        role: string
        serverToken: string
    }
}

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required")
                }

                const res = await fetch(`${SERVER_URL}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: credentials.email,
                        password: credentials.password,
                    }),
                })

                const data = await res.json()

                if (!res.ok) {
                    throw new Error(data.message || "Invalid credentials")
                }

                return {
                    id: String(data.user.id),
                    username: data.user.username,
                    email: data.user.email,
                    role: data.user.role,
                    serverToken: data.token,
                }
            },
        }),
    ],

    session: {
        strategy: "jwt" as const,
    },

    callbacks: {
        async jwt({ token, user }: { token: JWT; user: { id: string; username: string; role: string; serverToken: string } | undefined }) {
            if (user) {
                token.id = user.id
                token.username = user.username
                token.role = user.role
                token.serverToken = user.serverToken
            }
            return token
        },

        async session({ session, token }: { session: Session; token: JWT }) {
            session.user = {
                id: token.id,
                username: token.username,
                email: token.email as string,
                role: token.role,
                serverToken: token.serverToken,
            }
            return session
        },

        async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },
    },

    pages: {
        signIn: "/auth/signin",
    },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

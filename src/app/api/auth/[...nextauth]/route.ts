import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

export const OPTIONS: NextAuthOptions = {
  pages: {
    signIn: "/login",
    signOut: "",
  },
  providers: [
    // Login Provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          type: "email",
          label: "Email Address",
          placeholder: "Enter your email address",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and Password are required.");
        }

        // Server-side validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(credentials.email)) {
          throw new Error("Invalid email format.");
        }
        try {
          const res = await fetch(
            "https://exam.elevateegy.com/api/v1/auth/signin",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const user = await res.json();

          if (!res.ok || !user) {
            console.error(
              "Authorization failed:",
              user.message || "Unknown error"
            );
            return null;
          }
          console.log({ login: user });
          return user;
        } catch (error) {
          console.error("Error during authorization:", error);
          throw new Error("Authentication failed.");
        }
      },
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ token, session }) {
      return { ...token, ...session };
    },
  },
};

const handler = NextAuth(OPTIONS);

export { handler as GET, handler as POST };

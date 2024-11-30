import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

export const OPTIONS: NextAuthOptions = {
  pages: {
    signIn: "/login",
    signOut: "/register",
  },
  providers: [
    // Login Provider
    CredentialsProvider({
      name: "login",
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
          console.log({ login: user });

          if (!res.ok || !user) {
            console.error(
              "Authorization failed:",
              user.message || "Unknown error"
            );
            return null;
          }

          return user;
        } catch (error) {
          console.error("Error during authorization:", error);
          throw new Error("Authentication failed.");
        }
      },
    }),
    // Signup Provider
    CredentialsProvider({
      name: "signup",
      credentials: {
        username: {
          type: "text",
          label: "Username",
          placeholder: "Enter your username",
        },
        firstName: {
          type: "text",
          label: "First Name",
          placeholder: "Enter your first name",
        },
        lastName: {
          type: "text",
          label: "Last Name",
          placeholder: "Enter your last name",
        },
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
        rePassword: {
          type: "password",
          label: "Confirm Password",
          placeholder: "Confirm your password",
        },
        phone: {
          type: "text",
          label: "Phone Number",
          placeholder: "Enter your phone number",
        },
      },
      async authorize(credentials, req) {
        if (
          !credentials?.email ||
          !credentials?.password ||
          !credentials?.username ||
          !credentials?.firstName ||
          !credentials?.lastName ||
          !credentials?.phone ||
          !credentials?.rePassword
        ) {
          throw new Error("All fields are required.");
        }

        // Server-side validations
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(credentials.email)) {
          throw new Error("Invalid email format.");
        }
        if (credentials.password !== credentials.rePassword) {
          throw new Error("Passwords do not match.");
        }
        if (!/^01[0-2,5]{1}[0-9]{8}$/.test(credentials.phone)) {
          throw new Error("Invalid phone number format.");
        }

        try {
          const res = await fetch(
            "https://exam.elevateegy.com/api/v1/auth/signup",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: credentials.username,
                firstName: credentials.firstName,
                lastName: credentials.lastName,
                email: credentials.email,
                password: credentials.password,
                rePassword: credentials.rePassword,
                phone: credentials.phone,
              }),
            }
          );

          const user = await res.json();
          console.log({ signup: user });

          if (!res.ok || !user) {
            console.error("Signup failed:", user.message || "Unknown error");
            return null;
          }

          return user;
        } catch (error) {
          console.error("Error during signup:", error);
          throw new Error("Signup failed. Please try again.");
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

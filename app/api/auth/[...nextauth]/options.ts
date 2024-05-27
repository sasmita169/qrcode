import config from "@/lib/config";
import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

// Define User type if not already defined
interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export const authOptions: AuthOptions = {
  providers: [
    // GithubProvider({
    //   clientId: config.GITHUB_CLIENT_ID,
    //   clientSecret: config.GITHUB_CLIENT_SEC,
    // }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      authorize: async (credentials) => {
        const user = loginUser(credentials);

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        }
        return null;
      },
    }),
  ],
  secret: config.NEXTAUTH_SECRET,
};

// const loginUser = async (
//   credentials: Record<"email" | "password", string> | undefined
// ): Promise<User | null> => {
//   if (!credentials) return null;

//   const user = await prisma.user.findFirst({
//     where: { email: credentials.email },
//   });

//   if (user) {
//     const isPasswordCorrect = await bcrypt.compare(
//       credentials.password,
//       user.password
//     );

//     if (isPasswordCorrect) {
//       const { id, firstName, email } = user;
//       return {
//         id,
//         name: firstName,
//         email,
//       };
//     }
//   }

//   return null;
// };

const loginUser = (
  credentials: Record<"email" | "password", string> | undefined
): User | null => {
  const name = config.SUPER_NAME;
  const email = config.SUPER_EMAIL;
  const password = config.SUPER_PASSWORD;

  if (!credentials || !credentials.email || !credentials.password) {
    return null;
  }

  const isPasswordCorrect = password === credentials.password;
  const isEmailMatched = email === credentials.email;

  if (isPasswordCorrect && isEmailMatched) {
    return {
      id: "Super-User",
      name,
      email,
    };
  }
  return null;
};

import NextAuth from "next-auth";

import { authOptions } from "~/server/auth";

// import GoogleProvider from "next-auth/providers/google";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions);

// const handler = NextAuth({
//     providers:[
//         GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID ?? "",
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
//         }),
//     ],
// });

export { handler as GET, handler as POST };

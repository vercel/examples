import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import Moralis from 'moralis';

export type TUserData = {
  address: string;
  signature: string;
  profileId: string;
  expirationTime: string;
};

export interface ISession {
  user: TUserData;
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'MoralisAuth',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
      },
      async authorize(credentials) {
        try {
          const { message, signature } = credentials as { message: string; signature: string };

          await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

          const { address, profileId, expirationTime } = (
            await Moralis.Auth.verify({ message, signature, network: 'evm' })
          ).raw;

          const user = { address, profileId, expirationTime, signature };

          return user;
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // eslint-disable-next-line no-unused-expressions
      user && (token.user = user);
      return token;
    },
    async session({ session, token }) {
      session.expires = (token as unknown as ISession).user.expirationTime;
      (session as unknown as ISession).user = (token as unknown as ISession).user;
      return session;
    },
  },
});
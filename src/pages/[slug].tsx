import Head from "next/head";
import Image from "next/image";
import superjson from "superjson";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type {
  NextPage,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";

import { api } from "~/utils/api";
import { prisma } from "~/server/db";
import { Layout } from "~/components/layout";
import { appRouter } from "~/server/api/root";

const Profile: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  username,
}) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <Layout>
        <div className="relative h-36 bg-slate-600">
          <Image
            width={128}
            height={128}
            src={data.profileImageUrl}
            alt={`${data.username ?? ""}'s profile pic`}
            className="m-b absolute bottom-0 left-5 -mb-[64px] rounded-full border-4 border-black bg-black"
          />
        </div>

        <div className="h-[64px]" />
        <div className="border-b border-slate-400 p-4 text-2xl font-bold ">
          @{data.username}
        </div>
      </Layout>
    </>
  );
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    transformer: superjson,
    ctx: {
      prisma,
      userId: null,
    },
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") {
    return {
      notFound: true,
    };
  }

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({
    username,
  });

  return {
    props: {
      username,
      trpcState: ssg.dehydrate(),
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default Profile;

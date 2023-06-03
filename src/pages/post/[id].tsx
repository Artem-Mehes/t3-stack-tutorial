import Head from "next/head";
import type {
  NextPage,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";

import { api } from "~/utils/api";
import { Post } from "~/components/post";
import { Layout } from "~/components/layout";
import { generateSSGHelper } from "~/server/helpers";

const SinglePostPage: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ id }) => {
  const { data } = api.posts.getById.useQuery({
    id,
  });

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>
          {data.post.content} | {data.author.username}
        </title>
      </Head>
      <Layout>
        <Post {...data} />
      </Layout>
    </>
  );
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await ssg.posts.getById.prefetch({ id });

  return {
    props: {
      id,
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

export default SinglePostPage;

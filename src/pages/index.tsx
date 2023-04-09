import dayjs from "dayjs";
import Head from "next/head";
import Image from "next/image";
import { type NextPage } from "next";
import relativeTime from "dayjs/plugin/relativeTime";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";

import { api, type RouterOutputs } from "~/utils/api";

dayjs.extend(relativeTime);

const CreatePost = () => {
  return (
    <div className="flex w-full gap-5">
      <UserButton />

      <input
        type="text"
        placeholder="Type some emojis"
        className="grow bg-transparent p-1 outline-none"
      />
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
const Post = (props: PostWithUser) => {
  const { post, author } = props;

  console.log(post);

  return (
    <li className="flex gap-5 border-b border-slate-400 p-5">
      <div className="flex flex-col items-center">
        <Image
          width="56"
          height="56"
          alt={author.username}
          src={author.profileImageUrl}
          className="h-14 w-14 rounded-full"
        />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center">
          <span className="text-slate-500">
            @{author.username} · {dayjs(post.createdAt).fromNow()}
          </span>
        </div>
        <div className="text-lg">{post.content}</div>
      </div>
    </li>
  );
};

const Home: NextPage = () => {
  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>Something went wrong</div>;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="w-full border-x border-slate-200 md:max-w-2xl">
          <header className="flex border-b border-slate-200 p-4">
            <SignedIn>
              <CreatePost />
            </SignedIn>

            <SignedOut>
              <SignInButton>
                <button className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm">
                  Sign in
                </button>
              </SignInButton>
            </SignedOut>
          </header>

          <ul>
            {data?.map((data) => (
              <Post key={data.post.id} {...data} />
            ))}
          </ul>
        </div>
      </main>
    </>
  );
};

export default Home;

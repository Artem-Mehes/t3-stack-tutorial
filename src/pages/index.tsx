import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { type NextPage } from "next";
import { type FormEvent, useState } from "react";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  useUser,
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from "@clerk/nextjs";

import { api, type RouterOutputs } from "~/utils/api";
import { Loader, LoaderIcon } from "~/components/loader";
import { Layout } from "~/components/layout";

dayjs.extend(relativeTime);

const CreatePost = () => {
  const ctx = api.useContext();

  const [content, setContent] = useState("");

  const { mutate, isLoading } = api.posts.create.useMutation({
    onSuccess: () => {
      setContent("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (error) => {
      const message = error?.data?.zodError?.fieldErrors.content?.[0];
      if (message) {
        toast.error(message);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutate({ content });
  };

  return (
    <form className="flex w-full items-center gap-5" onSubmit={onSubmit}>
      <UserButton />

      <input
        type="text"
        value={content}
        disabled={isLoading}
        placeholder="Type some emojis"
        onChange={(e) => setContent(e.target.value)}
        className="grow bg-transparent p-1 outline-none"
      />

      {isLoading ? (
        <LoaderIcon />
      ) : (
        <input
          value="Send"
          type="submit"
          disabled={!content}
          className="cursor-pointer rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-500"
        />
      )}
    </form>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
const Post = (props: PostWithUser) => {
  const { post, author } = props;

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
            <Link href={`/${author.username}`}>@{author.username}</Link> ·{" "}
            <Link href={`/post/${post.id}`}>
              {dayjs(post.createdAt).fromNow()}
            </Link>
          </span>
        </div>
        <div className="text-lg">{post.content}</div>
      </div>
    </li>
  );
};

const Feed = () => {
  const { isLoading, data, isError } = api.posts.getAll.useQuery();

  if (isLoading) return <Loader size={90} className="grow" />;

  if (isError) return <div>Something went wrong</div>;

  return (
    <ul className="overflow-auto">
      {data?.map((data) => (
        <Post key={data.post.id} {...data} />
      ))}
    </ul>
  );
};

const Home: NextPage = () => {
  const { isLoaded } = useUser();

  api.posts.getAll.useQuery();

  if (!isLoaded) return null;

  return (
    <>
      <Layout>
        <header className="flex h-20 border-b border-slate-200 p-4">
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

        <Feed />
      </Layout>
    </>
  );
};

export default Home;

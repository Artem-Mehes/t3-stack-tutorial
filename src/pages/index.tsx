import dayjs from "dayjs";
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

import { api } from "~/utils/api";
import { Post } from "~/components/post";
import { Layout } from "~/components/layout";
import { Loader, LoaderIcon } from "~/components/loader";

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

import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import relativeTime from "dayjs/plugin/relativeTime";

import type { RouterOutputs } from "~/utils/api";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const Post = (props: PostWithUser) => {
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

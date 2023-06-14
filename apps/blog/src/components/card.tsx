import React from "react";
import Link from "next/link";
import Image from "next/image";
import moment from "moment";

type Props = React.HTMLAttributes<HTMLElement> & {
  name: string;
  author: string;
  date: string;
  imageUrl: string;
  slug: string;
  summary: string;
};

export const Card = ({ name, date, imageUrl, slug, summary }: Props) => {
  return (
    <article className="w-[350px] rounded-lg shadow-lg">
      <Link href={`/${slug}`}>
        <div className="relative h-[200px] w-full overflow-hidden rounded-t-lg">
          <Image
            src={imageUrl}
            alt={name}
            loading="lazy"
            placeholder="empty"
            object-fit="cover"
            quality={100}
            fill={true}
          />
        </div>

        <div className="h-[224px] p-6">
          <p className="text-grayColor text-sm">
            <span>yushaku</span>
            <span className="ml-4">{moment(date).format("LL")}</span>
          </p>
          <h3 className="text-textColor hover:text-primaryColor my-2 text-xl font-semibold">
            {name}
          </h3>
          <p className="text-grayColor line-clamp-4 text-sm">{summary}</p>
        </div>
      </Link>
    </article>
  );
};
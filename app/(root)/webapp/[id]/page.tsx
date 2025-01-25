import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { PLAYLIST_BY_SLUG_QUERY, WEBAPP_BY_ID_QUERY } from "@/sanity/lib/queries";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import markdownit from "markdown-it"
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import WebappCard, { WebappTypeCard } from "@/components/WebappCard";

const md = markdownit()
export const experimental_ppr = true;

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id;

    const post = await client.fetch(WEBAPP_BY_ID_QUERY, { id });

    const { select: editorsPosts } = await client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: "best-websites" })

    if (!post) return notFound();

    const parsedContent = md.render(post?.pitch || "")


    return (
        <>
            <section className="hero_container !min-h-[230px]">
                <p className="tag">{formatDate(post?._createdAt)}</p>
                <h1 className="heading">{post.title}</h1>
                <p className="sub-heading !max-w-5xl">{post.description}</p>
            </section>
            <section className="web-apps_container">
                <img src={post.image || "https://placehold.co/600x400"} alt="thumbnail" className="w-full h-auto rounded-xl" />
                <div className="space-y-5  mt-10 max-w-4xl mx-auto">
                    <div className="flex-between gap-5">
                        <Link href={`/user/${post.author?._id}`} className="flex gap-2 items-center mb-3">
                            <Image src={post.author.image || "https://placehold.co/64x64"} alt="avatar" width={64} height={64} className="rounded-full drop-shadow-lg" />
                            <div>
                                <p className="text-20-medium">{post.author.name}</p>
                                <p className="text-16-medium !text-black-300">@{post.author.username}</p>
                            </div>
                        </Link>
                        <p className="category-tag">{post.category}</p>
                    </div>
                    <h3 className="text-30-bold"> Pitch Details</h3>
                    {parsedContent ? (
                        <article
                            className="pros max-w-4xl font-work-sans break-all"
                            dangerouslySetInnerHTML={{ __html: parsedContent }}
                        />
                    ) : (
                        <p className="no-result">No details provided</p>
                    )}
                </div>
                <hr className="divider" />
                {editorsPosts?.length > 0 && (
                    <div className="max-w-4xl mx-auto">
                        <p className="text-30-semibold">Editor Picks</p>
                        <ul className="mt-7 card_grid-sm">
                            {editorsPosts.map((post: WebappTypeCard, i: number) => (
                                <WebappCard key={i} post={post} /> 
                            ))}
                        </ul>
                    </div>
                )}
                <Suspense fallback={<Skeleton className="view_skeleton" />}>
                    <View id={id} />
                </Suspense>
            </section>

        </>
    )
}

export default Page
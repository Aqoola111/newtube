import {trpc} from "@/trpc/server";

export default async function Home() {
    const data = await trpc.hello({text: "hello"});

    return (
        <div>
            client says: {data?.greeting}
        </div>
    );
}

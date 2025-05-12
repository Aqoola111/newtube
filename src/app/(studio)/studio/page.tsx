import {HydrateClient, trpc} from "@/trpc/server";
import {StuidoView} from "@/modules/studio/ui/views/stuido-view";
import {DEFAULT_LIMIT} from "@/constants";

const StudioPage = async () => {
    void trpc.studio.getMany.prefetchInfinite({limit: DEFAULT_LIMIT})

    return (
        <HydrateClient>
            <StuidoView/>
        </HydrateClient>
    )
}
export default StudioPage

import MuxPlayer from "@mux/mux-player-react";
import {THUMBNAIL_FALLBACK} from "@/modules/studio/constants";

interface VideoPlayerProps {
    playbackId?: string | null | undefined,
    thumbnailUrl?: string | null | undefined,
    autoplay?: boolean,
    onPlay?: () => void,
}

const VideoPlayer = ({
                         playbackId,
                         thumbnailUrl,
                         autoplay,
                         onPlay
                     }: VideoPlayerProps) => {

    if (!playbackId) return null

    return (
        <MuxPlayer
            playbackId={playbackId}
            poster={thumbnailUrl || THUMBNAIL_FALLBACK}
            playerInitTime={0}
            autoPlay={autoplay}
            thumbnailTime={0}
            className={'w-full h-full object-contain'}
            accentColor={'#94181a'}
            onPlay={onPlay}
        />

    )
}
export default VideoPlayer

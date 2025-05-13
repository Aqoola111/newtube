import {
    VideoAssetCreatedWebhookEvent,
    VideoAssetDeletedWebhookEvent,
    VideoAssetErroredWebhookEvent,
    VideoAssetReadyWebhookEvent,
    VideoAssetTrackReadyWebhookEvent
} from "@mux/mux-node/resources/webhooks"
import {headers} from "next/headers";
import {mux} from "@/lib/mux";
import {db} from "@/db";
import {videos} from "@/db/schema";
import {eq} from "drizzle-orm";

const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET;

type WEBHOOK_EVENT =
    VideoAssetCreatedWebhookEvent
    | VideoAssetReadyWebhookEvent
    | VideoAssetErroredWebhookEvent
    | VideoAssetTrackReadyWebhookEvent
    | VideoAssetDeletedWebhookEvent

export const POST = async (request: Request) => {
    console.log("GOT MUX WEBHOOK")
    if (!SIGNING_SECRET) throw new Error("MUX_WEBHOOK_SECRET is not set");

    const headersPayload = await headers()
    const muxSignature = headersPayload.get("mux-signature")

    if (!muxSignature) {
        return new Response("Missing Mux Signature", {status: 400})
    }

    const payload = await request.json()
    const body = JSON.stringify(payload)

    mux.webhooks.verifySignature(body,
        {
            "mux-signature": muxSignature,
        },
        SIGNING_SECRET
    )


    switch (payload.type as WEBHOOK_EVENT['type']) {
        case "video.asset.created" : {
            const data = payload.data as VideoAssetCreatedWebhookEvent['data']

            if (!data.upload_id) {
                return new Response('No mux video upload id found', {status: 400})
            }

            await db.update(videos).set({
                muxAssetId: data.id,
                muxStatus: data.status,

            }).where(eq(videos.muxUploadId, data.upload_id))
            break;
        }
        case "video.asset.ready" : {
            const data = payload.data as VideoAssetReadyWebhookEvent['data']
            const playbackId = data.playback_ids?.[0]?.id

            if (!playbackId) {
                return new Response('No mux video playback id found', {status: 400})
            }

            if (!data.upload_id) {
                return new Response('No mux video upload id found', {status: 400})
            }

            const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`
            const previewUrl = `https://image.mux.com/${playbackId}/animated.gif`

            const duration = data.duration ? Math.round(data.duration * 1000) : 0

            await db.update(videos).set({
                muxPlaybackId: playbackId,
                muxAssetId: data.id,
                thumbnailUrl: thumbnailUrl,
                muxStatus: data.status,
                previewUrl: previewUrl,
                duration: duration
            }).where(eq(videos.muxUploadId, data.upload_id))
            break
        }
        case "video.asset.errored" : {

            const data = payload.data as VideoAssetErroredWebhookEvent['data']

            if (!data.upload_id) {
                return new Response('No mux video upload id found', {status: 400})
            }

            await db.update(videos).set({
                muxStatus: data.status,
            }).where(eq(videos.muxUploadId, data.upload_id))

            break
        }
        case "video.asset.deleted": {
            const data = payload.data as VideoAssetDeletedWebhookEvent['data']

        }

        // case "video.asset.track.ready" : {
        // }
    }


    return new Response("Webhook received", {status: 200})
}
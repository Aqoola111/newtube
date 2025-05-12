import {
    VideoAssetCreatedWebhookEvent,
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

export const POST = async (request: Request) => {
    console.log("GOT MUX WEBHOOK")
    if (!SIGNING_SECRET) throw new Error("MUX_WEBHOOK_SECRET is not set");

    const headersPayloaad = await headers()
    const muxSignature = headersPayloaad.get("mux-signature")

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
    }
    
    return new Response("Webhook received", {status: 200})
}
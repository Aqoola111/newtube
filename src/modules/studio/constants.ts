export const statusMap: Record<
    "preparing" | "ready" | "errored" | "waiting",
    { label: string; className: string; variant?: "default" | "outline" | "destructive" }
> = {
    preparing: {
        label: "Preparing",
        variant: "outline",
        className: "text-yellow-600 border-yellow-600",
    },
    ready: {
        label: "Ready",
        variant: "default",
        className: "bg-green-600 hover:bg-green-700",
    },
    errored: {
        label: "Error",
        variant: "destructive",
        className: "",
    },
    waiting: {
        label: "Waiting",
        variant: "outline",
        className: "text-yellow-600 border-yellow-600",
    },
}

export const THUMBNAIL_FALLBACK = '/placeholder.svg'
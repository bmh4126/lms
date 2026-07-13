import { lusitana } from "../../font";

export function Video({ video_url }: { video_url: string }) {
    if (!video_url)
        return (
            <p className={`${lusitana.className} text-[20px]`} >Video's coming soon</p>
    )
    return (<iframe
        className="w-full shadow-md/30 aspect-video max-w-3xl"
        src={video_url}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
    ></iframe>);
}

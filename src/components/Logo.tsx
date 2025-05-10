import Image from "next/image";

export function Logo() {
    return <div className="flex p-4 gap-2 items-center">
        <Image height={"32"} width={"32"} src={"/logo.svg"} alt={"Logo"}/>
        <h1 className="text-2xl tracking-tight font-semibold">
            NewTube
        </h1>
    </div>;
}
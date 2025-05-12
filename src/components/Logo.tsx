import Image from "next/image";

interface LogoProps {
    label?: string;
}

export function Logo({label}: LogoProps) {
    return <div className="md:flex hidden  p-4 gap-2 items-center">
        <Image height={"32"} width={"32"} src={"/logo.svg"} alt={"Logo"}/>
        <h1 className="text-2xl tracking-tight font-semibold">
            {label ? label : 'NewTube'}
        </h1>
    </div>;
}
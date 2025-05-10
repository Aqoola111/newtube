import {HomeLayout} from "@/modules/ui/layouts/home-layout";

const Layout = ({
                    children,
                }: {
    children: React.ReactNode;
}) => {
    return (
        <HomeLayout>
            {children}
        </HomeLayout>
    )
}
export default Layout

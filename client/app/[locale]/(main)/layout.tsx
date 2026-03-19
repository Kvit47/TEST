import Footer from "@/src/widgets/footer/footer";
import Navbar from "@/src/widgets/navbar/navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Navbar />
            {children}
            <Footer />
        </div>
    )
}
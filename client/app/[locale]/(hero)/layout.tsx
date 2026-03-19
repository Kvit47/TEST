import AppShell from "@/app/app-shell";
import SmoothScroll from "@/src/shared/ui/smooth-scroll/smooth-scroll";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <SmoothScroll>
                <AppShell>
                    {children}
                </AppShell>
            </SmoothScroll>
        </div>
    )
}
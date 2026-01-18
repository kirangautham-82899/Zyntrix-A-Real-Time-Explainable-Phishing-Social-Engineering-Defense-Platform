"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Shield,
    Scan,
    BarChart3,
    History,
    QrCode,
    Eye,
    Activity,
    Settings,
    LogOut,
    Menu,
    X,
    User
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sidebarItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/scanner", label: "Threat Scanner", icon: Scan },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/history", label: "Scan History", icon: History },
    { href: "/qr-scanner", label: "QR Scanner", icon: QrCode },
    { href: "/visualization", label: "Risk Viz", icon: Eye },
    { href: "/api-test", label: "API Status", icon: Activity },
    { href: "/demo", label: "UI Demo", icon: Settings },
];

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#0a0e27] text-white overflow-hidden">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-64 border-r border-cyan-500/20 bg-[#0a0e27]/95 backdrop-blur-xl">
                <div className="p-6 flex items-center gap-3 border-b border-cyan-500/20">
                    <Shield className="w-8 h-8 text-cyan-400" />
                    <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        ZYNTRIX
                    </span>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link key={item.href} href={item.href}>
                                <div
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                            ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30"
                                            : "text-gray-400 hover:text-cyan-300 hover:bg-white/5"
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? "text-cyan-400" : "text-gray-500 group-hover:text-cyan-400"}`} />
                                    <span className="font-medium">{item.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebar-active"
                                            className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                                        />
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-cyan-500/20">
                    <Link href="/">
                        <button className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Log Out</span>
                        </button>
                    </Link>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a0e27]/90 backdrop-blur-md border-b border-cyan-500/20 z-50 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-cyan-400" />
                    <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        ZYNTRIX
                    </span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-gray-400 hover:text-white"
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative md:static pt-16 md:pt-0">
                {/* Top Bar (Desktop) */}
                <header className="hidden md:flex items-center justify-between px-8 py-4 bg-[#0a0e27]/50 backdrop-blur-sm border-b border-cyan-500/10">
                    <div>
                        <h2 className="text-gray-400 text-sm">
                            / {sidebarItems.find(i => i.href === pathname)?.label || 'App'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                <User className="w-4 h-4 text-cyan-400" />
                            </div>
                            <span className="text-sm font-medium pr-2">Security Admin</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 relative">
                    {/* Background Grid */}
                    <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
                        <div className="absolute inset-0"
                            style={{
                                backgroundImage: `
                   linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px),
                   linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px)
                 `,
                                backgroundSize: '40px 40px'
                            }}
                        />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </div>
            </main>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 z-40 md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute left-0 top-0 bottom-0 w-64 bg-[#0a0e27] border-r border-cyan-500/20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 flex items-center gap-3 border-b border-cyan-500/20">
                                <Shield className="w-8 h-8 text-cyan-400" />
                                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                    ZYNTRIX
                                </span>
                            </div>
                            <nav className="p-4 space-y-2">
                                {sidebarItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${isActive
                                                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                                                    : "text-gray-400"
                                                }`}>
                                                <Icon className="w-5 h-5" />
                                                <span className="font-medium">{item.label}</span>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </nav>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

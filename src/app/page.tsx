'use client';
import Link from 'next/link';
import {FirstViewVideo} from "@/components/FirstViewVideo";
import {motion} from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from 'react';
import ScrollIndicator from "@/components/scrollIndicator/ScrollIndicator";
import FirstViewContent from "@/components/firstViewContent/FirstViewContent";

export default function HomePage() {
    const [worksRef, worksInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const [careerRef, careerInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });
    const [showHeader, setShowHeader] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowHeader(true);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);


    const workItemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.2,
                duration: 0.6,
                ease: "easeOut"
            }
        })
    };

    const careerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };
    return (
        <div className="min-h-screen flex flex-col">
            <motion.header
                className="bg-transparent absolute top-0 left-0 w-screen z-10"
                initial={{y: -100, opacity: 0}}
                animate={showHeader ? {y: 0, opacity: 1} : {y: -100, opacity: 0}}
                transition={{duration: 0.6, ease: "easeInOut"}}
            >
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href={"/"}>
                        <div className="flex items-center w-[40px]">
                            <img src={"./RyoLogo.png"} alt={"Logo"} className={"w-full"}/>
                        </div>
                    </Link>
                    <nav>
                        <ul className="flex space-x-6">
                            <li><Link href="/lp" className="text-gray-600 hover:text-gray-800">LP</Link></li>
                        </ul>
                    </nav>
                </div>
            </motion.header>
            <main className="flex-grow">
                {/* FirstView */}
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 1}}
                    className="w-full"
                >
                    <div className="relative h-screen">
                        <FirstViewVideo/>
                        <FirstViewContent />
                        <ScrollIndicator />
                    </div>
                </motion.div>

                {/* Works */}
                <motion.div
                    ref={worksRef}
                    initial="hidden"
                    animate={worksInView ? "visible" : "hidden"}
                    className="container mx-auto px-4 py-16"
                >
                    <motion.h2
                        initial={{opacity: 0, y: 20}}
                        animate={worksInView ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
                        transition={{delay: 0.8, duration: 0.5}}
                        className="text-2xl font-bold mb-8"
                    >
                        Works
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link href="/works/project1" className="block">
                            <motion.div
                                custom={0}
                                variants={workItemVariants}
                                className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-102 bg-white border border-gray-100"
                            >
                                <div className="p-4 justify-between items-center border-b border-gray-100">
                                    <h3 className="font-bold text-gray-800 text-lg">PF DB共通化</h3>
                                    <p className="text-xs text-orange-600 py-1 rounded-full font-medium">2024.08</p>
                                </div>

                                <div className="bg-gray-50 overflow-hidden flex justify-center items-center p-3">
                                    <div
                                        className="overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105 w-full">
                                        <img src="./dbCommonPreview.png" alt="DB共通化画像" className="w-full object-cover"/>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="flex gap-2 mb-3">
                                        <span
                                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">PF会員増加</span>
                                        <span
                                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">スカウト送信数UP</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">うんちゃらかんちゃら</p>
                                    <div className="text-right">
                                        <span className="inline-flex items-center text-sm text-orange-500 font-medium group">
                                            詳細を見る
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                 className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none"
                                                 viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>

                        <Link href="/works/project2" className="block">
                            <motion.div
                                custom={1}
                                variants={workItemVariants}
                                className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-102 bg-white border border-gray-100"
                            >
                                <div className="p-4 justify-between items-center border-b border-gray-100">
                                    <h3 className="font-bold text-gray-800 text-lg">AgentDX</h3>
                                    <p className="text-xs text-orange-600 py-1 rounded-full font-medium">2024.12</p>
                                </div>

                                <div className="bg-gray-50 overflow-hidden flex justify-center items-center p-3">
                                    <div
                                        className="overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105 w-full">
                                        <img src="./agentDXPreview.png" alt="agentDX画像"
                                             className="w-full object-cover"/>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="flex gap-2 mb-3">
                                        <span
                                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">Rails</span>
                                        <span
                                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">React</span>
                                        <span
                                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">UI/UX</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">うんちゃらかんちゃら</p>
                                    <div className="text-right">
                                        <span
                                            className="inline-flex items-center text-sm text-orange-500 font-medium group">
                                            詳細を見る
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                 className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                                                 fill="none"
                                                 viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>

                        <Link href="/works/project3" className="block">
                            <motion.div
                                custom={2}
                                variants={workItemVariants}
                                className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-102 bg-white border border-gray-100"
                            >
                                <div className="p-4 justify-between items-center border-b border-gray-100">
                                    <h3 className="font-bold text-gray-800 text-lg">AgentDX</h3>
                                    <p className="text-xs text-orange-600 py-1 rounded-full font-medium">2024.12</p>
                                </div>

                                <div className="bg-gray-50 overflow-hidden flex justify-center items-center p-3">
                                    <div
                                        className="overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105 w-full">
                                        <img src="./foodslaboEfPreview.png" alt="foodslaboEf画像"
                                             className="w-full object-cover"/>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="flex gap-2 mb-3">
                                        <span
                                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">作業効率UP</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">うんちゃらかんちゃら</p>
                                    <div className="text-right">
                                        <span
                                            className="inline-flex items-center text-sm text-orange-500 font-medium group">
                                            詳細を見る
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                 className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                                                 fill="none"
                                                 viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                </motion.div>

                {/* Career */}
                <motion.div
                    ref={careerRef}
                    initial="hidden"
                    animate={careerInView ? "visible" : "hidden"}
                    className="container mx-auto px-4 py-16 bg-gray-50"
                >
                    <motion.h2
                        initial={{opacity: 0, y: 20}}
                        animate={careerInView ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
                        transition={{delay: 0.8, duration: 0.5}}
                        className="text-2xl font-bold mb-8"
                    >
                        Career
                    </motion.h2>

                    <div className="max-w-3xl mx-auto">
                        {/* Career Item */}
                        <motion.div
                            variants={careerVariants}
                            className="bg-gray-200 p-6 rounded-lg mb-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <h3 className="font-bold text-lg mb-2">自分のキャリアについて</h3>
                            <p className="text-gray-700 mb-4">2025</p>
                            <p className="text-gray-600">1-3年で達成したい技術的な目標や経験したいプロジェクト</p>
                        </motion.div>

                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            animate={careerInView ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
                            transition={{delay: 0.8, duration: 0.5}}
                            className="text-center mt-8"
                        >
                            <Link href="/career"
                                  className="inline-block py-3 px-6 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition-colors duration-300">
                                View more
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </main>
            <footer>
                <div className="py-5 border-t border-gray-700 text-center text-gray-400">
                    <p>© 2025 藤江&apos;sサイト All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}


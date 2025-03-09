'use client';
import Link from 'next/link';
import {FirstViewVideo} from "@/components/FirstViewVideo";
import {motion} from "framer-motion";
import { useInView } from "react-intersection-observer";


export default function HomePage() {
    const [worksRef, worksInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const [careerRef, careerInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

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
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-gray-800">藤江&apos;sサイト</h1>
                    </div>
                    <nav>
                        <ul className="flex space-x-6">
                            <li><Link href="/" className="text-blue-600 font-medium hover:text-blue-800">ホーム</Link>
                            </li>
                            <li><Link href="/lp" className="text-gray-600 hover:text-gray-800">LP</Link></li>
                        </ul>
                    </nav>
                </div>
            </header>
            <main className="flex-grow">
                {/* FirstView */}
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 1}}
                    className="w-full"
                >
                    <div className="relative">
                        <FirstViewVideo/>
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
                        animate={careerInView ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
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
                                className="bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                            >
                                <div className="aspect-video bg-gray-300"></div>
                                <div className="p-4">
                                    <h3 className="font-medium">db共通化</h3>
                                    <p className="text-sm text-gray-600">うんちゃらかんちゃら</p>
                                </div>
                            </motion.div>
                        </Link>

                        <Link href="/works/project2" className="block">
                            <motion.div
                                custom={1}
                                variants={workItemVariants}
                                className="bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                            >
                                <div className="aspect-video bg-gray-300"></div>
                                <div className="p-4">
                                    <h3 className="font-medium">AgentDX</h3>
                                    <p className="text-sm text-gray-600">うんちゃらかんちゃら</p>
                                </div>
                            </motion.div>
                        </Link>

                        <Link href="/works/project3" className="block">
                            <motion.div
                                custom={2}
                                variants={workItemVariants}
                                className="bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                            >
                                <div className="aspect-video bg-gray-300"></div>
                                <div className="p-4">
                                    <h3 className="font-medium">EFO</h3>
                                    <p className="text-sm text-gray-600">うんちゃらかんちゃら</p>
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
                            <h3 className="font-bold text-lg mb-2">こっからどないすんの</h3>
                            <p className="text-gray-700 mb-4">2025</p>
                            <p className="text-gray-600">うんちゃらかんちゃら</p>
                        </motion.div>

                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            animate={careerInView ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
                            transition={{delay: 0.8, duration: 0.5}}
                            className="text-center mt-8"
                        >
                            <Link href="/career"
                                  className="inline-block py-3 px-6 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-300">
                                View more
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </main>
            <footer>
                <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
                    <p>© 2025 藤江&apos;sサイト All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
        ;
}
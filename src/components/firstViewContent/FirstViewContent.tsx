// FirstViewContent.jsx
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const FirstViewContent = () => {
    // アニメーションの状態を管理
    const [isVisible, setIsVisible] = useState(false);

    // コンポーネントのマウント時にアニメーションを開始
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 500); // 画面が読み込まれてから0.5秒後に開始

        return () => clearTimeout(timer);
    }, []);

    // 各要素のアニメーション設定
    const containerVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.5, // 子要素を0.5秒ずつ遅延して表示
                delayChildren: 0.3 // 最初の要素は0.3秒待ってから表示
            }
        }
    };

    // マスクアニメーション用の設定
    const maskVariants = {
        hidden: {
            clipPath: "inset(0 100% 0 0)" // 右から0%表示（完全に隠れている）
        },
        visible: {
            clipPath: "inset(0 0% 0 0)", // 右から100%表示（完全に見える）
            transition: {
                duration: 0.8, // 0.8秒かけて表示
                ease: "easeInOut" // イーズイン・アウトで滑らかに
            }
        }
    };

    return (
        <div className="absolute pt-[28%] px-[5%]">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
            >
                <motion.div variants={maskVariants}>
                    <img
                        src={"./cuolegaLogo.png"}
                        alt={"クオレガロゴ"}
                        className={"w-32 lg:bg-black p-1"}
                    />
                </motion.div>

                <motion.div variants={maskVariants} className="mt-4">
                    <img
                        src={"./Engineer.svg"}
                        alt={"エンジニア"}
                        className={"lg:w-[440px]"}
                    />
                </motion.div>

                <motion.div variants={maskVariants} className="mt-4">
                    <img
                        src={"./FujieRyo.svg"}
                        alt={"俺の名前"}
                    />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default FirstViewContent;
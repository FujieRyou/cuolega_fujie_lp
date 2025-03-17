import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const FirstViewContent = () => {

    const [isVisible, setIsVisible] = useState(false);


    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);


    const containerVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.5,
                delayChildren: 0.3
            }
        }
    };


    const maskVariants = {
        hidden: {
            clipPath: "inset(0 100% 0 0)"
        },
        visible: {
            clipPath: "inset(0 0% 0 0)",
            transition: {
                duration: 0.8,
                ease: "easeInOut"
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
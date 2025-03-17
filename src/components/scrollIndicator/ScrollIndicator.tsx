import { motion } from 'framer-motion';

const ScrollIndicator = () => {
    return (
        <motion.div
            className="absolute bottom-8 right-8 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.8 }}
        >
            <span className="text-sm mb-2 text-white font-semibold"
                  style={{ textShadow: '0px 0px 8px rgba(0,0,0,0.8)' }}>
                SCROLL
            </span>
            <motion.div
                animate={{
                    y: [0, 10, 0],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="flex flex-col items-center"
            >
                <div className="relative p-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19 12L12 19L5 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ScrollIndicator;
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
// Next.jsのLinkコンポーネントをインポート
import Link from 'next/link';

export default function Career() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // クライアントサイドでのみ実行されるコードを明示的に分離
        if (typeof window !== 'undefined') {
            setIsLoaded(true);
        }
    }, []);

    // Career entries data
    const careerEntries = [
        {
            date: '2025/07',
            text: 'テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト'
        },
        {
            date: '2025/07',
            text: 'テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト'
        },
        {
            date: '2025/07',
            text: 'テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト'
        }
    ];

    // Additional content
    const additionalContent = {
        title: '軽いタイトル的な',
        text: 'テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト',
        button: '戻る的な'
    };

    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.4,
                delayChildren: 0.3
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: -30 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10,
                duration: 0.8
            }
        }
    };

    const lineAnimation = {
        hidden: { height: 0 },
        show: {
            height: "100%",
            transition: {
                duration: 1.5,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate={isLoaded ? "show" : "hidden"}
            variants={container}
            className="career-container"
            style={{
                padding: '40px',
                maxWidth: '800px',
                margin: '0 auto',
                fontFamily: 'sans-serif',
                fontSize: '110%'
            }}
        >
            <motion.h1
                variants={item}
                style={{
                    fontSize: '48px',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    paddingBottom: '0'
                }}
                whileHover={{
                    scale: 1.03,
                    transition: { duration: 0.3 }
                }}
            >
                Career
            </motion.h1>

            <motion.p
                variants={item}
                style={{
                    fontSize: '14px',
                    marginBottom: '30px',
                    color: '#333'
                }}
            >
                テキストテキストテキストテキスト
            </motion.p>

            <div style={{ position: 'relative' }}>
                {/* Timeline vertical line */}
                <motion.div
                    variants={lineAnimation}
                    style={{
                        position: 'absolute',
                        left: '94px',
                        top: '0',
                        bottom: '0',
                        width: '2px',
                        backgroundColor: '#ddd',
                        transformOrigin: 'top'
                    }}
                ></motion.div>

                {careerEntries.map((entry, index) => (
                    <motion.div
                        key={index}
                        variants={item}
                        style={{
                            marginBottom: '50px',
                            display: 'flex',
                            position: 'relative'
                        }}
                    >
                        {/* Date section */}
                        <div style={{
                            minWidth: '80px',
                            marginRight: '15px',
                            textAlign: 'left',
                            color: '#aaa'
                        }}>
                            <div style={{
                                fontSize: '22px',
                                fontWeight: 'normal',
                                lineHeight: '1.2'
                            }}>
                                {entry.date.split('/')[0]}
                            </div>
                            <div style={{
                                fontSize: '28px',
                                fontWeight: 'normal',
                                lineHeight: '1.2'
                            }}>
                                /{entry.date.split('/')[1]}
                            </div>
                        </div>

                        {/* Timeline dot */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                delay: 0.8 + index * 0.4,
                                type: "spring",
                                stiffness: 200,
                                damping: 10
                            }}
                            style={{
                                position: 'absolute',
                                left: '90px',
                                top: '10px',
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor: '#aaa',
                                transform: 'translateX(-50%)'
                            }}
                        ></motion.div>

                        {/* Content section */}
                        <div style={{
                            flex: 1,
                            paddingLeft: '50px'
                        }}>
                            <p style={{
                                fontSize: '14px',
                                lineHeight: '1.5',
                                margin: '0',
                                color: '#333'
                            }}>
                                {entry.text}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div variants={item} style={{ marginTop: '60px' }}>
                <h2 style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '15px'
                }}>
                    {additionalContent.title}
                </h2>
                <p style={{
                    fontSize: '14px',
                    lineHeight: '1.5',
                    marginBottom: '30px',
                    color: '#333'
                }}>
                    {additionalContent.text}
                </p>

                {/* Link コンポーネントでボタンをラップ */}
                <Link href="./" passHref>
                    <motion.button
                        whileHover={{
                            backgroundColor: '#d2d2d2',
                            scale: 1.02
                        }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            display: 'block',
                            width: '100%',
                            padding: '20px',
                            backgroundColor: '#e2e2e2',
                            border: 'none',
                            textAlign: 'center',
                            fontSize: '18px',
                            color: '#555',
                            cursor: 'pointer',
                            borderRadius: '2px'
                        }}
                    >
                        {additionalContent.button || "戻る的な"}
                    </motion.button>
                </Link>
            </motion.div>
        </motion.div>
    );
}
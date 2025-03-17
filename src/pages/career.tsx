import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Career() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsLoaded(true);
        }
    }, []);

    // Career entries data
    const careerEntries = [
        {
            date: '2026/03',
            text: 'インフラの基礎から応用まで幅広く学習。クラウドプラットフォーム（AWS/GCP/Azure）、コンテナ技術、CI/CD、ネットワーク、セキュリティの知識を体系的に習得。自分の手で環境構築からデプロイまで一貫して行える技術力を養成。'
        },
        {
            date: '2027/09',
            text: 'バックエンド、フロントエンド、データベース設計など、システム全体を俯瞰できるフルスタックな技術者を目指す。プロジェクト単位で一人でも構築・運用できる総合力を養成。問題解決能力と技術選定の知見を深める'
        },
        {
            date: '2027/10',
            text: 'エンジニアリングスキルを基盤としながら、プロダクトマネジメント、UXデザイン、ビジネス戦略などの領域にも挑戦。技術と事業の両面から価値を創出できる人材へと成長。起業や新規事業立ち上げなど、より大きなチャレンジへ'
        }
    ];

    // Additional content
    const additionalContent = {
        title: '素直に',
        text: 'すべてを一度に習得しようとせず、今の業務を大切にしながら少しずつスキルアップしていくことが大切です。先輩エンジニアにわからないことを質問したり、オンライン学習で基礎を固めたりしながら成長していきます',
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
                    transition: {duration: 0.3}
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
                自分のキャリアについて
            </motion.p>

            <div style={{position: 'relative'}}>
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
                            initial={{scale: 0}}
                            animate={{scale: 1}}
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

            <motion.div variants={item} style={{marginTop: '60px'}}>
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

                {/* ボタンを中央に配置するためのコンテナ */}
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Link href="./" passHref>
                        <motion.button
                            whileHover={{
                                backgroundColor: '#ff6b33',
                                color: '#ffffff',
                                scale: 1.02
                            }}
                            whileTap={{scale: 0.98}}
                            style={{
                                display: 'inline-block',
                                padding: '12px 56px',
                                backgroundColor: 'transparent',
                                border: '1px solid #ff5722',
                                color: '#ff5722',
                                textAlign: 'center',
                                fontSize: '16px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                borderRadius: '8px',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {additionalContent.button}
                        </motion.button>
                    </Link>
                </div>
            </motion.div>
        </motion.div>
    );
}
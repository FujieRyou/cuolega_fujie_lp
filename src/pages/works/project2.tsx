import { motion } from 'framer-motion';
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Project2() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsLoaded(true);
        }
    }, []);

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

    return (
        <motion.div
            initial="hidden"
            animate={isLoaded ? "show" : "hidden"}
            variants={container}
            className="career-container"
            style={{
                maxWidth: '800px',
                margin: '0 auto',
                fontFamily: 'sans-serif',
                padding: '20px'
            }}
        >
            <motion.h1
                variants={item}
                style={{
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    paddingBottom: '0',
                    color: "black",
                    fontSize: '2.5rem'
                }}
            >
                Works
            </motion.h1>
            <motion.h3
                variants={item}
                style={{
                    marginBottom: '30px',
                    color: '#333',
                }}
            >
                AgentDX
            </motion.h3>
            <motion.div variants={item} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: '30px 0'
            }}>
                <img src={"/agentDXPreview.png"} alt={"AgentDXダッシュボード"}
                     style={{
                         width: '90%',
                         height: "auto",
                         borderRadius: '4px',
                         boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                     }}/>
            </motion.div>
            <motion.p variants={item} style={{
                fontSize: "16px",
                lineHeight: '1.6',
                margin: '30px 0',
                color: '#555'
            }}>
                AgentDXは、企業とのコミュニケーションを効率化するためのプラットフォームです。これまでメールやLINE
                WORKSなど複数のツールに分散していた連絡手段を一つに統合し、シンプルな一元管理を実現しました。<br/><br/>
                この改善により日々の業務効率が向上し、採用プロセスも大幅にスピードアップ。従来では困難だった「最短1週間での採用完了」という成果を達成し、より迅速な人材確保が可能になっています。
            </motion.p>

            <motion.div variants={item} style={{
                backgroundColor: '#f8f8f8',
                padding: '20px',
                borderRadius: '4px',
                marginBottom: '30px'
            }}>
                <h4 style={{ marginTop: 0, marginBottom: '15px', color: '#333' }}>担当業務</h4>
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    <li style={{ marginBottom: '8px' }}>メッセージ部分のレイアウト実装</li>
                    <li style={{ marginBottom: '8px' }}>アラート部分の開発</li>
                    <li style={{ marginBottom: '8px' }}>従来のプラットフォームとAgentDXのパイプライン作成</li>
                    <li style={{ marginBottom: '8px' }}>検索項目の修正</li>
                </ul>
            </motion.div>

            <motion.div variants={item} style={{ marginTop: '40px' }}>
                <Link href="/" passHref>
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
                            borderRadius: '4px',
                            marginTop: '20px'
                        }}
                    >
                        home
                    </motion.button>
                </Link>
            </motion.div>
        </motion.div>
    );
}
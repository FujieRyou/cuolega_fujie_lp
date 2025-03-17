import { motion } from 'framer-motion';
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Project3() {
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
                foodslaboEF
            </motion.h3>
            <motion.div variants={item} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: '30px 0'
            }}>
                <img src={"/foodslaboEfDetail.png"} alt={"AgentDXダッシュボード"}
                     style={{
                         width: '90%',
                         height: "auto",
                         borderRadius: '4px',
                     }}/>
            </motion.div>

            {/* プロジェクト内容説明部分 */}
            <motion.div variants={item} style={{ margin: '40px 0' }}>
                <motion.h2 variants={item} style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    marginBottom: '20px',
                    color: '#333'
                }}>
                    フォーム最適化プロジェクト
                </motion.h2>

                <motion.p variants={item} style={{ marginBottom: '20px', lineHeight: '1.6' }}>
                    PF全チャネルの会員登録フォームを最適化し、<strong style={{ color: '#FF9B42' }}>CVRを20%以上向上</strong>させることで、CPA削減とPF会員獲得数の拡大を実現します。
                </motion.p>

                <motion.h3 variants={item} style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    marginTop: '25px',
                    marginBottom: '15px',
                    color: '#333'
                }}>
                    背景と課題
                </motion.h3>

                <motion.ul variants={item} style={{
                    marginBottom: '20px',
                    lineHeight: '1.6'
                }}>
                    <li>PFのデータベースに登録されたユーザーの<strong style={{ color: '#FF9B42' }}>決定率は最低200%</strong>に達する</li>
                    <li>直近の<strong style={{ color: '#FF9B42' }}>CPA高騰</strong>により、効率的な会員獲得が急務</li>
                    <li>現状の登録フォームがコンバージョンのボトルネックとなっている</li>
                </motion.ul>

                <motion.h3 variants={item} style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    marginTop: '25px',
                    marginBottom: '15px',
                    color: '#333'
                }}>
                    リニューアル方針
                </motion.h3>

                <motion.p variants={item} style={{ marginBottom: '20px', lineHeight: '1.6' }}>
                    会員登録の障壁を徹底的に取り除き、ユーザーが瞬時に登録完了できる「<strong style={{ color: '#FF9B42' }}>フリクションレス登録体験</strong>」を構築します。
                </motion.p>

                <motion.h3 variants={item} style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    marginTop: '25px',
                    marginBottom: '15px',
                    color: '#333'
                }}>
                    具体的な改善策
                </motion.h3>

                <motion.ul variants={item} style={{
                    marginBottom: '20px',
                    lineHeight: '1.6'
                }}>
                    <li>入力フィールドの項目数は維持しつつも、UI/UXを根本から再設計</li>
                    <li>入力完了から次ステップへの<strong style={{ color: '#FF9B42' }}>自動遷移機能</strong>の実装</li>
                    <li>ユーザーが入力中に完了を判断し、クリック操作なしで次へ進行</li>
                </motion.ul>

                <motion.h3 variants={item} style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    marginTop: '25px',
                    marginBottom: '15px',
                    color: '#333'
                }}>
                    期待されるインパクト
                </motion.h3>

                <motion.div variants={item} style={{
                    marginBottom: '20px',
                    lineHeight: '1.6'
                }}>
                    <p style={{ marginBottom: '10px' }}><strong style={{ color: '#FF9B42' }}>CVR向上：</strong>最低20%、最大35%の向上見込み</p>
                    <p style={{ marginBottom: '10px' }}><strong style={{ color: '#FF9B42' }}>CPA削減：</strong>現状比25%以上の削減が実現可能</p>
                    <p style={{ marginBottom: '10px' }}><strong style={{ color: '#FF9B42' }}>会員数増加：</strong>年間獲得数30%増の見込み</p>
                    <p style={{ marginBottom: '10px' }}><strong style={{ color: '#FF9B42' }}>顧客体験：</strong>フォーム完了までの平均時間を60%短縮</p>
                </motion.div>
            </motion.div>

            <motion.div variants={item}  style={{display:"flex", justifyContent:"center"}}>
                <Link href="/" passHref>
                    <motion.button
                        whileHover={{
                            backgroundColor: '#ff5722',
                            scale: 1.02,
                            color:"#fff"
                        }}
                        whileTap={{ scale: 0.98 }}
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
                        home
                    </motion.button>
                </Link>
            </motion.div>
        </motion.div>
    );
}
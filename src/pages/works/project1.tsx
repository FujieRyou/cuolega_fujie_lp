import { motion } from 'framer-motion';
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Cell } from 'recharts';
import Link from "next/link";

export default function Project1() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsLoaded(true);
            // 画面の幅を取得
            setWindowWidth(window.innerWidth);

            // リサイズイベントのリスナーを追加
            const handleResize = () => {
                setWindowWidth(window.innerWidth);
            };

            window.addEventListener('resize', handleResize);

            // クリーンアップ
            return () => {
                window.removeEventListener('resize', handleResize);
            };
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

    // スマホサイズかどうかの判定
    const isMobile = windowWidth < 768;

    // 転換者と未転換者の決定率データ（データ量を減らして見やすく）
    const decisionRateData = [
        { サンプル: 1, PF転換決定率: 8.0, SLP未転換決定率: 2.5, 比率: 320 },
        { サンプル: 2, PF転換決定率: 11.9, SLP未転換決定率: 2.8, 比率: 425 },
        { サンプル: 3, PF転換決定率: 5.2, SLP未転換決定率: 3.1, 比率: 168 },
        { サンプル: 4, PF転換決定率: 11.8, SLP未転換決定率: 3.1, 比率: 381 },
        { サンプル: 5, PF転換決定率: 12.6, SLP未転換決定率: 2.4, 比率: 525 },
        { サンプル: 6, PF転換決定率: 7.8, SLP未転換決定率: 2.4, 比率: 325 }
    ];

    // モバイル表示用にさらに減らす
    const mobileDecisionRateData = decisionRateData.slice(0, 4);

    // 平均値の計算
    const avgPFDecisionRate = decisionRateData.reduce((sum, item) => sum + item.PF転換決定率, 0) / decisionRateData.length;
    const avgSLPDecisionRate = decisionRateData.reduce((sum, item) => sum + item.SLP未転換決定率, 0) / decisionRateData.length;
    const avgRatio = decisionRateData.reduce((sum, item) => sum + item.比率, 0) / decisionRateData.length;

    // 項目別決定率データ（縦棒グラフ用）
    const summaryData = [
        { name: 'PF転換者', value: avgPFDecisionRate.toFixed(1) },
        { name: 'SLP未転換者', value: avgSLPDecisionRate.toFixed(1) }
    ];

    // 値と名前のマッピングを作成して型エラーを回避
    const getValueType = (value: any, name: string) => {
        // 値を数値に変換して処理
        const numValue = Number(value);

        // 比率かどうかを名前で判断
        const isRatio = name === '比率' || name === '転換者/未転換者比率';

        // 比率の場合、またはnumValueが100より大きい場合は%を付ける
        if (isRatio || numValue > 100) {
            return `${value}%`;
        }

        return `${value}%`;
    };

    return (
        <motion.div
            initial="hidden"
            animate={isLoaded ? "show" : "hidden"}
            variants={container}
            className="career-container"
            style={{
                padding: isMobile ? '20px' : '40px',
                maxWidth: '800px',
                margin: '0 auto',
                fontFamily: 'sans-serif',
                fontSize: isMobile ? '100%' : '110%'
            }}
        >
            <motion.h1
                variants={item}
                style={{
                    fontSize: isMobile ? '36px' : '48px',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    paddingBottom: '0',
                    color: "black"
                }}
            >
                Works
            </motion.h1>
            <motion.h3
                variants={item}
                style={{
                    fontSize: isMobile ? '18px' : '20px',
                    marginBottom: '30px',
                    color: '#333'
                }}
            >
                PF DB共通化
            </motion.h3>
            <motion.div variants={item}>
                <img src={"/dbCommonDetail.png"} alt={"DB共通化"}
                     style={{
                         width: '100%',
                         height: "auto",
                         margin: '0 auto',
                     }}/>
            </motion.div>
            <motion.p
                variants={item}
                style={{
                    fontSize: isMobile ? '13px' : '14px',
                    marginBottom: '30px',
                    color: '#333',
                    textAlign: "left"
                }}
            >
                PF DB共通化プロジェクトでは、これまで分断されていたシステム間の連携を実現することに成功しました。<br /><br />従来はLPのデータがSalesforceにのみ保存され、PFのデータベースとは連携していなかったため、ユーザーデータの一貫性が保たれず決定率も低迷していました。<br/>しかし、DB共通化によってLPの情報もPFのデータベースに直接入るようになり、顧客情報の一元管理が実現しました。<br/><br/>これにより、より精度の高いマーケティング施策の展開が可能となり、その結果として幅広いマーケティング活動の展開と飛躍的な決定率向上を達成しました。<br/>以下のグラフは、このDB共通化プロジェクトによって得られたマーケティング効果の拡大と成果を明確に示しています。
            </motion.p>

            {/* 転換者と未転換者の決定率グラフ */}
            <motion.div
                variants={item}
                style={{
                    marginTop: '20px',
                    marginBottom: '30px',
                    padding: isMobile ? '15px' : '20px',
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
            >
                <h3 style={{
                    fontSize: isMobile ? '16px' : '18px',
                    marginBottom: isMobile ? '15px' : '20px',
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}>
                    DB共通化による転換者と未転換者の決定率比較
                </h3>

                {/* サンプル別比較グラフ */}
                <div style={{ height: isMobile ? '250px' : '300px', marginBottom: isMobile ? '20px' : '30px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={isMobile ? mobileDecisionRateData : decisionRateData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="サンプル" />
                            <YAxis
                                yAxisId="left"
                                label={isMobile ? {} : { value: '決定率 (%)', angle: -90, position: 'insideLeft' }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                label={isMobile ? {} : { value: '比率 (%)', angle: 90, position: 'insideRight' }}
                                domain={[0, 700]}
                            />
                            <Tooltip formatter={(value, name) => {
                                return [getValueType(value, name as string), name];
                            }} />
                            <Legend
                                layout={isMobile ? "horizontal" : "vertical"}
                                verticalAlign={isMobile ? "bottom" : "middle"}
                                align={isMobile ? "center" : "right"}
                                wrapperStyle={isMobile ? {} : { right: 0 }}
                            />
                            <Bar yAxisId="left" dataKey="PF転換決定率" name="PF転換者の決定率" fill="#8884d8" />
                            <Bar yAxisId="left" dataKey="SLP未転換決定率" name="SLP未転換者の決定率" fill="#82ca9d" />
                            <Bar yAxisId="right" dataKey="比率" name="転換者/未転換者比率" fill="#ff7300" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                <div style={{
                    padding: isMobile ? '12px' : '15px',
                    margin: `${isMobile ? '15px' : '20px'} 0`,
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    fontSize: isMobile ? '13px' : '14px',
                    lineHeight: '1.5'
                }}>
                    <p style={{ marginBottom: '8px' }}>
                        <strong>分析結果：</strong>このデータから、DB共通化によってPF転換した利用者の決定率は一貫して未転換者より高いことが明確に示されています。
                    </p>
                    <p style={{ marginBottom: '8px' }}>
                        DB共通化後のPF転換者の決定率(12.6%)が未転換者(2.4%)の5倍以上に達しており、
                        DB共通化とそれによる転換プロセスの改善が決定率向上に大きく貢献していることを示しています。
                    </p>
                    <p style={{ margin: '0' }}>
                        <strong>ポジティブな効果：</strong>DB共通化によるPF転換で平均400%の決定率向上が実現しました。これは営業効率の大幅な改善を意味し、
                        同じリソースで4倍の成果を生み出せるようになったことを示しています。この傾向が継続すれば、売上増加と営業コスト削減の両面で
                        ビジネスに大きなインパクトをもたらします。DB共通化プロジェクトへの投資は高いROIを生み出し、ビジネス全体の成長を加速させる基盤となります。
                    </p>
                </div>

                {/* 平均決定率比較グラフ */}
                <h3 style={{
                    fontSize: isMobile ? '15px' : '16px',
                    marginBottom: isMobile ? '10px' : '15px',
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}>
                    平均決定率の比較
                </h3>
                <div style={{ height: isMobile ? '200px' : '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={summaryData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis
                                domain={[0, 15]}
                                label={isMobile ? {} : { value: '決定率 (%)', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip formatter={(value) => [`${value}%`, '平均決定率']} />
                            <Legend />
                            <Bar dataKey="value" name="平均決定率" fill="#8884d8">
                                {summaryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#8884d8' : '#82ca9d'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ marginTop: isMobile ? '15px' : '20px', textAlign: 'center' }}>
                    <p style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 'bold' }}>
                        PF転換者の決定率は未転換者の約{avgRatio.toFixed(0)}%
                    </p>
                    <p style={{ fontSize: isMobile ? '12px' : '14px' }}>
                        （約{(avgPFDecisionRate / avgSLPDecisionRate).toFixed(1)}倍）
                    </p>
                </div>
            </motion.div>
            <motion.div variants={item}>
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
                            borderRadius: '2px'
                        }}
                    >
                        home
                    </motion.button>
                </Link>
            </motion.div>
        </motion.div>
    )
}
'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

export default function HandwritingAnimation() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [vivusLoaded, setVivusLoaded] = useState(false);
    const [svgLoaded, setSvgLoaded] = useState(false);

    // SVG要素をDOMに直接追加する関数
    const loadSvg = async () => {
        if (!containerRef.current) return;

        try {
            const response = await fetch('/Engineer.svg');
            const svgText = await response.text();

            if (containerRef.current) {
                // コンテナをクリアして新しいSVGを追加
                containerRef.current.innerHTML = svgText;

                // SVGの各パスを手書き風に修正
                const svgElement = containerRef.current.querySelector('svg');
                if (svgElement) {
                    // SVGのサイズを設定
                    svgElement.setAttribute('width', '400');
                    svgElement.setAttribute('height', '400');

                    const paths = svgElement.querySelectorAll('path');
                    paths.forEach(path => {
                        // 線の太さをランダムに少し変える（手書き感を出す）
                        const strokeWidth = (1 + Math.random() * 0.5).toFixed(1);
                        path.setAttribute('stroke-width', strokeWidth);

                        // 線の先端を丸く
                        path.setAttribute('stroke-linecap', 'round');

                        // 線の接続部分を丸く
                        path.setAttribute('stroke-linejoin', 'round');

                        // 塗りつぶしなし、線のみ
                        path.setAttribute('fill', 'none');
                        path.setAttribute('stroke', '#000');
                    });

                    // SVGが正常に読み込まれたことを示す
                    setSvgLoaded(true);
                    console.log('SVG loaded successfully');
                }
            }
        } catch (error) {
            console.error('SVG fetch error:', error);
        }
    };

    // SVGをロードする
    useEffect(() => {
        loadSvg();
    }, []);

    // Vivusアニメーションを適用
    useEffect(() => {
        // VivusとSVGの両方がロードされた時だけアニメーションを開始
        if (vivusLoaded && svgLoaded && containerRef.current) {
            console.log('Starting animation...');

            // タイマーを設定して少し遅延させる
            const timer = setTimeout(() => {
                const svgElement = containerRef.current?.querySelector('svg');

                if (svgElement) {
                    console.log('SVG element found, initializing Vivus');

                    try {
                        new window.Vivus(svgElement as unknown as HTMLElement, {
                            duration: 150,           // アニメーションの長さ - 小さくすると速くなる
                            type: 'oneByOne',        // パスを一つずつアニメーション
                            start: 'autostart',      // 自動開始
                            pathTimingFunction: window.Vivus.EASE_OUT_BOUNCE, // バウンス効果で手書き感を出す
                            animTimingFunction: window.Vivus.EASE,
                            dashGap: 2,              // ダッシュの間隔 - 手書き風に見せる
                            forceRender: false       // SVGの再レンダリングを強制しない
                        }, function(obj: any) {
                            console.log('Animation completed');
                        });
                    } catch (error) {
                        console.error('Vivus initialization error:', error);
                    }
                } else {
                    console.error('SVG element not found after delay');
                }
            }, 1000); // 1000ms (1秒) に遅延を増やす

            return () => clearTimeout(timer);
        }
    }, [vivusLoaded, svgLoaded]);

    return (
        <div className="svg-container relative">
            {/* Vivusスクリプト */}
            <Script
                src="https://cdn.jsdelivr.net/npm/vivus@0.4.6/dist/vivus.min.js"
                onLoad={() => {
                    console.log('Vivus script loaded');
                    setVivusLoaded(true);
                }}
                strategy="afterInteractive"
            />

            {/* SVGコンテナ */}
            <div
                ref={containerRef}
                className="w-full h-full flex items-center justify-center"
                style={{ minHeight: '400px' }}
            >
                {/* コンテナ内にSVGがプログラムで挿入される */}
            </div>
        </div>
    );
}

// Vivusの型定義
declare global {
    interface Window {
        Vivus: any;
    }
}
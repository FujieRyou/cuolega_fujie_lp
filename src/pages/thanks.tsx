// pages/thanks.js
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function ThanksPage() {
    const router = useRouter();

    // 直接URLからアクセスされた場合はコンタクトページにリダイレクト
    useEffect(() => {
        const fromContact = sessionStorage.getItem('fromContact');

        if (!fromContact) {
            // コンタクトフォームからの遷移でない場合
            router.push('/contact');
        } else {
            // フラグをクリア
            sessionStorage.removeItem('fromContact');
        }
    }, [router]);

    return (
        <div className="container mx-auto px-4 py-10 max-w-md text-center">
            <Head>
                <title>お問い合わせありがとうございます</title>
            </Head>

            <div className="bg-green-50 p-6 rounded-lg border border-green-100 mb-6">
                <h1 className="text-2xl font-bold text-green-700 mb-4">お問い合わせありがとうございます</h1>

                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>

                <p className="mb-4">
                    お問い合わせを受け付けました。<br />
                    確認メールを送信しましたのでご確認ください。
                </p>

                <p className="mb-4">
                    内容を確認の上、担当者より折り返しご連絡いたします。<br />
                    しばらくお待ちくださいませ。
                </p>
            </div>

            <Link href="/">
                <span className="inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md">
                    トップページに戻る
                </span>
            </Link>
        </div>
    );
}
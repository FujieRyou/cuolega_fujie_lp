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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Head>
                <title>お問い合わせありがとうございます | Engineer FujieRyo</title>
                <meta name="description" content="お問い合わせありがとうございます。確認メールをご確認ください。" />
            </Head>

            <div className="max-w-md w-full">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all">
                    <div className="bg-green-600 px-6 py-4 text-center">
                        <h1 className="text-2xl font-bold text-white">お問い合わせ完了</h1>
                    </div>

                    <div className="p-8">
                        <div className="flex flex-col items-center">
                            <div className="rounded-full bg-green-100 p-3 mb-6">
                                <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>

                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                お問い合わせありがとうございます
                            </h2>

                            <div className="text-center mb-8 space-y-4">
                                <p className="text-gray-600">
                                    お問い合わせを受け付けました。<br />
                                    確認メールを送信しましたのでご確認ください。
                                </p>

                                <div className="h-px bg-gray-200 w-24 mx-auto"></div>

                                <p className="text-gray-600">
                                    内容を確認の上、担当者より折り返しご連絡いたします。<br />
                                    しばらくお待ちくださいませ。
                                </p>
                            </div>

                            <Link href="/">
                                <span className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md shadow-md transition-all transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                                    </svg>
                                    トップページに戻る
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="text-center text-gray-500 text-sm mt-8">
                    ご不明な点がございましたら、お気軽にお問い合わせください。
                </div>
            </div>
        </div>
    );
}
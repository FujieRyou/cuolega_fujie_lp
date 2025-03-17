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

    // スタイル設定
    const pageStyle = {
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 0'
    };

    const containerStyle = {
        maxWidth: '500px',
        width: '100%',
        margin: '0 auto',
        padding: '0 20px'
    };

    const cardStyle = {
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        overflow: 'hidden'
    };

    const headerStyle = {
        backgroundColor: '#4CAF50',
        padding: '20px',
        color: 'white',
        textAlign: 'center' as const
    };

    const headerTitleStyle = {
        fontSize: '24px',
        fontWeight: 'bold',
        margin: '0'
    };

    const contentStyle = {
        padding: '30px 20px',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center'
    };

    const iconContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80px',
        height: '80px',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderRadius: '50%',
        marginBottom: '20px'
    };

    const titleStyle = {
        fontSize: '20px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '20px',
        textAlign: 'center' as const
    };

    const messageStyle = {
        fontSize: '16px',
        color: '#666',
        lineHeight: '1.6',
        textAlign: 'center' as const,
        marginBottom: '30px'
    };

    const dividerStyle = {
        width: '60px',
        height: '1px',
        backgroundColor: '#e0e0e0',
        margin: '20px auto'
    };

    const buttonStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3b5fe3',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        textDecoration: 'none'
    };

    const buttonIconStyle = {
        marginRight: '8px'
    };

    const footerStyle = {
        textAlign: 'center' as const,
        color: '#666',
        fontSize: '14px',
        margin: '20px 0'
    };

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <Head>
                    <title>お問い合わせありがとうございます | Engineer FujieRyo</title>
                    <meta name="description" content="お問い合わせありがとうございます。確認メールをご確認ください。" />
                </Head>

                <div style={cardStyle}>
                    <div style={headerStyle}>
                        <h1 style={headerTitleStyle}>お問い合わせ完了</h1>
                    </div>

                    <div style={contentStyle}>
                        <div style={iconContainerStyle}>
                            <svg style={{width: '40px', height: '40px', color: '#4CAF50'}} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>

                        <h2 style={titleStyle}>
                            お問い合わせありがとうございます
                        </h2>

                        <div style={messageStyle}>
                            <p>
                                お問い合わせを受け付けました。<br />
                                確認メールを送信しましたのでご確認ください。
                            </p>

                            <div style={dividerStyle}></div>

                            <p>
                                内容を確認の上、担当者より折り返しご連絡いたします。<br />
                                しばらくお待ちくださいませ。
                            </p>
                        </div>

                        <Link href="/" style={buttonStyle}>
                            <svg style={buttonIconStyle} width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            トップページに戻る
                        </Link>
                    </div>
                </div>

                <div style={footerStyle}>
                    ご不明な点がございましたら、お気軽にお問い合わせください。
                </div>
            </div>
        </div>
    );
}
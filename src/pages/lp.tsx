import {useState, FormEvent, ChangeEvent, useEffect} from 'react';
import {useRouter} from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';


interface FormData {
    name: string;
    email: string;
    message: string;
    birthdateYear: string;
    birthdateMonth: string;
    birthdateDay: string;
    departmentName: string;
    address: string;
    termOfService: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    message?: string;
    birthdateYear?: string;
    birthdateMonth?: string;
    birthdateDay?: string;
    departmentName?: string;
    address?: string;
    recaptcha?: string;
    termOfService?: string;
}

export default function ContactForm() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        message: "",
        birthdateYear: "",
        birthdateMonth: "",
        birthdateDay: "",
        departmentName: "",
        address: "",
        termOfService: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState<number>(1);
    const totalSteps = 2;

    // 年の選択肢を生成（現在の年から100年前まで）
    const currentYear = new Date().getFullYear();
    const years = Array.from({length: 100}, (_, i) => currentYear - i);

    // 月の選択肢
    const months = Array.from({length: 12}, (_, i) => i + 1);

    // 日の選択肢
    const days = Array.from({length: 31}, (_, i) => i + 1);

    // 部署のリスト
    const departments = [
        "営業部",
        "プロダクトデザイン・マーケティンググループ",
        "人事部",
        "経理部",
        "カスタマーサポート",
        "取締役",
        "経営企画",
        "バックオフィス",
        "その他",
    ];

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value, type} = e.target as HTMLInputElement;

        // チェックボックスの場合は checked プロパティを使用
        if (type === 'checkbox') {
            const checkbox = e.target as HTMLInputElement;
            setFormData({
                ...formData,
                [name]: checkbox.checked ? 'agreed' : ''
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleRecaptchaChange = (value: string | null) => {
        setRecaptchaValue(value);
    };

    const validateStep = (step: number): boolean => {
        const tempErrors: FormErrors = {};

        if (step === 1) {
            if (!formData.name) tempErrors.name = '名前を入力してください';
            if (!formData.email) {
                tempErrors.email = 'メールアドレスを入力してください';
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                tempErrors.email = '有効なメールアドレスを入力してください';
            }
            if (!formData.address) tempErrors.address = '住所を入力してください';

            // 生年月日の部分入力チェック
            if (formData.birthdateYear && (!formData.birthdateMonth || !formData.birthdateDay)) {
                tempErrors.birthdateMonth = '生年月日をすべて選択してください';
            }
        } else if (step === 2) {
            if (!formData.message) tempErrors.message = 'メッセージを入力してください';
            if (!formData.termOfService) tempErrors.termOfService = '利用規約に同意してください';
            if (!recaptchaValue) tempErrors.recaptcha = 'reCAPTCHAを完了してください';
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
            window.scrollTo(0, 0);
        }
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
        window.scrollTo(0, 0);
    };

    const validateForm = (): boolean => {
        const tempErrors: FormErrors = {};
        if (!formData.name) tempErrors.name = '名前を入力してください';
        if (!formData.email) {
            tempErrors.email = 'メールアドレスを入力してください';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = '有効なメールアドレスを入力してください';
        }
        if (!formData.message) tempErrors.message = 'メッセージを入力してください';

        // 追加項目のバリデーション
        if (formData.birthdateYear && (!formData.birthdateMonth || !formData.birthdateDay)) {
            tempErrors.birthdateMonth = '生年月日をすべて選択してください';
        }

        if (!formData.address) tempErrors.address = '住所を入力してください';

        if (!formData.termOfService) tempErrors.termOfService = '利用規約に同意してください';

        if (!recaptchaValue) tempErrors.recaptcha = 'reCAPTCHAを完了してください';

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...formData,
                        recaptchaToken: recaptchaValue
                    }),
                });

                if (response.ok) {
                    // セッションストレージにフラグを設定
                    sessionStorage.setItem('fromContact', 'true');
                    // フォーム送信成功時にthanksページへ遷移
                    router.push('/thanks');
                } else {
                    const data: { message: string } = await response.json();
                    throw new Error(data.message || 'エラーが発生しました');
                }
            } catch (error) {
                console.error('送信エラー:', error);
                alert('送信に失敗しました。もう一度お試しください。');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    useEffect(() => {
        console.log('reCAPTCHA site key:', process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);
        if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
            console.error('reCAPTCHA site key is missing!');
        }
    }, []);

    // フォーム進行状況バーのレンダリング
    const renderProgressBar = () => {
        return (
            <div style={{
                padding: '10px 0',
                margin: '0 10px'
            }}>
                <div style={{
                    width: '100%',
                    backgroundColor: '#e6e6e6',
                    borderRadius: '9999px',
                    height: '6px',
                    marginBottom: '5px'
                }}>
                    <div
                        style={{
                            backgroundColor: '#3b5fe3',
                            height: '6px',
                            borderRadius: '9999px',
                            transition: 'width 0.3s ease-in-out',
                            width: `${(currentStep / totalSteps) * 100}%`
                        }}
                    ></div>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '14px',
                    color: '#6b7280'
                }}>
                    <span style={{
                        fontWeight: currentStep >= 1 ? '500' : 'normal',
                        color: currentStep >= 1 ? '#3b5fe3' : '#6b7280'
                    }}>基本情報</span>
                    <span style={{
                        fontWeight: currentStep >= 2 ? '500' : 'normal',
                        color: currentStep >= 2 ? '#3b5fe3' : '#6b7280'
                    }}>お問い合わせ内容</span>
                </div>
            </div>
        );
    };

    // スタイル設定
    const pageStyle = {
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        padding: '20px 0'
    };

    const containerStyle = {
        maxWidth: '600px',
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
        backgroundColor: '#3b5fe3',
        padding: '20px',
        color: 'white'
    };

    const headerTitleStyle = {
        fontSize: '24px',
        fontWeight: 'bold',
        margin: '0'
    };

    const headerSubtitleStyle = {
        color: 'rgba(255, 255, 255, 0.8)',
        margin: '5px 0 0 0',
        fontSize: '16px'
    };

    const formStyle = {
        padding: '20px'
    };

    const formGroupStyle = {
        marginBottom: '20px'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '14px',
        fontWeight: '500',
        color: '#333',
        marginBottom: '8px'
    };

    const requiredMarkStyle = {
        color: '#ff4d4f',
        marginLeft: '2px'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 15px',
        fontSize: '16px',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        boxSizing: 'border-box' as const,
        marginBottom: '5px'
    };

    const textareaStyle = {
        ...inputStyle,
        minHeight: '120px',
        resize: 'vertical' as const
    };

    const errorStyle = {
        color: '#ff4d4f',
        fontSize: '12px',
        margin: '5px 0 0 0'
    };

    const dateGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px'
    };

    const checkboxContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px'
    };

    const checkboxStyle = {
        width: '20px',
        height: '20px',
        marginRight: '10px'
    };

    const recaptchaContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        margin: '20px 0'
    };

    const buttonContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px'
    };

    const primaryButtonStyle = {
        backgroundColor: '#ff5722',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'center' as const
    };

    const secondaryButtonStyle = {
        backgroundColor: 'white',
        color: '#ff5722',
        border: '1px solid #ff5722',
        borderRadius: '4px',
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        width: '48%',
        textAlign: 'center' as const
    };

    const submitButtonStyle = {
        backgroundColor: '#ff5722',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: isSubmitting ? 'not-allowed' : 'pointer',
        width: '48%',
        textAlign: 'center' as const,
        opacity: isSubmitting ? 0.7 : 1
    };

    const spinnerStyle = {
        display: 'inline-block',
        width: '16px',
        height: '16px',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '50%',
        borderTopColor: 'white',
        animation: 'spin 1s linear infinite',
        marginRight: '8px'
    };

    const footerStyle = {
        textAlign: 'center' as const,
        color: '#666',
        fontSize: '14px',
        margin: '20px 0'
    };

    const footerLinksStyle = {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        margin: '10px 0'
    };

    const linkStyle = {
        color: '#3b5fe3',
        textDecoration: 'none'
    };

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <Head>
                    <title>Engineer FujieRyo | お問い合わせ</title>
                    <style>{`
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </Head>

                <div style={cardStyle}>
                    <div style={headerStyle}>
                        <h1 style={headerTitleStyle}>お問い合わせ</h1>
                        <p style={headerSubtitleStyle}>ご質問・ご相談はこちらから</p>
                    </div>

                    {renderProgressBar()}

                    <form onSubmit={handleSubmit} style={formStyle}>
                        {currentStep === 1 && (
                            <>
                                {/* ステップ1: 基本情報 */}
                                {/* 名前フィールド */}
                                <div style={formGroupStyle}>
                                    <label htmlFor="name" style={labelStyle}>
                                        お名前 <span style={requiredMarkStyle}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        style={inputStyle}
                                        placeholder="山田 太郎"
                                    />
                                    {errors.name && <p style={errorStyle}>{errors.name}</p>}
                                </div>

                                {/* メールアドレスフィールド */}
                                <div style={formGroupStyle}>
                                    <label htmlFor="email" style={labelStyle}>
                                        メールアドレス <span style={requiredMarkStyle}>*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        style={inputStyle}
                                        placeholder="email@example.com"
                                    />
                                    {errors.email && <p style={errorStyle}>{errors.email}</p>}
                                </div>

                                {/* 生年月日フィールド */}
                                <div style={formGroupStyle}>
                                    <label style={labelStyle}>
                                        生年月日
                                    </label>
                                    <div style={dateGridStyle}>
                                        <select
                                            name="birthdateYear"
                                            value={formData.birthdateYear}
                                            onChange={handleChange}
                                            style={inputStyle}
                                        >
                                            <option value="">年</option>
                                            {years.map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                        <select
                                            name="birthdateMonth"
                                            value={formData.birthdateMonth}
                                            onChange={handleChange}
                                            style={inputStyle}
                                        >
                                            <option value="">月</option>
                                            {months.map(month => (
                                                <option key={month} value={month}>{month}</option>
                                            ))}
                                        </select>
                                        <select
                                            name="birthdateDay"
                                            value={formData.birthdateDay}
                                            onChange={handleChange}
                                            style={inputStyle}
                                        >
                                            <option value="">日</option>
                                            {days.map(day => (
                                                <option key={day} value={day}>{day}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {(errors.birthdateYear || errors.birthdateMonth || errors.birthdateDay) && (
                                        <p style={errorStyle}>
                                            {errors.birthdateYear || errors.birthdateMonth || errors.birthdateDay}
                                        </p>
                                    )}
                                </div>

                                {/* 部署フィールド */}
                                <div style={formGroupStyle}>
                                    <label htmlFor="departmentName" style={labelStyle}>
                                        お問い合わせ部署
                                    </label>
                                    <select
                                        id="departmentName"
                                        name="departmentName"
                                        value={formData.departmentName}
                                        onChange={handleChange}
                                        style={inputStyle}
                                    >
                                        <option value="">選択してください</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                    {errors.departmentName && <p style={errorStyle}>{errors.departmentName}</p>}
                                </div>

                                {/* 住所フィールド */}
                                <div style={formGroupStyle}>
                                    <label htmlFor="address" style={labelStyle}>
                                        住所 <span style={requiredMarkStyle}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        style={inputStyle}
                                        placeholder="例: 東京都千代田区〇〇町1-1-1"
                                    />
                                    {errors.address && <p style={errorStyle}>{errors.address}</p>}
                                </div>

                                {/* 次へボタン */}
                                <div>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        style={primaryButtonStyle}
                                    >
                                        次へ進む
                                    </button>
                                </div>
                            </>
                        )}

                        {currentStep === 2 && (
                            <>
                                {/* ステップ2: お問い合わせ内容 */}
                                {/* お問い合わせ内容フィールド */}
                                <div style={formGroupStyle}>
                                    <label htmlFor="message" style={labelStyle}>
                                        お問い合わせ内容 <span style={requiredMarkStyle}>*</span>
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        style={textareaStyle}
                                        placeholder="お問い合わせ内容を入力してください"
                                    ></textarea>
                                    {errors.message && <p style={errorStyle}>{errors.message}</p>}
                                </div>

                                {/* 利用規約の同意 */}
                                <div style={checkboxContainerStyle}>
                                    <input
                                        type="checkbox"
                                        id="termOfService"
                                        name="termOfService"
                                        checked={formData.termOfService === 'agreed'}
                                        onChange={handleChange}
                                        style={checkboxStyle}
                                    />
                                    <label htmlFor="termOfService" style={{fontSize: '14px'}}>
                                        <span style={requiredMarkStyle}>*</span>
                                        <Link href="/terms" target="_blank"
                                              style={{color: '#3b5fe3', textDecoration: 'underline'}}>利用規約</Link>に同意します
                                    </label>
                                </div>
                                {errors.termOfService && <p style={errorStyle}>{errors.termOfService}</p>}

                                {/* reCAPTCHA */}
                                <div style={recaptchaContainerStyle}>
                                    <ReCAPTCHA
                                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                                        onChange={handleRecaptchaChange}
                                        theme="light"
                                        size="normal"
                                        onErrored={() => console.error('reCAPTCHA エラー')}
                                    />
                                </div>
                                {errors.recaptcha && <p style={{...errorStyle, textAlign: 'center'}}>{errors.recaptcha}</p>}

                                {/* ボタングループ */}
                                <div style={buttonContainerStyle}>
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        style={secondaryButtonStyle}
                                    >
                                        戻る
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        style={submitButtonStyle}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div style={spinnerStyle}></div>
                                                送信中...
                                            </>
                                        ) : '送信する'}
                                    </button>
                                </div>
                            </>
                        )}
                    </form>
                </div>

                <div style={footerStyle}>
                    <p>
                        お問い合わせいただきありがとうございます。通常2営業日以内にご返信いたします。
                    </p>
                    <div style={footerLinksStyle}>
                        <Link href="/" style={linkStyle}>ホームに戻る</Link>
                        <Link href="/faq" style={linkStyle}>よくある質問</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
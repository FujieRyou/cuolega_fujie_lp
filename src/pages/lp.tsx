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
            <div style={{ padding: '1rem 1.5rem 0.5rem 1.5rem' }}>
                <div style={{
                    width: '100%',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '9999px',
                    height: '0.625rem',
                    marginBottom: '0.5rem'
                }}>
                    <div
                        style={{
                            backgroundColor: '#2563eb',
                            height: '0.625rem',
                            borderRadius: '9999px',
                            transition: 'all 0.5s ease-in-out',
                            width: `${(currentStep / totalSteps) * 100}%`
                        }}
                    ></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280' }}>
                    <span style={{
                        fontWeight: currentStep >= 1 ? '500' : 'normal',
                        color: currentStep >= 1 ? '#2563eb' : '#6b7280'
                    }}>基本情報</span>
                    <span style={{
                        fontWeight: currentStep >= 2 ? '500' : 'normal',
                        color: currentStep >= 2 ? '#2563eb' : '#6b7280'
                    }}>お問い合わせ内容</span>
                </div>
            </div>
        );
    };

    const containerStyle = {
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #ebf5ff, #f3f4f6)',
        padding: '3rem 0'
    };

    const wrapperStyle = {
        maxWidth: '32rem',
        margin: '0 auto',
        padding: '0 1rem'
    };

    const cardStyle = {
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        transform: 'translateZ(0)',
        transition: 'all 0.3s'
    };

    const headerStyle = {
        background: 'linear-gradient(to right, #2563eb, #1e40af)',
        padding: '1.25rem 1.5rem'
    };

    const titleStyle = {
        color: 'white',
        fontSize: '1.875rem',
        fontWeight: '700'
    };

    const subtitleStyle = {
        color: '#bfdbfe',
        marginTop: '0.5rem'
    };

    const formStyle = {
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '1.5rem'
    };

    const formGroupStyle = {
        marginBottom: '1.5rem'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '0.5rem'
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem 1rem',
        border: '1px solid #d1d5db',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        transition: 'all 0.15s ease'
    };

    const textareaStyle = {
        ...inputStyle,
        minHeight: '8rem',
        resize: 'vertical' as const
    };

    const selectStyle = {
        ...inputStyle
    };

    const dateGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.75rem'
    };

    const errorStyle = {
        color: '#ef4444',
        fontSize: '0.75rem',
        fontStyle: 'italic',
        marginTop: '0.25rem'
    };

    const checkboxContainerStyle = {
        display: 'flex',
        alignItems: 'flex-start',
        paddingTop: '0.5rem'
    };

    const checkboxWrapperStyle = {
        display: 'flex',
        alignItems: 'center',
        height: '1.25rem'
    };

    const checkboxStyle = {
        width: '1.25rem',
        height: '1.25rem',
        color: '#2563eb',
        borderColor: '#d1d5db',
        borderRadius: '0.25rem'
    };

    const recaptchaContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '1rem'
    };

    const buttonContainerStyle = {
        display: 'flex',
        gap: '1rem',
        paddingTop: '1rem'
    };



    const footerStyle = {
        marginTop: '2rem',
        textAlign: 'center' as const
    };

    const footerTextStyle = {
        color: '#6b7280',
        fontSize: '0.875rem'
    };

    const footerLinksStyle = {
        marginTop: '1rem',
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem'
    };



    return (
        <div style={containerStyle}>
            <div style={wrapperStyle}>
                <Head>
                    <title>Engineer FujieRyo | お問い合わせ</title>
                </Head>

                <div style={cardStyle}>
                    <div style={headerStyle}>
                        <h1 style={titleStyle}>お問い合わせ</h1>
                        <p style={subtitleStyle}>ご質問・ご相談はこちらから</p>
                    </div>

                    {renderProgressBar()}

                    <form onSubmit={handleSubmit} style={formStyle}>
                        {currentStep === 1 && (
                            <>
                                {/* ステップ1: 基本情報 */}
                                {/* 名前フィールド */}
                                <div style={formGroupStyle}>
                                    <label htmlFor="name" style={labelStyle}>
                                        お名前 <span style={{color: '#ef4444'}}>*</span>
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
                                        メールアドレス <span style={{color: '#ef4444'}}>*</span>
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
                                            style={selectStyle}
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
                                            style={selectStyle}
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
                                            style={selectStyle}
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
                                        style={selectStyle}
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
                                        住所 <span style={{color: '#ef4444'}}>*</span>
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
                                <div style={{paddingTop: '1rem'}}>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        style={{
                                            display: 'inline-block',
                                            width: '100%',
                                            padding: '12px 56px',
                                            backgroundColor: '#ff5722',
                                            color: 'white',
                                            textAlign: 'center',
                                            fontSize: '16px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            borderRadius: '8px',
                                            transition: 'all 0.3s ease',
                                            border: 'none',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                        }}
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
                                        お問い合わせ内容 <span style={{color: '#ef4444'}}>*</span>
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={5}
                                        style={textareaStyle}
                                        placeholder="お問い合わせ内容を入力してください"
                                    ></textarea>
                                    {errors.message && <p style={errorStyle}>{errors.message}</p>}
                                </div>

                                {/* 利用規約の同意 */}
                                <div style={checkboxContainerStyle}>
                                    <div style={checkboxWrapperStyle}>
                                        <input
                                            type="checkbox"
                                            id="termOfService"
                                            name="termOfService"
                                            checked={formData.termOfService === 'agreed'}
                                            onChange={handleChange}
                                            style={checkboxStyle}
                                        />
                                    </div>
                                    <div style={{marginLeft: '0.75rem', fontSize: '0.875rem'}}>
                                        <label htmlFor="termOfService" style={{fontWeight: '500', color: '#374151'}}>
                                            <span style={{color: '#ef4444', marginRight: '0.25rem'}}>*</span>
                                            <Link href="/terms" target="_blank"
                                                  style={{color: '#2563eb', textDecoration: 'underline'}}>利用規約</Link>に同意します
                                        </label>
                                    </div>
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
                                            transition: 'all 0.3s ease',
                                            flex: 1
                                        }}
                                    >
                                        戻る
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        style={{
                                            display: 'inline-block',
                                            padding: '12px 56px',
                                            backgroundColor: '#ff5722',
                                            color: 'white',
                                            textAlign: 'center',
                                            fontSize: '16px',
                                            fontWeight: '500',
                                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                            borderRadius: '8px',
                                            transition: 'all 0.3s ease',
                                            border: 'none',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                            opacity: isSubmitting ? 0.5 : 1,
                                            flex: 2
                                        }}
                                    >
                                        {isSubmitting ? (
                                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                <svg style={{
                                                    animation: 'spin 1s linear infinite',
                                                    marginRight: '0.75rem',
                                                    height: '1.25rem',
                                                    width: '1.25rem'
                                                }}
                                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle style={{opacity: 0.25}} cx="12" cy="12" r="10" stroke="currentColor"
                                                            strokeWidth="4"></circle>
                                                    <path style={{opacity: 0.75}} fill="currentColor"
                                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                送信中...
                                            </div>
                                        ) : '送信する'}
                                    </button>
                                </div>
                            </>
                        )}
                    </form>
                </div>

                <div style={footerStyle}>
                    <p style={footerTextStyle}>
                        お問い合わせいただきありがとうございます。通常2営業日以内にご返信いたします。
                    </p>
                    <div style={footerLinksStyle}>
                        <Link href="/" style={{color: '#2563eb', fontSize: '0.875rem'}}>ホームに戻る</Link>
                        <Link href="/faq" style={{color: '#2563eb', fontSize: '0.875rem'}}>よくある質問</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
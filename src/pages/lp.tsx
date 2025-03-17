import {useState, FormEvent, ChangeEvent, useEffect} from 'react';
import {useRouter} from 'next/router';
import Head from 'next/head';
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
            <div className="px-6 pb-2 pt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                    <span className={`${currentStep >= 1 ? "font-medium text-blue-600" : ""}`}>基本情報</span>
                    <span className={`${currentStep >= 2 ? "font-medium text-blue-600" : ""}`}>お問い合わせ内容</span>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-12">
            <div className="container mx-auto px-4 max-w-lg">
                <Head>
                    <title>Engineer FujieRyo | お問い合わせ</title>
                </Head>

                <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-5">
                        <h1 className="text-3xl font-bold text-white">お問い合わせ</h1>
                        <p className="text-blue-100 mt-2">ご質問・ご相談はこちらから</p>
                    </div>

                    {renderProgressBar()}

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {currentStep === 1 && (
                            <>
                                {/* ステップ1: 基本情報 */}
                                {/* 名前フィールド */}
                                <div className="space-y-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        お名前 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="山田 太郎"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>}
                                </div>

                                {/* メールアドレスフィールド */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        メールアドレス <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="email@example.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>}
                                </div>

                                {/* 生年月日フィールド */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        生年月日
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        <select
                                            name="birthdateYear"
                                            value={formData.birthdateYear}
                                            onChange={handleChange}
                                            className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                                            className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                                            className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        >
                                            <option value="">日</option>
                                            {days.map(day => (
                                                <option key={day} value={day}>{day}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {(errors.birthdateYear || errors.birthdateMonth || errors.birthdateDay) && (
                                        <p className="text-red-500 text-xs italic mt-1">
                                            {errors.birthdateYear || errors.birthdateMonth || errors.birthdateDay}
                                        </p>
                                    )}
                                </div>

                                {/* 部署フィールド */}
                                <div className="space-y-2">
                                    <label htmlFor="departmentName" className="block text-sm font-medium text-gray-700">
                                        お問い合わせ部署
                                    </label>
                                    <select
                                        id="departmentName"
                                        name="departmentName"
                                        value={formData.departmentName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    >
                                        <option value="">選択してください</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                    {errors.departmentName &&
                                        <p className="text-red-500 text-xs italic mt-1">{errors.departmentName}</p>}
                                </div>

                                {/* 住所フィールド */}
                                <div className="space-y-2">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                        住所 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="例: 東京都千代田区〇〇町1-1-1"
                                    />
                                    {errors.address && <p className="text-red-500 text-xs italic mt-1">{errors.address}</p>}
                                </div>

                                {/* 次へボタン */}
                                <div className="pt-4">
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-all transform hover:-translate-y-px focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
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
                                <div className="space-y-2">
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                        お問い合わせ内容 <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={5}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="お問い合わせ内容を入力してください"
                                    ></textarea>
                                    {errors.message && <p className="text-red-500 text-xs italic mt-1">{errors.message}</p>}
                                </div>

                                {/* 利用規約の同意 */}
                                <div className="pt-2">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                type="checkbox"
                                                id="termOfService"
                                                name="termOfService"
                                                checked={formData.termOfService === 'agreed'}
                                                onChange={handleChange}
                                                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="termOfService" className="font-medium text-gray-700">
                                                <span className="text-red-500 mr-1">*</span>
                                                <a href="/terms" target="_blank"
                                                   className="text-blue-600 hover:text-blue-800 underline">利用規約</a>に同意します
                                            </label>
                                        </div>
                                    </div>
                                    {errors.termOfService &&
                                        <p className="text-red-500 text-xs italic mt-1">{errors.termOfService}</p>}
                                </div>

                                {/* reCAPTCHA */}
                                <div className="flex justify-center pt-4">
                                    <ReCAPTCHA
                                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                                        onChange={handleRecaptchaChange}
                                        theme="light"
                                        size="normal"
                                        onErrored={() => console.error('reCAPTCHA エラー')}
                                    />
                                </div>
                                {errors.recaptcha &&
                                    <p className="text-red-500 text-xs italic text-center mt-1">{errors.recaptcha}</p>}

                                {/* ボタングループ */}
                                <div className="flex space-x-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="w-1/3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                                    >
                                        戻る
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-all transform hover:-translate-y-px focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:pointer-events-none"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                            strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor"
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

                <div className="mt-8 text-center">
                    <p className="text-gray-600 text-sm">
                        お問い合わせいただきありがとうございます。通常2営業日以内にご返信いたします。
                    </p>
                    <div className="mt-4 flex justify-center space-x-4">
                        <a href="/" className="text-blue-600 hover:text-blue-800 text-sm">ホームに戻る</a>
                        <a href="/faq" className="text-blue-600 hover:text-blue-800 text-sm">よくある質問</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
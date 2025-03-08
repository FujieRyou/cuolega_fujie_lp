import {useState, FormEvent, ChangeEvent, useEffect} from 'react';
import {useRouter} from 'next/router';
import Head from 'next/head';
import ReCAPTCHA from 'react-google-recaptcha';

// フォームデータの型定義
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

// エラーオブジェクトの型定義
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

    return (
        <div className="container mx-auto px-4 py-10 max-w-md">
            <Head>
                <title>Engineer FujieRyo</title>
            </Head>
            <h1 className="text-2xl font-bold mb-6">お問い合わせ</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 名前フィールド */}
                <div>
                    <label htmlFor="name" className="block mb-1">
                        お名前 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* メールアドレスフィールド */}
                <div>
                    <label htmlFor="email" className="block mb-1">
                        メールアドレス <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* 生年月日フィールド */}
                <div>
                    <label className="block mb-1">
                        生年月日
                    </label>
                    <div className="flex space-x-2">
                        <select
                            name="birthdateYear"
                            value={formData.birthdateYear}
                            onChange={handleChange}
                            className="px-3 py-2 border rounded-md"
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
                            className="px-3 py-2 border rounded-md"
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
                            className="px-3 py-2 border rounded-md"
                        >
                            <option value="">日</option>
                            {days.map(day => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>
                    </div>
                    {(errors.birthdateYear || errors.birthdateMonth || errors.birthdateDay) && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.birthdateYear || errors.birthdateMonth || errors.birthdateDay}
                        </p>
                    )}
                </div>

                {/* 部署フィールド */}
                <div>
                    <label htmlFor="departmentName" className="block mb-1">
                        お問い合わせ部署
                    </label>
                    <select
                        id="departmentName"
                        name="departmentName"
                        value={formData.departmentName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                    >
                        <option value="">選択してください</option>
                        {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                    {errors.departmentName && <p className="text-red-500 text-sm mt-1">{errors.departmentName}</p>}
                </div>

                {/* 住所フィールド */}
                <div>
                    <label htmlFor="address" className="block mb-1">
                        住所 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="例: 東京都千代田区〇〇町1-1-1"
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                {/* お問い合わせ内容フィールド */}
                <div>
                    <label htmlFor="message" className="block mb-1">
                        お問い合わせ内容 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="w-full px-3 py-2 border rounded-md"
                    ></textarea>
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>

                {/* 利用規約の同意 */}
                <div className="flex items-start">
                    <input
                        type="checkbox"
                        id="termOfService"
                        name="termOfService"
                        checked={formData.termOfService === 'agreed'}
                        onChange={handleChange}
                        className="mt-1 mr-2"
                    />
                    <label htmlFor="termOfService" className="text-sm">
                        <span className="text-red-500 mr-1">*</span>
                        <a href="/terms" target="_blank" className="text-blue-500 hover:underline">利用規約</a>に同意します
                    </label>
                </div>
                {errors.termOfService && <p className="text-red-500 text-sm mt-1">{errors.termOfService}</p>}

                {/* reCAPTCHA */}
                <div className="flex justify-center my-4">
                    <ReCAPTCHA
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                        onChange={handleRecaptchaChange}
                        theme="light" // テーマを指定
                        size="normal" // サイズを指定
                        onErrored={() => console.error('reCAPTCHA エラー')} // エラーハンドリング
                    />
                </div>
                {errors.recaptcha && <p className="text-red-500 text-sm mt-1 text-center">{errors.recaptcha}</p>}

                {/* 送信ボタン */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md disabled:opacity-50"
                >
                    {isSubmitting ? '送信中...' : '送信する'}
                </button>
            </form>
        </div>
    );
}
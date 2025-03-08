// pages/api/contact.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

// リクエストボディの型定義
interface ContactRequestBody {
    name: string;
    email: string;
    message: string;
    birthdateYear?: string;
    birthdateMonth?: string;
    birthdateDay?: string;
    departmentName?: string;
    address?: string;
    termOfService?: string;
    recaptchaToken?: string;
}

// APIレスポンスの型定義
interface ApiResponse {
    message: string;
}

// メールオプションの型定義
interface MailOptions {
    from: string;
    to: string;
    subject: string;
    replyTo?: string;
    text: string;
    html: string;
}

// Nodemailer トランスポーターの設定型
interface TransportOptions {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'メソッドが許可されていません' });
    }

    try {
        const {
            name,
            email,
            message,
            birthdateYear,
            birthdateMonth,
            birthdateDay,
            departmentName,
            address,
            termOfService,
        } = req.body as ContactRequestBody;

        // バリデーション
        if (!name || !email || !message) {
            return res.status(400).json({ message: '必須項目が入力されていません' });
        }

        // 生年月日の組み立て
        const birthdate = birthdateYear && birthdateMonth && birthdateDay
            ? `${birthdateYear}年${birthdateMonth}月${birthdateDay}日`
            : '未入力';

        // メール送信設定
        const transportOptions: TransportOptions = {
            host: process.env.SMTP_HOST || '',
            port: parseInt(process.env.SMTP_PORT || '587', 10),
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER || '',
                pass: process.env.SMTP_PASSWORD || '',
            },
        };

        const transporter = nodemailer.createTransport(transportOptions);

        // メール送信先の設定
        const mailOptions: MailOptions = {
            from: `"お問い合わせフォーム" <${process.env.MAIL_FROM || ''}>`,
            to: process.env.MAIL_TO || '', // 管理者宛メールアドレス
            subject: `【お問い合わせ】${name}様からのお問い合わせ`,
            replyTo: email, // 返信先は送信者のメールアドレス
            text: `
お名前: ${name}
メールアドレス: ${email}
生年月日: ${birthdate}
住所: ${address || '未入力'}
お問い合わせ部署: ${departmentName || '未選択'}
お問い合わせ内容:
${message}
利用規約への同意: ${termOfService === 'agreed' ? '同意済み' : '未同意'}
      `,
            html: `
<div>
  <p><strong>お名前:</strong> ${name}</p>
  <p><strong>メールアドレス:</strong> ${email}</p>
  <p><strong>生年月日:</strong> ${birthdate}</p>
  <p><strong>住所:</strong> ${address || '未入力'}</p>
  <p><strong>お問い合わせ部署:</strong> ${departmentName || '未選択'}</p>
  <p><strong>お問い合わせ内容:</strong></p>
  <p>${message.replace(/\n/g, '<br>')}</p>
  <p><strong>利用規約への同意:</strong> ${termOfService === 'agreed' ? '同意済み' : '未同意'}</p>
</div>
      `,
        };

        // 送信者へのコピーメール設定
        const userMailOptions: MailOptions = {
            from: `"お問い合わせフォーム" <${process.env.MAIL_FROM || ''}>`,
            to: email, // 送信者本人へ
            subject: `【お問い合わせ確認】お問い合わせありがとうございます`,
            text: `
${name}様

お問い合わせありがとうございます。
以下の内容でお問い合わせを受け付けました。
担当者より順次ご連絡いたします。

お名前: ${name}
メールアドレス: ${email}
生年月日: ${birthdate}
住所: ${address || '未入力'}
お問い合わせ部署: ${departmentName || '未選択'}
お問い合わせ内容:
${message}

このメールは自動送信されています。
ご返信いただいても対応できない場合がございますのでご了承ください。
      `,
            html: `
<div>
  <p>${name}様</p>
  <p>お問い合わせありがとうございます。<br>以下の内容でお問い合わせを受け付けました。<br>担当者より順次ご連絡いたします。</p>
  <hr>
  <p><strong>お名前:</strong> ${name}</p>
  <p><strong>メールアドレス:</strong> ${email}</p>
  <p><strong>生年月日:</strong> ${birthdate}</p>
  <p><strong>住所:</strong> ${address || '未入力'}</p>
  <p><strong>お問い合わせ部署:</strong> ${departmentName || '未選択'}</p>
  <p><strong>お問い合わせ内容:</strong></p>
  <p>${message.replace(/\n/g, '<br>')}</p>
  <hr>
  <p><small>このメールは自動送信されています。<br>ご返信いただいても対応できない場合がございますのでご了承ください。</small></p>
</div>
      `,
        };

        // 管理者宛メール送信
        await transporter.sendMail(mailOptions);

        // 送信者宛メール送信
        await transporter.sendMail(userMailOptions);

        return res.status(200).json({ message: '送信に成功しました' });
    } catch (error) {
        console.error('メール送信エラー:', error);
        return res.status(500).json({ message: 'メール送信に失敗しました' });
    }
}
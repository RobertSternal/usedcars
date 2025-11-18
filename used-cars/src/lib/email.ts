import nodemailer from 'nodemailer';

// Create transporter for sending emails
export const createEmailTransporter = () => {
  // You can use different email providers
  // For development, you can use ethereal.email (fake SMTP)
  // For production, use services like Gmail, SendGrid, AWS SES, etc.
  
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Generate 6-digit verification code
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// HTML template for verification email
export const getVerificationEmailTemplate = (code: string, userName?: string): string => {
  return `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weryfikacja konta</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f4;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 18px;
      color: #333333;
      margin-bottom: 20px;
    }
    .message {
      font-size: 16px;
      color: #666666;
      line-height: 1.6;
      margin-bottom: 30px;
    }
    .code-container {
      background-color: #f8f9fa;
      border: 2px dashed #667eea;
      border-radius: 8px;
      padding: 30px;
      text-align: center;
      margin: 30px 0;
    }
    .code {
      font-size: 36px;
      font-weight: bold;
      letter-spacing: 8px;
      color: #667eea;
      font-family: 'Courier New', monospace;
    }
    .code-label {
      font-size: 14px;
      color: #666666;
      margin-top: 10px;
    }
    .expiry-notice {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      font-size: 14px;
      color: #856404;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #999999;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
    .security-notice {
      margin-top: 30px;
      padding: 20px;
      background-color: #f8f9fa;
      border-radius: 6px;
      font-size: 13px;
      color: #666666;
    }
    .security-notice strong {
      color: #dc3545;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>🚗 Weryfikacja Konta</h1>
    </div>
    
    <div class="content">
      <div class="greeting">
        Cześć${userName ? ` ${userName}` : ''}! 👋
      </div>
      
      <div class="message">
        Dziękujemy za rejestrację w naszym serwisie ogłoszeń samochodowych. 
        Aby dokończyć proces rejestracji i aktywować swoje konto, wprowadź poniższy kod weryfikacyjny:
      </div>
      
      <div class="code-container">
        <div class="code">${code}</div>
        <div class="code-label">Twój kod weryfikacyjny</div>
      </div>
      
      <div class="expiry-notice">
        ⏰ <strong>Ważne:</strong> Ten kod jest ważny przez <strong>10 minut</strong> od momentu jego wygenerowania.
      </div>
      
      <div class="message">
        Po wprowadzeniu kodu będziesz mógł w pełni korzystać ze wszystkich funkcji naszego serwisu, 
        w tym wystawiania ogłoszeń i kontaktu ze sprzedawcami.
      </div>
      
      <div class="security-notice">
        <strong>⚠️ Uwaga bezpieczeństwa:</strong><br>
        Jeśli nie zakładałeś konta w naszym serwisie, zignoruj tę wiadomość. 
        Nigdy nie udostępniaj tego kodu nikomu. Nasi pracownicy nigdy nie będą prosić Cię o kod weryfikacyjny.
      </div>
    </div>
    
    <div class="footer">
      <p>Masz pytania? Skontaktuj się z nami: <a href="mailto:support@usedcars.pl">support@usedcars.pl</a></p>
      <p>&copy; 2024 UsedCars. Wszelkie prawa zastrzeżone.</p>
    </div>
  </div>
</body>
</html>
  `;
};

// Send verification email
export const sendVerificationEmail = async (
  email: string, 
  code: string, 
  userName?: string
): Promise<boolean> => {
  try {
    const transporter = createEmailTransporter();
    
    const mailOptions = {
      from: `"UsedCars" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🚗 Zweryfikuj swoje konto - Kod weryfikacyjny',
      html: getVerificationEmailTemplate(code, userName),
      text: `Twój kod weryfikacyjny to: ${code}. Kod jest ważny przez 10 minut.`,
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to: ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

// Send welcome email after successful verification
export const sendWelcomeEmail = async (
  email: string, 
  userName?: string
): Promise<boolean> => {
  try {
    const transporter = createEmailTransporter();
    
    const mailOptions = {
      from: `"UsedCars" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎉 Witamy w UsedCars!',
      html: `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      padding: 40px 20px;
      text-align: center;
      color: #ffffff;
    }
    .content {
      padding: 40px 30px;
      color: #333333;
    }
    .button {
      display: inline-block;
      padding: 15px 30px;
      background-color: #667eea;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Konto Zweryfikowane!</h1>
    </div>
    <div class="content">
      <h2>Witaj${userName ? ` ${userName}` : ''} w UsedCars! 🎉</h2>
      <p>Twoje konto zostało pomyślnie zweryfikowane. Możesz teraz korzystać ze wszystkich funkcji naszego serwisu:</p>
      <ul>
        <li>Przeglądaj tysiące ogłoszeń samochodowych</li>
        <li>Dodawaj własne ogłoszenia</li>
        <li>Kontaktuj się ze sprzedawcami</li>
        <li>Zapisuj ulubione samochody</li>
      </ul>
      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}" class="button">
          Rozpocznij Przeglądanie
        </a>
      </div>
    </div>
  </div>
</body>
</html>
      `,
      text: `Witamy w UsedCars! Twoje konto zostało pomyślnie zweryfikowane.`,
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to: ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

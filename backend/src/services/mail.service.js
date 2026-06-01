const nodemailer = require('nodemailer');

// Validate email configuration on startup
const validateEmailConfig = () => {
  const required = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASSWORD'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn(`⚠️  Email not configured. Missing: ${missing.join(', ')}`);
    return false;
  }
  return true;
};

// Create reusable transporter
let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  
  if (!validateEmailConfig()) {
    console.warn('📧 Email service disabled - configure .env to enable');
    return null;
  }

  try {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Verify connection
    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Email service error:', error.message);
        transporter = null;
      } else {
        console.log('✅ Email service ready');
      }
    });

    return transporter;
  } catch (error) {
    console.error('❌ Failed to create email transporter:', error.message);
    return null;
  }
};

exports.sendWelcomeEmail = async (to, name) => {
  try {
    const emailTransporter = getTransporter();
    
    if (!emailTransporter) {
      console.warn(`📧 Email disabled - skipping welcome email to ${to}`);
      return { success: false, reason: 'Email service not configured' };
    }

    if (!to || !name) {
      throw new Error('Missing required email parameters: to, name');
    }

    const mailOptions = {
      from: `"DocuAsk" <${process.env.EMAIL_USER}>`,
      to,
      subject: '🎉 Welcome to DocuAsk — AI-Powered Document Q&A',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; color: white; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">Welcome to DocuAsk!</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <p>Hi <strong>${name}</strong>,</p>
            <p>We're thrilled to have you on board! 🚀</p>
            
            <h3>What's next?</h3>
            <ol>
              <li><strong>Upload a document</strong> — PDF files work best</li>
              <li><strong>Ask a question</strong> — Use natural language</li>
              <li><strong>Get instant answers</strong> — Powered by AI</li>
            </ol>

            <p><a href="${process.env.FRONTEND_URL || 'http://localhost:4200'}/dashboard" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Get Started →</a></p>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">Questions? <a href="mailto:support@docuask.com">Contact support</a></p>
          </div>
          <div style="padding: 20px; background: #333; color: white; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
            <p>© 2026 DocuAsk. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${to}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error(`❌ Failed to send welcome email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

exports.sendQueryResultEmail = async (to, name, question, answer) => {
  try {
    const emailTransporter = getTransporter();
    
    if (!emailTransporter) {
      console.warn(`📧 Email disabled - skipping query result email to ${to}`);
      return { success: false, reason: 'Email service not configured' };
    }

    const mailOptions = {
      from: `"DocuAsk" <${process.env.EMAIL_USER}>`,
      to,
      subject: `📄 Query Result: "${question.substring(0, 50)}..."`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="padding: 20px; background: #f0f4ff; border-left: 4px solid #667eea;">
            <h2>Your Query Result</h2>
            <p><strong>Question:</strong> ${question}</p>
            <hr>
            <p><strong>Answer:</strong></p>
            <p>${answer.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log(`✅ Query result email sent to ${to}`);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error(`❌ Failed to send query result email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

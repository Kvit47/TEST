const nodemailer = require("nodemailer");

// Create transporter
const createTransporter = () => {
  // For development, you can use a service like Ethereal Email (fake SMTP)
  // For production, use a real service like Gmail, SendGrid, AWS SES, etc.
  
  if (process.env.NODE_ENV === 'production') {
    // Production email configuration
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASSWORD, // Your email password or app password
      },
    });
  } else {
    // Development: Use Ethereal (fake SMTP) or Gmail for testing
    // If you want to use Gmail for testing:
    // 1. Enable 2-factor authentication in your Google account
    // 2. Generate an App Password
    // 3. Use that app password here
    
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  const transporter = createTransporter();
  
  // Create reset URL
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
  
  const mailOptions = {
    from: `"${process.env.APP_NAME || 'Your App'}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset Request",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #bd7422; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
            .button { display: inline-block; padding: 12px 30px; background-color: #bd7422; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .button:hover { background-color: #9d5f1c; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .warning { background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 4px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>You requested to reset your password. Click the button below to reset it:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="background-color: #fff; padding: 10px; border: 1px solid #ddd; word-break: break-all;">
                ${resetUrl}
              </p>
              <div class="warning">
                <strong>⚠️ Important:</strong>
                <ul style="margin: 10px 0;">
                  <li>This link will expire in 1 hour</li>
                  <li>If you didn't request this, please ignore this email</li>
                  <li>Your password won't change unless you click the link and set a new one</li>
                </ul>
              </div>
              <p>For security reasons, we cannot tell you your current password. You'll need to create a new one.</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>&copy; ${new Date().getFullYear()} ${process.env.APP_NAME || 'Your App'}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Password Reset Request
      
      Hello,
      
      You requested to reset your password. Click the link below to reset it:
      ${resetUrl}
      
      This link will expire in 1 hour.
      
      If you didn't request this, please ignore this email. Your password won't change unless you click the link and set a new one.
      
      For security reasons, we cannot tell you your current password. You'll need to create a new one.
      
      This is an automated email. Please do not reply to this message.
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

// Send password change confirmation email
const sendPasswordChangedEmail = async (email, username) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"${process.env.APP_NAME || 'Your App'}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Changed Successfully",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #bd7422; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .success { background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 4px; margin: 20px 0; color: #155724; }
            .alert { background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 4px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Changed</h1>
            </div>
            <div class="content">
              <p>Hello ${username},</p>
              <div class="success">
                <strong>✓ Success!</strong> Your password has been changed successfully.
              </div>
              <p>This email confirms that your password was recently changed on ${new Date().toLocaleString()}.</p>
              <div class="alert">
                <strong>⚠️ Didn't make this change?</strong>
                <p style="margin: 10px 0;">If you didn't change your password, please contact our support team immediately. Someone may have unauthorized access to your account.</p>
              </div>
              <p>For your security, we recommend:</p>
              <ul>
                <li>Use a strong, unique password</li>
                <li>Never share your password with anyone</li>
                <li>Enable two-factor authentication if available</li>
              </ul>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>&copy; ${new Date().getFullYear()} ${process.env.APP_NAME || 'Your App'}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Password Changed Successfully
      
      Hello ${username},
      
      Your password has been changed successfully on ${new Date().toLocaleString()}.
      
      If you didn't make this change, please contact our support team immediately.
      
      This is an automated email. Please do not reply to this message.
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Password changed confirmation email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending password changed email:", error);
    // Don't throw error here - it's just a notification
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
};


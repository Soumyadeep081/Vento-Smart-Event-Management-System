package com.vento.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String otp) {
        log.info("\n======================================================\n" +
                 "              OTP VERIFICATION CODE\n" +
                 "======================================================\n" +
                 "To: {}\n" +
                 "OTP: {}\n" +
                 "======================================================", toEmail, otp);
                 
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@vento.com");
            message.setTo(toEmail);
            message.setSubject("Vento - Verify Your Email");
            message.setText("Welcome to Vento! Your email verification code is: " + otp + "\nThis code will expire in 10 minutes.");
            mailSender.send(message);
            log.info("Sent verification OTP to {}", toEmail);
        } catch (Exception e) {
            log.warn("Failed to send verification email to {} (Using dummy console OTP logger as fallback)", toEmail);
            // Ignore error so that application doesn't crash on bad credentials,
            // we can test OTP via logs or direct database queries during dev.
        }
    }
}

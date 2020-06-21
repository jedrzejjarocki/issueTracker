package issuetracker.services;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import issuetracker.models.PasswordResetToken;
import issuetracker.repositories.PasswordTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URL;

@Service
@RequiredArgsConstructor
public class MailSenderService {

    private final PasswordTokenRepository repository;
    private final UserService userService;

    public void resetPassword(String email) throws IOException {
        String token = createPasswordResetToken(email);

        String baseUrl = new URL("http://localhost:8080/reset-password").toString();

        Email from = new Email("springbootissuetrackerproject@gmail.com");
        Email to = new Email(email);

        String subject = "Reset password";
        Content content = new Content("text/plain",
                String.format("To reset password, please click here: %s?token=%s", baseUrl, token));

        Mail mail = new Mail(from, subject, to, content);

        //@Todo move api key to env
        SendGrid sg = new SendGrid("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");
        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            sg.api(request);
        } catch (IOException ex) {
            throw ex;
        }
    }

    private String createPasswordResetToken(String email) {
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUser(userService.getByEmail(email));
        return repository.save(resetToken).getToken();
    }
}

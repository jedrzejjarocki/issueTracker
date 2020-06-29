package issuetracker.services;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import issuetracker.models.TeamMemberInvitationToken;
import issuetracker.repositories.PasswordTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URL;

@Service
@RequiredArgsConstructor
public class MailSenderService {

    //@Todo move api key to env
    String apiKey = "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\n";
    private final PasswordTokenRepository repository;
    private final Email from = new Email("springbootissuetrackerproject@gmail.com");
    private final SendGrid sg = new SendGrid(apiKey);


    public void resetPassword(String email, String token) throws IOException {
        String baseUrl = new URL("http://localhost:8080/reset-password").toString();

        Email to = new Email(email);
        String subject = "Reset password";
        Content content = new Content("text/plain",
                String.format("To reset password, please click here: %s?token=%s", baseUrl, token));

        Mail mail = new Mail(from, subject, to, content);
        send(mail);
    }

    public void inviteNewUser(TeamMemberInvitationToken invitationToken) throws IOException {
        String baseUrl = new URL("http://localhost:8080/signup").toString();
        Email to = new Email(invitationToken.getEmail());
        String subject = "Invitation to collaboration";
        Content content = new Content("text/plain",
                String.format("You've been invited to collaborate on a project. To create account click here: %s?token=%s",
                        baseUrl,
                        invitationToken.getToken())
        );
        Mail mail = new Mail(from, subject, to, content);
        send(mail);
    }

    public void send(Mail mail) throws IOException {
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
}

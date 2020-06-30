package issuetracker.services;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.objects.Email;
import issuetracker.models.TeamMemberInvitationToken;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.internal.util.reflection.FieldSetter;
import org.mockito.junit.MockitoJUnitRunner;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class MailSenderServiceTest {
    private final String apiKey = "key";
    private final Email from = mock(Email.class, withSettings().useConstructor("email@email.com"));
    private final SendGrid sg = mock(SendGrid.class, withSettings().useConstructor(apiKey));

    private final MailSenderService service = new MailSenderService();

    @Before
    public void init() throws NoSuchFieldException {
        FieldSetter.setField(service, service.getClass().getDeclaredField("from"), from);
        FieldSetter.setField(service, service.getClass().getDeclaredField("sg"), sg);
    }

    private void verifyMailSentWithProperRequest() throws IOException {
        ArgumentCaptor<Request> captured = ArgumentCaptor.forClass(Request.class);
        verify(sg).api(captured.capture());
        assertEquals(captured.getValue().getMethod(), Method.POST);
        assertEquals(captured.getValue().getEndpoint(), "mail/send");
    }

    @Test
    public void resetPassword() throws IOException {
        service.resetPassword("test@test.com", "token");
        verifyMailSentWithProperRequest();
    }

    @Test
    public void inviteNewUser() throws IOException {
        service.inviteNewUser(new TeamMemberInvitationToken());
        verifyMailSentWithProperRequest();
    }
}
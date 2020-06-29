package issuetracker.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import issuetracker.dtos.*;
import issuetracker.dtos.common.DtoMapper;
import issuetracker.models.Project;
import issuetracker.models.User;
import issuetracker.services.MailSenderService;
import issuetracker.services.UserService;
import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.io.IOException;
import java.security.Principal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@WithMockUser
@ExtendWith(MockitoExtension.class)
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class UserControllerTest {
    @Autowired
    ObjectMapper objectMapper;

    @Mock UserService service;
    @Mock DtoMapper<User, UserDto> mapper;
    @Mock DtoMapper<Project, ProjectDto> projectMapper;
    @Mock MailSenderService mailSenderService;
    @Mock Principal principal;
    @InjectMocks
    private UserController controller;

    @Test
    public void callsServiceGetByUsernameWithPrincipalName() {
        String username = "username";
        when(principal.getName()).thenReturn(username);
        User user = new User();
        user.setUsername(username);
        when(service.getByUsername(username)).thenReturn(user);

        UserDto dto = controller.current(principal);
        verify(service).getByUsername(username);
        assertEquals(dto.getUsername(), username);
    }

    @Test
    public void callsServiceCreateWithUser() {
        UserCreationDto dto = new UserCreationDto();
        dto.setUsername("username");
        dto.setPassword("password");

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(dto.getPassword());

        when(mapper.toEntity(any(UserCreationDto.class), any(User.class))).thenReturn(user);
        when(mapper.toDto(any(User.class), any(UserDto.class))).thenReturn(new UserDto());

        when(service.create(user)).thenReturn(user);

        controller.create(dto, null);
        verify(service).create(user);
    }

    @Test
    public void callsServiceDeleteWithPrincipalName() {
        String username = "username";
        when(principal.getName()).thenReturn(username);
        User user = new User();
        user.setUsername(username);
        when(service.getByUsername(username)).thenReturn(user);

        controller.delete(principal);
        verify(service).delete(username);
    }

    @Test
    public void callsMailSenderService() throws IOException {
        String reqBody = "{\"email\": \"email@email.com\"}";

        doNothing().when(mailSenderService).resetPassword("email@email.com", "");
        PasswordRecoveryDto dto = objectMapper.readValue(reqBody, PasswordRecoveryDto.class);

        controller.resetPassword(dto);
        verify(mailSenderService).resetPassword("email@email.com", "");
    }

    @Test
    public void callsServiceWithTokenAndPassword() throws IOException {
        ObjectNode objectNode = objectMapper.createObjectNode();
        objectNode.put("token", "token");
        objectNode.put("password", "password");
        ChangePasswordDto dto = objectMapper.readValue(objectMapper.writeValueAsString(objectNode), ChangePasswordDto.class);

        doNothing().when(service).changePassword(dto.getToken(), dto.getPassword());

        controller.changePassword(dto);
        verify(service).changePassword(dto.getToken(), dto.getPassword());
    }
}
package issuetracker.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import issuetracker.dtos.ChangePasswordDto;
import issuetracker.dtos.PasswordRecoveryDto;
import issuetracker.dtos.UserCreationDto;
import issuetracker.dtos.UserDto;
import issuetracker.dtos.common.DtoMapper;
import issuetracker.models.User;
import issuetracker.services.UserService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.io.IOException;
import java.security.Principal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class UserControllerTest {
    ObjectMapper objectMapper = new ObjectMapper();
    @Mock UserService service;
    @Mock DtoMapper<User, UserDto> mapper;
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

        controller.delete(principal);
        verify(service).delete(username);
    }

    @Test
    public void callsServiceCreateResetPasswordToken() throws IOException {
        String reqBody = "{\"email\": \"email@email.com\"}";
        PasswordRecoveryDto dto = objectMapper.readValue(reqBody, PasswordRecoveryDto.class);
        doNothing().when(service).createPasswordResetToken(dto.getEmail());

        controller.resetPassword(dto);
        verify(service).createPasswordResetToken(dto.getEmail());
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
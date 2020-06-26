package issuetracker.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import issuetracker.auth.TestConfig;
import issuetracker.dtos.UserCreationDto;
import issuetracker.dtos.UserDto;
import issuetracker.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@SpringBootTest(classes = {TestConfig.class})
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class UserControllerTestIntegration {

    String BASE_URL = "/api/users";
    String CURRENT_USER_URL = String.format("%s/current", BASE_URL);
    String RESET_PASSWORD_URL = String.format("%s/reset-password", BASE_URL);

    @Autowired private UserRepository repository;
    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @Test
    public void respondsWith401IfUserNotAuthenticated() throws Exception {
        mockMvc.perform(get(CURRENT_USER_URL)).andExpect(status().is(401));
    }

    @Test
    @WithMockUser(username = "first")
    public void returnsDtoIfUserExists() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/users/current"))
                .andExpect(status().isOk())
                .andReturn();

        UserDto userDto = objectMapper.readValue(
                result.getResponse().getContentAsString(),
                UserDto.class);

        assertEquals(userDto.getUsername(), "first");
        assertEquals(userDto.getProjects().size(), 2);
    }

    @Test
    @WithMockUser(username = "nonexistent")
    public void respondsWith404IfUserNotFound() throws Exception {
        mockMvc.perform(get("/api/users/current"))
                .andExpect(status().is(404));
    }

    @Test
    public void CreatesUserIfValidInputData() throws Exception {
        UserCreationDto dto = new UserCreationDto();
        dto.setUsername("user");
        dto.setPassword("password");

        MvcResult result = mockMvc.perform(post(BASE_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto))
        )
                .andExpect(status().is(201)).andReturn();

        UserDto responseDto = objectMapper
                .readValue(result.getResponse().getContentAsString(), UserDto.class);
        assertNotNull(repository.getOne(responseDto.getId()));
    }

    private static List<UserCreationDto> invalidUserCreationDto() {
        UserCreationDto blankPassword = new UserCreationDto();
        blankPassword.setPassword("         ");
        blankPassword.setUsername("user");

        UserCreationDto blankUsername = new UserCreationDto();
        blankUsername.setUsername("        ");
        blankUsername.setPassword("abcabcabc");

        return Arrays.asList(blankPassword, blankUsername);
    }

    @ParameterizedTest
    @MethodSource("invalidUserCreationDto")
    public void respondsWith422IfPasswordOrUsernameNotValid(UserCreationDto dto) throws Exception {
        mockMvc.perform(post(BASE_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto))
        )
                .andExpect(status().is(422));

    }

    @Test
    public void respondsWith422IfEmailNotValid() throws Exception {
        String content = "{\"email\": \"notvalid\"}";

        mockMvc.perform(post(RESET_PASSWORD_URL)
        .contentType(MediaType.APPLICATION_JSON)
        .content(content)).andExpect(status().is(422));
    }

    @Test
    public void respondsWith422IfNewPasswordNotValid() throws Exception {
        ObjectNode content = objectMapper.createObjectNode();
        content.put("token", UUID.randomUUID().toString());
        content.put("password", "        ");

        mockMvc.perform(put(RESET_PASSWORD_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(content))).andExpect(status().is(422));
    }

    @Test
    public void callsMailSenderServiceIfValidEmail() throws Exception {
        ObjectNode content = objectMapper.createObjectNode();
        content.put("token", UUID.randomUUID().toString());
        content.put("password", "");

        mockMvc.perform(put(RESET_PASSWORD_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(content))).andExpect(status().is(422));
    }
}
//package issuetracker.controllers;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import issuetracker.dtos.UserDto;
//import issuetracker.models.User;
//import issuetracker.services.UserService;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.security.test.context.support.WithMockUser;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.MvcResult;
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//@AutoConfigureMockMvc
//@SpringBootTest
//public class UserControllerTestIntegration {
//
//    String BASE_URL = "/api/users";
//    String CURRENT_USER_URL = String.format("%s/current", BASE_URL);
//    String RESET_PASSWORD_URL = String.format("%s/reset-password", BASE_URL);
//
//    @Autowired private MockMvc mockMvc;
//    @Autowired private ObjectMapper objectMapper;
//
//    @MockBean private UserService service;
//
//    @Test
//    public void respondsWith401IfUserNotAuthenticated() throws Exception {
//        mockMvc.perform(get(CURRENT_USER_URL)).andExpect(status().is(401));
//    }
//
//    @Test
//    @WithMockUser(username = "first")
//    public void returnsDtoIfUserExists() throws Exception {
//        MvcResult result = mockMvc.perform(get(CURRENT_USER_URL))
//                .andExpect(status().isOk())
//                .andReturn();
//
//        UserDto userDto = objectMapper.readValue(
//                result.getResponse().getContentAsString(),
//                UserDto.class);
//
//        User user = new User();
//        user.setUsername("first");
//        when(service.getByUsername("first")).thenReturn(user);
//
//        assertEquals(userDto.getUsername(), "first");
//    }
////
////    @Test
////    @WithMockUser(username = "nonexistent")
////    public void respondsWith404IfUserNotFound() throws Exception {
////        mockMvc.perform(get("/api/users/current"))
////                .andExpect(status().is(404));
////    }
////
////    @Test
////    public void CreatesUserIfValidInputData() throws Exception {
////        UserCreationDto dto = new UserCreationDto();
////        dto.setUsername("user");
////        dto.setPassword("password");
////
////        MvcResult result = mockMvc.perform(post(BASE_URL)
////                .contentType(MediaType.APPLICATION_JSON)
////                .content(objectMapper.writeValueAsString(dto))
////        )
////                .andExpect(status().is(201)).andReturn();
////
////        UserDto responseDto = objectMapper
////                .readValue(result.getResponse().getContentAsString(), UserDto.class);
////        assertNotNull(repository.getOne(responseDto.getId()));
////    }
////
////    private static List<UserCreationDto> invalidUserCreationDto() {
////        UserCreationDto blankPassword = new UserCreationDto();
////        blankPassword.setPassword("         ");
////        blankPassword.setUsername("user");
////
////        UserCreationDto blankUsername = new UserCreationDto();
////        blankUsername.setUsername("        ");
////        blankUsername.setPassword("abcabcabc");
////
////        return Arrays.asList(blankPassword, blankUsername);
////    }
////
////    @ParameterizedTest
////    @MethodSource("invalidUserCreationDto")
////    public void respondsWith422IfPasswordOrUsernameNotValid(UserCreationDto dto) throws Exception {
////        mockMvc.perform(post(BASE_URL)
////                .contentType(MediaType.APPLICATION_JSON)
////                .content(objectMapper.writeValueAsString(dto))
////        )
////                .andExpect(status().is(422));
////
////    }
//
////    @Test
////    public void respondsWith422IfEmailNotValid() throws Exception {
////        String content = "{\"email\": \"notvalid\"}";
////
////        mockMvc.perform(post(RESET_PASSWORD_URL)
////        .contentType(MediaType.APPLICATION_JSON)
////        .content(content)).andExpect(status().is(422));
////    }
////
////    @Test
////    public void respondsWith422IfNewPasswordNotValid() throws Exception {
////        ObjectNode content = objectMapper.createObjectNode();
////        content.put("token", UUID.randomUUID().toString());
////        content.put("password", "        ");
////
////        mockMvc.perform(put(RESET_PASSWORD_URL)
////                .contentType(MediaType.APPLICATION_JSON)
////                .content(objectMapper.writeValueAsString(content))).andExpect(status().is(422));
////    }
////
////    @Test
////    public void callsMailSenderServiceIfValidEmail() throws Exception {
////        ObjectNode content = objectMapper.createObjectNode();
////        content.put("token", UUID.randomUUID().toString());
////        content.put("password", "");
////
////        mockMvc.perform(put(RESET_PASSWORD_URL)
////                .contentType(MediaType.APPLICATION_JSON)
////                .content(objectMapper.writeValueAsString(content))).andExpect(status().is(422));
////    }
//}
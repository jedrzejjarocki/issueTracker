package issuetracker.controllers;


import org.springframework.web.bind.annotation.GetMapping;

//@Todo delete if sure that will not be used
//@Controller
public class UIController {
    @GetMapping(value = {"/{path:[^\\.]*}", "/**/{path:[^\\.]*}"})
    public String forward() {
        return "forward:/";
    }
}

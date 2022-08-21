package feedmon.testing.adapters.rest.Controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static feedmon.testing.util.Constants.TEXT_PLAIN_UTF_8_VALUE;

@RestController
@RequestMapping("/api/testing")
public class TestController {

    @GetMapping(value = "", produces = TEXT_PLAIN_UTF_8_VALUE)
    public String test() {
        return "yeeehaw213321";
    }
}

package feedmon.testing.adapters.rest.Controllers;

import feedmon.testing.adapters.database.SubjectRepository;
import feedmon.testing.domain.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static feedmon.testing.util.Constants.TEXT_PLAIN_UTF_8_VALUE;

@RestController
@RequestMapping("/api/testing")
public class TestController {

    private final SubjectRepository subjectRepository;

    @Autowired
    public TestController(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    @GetMapping(value = "", produces = TEXT_PLAIN_UTF_8_VALUE)
    public String test() {
        return "Working";
    }

    @PutMapping(value = "create")
    public void create() {
        this.subjectRepository.save(new Subject("English", "Petra"));
    }

    @GetMapping(value = "getAll")
    public List<Subject> getAllSubjects() {
        return this.subjectRepository.getAllSubjects();
    }

}

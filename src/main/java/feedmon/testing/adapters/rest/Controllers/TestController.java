package feedmon.testing.adapters.rest.Controllers;

import feedmon.testing.usecases.CreateClassUseCase;
import feedmon.testing.usecases.GetAllSubjectsUseCase;
import feedmon.testing.usecases.dtos.CreateClassRequestDto;
import feedmon.testing.usecases.dtos.SubjectDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static feedmon.testing.util.Constants.TEXT_PLAIN_UTF_8_VALUE;

@RestController
@RequestMapping("/api/testing")
public class TestController {

    private final GetAllSubjectsUseCase getAllSubjectsUseCase;
    private final CreateClassUseCase createClassUseCase;

    @Autowired
    public TestController(GetAllSubjectsUseCase getAllSubjectsUseCase,
                          CreateClassUseCase createClassUseCase) {
        this.getAllSubjectsUseCase = getAllSubjectsUseCase;
        this.createClassUseCase = createClassUseCase;
    }

    @GetMapping(value = "")
    public List<SubjectDto> getAllSubjects() {
        return this.getAllSubjectsUseCase.execute();
    }

    @GetMapping(value = "{id}", produces = TEXT_PLAIN_UTF_8_VALUE)
    public String test(@PathVariable Long id) {
        return "Working";
    }

    @PutMapping(value = "create")
    public void create(@RequestBody CreateClassRequestDto createClassRequestDto) {
        createClassUseCase.execute(new CreateClassUseCase.Input(createClassRequestDto));
    }
}

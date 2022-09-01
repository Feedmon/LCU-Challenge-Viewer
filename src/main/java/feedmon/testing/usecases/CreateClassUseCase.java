package feedmon.testing.usecases;

import feedmon.testing.adapters.database.SubjectRepository;
import feedmon.testing.domain.Subject;
import feedmon.testing.usecases.dtos.CreateClassRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CreateClassUseCase implements UseCase<String, CreateClassUseCase.Input> {
    private final SubjectRepository subjectRepository;

    @Autowired
    public CreateClassUseCase(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    @Override
    public String execute(Input input) {
        this.subjectRepository.saveAndFlush(new Subject(input.createClassRequestDto.getClassName(), input.createClassRequestDto.getTeacher(), input.createClassRequestDto.getGoodMates()));
        return null;
    }


    public static class Input {
        private final CreateClassRequestDto createClassRequestDto;

        // todo check not null
        public Input(CreateClassRequestDto createClassRequestDto) {
            this.createClassRequestDto = createClassRequestDto;
        }
    }
}

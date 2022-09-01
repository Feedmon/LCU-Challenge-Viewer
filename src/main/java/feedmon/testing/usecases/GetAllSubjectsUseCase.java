package feedmon.testing.usecases;

import feedmon.testing.adapters.database.SubjectRepository;
import feedmon.testing.usecases.dtos.SubjectDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
public class GetAllSubjectsUseCase implements VoidInputUseCase<List<SubjectDto>> {
    private final SubjectRepository subjectRepository;

    @Autowired
    public GetAllSubjectsUseCase(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    @Override
    public List<SubjectDto> execute() {
        return subjectRepository.getAllSubjects().stream().map(SubjectDto::new).collect(toList());
    }
}

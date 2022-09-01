package feedmon.testing.usecases.dtos;

import java.util.List;

public class CreateClassRequestDto {
    private String className;
    private String teacher;
    private List<String> goodMates;

    public String getClassName() {
        return className;
    }

    public String getTeacher() {
        return teacher;
    }

    public List<String> getGoodMates() {
        return goodMates;
    }
}

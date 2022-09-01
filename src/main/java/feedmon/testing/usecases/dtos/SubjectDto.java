package feedmon.testing.usecases.dtos;

import feedmon.testing.domain.Subject;

import java.util.List;

public class SubjectDto {

    private final Long id;
    private final String name;
    private final String teacher;
    private final List<String> goodClassMates;
    private final List<String> topics;
    private final List<String> work;
    private final List<String> lesson;


    public SubjectDto(Subject subject) {
        this.id = subject.getId();
        this.name = subject.getName();
        this.teacher = subject.getTeacher();
        this.goodClassMates = List.of("baum");
        this.topics = List.of("baum");
        this.work = List.of("baum");
        this.lesson = List.of("");
/*        this.goodClassMates = subject.getGoodClassMates();
        this.topics = subject.getTopics();
        this.work = subject.getWork();
        this.lesson = subject.getLesson();*/
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getTeacher() {
        return teacher;
    }

    public List<String> getGoodClassMates() {
        return goodClassMates;
    }

    public List<String> getTopics() {
        return topics;
    }

    public List<String> getWork() {
        return work;
    }

    public List<String> getLesson() {
        return lesson;
    }
}

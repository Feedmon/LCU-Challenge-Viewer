package feedmon.testing.domain;

import javax.persistence.*;
import java.util.List;

@Entity
@Table
public class Subject {

    @Id
    @GeneratedValue
    private Long id;

    @Column
    private String name;

    @Column
    private String teacher;

    @ElementCollection
    @OrderColumn
    private List<String> goodClassMates;

    @ElementCollection
    @OrderColumn
    private List<String> topics;

    @ElementCollection
    @OrderColumn
    private List<String> work;

    @OneToMany
    @JoinColumn(nullable = false)
    private List<Lesson> lesson;


    public Subject() {
    }

    public Subject(String name, String teacher) {
        this.name = name;
        this.teacher = teacher;
    }

    public Subject(String name, String teacher, List<String> goodClassMates) {
        this.name = name;
        this.teacher = teacher;
        this.goodClassMates = goodClassMates;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTeacher() {
        return teacher;
    }

    public void setTeacher(String teacher) {
        this.teacher = teacher;
    }

    public List<String> getGoodClassMates() {
        return goodClassMates;
    }

    public void setGoodClassMates(List<String> goodClassMates) {
        this.goodClassMates = goodClassMates;
    }

    public List<String> getTopics() {
        return topics;
    }

    public void setTopics(List<String> topics) {
        this.topics = topics;
    }

    public List<String> getWork() {
        return work;
    }

    public void setWork(List<String> work) {
        this.work = work;
    }

    public List<Lesson> getLesson() {
        return lesson;
    }

    public void setLesson(List<Lesson> lesson) {
        this.lesson = lesson;
    }
}

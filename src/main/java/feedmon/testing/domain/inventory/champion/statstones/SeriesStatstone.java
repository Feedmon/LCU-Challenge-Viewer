package feedmon.testing.domain.inventory.champion.statstones;

import javax.validation.constraints.NotNull;

public class SeriesStatstone implements Comparable<SeriesStatstone> {
    @NotNull
    public String name;
    @NotNull
    public String description;
    // it gets mapped to contentId not itemId
    @NotNull
    public String contentId;
    @NotNull
    public Integer milestone5Value;
    @NotNull
    public Integer milestone15Value;
    @NotNull
    public Integer currentMilestone;
    @NotNull
    public Integer currentMilestoneCompletionPercentage;
    @NotNull
    public Integer currentValue;
    @NotNull
    public Integer milestone5CompletionPercentage;
    @NotNull
    public Integer milestone15CompletionPercentage;

    public SeriesStatstone(String name,
                           String description,
                           String contentId,
                           Integer milestone5Value,
                           Integer milestone15Value) {
        this.name = name;
        this.description = description;
        this.contentId = contentId;
        this.milestone5Value = milestone5Value;
        this.milestone15Value = milestone15Value;
    }

    @Override
    public int compareTo(SeriesStatstone other) {
        int milestoneComparison = this.currentMilestone.compareTo(other.currentMilestone);
        if (milestoneComparison != 0) {
            return milestoneComparison;
        }
        return this.currentMilestoneCompletionPercentage.compareTo(other.currentMilestoneCompletionPercentage);
    }
}

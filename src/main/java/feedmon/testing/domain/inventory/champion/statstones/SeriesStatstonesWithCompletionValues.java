package feedmon.testing.domain.inventory.champion.statstones;

import javax.validation.constraints.NotNull;
import java.util.Collections;
import java.util.List;

public class SeriesStatstonesWithCompletionValues {
    @NotNull
    public Integer seriesMileStone5CompletionPercentage;
    @NotNull
    public Integer seriesMileStone15CompletionPercentage;
    @NotNull
    public Double highestMilestoneWithPercentageToNext;
    @NotNull
    public List<SeriesStatstone> seriesStatstones;

    public SeriesStatstonesWithCompletionValues(List<SeriesStatstone> seriesStatstones) {
        this.seriesStatstones = seriesStatstones;
    }

    public void calculateMilestoneCompletionPercentage() {
        this.seriesMileStone5CompletionPercentage = seriesStatstones.stream().map(series -> series.milestone5CompletionPercentage).mapToInt(Integer::intValue).sum() / 3;
        this.seriesMileStone15CompletionPercentage = seriesStatstones.stream().map(series -> series.milestone15CompletionPercentage).mapToInt(Integer::intValue).sum() / 3;
        this.highestMilestoneWithPercentageToNext = getMilestoneWithPercentageToNext(seriesStatstones);
    }

    private Double getMilestoneWithPercentageToNext(List<SeriesStatstone> seriesStatstones) {
       SeriesStatstone highestStatstone = Collections.max(seriesStatstones);
       return (double) highestStatstone.currentMilestone + ((double) highestStatstone.currentMilestoneCompletionPercentage / 100);
    }
}

package feedmon.testing.domain.inventory.champion;

import feedmon.testing.domain.inventory.champion.statstones.SeriesStatstonesWithCompletionValues;

import javax.validation.constraints.NotNull;

public class ChampionIdWithStatstones {
    @NotNull
    public Integer championId;
    @NotNull
    public SeriesStatstonesWithCompletionValues starterSeriesStatstones;
    @NotNull
    public SeriesStatstonesWithCompletionValues series1Statstones;
    @NotNull
    public SeriesStatstonesWithCompletionValues series2Statstones;

    public ChampionIdWithStatstones(Integer championId) {
        this.championId = championId;
    }
}

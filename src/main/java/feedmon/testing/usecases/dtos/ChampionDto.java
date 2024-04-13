package feedmon.testing.usecases.dtos;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

public class ChampionDto {
    @NotNull
    private long id;
    @NotNull
    private String name;
    @NotNull
    private boolean owned;
    @NotNull
    private boolean chestAvailable;
    @NotNull
    private Date aquirationDate;
    @NotNull
    private int masteryLevel;
    @NotNull
    private int masterPoints;
    @NotNull
    private int ownedSkins;
    @NotNull
    private int tokensEarned;
    @NotNull
    private List<SpecialChallengesDto> championSpecificChallengeData;

    public ChampionDto(long id,
                       String name,
                       boolean owned,
                       boolean chestAvailable,
                       Date aquirationDate,
                       int masteryLevel,
                       int masterPoints,
                       int ownedSkins,
                       int tokensEarned,
                       List<SpecialChallengesDto> championSpecificChallengeData) {
        this.id = id;
        this.name = name;
        this.owned = owned;
        this.chestAvailable = chestAvailable;
        this.aquirationDate = aquirationDate;
        this.masteryLevel = masteryLevel;
        this.masterPoints = masterPoints;
        this.ownedSkins = ownedSkins;
        this.tokensEarned = tokensEarned;
        this.championSpecificChallengeData = championSpecificChallengeData;
    }

/*    public ChampionDto(LolChampionsCollectionsChampion champion){
        this.id = champion.id;
        this.name = champion.name;
        this.owned = champion.ownership.owned;
        this.chestAvailable = null; //??champion.ownership..chestAvailable;
        this.aquirationDate = champion.ownership.rental.purchaseDate;
        this.masteryLevel = champion.masteryLevel;
        this.masterPoints = champion.masterPoints;
        this.ownedSkins = champion.ownedSkins;
        this.tokensEarned = champion.tokensEarned;
        this.championSpecificChallengeData = championSpecificChallengeData;
    }*/
}

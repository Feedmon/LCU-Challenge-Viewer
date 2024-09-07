package feedmon.testing.domain.inventory;

import generated.LolChampionsCollectionsChampionSkin;

import javax.validation.constraints.NotNull;

public class ChampionSkin extends LolChampionsCollectionsChampionSkin {
    @NotNull
    public byte[] squarePortraitJpg;
}

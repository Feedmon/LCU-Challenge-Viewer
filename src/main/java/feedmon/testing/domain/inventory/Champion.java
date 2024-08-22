package feedmon.testing.domain.inventory;

import generated.LolChampionsCollectionsChampionSkin;

import javax.validation.constraints.NotNull;
import java.math.BigInteger;
import java.util.List;

public class Champion {
    public String alias;
    public String baseLoadScreenPath;
    public String baseSplashPath;
    @NotNull
    public Integer id;
    @NotNull
    public String name;
    // date as BigInt
    public BigInteger purchased;
    // like mage...
    @NotNull
    public List<String> roles;
    @NotNull
    public List<String> laneAssignments;
    public List<LolChampionsCollectionsChampionSkin> skins;
    @NotNull
    public String squarePortraitPath;
    @NotNull
    public byte[] squarePortraitJpg;
}

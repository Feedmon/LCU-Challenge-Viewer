package feedmon.testing.domain.inventory;

import generated.LolChampionsCollectionsChampionSkin;

import java.math.BigInteger;
import java.util.List;

public class Champion {
    public String alias;
    public String baseLoadScreenPath;
    public String baseSplashPath;
    public Integer id;
    public String name;
    // date as BigInt
    public BigInteger purchased;
    // like mage...
    public List<String> roles;
    public List<LolChampionsCollectionsChampionSkin> skins;
    public String squarePortraitPath;
    public byte[] squarePortraitJpg;
}

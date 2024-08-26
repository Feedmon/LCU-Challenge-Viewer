package feedmon.testing.domain.inventory.champion.statstones.ddragon;

import java.util.List;

public class StatstoneData {
    // refers to which series it belongs { Starter Series, Series 1, Series 2}
    public String name;
    public int itemId;
    public String inventoryType;
    public String contentId;
    // includes the 3 eternals for the matching series
    public List<DDragonStatstone> statstones;
}

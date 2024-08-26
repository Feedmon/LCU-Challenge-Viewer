package feedmon.testing.domain.inventory.champion.statstones;

import java.util.List;

// eternals are called statstones in the LCU Api
public class Statstones {
    public String inventoryType;
    public int itemId;
    public String itemInstanceID;
    public int milestonesPassed;
    // name refers to series
    public String name;
    public List<OwnedFromPack> ownedFromPacks;
    public List<Object> prices;
    public List<Statstone> statstones;
    public int stonesOwned;
    public String subInventoryType;
}

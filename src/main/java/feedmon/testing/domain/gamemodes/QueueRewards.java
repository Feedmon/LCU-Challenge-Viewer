package feedmon.testing.domain.gamemodes;

import java.util.List;

public class QueueRewards {
    private boolean isChampionPointsEnabled;
    private boolean isIpEnabled;
    private boolean isXpEnabled;

    // most likely always empty bcs of legacy currency (Influence Points)
    private List<Object> partySizeIpRewards;
}

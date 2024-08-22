package feedmon.testing.domain.inventory;

import javax.validation.constraints.NotNull;
import java.util.List;

public class ChampionWithLanes {
   // https://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions.json
   @NotNull
   public Integer id;
   @NotNull
   public String name;
   @NotNull
   public List<String> positions;
   @NotNull
   public String icon;
}

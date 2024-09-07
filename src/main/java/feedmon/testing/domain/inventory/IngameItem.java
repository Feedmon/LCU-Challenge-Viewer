package feedmon.testing.domain.inventory;

import javax.validation.constraints.NotNull;

public class IngameItem {
    @NotNull
    public String name;
    @NotNull
    public Integer id;
    @NotNull
    public String iconPath;
    @NotNull
    public byte[] iconSquarePortrait;
}

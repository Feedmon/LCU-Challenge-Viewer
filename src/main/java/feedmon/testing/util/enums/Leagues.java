package feedmon.testing.util.enums;

public enum Leagues {
    IRON("A Iron"),
    BRONZE("B Bronze"),
    SILVER("C Silver"),
    GOLD("D Gold"),
    PLATINUM("E Platinum"),
    EMERALD("F Emerald"),
    DIAMOND("G Diamond"),
    MASTER("H Master"),
    GRANDMASTER("I Grandmaster"),
    CHALLENGER("J Challenger"),
    NONE("K None");

    private final String name;

    Leagues(String name) {
        this.name = name;
    }

    public String getName(){
        return name;
    }

}

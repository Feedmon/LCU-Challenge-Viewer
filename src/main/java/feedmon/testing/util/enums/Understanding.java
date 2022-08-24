package feedmon.testing.util.enums;

public enum Understanding {
    NONE(0),
    LITTLE(1),
    MEDIOCRE(2),
    GOOD(4),
    PERFECT(5);

    public final int value;

    private Understanding(int value) {
        this.value = value;
    }
}

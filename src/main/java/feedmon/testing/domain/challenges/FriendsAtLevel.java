package feedmon.testing.domain.challenges;

import feedmon.testing.util.enums.Leagues;

import java.util.List;

public class FriendsAtLevel {
    private List<String> friends;
    private Leagues level;

    public List<String> getFriends() {
        return friends;
    }

    public void setFriends(List<String> friends) {
        this.friends = friends;
    }

    public Leagues getLevel() {
        return level;
    }

    public void setLevel(Leagues level) {
        this.level = level;
    }
}

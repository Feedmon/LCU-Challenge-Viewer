package feedmon.testing.domain.challenges;

import feedmon.testing.util.enums.Leagues;

import javax.validation.constraints.NotNull;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

public class Challenge {
    @NotNull
    private List<Integer> availableIds;
    private int capstoneGroupId;
    private String capstoneGroupName;
    @NotNull
    private String category;
    @NotNull
    private List<Integer> childrenIds;
    @NotNull
    private List<Integer> completedIds;
    @NotNull
    private Leagues currentLevel;
    private long currentLevelAchievedTime;
    @NotNull
    private double currentThreshold;
    @NotNull
    private double currentValue;
    @NotNull
    private String description;
    @NotNull
    private String descriptionShort;
    private List<FriendsAtLevel> friendsAtLevels;
    @NotNull
    private List<String> gameModes;
    @NotNull
    private boolean hasLeaderboard;
    @NotNull
    private String iconPath;
    @NotNull
    private int id;
    @NotNull
    private String idListType;
    private Boolean isApex;
    private boolean isCapstone;
    private boolean isReverseDirection;
    // leagues without emerald with api url for icon
    private Map<Leagues, String> levelToIconPath;
    @NotNull
    private String name;
    private String nextLevel;
    private String nextLevelIconPath;
    private double nextThreshold;
    private int parentId;
    private String parentName;
    private double percentile;
    private int playersInLevel;
    private int pointsAwarded;
    private int position;
    private String previousLevel;
    private double previousValue;
    private double priority;
    @NotNull
    private Timestamp retireTimestamp;
    private String source;
    @NotNull
    private Map<Leagues, Reward> thresholds;
    private String valueMapping;
    @NotNull
    private boolean isRetired;


    public List<Integer> getAvailableIds() {
        return availableIds;
    }

    public void setAvailableIds(List<Integer> availableIds) {
        this.availableIds = availableIds;
    }

    public int getCapstoneGroupId() {
        return capstoneGroupId;
    }

    public void setCapstoneGroupId(int capstoneGroupId) {
        this.capstoneGroupId = capstoneGroupId;
    }

    public String getCapstoneGroupName() {
        return capstoneGroupName;
    }

    public void setCapstoneGroupName(String capstoneGroupName) {
        this.capstoneGroupName = capstoneGroupName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<Integer> getChildrenIds() {
        return childrenIds;
    }

    public void setChildrenIds(List<Integer> childrenIds) {
        this.childrenIds = childrenIds;
    }

    public List<Integer> getCompletedIds() {
        return completedIds;
    }

    public void setCompletedIds(List<Integer> completedIds) {
        this.completedIds = completedIds;
    }

    public Leagues getCurrentLevel() {
        return currentLevel;
    }

    public void setCurrentLevel(Leagues currentLevel) {
        this.currentLevel = currentLevel;
    }

    public long getCurrentLevelAchievedTime() {
        return currentLevelAchievedTime;
    }

    public void setCurrentLevelAchievedTime(long currentLevelAchievedTime) {
        this.currentLevelAchievedTime = currentLevelAchievedTime;
    }

    public double getCurrentThreshold() {
        return currentThreshold;
    }

    public void setCurrentThreshold(double currentThreshold) {
        this.currentThreshold = currentThreshold;
    }

    public double getCurrentValue() {
        return currentValue;
    }

    public void setCurrentValue(double currentValue) {
        this.currentValue = currentValue;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDescriptionShort() {
        return descriptionShort;
    }

    public void setDescriptionShort(String descriptionShort) {
        this.descriptionShort = descriptionShort;
    }

    public List<FriendsAtLevel> getFriendsAtLevels() {
        return friendsAtLevels;
    }

    public void setFriendsAtLevels(List<FriendsAtLevel> friendsAtLevels) {
        this.friendsAtLevels = friendsAtLevels;
    }

    public List<String> getGameModes() {
        return gameModes;
    }

    public void setGameModes(List<String> gameModes) {
        this.gameModes = gameModes;
    }

    public boolean isHasLeaderboard() {
        return hasLeaderboard;
    }

    public void setHasLeaderboard(boolean hasLeaderboard) {
        this.hasLeaderboard = hasLeaderboard;
    }

    public String getIconPath() {
        return iconPath;
    }

    public void setIconPath(String iconPath) {
        this.iconPath = iconPath;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getIdListType() {
        return idListType;
    }

    public void setIdListType(String idListType) {
        this.idListType = idListType;
    }

    public Boolean getIsApex() {
        return isApex;
    }

    public void setIsApex(Boolean isApex) {
        this.isApex = isApex;
    }

    public boolean getIsCapstone() {
        return isCapstone;
    }

    public void setIsCapstone(boolean isCapstone) {
        this.isCapstone = isCapstone;
    }

    public boolean getIsReverseDirection() {
        return isReverseDirection;
    }

    public void setIsReverseDirection(boolean isReverseDirection) {
        this.isReverseDirection = isReverseDirection;
    }

    public Map<Leagues, String> getLevelToIconPath() {
        return levelToIconPath;
    }

    public void setLevelToIconPath(Map<Leagues, String> levelToIconPath) {
        this.levelToIconPath = levelToIconPath;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNextLevel() {
        return nextLevel;
    }

    public void setNextLevel(String nextLevel) {
        this.nextLevel = nextLevel;
    }

    public String getNextLevelIconPath() {
        return nextLevelIconPath;
    }

    public void setNextLevelIconPath(String nextLevelIconPath) {
        this.nextLevelIconPath = nextLevelIconPath;
    }

    public double getNextThreshold() {
        return nextThreshold;
    }

    public void setNextThreshold(double nextThreshold) {
        this.nextThreshold = nextThreshold;
    }

    public int getParentId() {
        return parentId;
    }

    public void setParentId(int parentId) {
        this.parentId = parentId;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public double getPercentile() {
        return percentile;
    }

    public void setPercentile(double percentile) {
        this.percentile = percentile;
    }

    public int getPlayersInLevel() {
        return playersInLevel;
    }

    public void setPlayersInLevel(int playersInLevel) {
        this.playersInLevel = playersInLevel;
    }

    public int getPointsAwarded() {
        return pointsAwarded;
    }

    public void setPointsAwarded(int pointsAwarded) {
        this.pointsAwarded = pointsAwarded;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public String getPreviousLevel() {
        return previousLevel;
    }

    public void setPreviousLevel(String previousLevel) {
        this.previousLevel = previousLevel;
    }

    public double getPreviousValue() {
        return previousValue;
    }

    public void setPreviousValue(double previousValue) {
        this.previousValue = previousValue;
    }

    public double getPriority() {
        return priority;
    }

    public void setPriority(double priority) {
        this.priority = priority;
    }

    public Timestamp getRetireTimestamp() {
        return retireTimestamp;
    }

    public void setRetireTimestamp(Timestamp retireTimestamp) {
        this.retireTimestamp = retireTimestamp;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public Map<Leagues, Reward> getThresholds() {
        return thresholds;
    }

    public void setThresholds(Map<Leagues, Reward> thresholds) {
        this.thresholds = thresholds;
    }

    public String getValueMapping() {
        return valueMapping;
    }

    public void setValueMapping(String valueMapping) {
        this.valueMapping = valueMapping;
    }

    public boolean isRetired() {
        return isRetired;
    }

    public void setRetired(boolean retired) {
        isRetired = retired;
    }
}

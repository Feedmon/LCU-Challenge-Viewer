package feedmon.testing.usecases.dtos;

import feedmon.testing.domain.challenges.Challenge;
import feedmon.testing.domain.inventory.Champion;
import feedmon.testing.util.enums.Leagues;
import generated.LolChampionsCollectionsChampionSkin;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

import static feedmon.testing.util.enums.ChallengeAvailableIdType.CHAMPION;

public class SpecialChallengesDto {
    @NotNull
    private final long id;
    @NotNull
    private final String challengeType;
    @NotNull
    private final String challengeName;
    @NotNull
    private final String challengeDescription;
    @NotNull
    private final List<Integer> availableIds;
    @NotNull
    private final List<String> availableNames;
    @NotNull
    private final List<Integer> notCompletedIds;
    @NotNull
    private final List<String> notCompletedNames;
    @NotNull
    private final List<Integer> completedIds;
    @NotNull
    private final List<String> completedNames;
    @NotNull
    private final String challengeLeague;
    @NotNull
    private final Integer completionAmount;
    @NotNull
    private final Integer completionAmountForMaster;

    public SpecialChallengesDto(Challenge challenge, List<LolChampionsCollectionsChampionSkin> allSkins, List<Champion> champions) {
        this.id = challenge.getId();
        this.challengeType = getStringForChallengeType(challenge.getIdListType());
        this.challengeName = challenge.getName();
        this.challengeDescription = challenge.getDescription();
        this.availableIds =getAvailableIds(challenge, allSkins,champions) ;
        this.availableNames = availableIds.stream().map(id -> getName(id, allSkins, champions)).toList();
        List<Integer> notCompletedSkinIds = new ArrayList<>(getAvailableIds());
        notCompletedSkinIds.removeAll(challenge.getCompletedIds());
        this.notCompletedIds = notCompletedSkinIds;
        this.notCompletedNames = notCompletedSkinIds.stream().map(id -> getName(id, allSkins, champions)).toList();
        this.completedIds = challenge.getCompletedIds();
        this.completedNames = completedIds.stream().map(id -> getName(id, allSkins, champions)).toList();
        this.challengeLeague = challenge.getCurrentLevel().getName();
        this.completionAmount = 0;//Integer.valueOf(Double.toString(challenge.getCurrentThreshold()));
        this.completionAmountForMaster = getCompletionAmountForMasterOrNull(challenge);
    }

    private Integer getCompletionAmountForMasterOrNull(Challenge challenge){
        if(challenge.getThresholds().get(Leagues.MASTER)!= null){
            return challenge.getThresholds().get(Leagues.MASTER).getQuantity();
        }
        return null;
    }

    private List<Integer> getAvailableIds(Challenge challenge,List<LolChampionsCollectionsChampionSkin> allSkins, List<Champion> champions){
        if(!challenge.getAvailableIds().isEmpty()){
            return challenge.getAvailableIds();
        }
        if( challenge.getIdListType().equals(CHAMPION.name())){
           return champions.stream().map(champion -> champion.id).toList();
        }else {
         return allSkins.stream().map(skin-> skin.id).toList();
        }
    }

    private String getStringForChallengeType(String type) {
        return type.equals(CHAMPION.name()) ? "Champion" : "Skin";
    }

    private String getName(Integer id, List<LolChampionsCollectionsChampionSkin> skins, List<Champion> champions) {
        if (getChallengeType().equalsIgnoreCase(CHAMPION.name())) {
            return champions.stream()
                    .filter(champion -> champion.id.equals(id))
                    .findFirst().map(champion -> champion.name)
                    .orElse(String.format("id '%s' not in given List", id));
        } else {
            return skins.stream()
                    .filter(skin -> skin.id.equals(id))
                    .findFirst().map(skin -> skin.name)
                    .orElse(String.format("id '%s' not in given List", id));
        }
    }

    public long getId() {
        return id;
    }

    public String getChallengeType() {
        return challengeType;
    }

    public String getChallengeName() {
        return challengeName;
    }

    public String getChallengeDescription() {
        return challengeDescription;
    }

    public List<Integer> getAvailableIds() {
        return availableIds;
    }

    public List<Integer> getCompletedIds() {
        return completedIds;
    }

    public String getChallengeLeague() {
        return challengeLeague;
    }

    public Integer getCompletionAmount() {
        return completionAmount;
    }

    public Integer getCompletionAmountForMaster() {
        return completionAmountForMaster;
    }

    public List<String> getAvailableNames() {
        return availableNames;
    }

    public List<String> getCompletedNames() {
        return completedNames;
    }

    public List<Integer> getNotCompletedIds() {
        return notCompletedIds;
    }

    public List<String> getNotCompletedNames() {
        return notCompletedNames;
    }
}

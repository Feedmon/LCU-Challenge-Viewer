package feedmon.testing.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import com.fasterxml.jackson.databind.type.MapType;
import com.fasterxml.jackson.databind.type.TypeFactory;
import com.stirante.lolclient.ClientApi;
import feedmon.testing.domain.challenges.Challenge;
import feedmon.testing.domain.inventory.Champion;
import feedmon.testing.usecases.dtos.ChampionDto;
import feedmon.testing.usecases.dtos.SpecialChallengesDto;
import generated.LolChampionsCollectionsChampion;
import generated.LolChampionsCollectionsChampionSkin;
import generated.LolSummonerSummoner;
import generated.UriMap;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

import static feedmon.testing.util.enums.ChallengeAvailableIdType.ITEM;


@SuppressWarnings("deprecation")
@Service
public class LCUService {

    private ClientApi clientApi = new ClientApi();
    private final LolSummonerSummoner loggedInSummoner;

    private List<Challenge> challenges;
    private List<Champion> champions;
    private List<LolChampionsCollectionsChampionSkin> skins;
    private List<SpecialChallengesDto> storedChallengeCompletionInfo;

    public LCUService() {
        clientApi.start();

        while (!clientApi.isConnected()) {
            try {
                //noinspection BusyWait
                Thread.sleep(5);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
        loggedInSummoner = executeWithExceptionWrapper(() -> clientApi.getCurrentSummoner());
        getChallenges(true);
    }

    public void startConnection() {
        clientApi = new ClientApi();
        clientApi.start();
    }

    public void stopConnection() {
        clientApi.stop();
    }

    public List<ChampionDto> getChampionsForCurrentSummoner() {
        //  Arrays.stream(getChampions()).map(champion -> new ChampionDto())
        return List.of();
    }

    public SpecialChallengesDto getChallengeForName(String challengeName) {
        return new SpecialChallengesDto(challenges.stream().filter(challenge -> challenge.getName().equals(challengeName)).findFirst().orElseThrow(), getAllSkins(), getChampions());
    }

    public LolChampionsCollectionsChampionSkin getSkinForId(Integer id) {
        return skins.stream().filter(skin -> skin.id.equals(id)).findFirst().orElseThrow();
    }

    public Champion getChampionForId(Integer id) {
        return champions.stream().filter(champion -> champion.id.equals(id)).findFirst().orElseThrow();
    }

    public List<SpecialChallengesDto> getChallengesCompletionInfo() {
/*        if (storedChallengeCompletionInfo != null) {
            return storedChallengeCompletionInfo;
        }*/

        List<Champion> champions = getChampions();
        List<LolChampionsCollectionsChampionSkin> skins = getAllSkins();

        List<Challenge> challenges = getChallenges(false).stream().filter(challenge -> !challenge.getCompletedIds().isEmpty()).filter(challenge -> !challenge.getIdListType().equals(ITEM.name())).toList();

        storedChallengeCompletionInfo = challenges.stream().map(chall -> new SpecialChallengesDto(chall, skins, champions)).toList();
        return storedChallengeCompletionInfo;
    }

    private ChampionDto championCollectionToChampionDto(LolChampionsCollectionsChampion champion) {
        //  /lol-champions/v1/inventories/{summonerId}/champions/{championId}/skins
        return null;
    }


    private List<Champion> getChampions() {
        if (champions != null) {
            return champions;
        }

        String champsJson = executeRequest("/lol-champions/v1/inventories/" + loggedInSummoner.summonerId + "/champions");

        ObjectMapper objectMapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        CollectionType type = TypeFactory.defaultInstance().constructCollectionType(List.class, Champion.class);
        try {
            List<Champion> championsMapped = objectMapper.readValue(champsJson, type);
            championsMapped.sort(Comparator.comparing(champion -> champion.name));
            champions = championsMapped.stream().filter(champion -> champion.id >= 0).toList();
            return champions;
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }


    public List<String> knownLCUEndpoints() {
        return UriMap.toClass.keySet().stream().toList();
    }


    public String executeRequest(String path) {
        try {
            //new String(clientApi.executeBinaryGet ("/lol-champions/v1/inventories/"+loggedInSummoner.summonerId+"/champions/1/skins").readAllBytes())
            return new String(clientApi.executeBinaryGet(path).readAllBytes());
            //  return clientApi.executeGet(path, String.class);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean testConnection() {
        return clientApi.isConnected();
    }

    private List<LolChampionsCollectionsChampionSkin> getAllSkins() {
        if (skins != null) {
            return skins;
        }

        List<LolChampionsCollectionsChampionSkin> skinsMapped = executeWithExceptionWrapper(() -> Arrays.stream(clientApi.executeGet("/lol-champions/v1/inventories/" + loggedInSummoner.summonerId + "/skins-minimal", LolChampionsCollectionsChampionSkin[].class)).toList());
        skins = skinsMapped.stream().filter(skin -> skin.id >= 0).toList();
        return skins;
    }

    private void getSkinsForChampionId(Long id) {
        executeWithExceptionWrapper(() -> clientApi.executeGet("/lol-champions/v1/inventories/" + loggedInSummoner.summonerId + "/champions/" + id + "/skins", LolChampionsCollectionsChampionSkin[].class));
    }

    public List<Challenge> getChallenges(boolean reload) {
        if (challenges != null && !reload) {
            return challenges;
        }

        List<Challenge> challenges = new ArrayList<>();
        MapType type = TypeFactory.defaultInstance().constructMapType(HashMap.class, Integer.class, Challenge.class);
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            HashMap<Integer, Challenge> challengeMap = objectMapper.readValue(executeRequest("/lol-challenges/v1/challenges/local-player"), type);
            challengeMap.forEach((key, value) -> challenges.add(value));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        this.challenges = challenges;

        return challenges;
    }

    @FunctionalInterface
    public interface ThrowingSupplier<T, E extends IOException> {
        T call() throws E;
    }

    private <T> T executeWithExceptionWrapper(ThrowingSupplier<T, IOException> supplier) {
        try {
            return supplier.call();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}

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
import feedmon.testing.domain.inventory.ChampionWithLanes;
import feedmon.testing.usecases.dtos.SpecialChallengesDto;
import generated.LolChampionsCollectionsChampionSkin;
import generated.LolSummonerSummoner;
import generated.UriMap;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.sql.Timestamp;
import java.util.*;

import static feedmon.testing.util.enums.ChallengeAvailableIdType.CHAMPION;
import static feedmon.testing.util.enums.ChallengeAvailableIdType.ITEM;


@SuppressWarnings("deprecation")
@Service
public class LCUService {

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private ClientApi clientApi;
    private  LolSummonerSummoner loggedInSummoner;

    private List<Challenge> challenges;
    private List<Champion> champions;
    private List<LolChampionsCollectionsChampionSkin> skins;

    public LCUService() {
        try {
            startConnection();
        }catch(Exception ignored){
        }
        httpClient = HttpClient.newHttpClient();
        objectMapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    public void startConnection() {
        clientApi = new ClientApi();
        clientApi.start();

        int counter = 0;
        while (!clientApi.isConnected() && counter <1000) {
            counter++;
            try {
                //noinspection BusyWait
                Thread.sleep(5);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
        if(!clientApi.isConnected()){
            throw new RuntimeException("could not connect");
        }
        loggedInSummoner = executeWithExceptionWrapper(() -> clientApi.getCurrentSummoner());
        getChallenges(true);
    }

    public void stopConnection() {
        clientApi.stop();
    }

    public Challenge getChallengeForName(String challengeName) {
        return challenges.stream().filter(challenge -> challenge.getName().equals(challengeName)).findFirst().orElseThrow();
    }

    public List<Challenge> getProgressableChampionSpecificChallenges() {
        return challenges.stream().filter(challenge -> !challenge.getCompletedIds().isEmpty()).filter(challenge -> challenge.getIdListType().equals(CHAMPION.name())).toList();
    }

    public LolChampionsCollectionsChampionSkin getSkinForId(Integer id) {
        return skins.stream().filter(skin -> skin.id.equals(id)).findFirst().orElseThrow();
    }

    public Champion getChampionForId(Integer id) {
        return getChampions().stream().filter(champion -> champion.id.equals(id)).findFirst().orElseThrow();
    }

    public List<Champion> getAllChampions() {
        return getChampions();
    }

    public List<SpecialChallengesDto> getChampSpecificChallenges() {
        List<Champion> champions = getChampions();
        List<LolChampionsCollectionsChampionSkin> skins = getAllSkins();

        List<Challenge> challenges = getChallenges(false).stream().filter(challenge -> !challenge.getCompletedIds().isEmpty()).filter(challenge -> !challenge.getIdListType().equals(ITEM.name())).toList();

        return challenges.stream().map(chall -> new SpecialChallengesDto(chall, skins, champions)).toList();
    }

    private List<Champion> getChampions() {
        if (champions != null) {
            return champions;
        }

        String champsJson = executeRequest("/lol-champions/v1/inventories/" + loggedInSummoner.summonerId + "/champions");

       // ObjectMapper objectMapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        CollectionType type = TypeFactory.defaultInstance().constructCollectionType(List.class, Champion.class);
        try {
            List<Champion> championsMapped = objectMapper.readValue(champsJson, type);
            championsMapped.sort(Comparator.comparing(champion -> champion.name));
            champions = championsMapped.stream().filter(champion -> champion.id >= 0).toList();

            List< ChampionWithLanes> champLaneAssignments = getChampionsWithLaneAssignments().values().stream().toList();

            champions.forEach(champ -> {
                champ.squarePortraitJpg = executeByteRequest(champ.squarePortraitPath);
                champ.laneAssignments = champLaneAssignments.stream().filter(champion -> Objects.equals(champ.id, champion.id)).findFirst().orElseThrow().positions;
            });

            return champions;
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    private Map<String, ChampionWithLanes> getChampionsWithLaneAssignments(){
       return sendRequestForMap(buildGetRequestForUrl("https://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions.json"), ChampionWithLanes.class);
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

    private byte[] executeByteRequest(String path){
        try {
         return clientApi.executeBinaryGet(path).readAllBytes();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean testConnection() {
        return this.loggedInSummoner!= null && clientApi.isConnected();
    }

    public List<LolChampionsCollectionsChampionSkin> getAllSkins() {
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
            challengeMap.forEach((key, value) -> {
                // this is standard first start of time tracking
                value.setRetired(value.getRetireTimestamp().after(Timestamp.valueOf("1970-01-01 01:00:00.0")) && value.getRetireTimestamp().before(new Date()));
                challenges.add(value);
            });
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        this.challenges = challenges;

        return challenges;
    }

    private HttpRequest buildGetRequestForUrl(String url) {
        return executeWithExceptionWrapper(() ->  HttpRequest.newBuilder() .GET().uri(new URI(url)).build());
    }

    private <T> Map<String, T> sendRequestForMap(HttpRequest httpRequest, Class<T> clazz){
        String s =  executeWithExceptionWrapper(() -> httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString()).body());
        return executeWithExceptionWrapper(()-> objectMapper.readValue(s, objectMapper.getTypeFactory().constructMapType(Map.class,String.class, clazz)));
    }


    @FunctionalInterface
    public interface ThrowingSupplier<T, E extends Exception > {
        T call() throws E;
    }

    private <T> T executeWithExceptionWrapper(ThrowingSupplier<T, Exception> supplier) {
        try {
            return supplier.call();
        } catch (Exception  e) {
            throw new RuntimeException(e);
        }
    }
}

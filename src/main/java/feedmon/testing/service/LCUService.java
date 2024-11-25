package feedmon.testing.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import com.fasterxml.jackson.databind.type.MapType;
import com.fasterxml.jackson.databind.type.TypeFactory;
import com.stirante.lolclient.ClientApi;
import feedmon.testing.domain.challenges.Challenge;
import feedmon.testing.domain.inventory.ChampionSkin;
import feedmon.testing.domain.inventory.IngameItem;
import feedmon.testing.domain.inventory.champion.Champion;
import feedmon.testing.domain.inventory.champion.ChampionIdWithStatstones;
import feedmon.testing.domain.inventory.champion.ChampionWithLanes;
import feedmon.testing.domain.inventory.champion.statstones.*;
import feedmon.testing.domain.inventory.champion.statstones.ddragon.DDragonStatstone;
import feedmon.testing.domain.inventory.champion.statstones.ddragon.DDragonStatstonesMappings;
import feedmon.testing.domain.inventory.champion.statstones.ddragon.StatstoneData;
import feedmon.testing.usecases.dtos.SpecialChallengesDto;
import generated.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StopWatch;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.sql.Timestamp;
import java.util.*;
import java.util.concurrent.CompletableFuture;

import static feedmon.testing.util.enums.ChallengeAvailableIdType.CHAMPION;
import static feedmon.testing.util.enums.ChallengeAvailableIdType.ITEM;


@Service
public class LCUService {

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private ClientApi clientApi;
    private  LolSummonerSummoner loggedInSummoner;

    private List<Challenge> challenges;
    private List<Champion> champions;
    private List<ChampionSkin> skins;
    private List<ChampionIdWithStatstones> championIdWithStatstones;

    public LCUService() {
        httpClient = HttpClient.newHttpClient();
        objectMapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        CompletableFuture.runAsync(() -> startConnection(true));
    }

    public synchronized void startConnection(boolean appStart) {
        clientApi = new ClientApi();
        clientApi.start();
        try {
            if(appStart){
                automaticConnection();
                loggedInSummoner = executeWithExceptionWrapper(() -> clientApi.getCurrentSummoner());
                getChallenges(true);
                getChampions();
                getStatstoneProgress(true);
                getAllSkins();
            }else {
                manualConnection();
                loggedInSummoner = executeWithExceptionWrapper(() -> clientApi.getCurrentSummoner());
                getChallenges(true);
                CompletableFuture.runAsync(() ->{
                    getChampions();
                    getStatstoneProgress(true);
                    getAllSkins();
                });

            }
        }catch(Exception ignored){
        }
    }

    private void automaticConnection(){
        while (!clientApi.isConnected()) {
            try {
                //noinspection BusyWait
                Thread.sleep(5);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    }

    private void manualConnection(){
        int counter = 0;
        while (!clientApi.isConnected() && counter < 1000) {
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
    }

    public void stopConnection() {
        clientApi.stop();
    }

    public Challenge getChallengeForName(String challengeName) {
        return challenges.stream().filter(challenge -> challenge.getName().equals(challengeName)).findFirst().orElseThrow();
    }
    
    public String getHighestClashWinWithSameTeam() {
    	return executeRequest("/lol-clash/v1/player/history");
    }
    
    public List<Challenge> getProgressableChampionSpecificChallenges() {
        return challenges.stream()
                .filter(challenge -> !challenge.isRetired())
                .filter(challenge -> challenge.getIdListType().equals(CHAMPION.name()))
                .toList();
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
        List<ChampionSkin> skins = getAllSkins();

        List<Challenge> challenges = getChallenges(false).stream().filter(challenge -> !challenge.getCompletedIds().isEmpty()).filter(challenge -> !challenge.getIdListType().equals(ITEM.name())).toList();

        return challenges.stream().map(chall -> new SpecialChallengesDto(chall, skins, champions)).toList();
    }

    private synchronized List<Champion> getChampions() {
        if (champions != null) {
            return champions;
        }

        String champsJson = executeRequest("/lol-champions/v1/inventories/" + loggedInSummoner.summonerId + "/champions");

        CollectionType type = objectMapper.getTypeFactory().constructCollectionType(List.class, Champion.class);
        try {
            List<Champion> championsMapped = objectMapper.readValue(champsJson, type);
            championsMapped.sort(Comparator.comparing(champion -> champion.name));
            champions = championsMapped.stream().filter(champion -> champion.id >= 0).toList();

            List< ChampionWithLanes> champLaneAssignments = getChampionsWithLaneAssignments().values().stream().toList();

            champions.forEach(champ -> {
                champ.squarePortraitJpg = executeByteRequest(champ.squarePortraitPath);
                champ.laneAssignments = getLanePositions(champLaneAssignments.stream().filter(champion -> Objects.equals(champ.id, champion.id)).findFirst().orElse(null));
            });

            return champions;
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    private List<String> getLanePositions(ChampionWithLanes champ){
        if(champ == null){
            return List.of("TOP", "JUNGLE", "MIDDLE", "BOTTOM", "SUPPORT");
        }
        return champ.positions;
    }

    private Map<String, ChampionWithLanes> getChampionsWithLaneAssignments(){
        HttpRequest request = buildGetRequestForUrl("https://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions.json");
        JavaType javaType = objectMapper.getTypeFactory().constructMapType(Map.class,String.class, ChampionWithLanes.class);
       return sendRequestForJavaType(request, javaType);
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

    public synchronized List<ChampionSkin> getAllSkins() {
        if (skins != null) {
            return skins;
        }

        List<ChampionSkin> skinsMapped = executeWithExceptionWrapper(() -> Arrays.stream(clientApi.executeGet("/lol-champions/v1/inventories/" + loggedInSummoner.summonerId + "/skins-minimal", ChampionSkin[].class)).toList());
        skins = skinsMapped.stream().filter(skin -> skin.id >= 0).map(this::addSquarePortrait).toList();
        return skins;
    }

    private ChampionSkin addSquarePortrait(ChampionSkin skin) {
        skin.squarePortraitJpg = executeByteRequest(skin.tilePath);
        return skin;
    }

    private void getSkinsForChampionId(Integer id) {
        executeWithExceptionWrapper(() -> clientApi.executeGet("/lol-champions/v1/inventories/" + loggedInSummoner.summonerId + "/champions/" + id + "/skins", LolChampionsCollectionsChampionSkin[].class));
    }

    public synchronized List<IngameItem> getAllItems() {
        HttpRequest request = buildGetRequestForUrl("https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/items.json");
        JavaType javaType = objectMapper.getTypeFactory().constructCollectionType(List.class, IngameItem.class);
        List<IngameItem> itemsMap = sendRequestForJavaType(request, javaType);

        return itemsMap.stream().map(this::mapSquarePortraitOntoItem).toList();
    }

    private IngameItem mapSquarePortraitOntoItem(IngameItem item) {
        item.iconSquarePortrait = executeByteRequest(item.iconPath);
        return item;
    }

    public synchronized List<ChampionIdWithStatstones> getStatstoneProgress(boolean reload) {
        if(championIdWithStatstones != null && !reload){
            return championIdWithStatstones;
        }

        System.out.println("start loading eternals");
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();

        HttpRequest request = buildGetRequestForUrl("https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/statstones.json");
        JavaType javaType = objectMapper.getTypeFactory().constructType( DDragonStatstonesMappings.class);
        DDragonStatstonesMappings statstonesMappings = sendRequestForJavaType(request, javaType);

        Map<Integer, ChampionIdWithStatstones> championIdWithStatstonesMap = new HashMap<>();
        this.getChampions().forEach(champ -> championIdWithStatstonesMap.put(champ.id, new ChampionIdWithStatstones(champ.id)));

        for (StatstoneData statstoneData : statstonesMappings.statstoneData) {

           Integer champId = statstoneData.statstones.get(0).boundChampion.itemId;
           if(statstoneData.name.equalsIgnoreCase("starter series")){
               championIdWithStatstonesMap.get(champId).starterSeriesStatstones = mapDDragonStatstonesToSeriesStatstones(statstoneData.statstones);
           }else if(statstoneData.name.equalsIgnoreCase("series 1")){
               championIdWithStatstonesMap.get(champId).series1Statstones = mapDDragonStatstonesToSeriesStatstones(statstoneData.statstones);
           }else if(statstoneData.name.equalsIgnoreCase("series 2")){
                championIdWithStatstonesMap.get(champId).series2Statstones = mapDDragonStatstonesToSeriesStatstones(statstoneData.statstones);
           } else {
               throw new RuntimeException("Unknown Eternal series");
           }
        }

        championIdWithStatstones = championIdWithStatstonesMap.values().stream().map(this::enterAndCalculateStatstoneDataForChampionIdWithStatstones).toList();

        stopWatch.stop();
        System.out.println("Completed loading eternals. Time needed: " + stopWatch.getTotalTimeMillis() + "ms");

        return championIdWithStatstones;
    }

    // todo maybe refactor so that ownership is on the seriesmapping and not on each statstone of the series
    private ChampionIdWithStatstones enterAndCalculateStatstoneDataForChampionIdWithStatstones(ChampionIdWithStatstones champWithStatstones) {
        Statstones[] statstones = getStatStonesForChampionId(champWithStatstones.championId);
        for (Statstones statstone : statstones) {
            if(statstone.name.equalsIgnoreCase("starter series")){
                for (SeriesStatstone starterSeriesStatstone : champWithStatstones.starterSeriesStatstones.seriesStatstones) {
                    mapDataOntoStatstone(starterSeriesStatstone, statstone.statstones);
                }
            } else if(statstone.name.equalsIgnoreCase("series 1")){
                for (SeriesStatstone series1Statstone : champWithStatstones.series1Statstones.seriesStatstones) {
                    mapDataOntoStatstone(series1Statstone, statstone.statstones);
                }
            }else if(statstone.name.equalsIgnoreCase("series 2")){
                for (SeriesStatstone series2Statstone : champWithStatstones.series2Statstones.seriesStatstones) {
                    mapDataOntoStatstone(series2Statstone, statstone.statstones);
                }
            }else {
                throw new RuntimeException("Unknown Eternal series: " + statstone.name);
            }
        }

        champWithStatstones.starterSeriesStatstones.calculateMilestoneCompletionPercentage();
        champWithStatstones.series1Statstones.calculateMilestoneCompletionPercentage();
        champWithStatstones.series2Statstones.calculateMilestoneCompletionPercentage();
        return champWithStatstones;
    }

    private void mapDataOntoStatstone(SeriesStatstone seriesStatstone, List<Statstone> statstones ) {
        Statstone statstone = statstones.stream()
                .filter(stone -> stone.statstoneId.equals(seriesStatstone.contentId))
                .reduce((a, b) -> {
                    throw new IllegalStateException("Found more than one element");
                }).orElseThrow(() -> new RuntimeException("None or more than one element found"));

        int playerRecordMilestoneLevel = statstone.playerRecord != null ? statstone.playerRecord.milestoneLevel : 0;
        int playerRecordValue = statstone.playerRecord != null ? statstone.playerRecord.value : 0;

        seriesStatstone.hasOwnership = statstone.playerRecord != null;
        seriesStatstone.currentMilestone = playerRecordMilestoneLevel;
        seriesStatstone.currentValue = playerRecordValue;
        seriesStatstone.currentMilestoneCompletionPercentage = (int) (statstone.completionValue * 100);
        seriesStatstone.milestone5CompletionPercentage = playerRecordValue >= seriesStatstone.milestone5Value ? 100 : percentageOfMileStone(playerRecordValue,seriesStatstone.milestone5Value);
        seriesStatstone.milestone15CompletionPercentage = playerRecordValue >= seriesStatstone.milestone15Value ? 100 : percentageOfMileStone(playerRecordValue,seriesStatstone.milestone15Value);
    }

    private int percentageOfMileStone(Integer currentValue, Integer mileStoneValue){
       return (int) (((double) currentValue / mileStoneValue) * 100);
    }

    private Statstones[] getStatStonesForChampionId(int id) {
      return executeWithExceptionWrapper(() -> objectMapper.readValue(clientApi.executeBinaryGet("/lol-statstones/v2/player-statstones-self/"+ id), Statstones[].class));
    }

    private SeriesStatstonesWithCompletionValues mapDDragonStatstonesToSeriesStatstones(List<DDragonStatstone> dragonStatstones) {
        List<SeriesStatstone> seriesStatstones = new ArrayList<>();
        for (DDragonStatstone dragonStatstone : dragonStatstones) {
            if(!dragonStatstone.isRetired){
                seriesStatstones.add(new SeriesStatstone(dragonStatstone.name, dragonStatstone.description, dragonStatstone.contentId, getMilestone5Value(dragonStatstone.milestones),getMilestone15Value(dragonStatstone.milestones)));
            }
        }

        if(seriesStatstones.size() != 3){
            throw new RuntimeException("Unexpected Statstone count");
        }
        return new SeriesStatstonesWithCompletionValues(seriesStatstones);
    }

    private int getMilestone5Value(List<Integer> values){
        return values.subList(0, 5).stream()
                .mapToInt(Integer::intValue)
                .sum();
    }

    private int getMilestone15Value(List<Integer> values){
        int milestone5Value = values.subList(0, 5).stream()
                .mapToInt(Integer::intValue)
                .sum();

        return milestone5Value + (values.get(5) * 10);
    }

    public synchronized List<Challenge> getChallenges(boolean reload) {
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

    private <T> T sendRequestForJavaType(HttpRequest httpRequest, JavaType javaType){
        String s =  executeWithExceptionWrapper(() -> httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString()).body());
        return executeWithExceptionWrapper(()-> objectMapper.readValue(s, javaType));
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

package feedmon.testing.adapters.rest.Controllers;

import feedmon.testing.domain.challenges.Challenge;
import feedmon.testing.domain.inventory.ChampionSkin;
import feedmon.testing.domain.inventory.IngameItem;
import feedmon.testing.domain.inventory.champion.Champion;
import feedmon.testing.domain.inventory.champion.ChampionIdWithStatstones;
import feedmon.testing.service.LCUService;
import feedmon.testing.usecases.GetLCUConnectionStatusUseCase;
import feedmon.testing.usecases.dtos.SpecialChallengesDto;
import generated.LolChampionsCollectionsChampionSkin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@RestController
@RequestMapping("/api/lcu-challenges")
public class LCUController {

    private final GetLCUConnectionStatusUseCase getLCUConnectionStatusUseCase;
    private final LCUService lcuService;

    @Autowired
    public LCUController(GetLCUConnectionStatusUseCase getLCUConnectionStatusUseCase,
                         LCUService lcuService) {
        this.getLCUConnectionStatusUseCase = getLCUConnectionStatusUseCase;
        this.lcuService = lcuService;
    }

    @GetMapping(value = "backend-running")
    public Boolean isBackendRunning() {
        return true;
    }

    @GetMapping(value = "connection-status")
    public Boolean getLCUConnectionStatus() {
        return getLCUConnectionStatusUseCase.execute();
    }

    @PutMapping(value = "stop-connection")
    public void stopConnection() {
        lcuService.stopConnection();
    }

    @PutMapping(value = "start-connection")
    public void startConnection() {
        lcuService.startConnection();
    }

    @PostMapping(value = "execute-request")
    public String executeApiRequest(@RequestBody String path) {
        return lcuService.executeRequest(path);
    }

    @GetMapping(value = "all-challenges")
    public List<Challenge> getChallenges() {
        return lcuService.getChallenges(false);
    }

    @GetMapping(value = "reload-challenge-data")
    public List<Challenge> reloadChallengeData() {
        return lcuService.getChallenges(true);
    }

    @GetMapping(value = "champ-specific-challenges")
    public List<SpecialChallengesDto> champSpecificChallenges() {
        return lcuService.getChampSpecificChallenges();
    }

    @GetMapping(value = "challenge")
    public Challenge getChallengeInfo(@RequestParam String challengeName){
        return lcuService.getChallengeForName(challengeName);
    }

    @GetMapping(value = "skin")
    public LolChampionsCollectionsChampionSkin getSkinForId(@RequestParam Integer skinId){
        return lcuService.getSkinForId(skinId);
    }

    @GetMapping(value = "champion")
    public Champion getChampionForId(@RequestParam Integer championId){
        return lcuService.getChampionForId(championId);
    }

    @GetMapping(value = "progressable-champion-challenges")
    public List<Challenge> getProgressableChampionChallenges(){
        return lcuService.getProgressableChampionSpecificChallenges();
    }

    @GetMapping(value = "champions")
    public List<Champion> getAllChampions(){
        return lcuService.getAllChampions();
    }

    @GetMapping(value = "skins")
    public List<ChampionSkin> getAllSkins(){
        return lcuService.getAllSkins();
    }

    @GetMapping(value = "items")
    public List<IngameItem> getAllItems(){
        return lcuService.getAllItems();
    }

    @GetMapping(value = "statstones")
    public List<ChampionIdWithStatstones> getStatstones(){
        return lcuService.getStatstoneProgress(false);
    }

    @GetMapping(value = "reload-statstone-data")
    public List<ChampionIdWithStatstones> reloadStatstoneData(){
        return lcuService.getStatstoneProgress(true);
    }
}
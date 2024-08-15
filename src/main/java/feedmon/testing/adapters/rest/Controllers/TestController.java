package feedmon.testing.adapters.rest.Controllers;

import feedmon.testing.domain.challenges.Challenge;
import feedmon.testing.domain.inventory.Champion;
import feedmon.testing.service.LCUService;
import feedmon.testing.usecases.GetLCUConnectionStatusUseCase;
import feedmon.testing.usecases.dtos.SpecialChallengesDto;
import generated.LolChampionsCollectionsChampionSkin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/testing")
public class TestController {

    private final GetLCUConnectionStatusUseCase getLCUConnectionStatusUseCase;
    private final LCUService lcuService;

    @Autowired
    public TestController(GetLCUConnectionStatusUseCase getLCUConnectionStatusUseCase,
                          LCUService lcuService) {
        this.getLCUConnectionStatusUseCase = getLCUConnectionStatusUseCase;
        this.lcuService = lcuService;
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

    @GetMapping(value = "challenge-data-as-string")
    public List<Challenge> getChallengeDataAsString() {
        return lcuService.getChallenges(true);
    }

    @GetMapping(value = "reload-challenge-data")
    public List<Challenge> reloadChallengeData() {
        return lcuService.getChallenges(true);
    }

    @GetMapping(value = "id-specific-challenges")
    public List<SpecialChallengesDto> idSpecificChallenges() {
        return lcuService.getChallengesCompletionInfo();
    }

    @GetMapping(value = "challenge")
    public SpecialChallengesDto getChallengeInfo(@RequestParam String challengeName){
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

    @GetMapping(value = "champions")
    public List<Champion> getAllChampions(){
        return lcuService.getAllChampions();
    }
}

package feedmon.testing.usecases;

import feedmon.testing.service.LCUService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GetLCUConnectionStatusUseCase implements VoidInputUseCase<Boolean>{

    private final LCUService lcuService;

    @Autowired
    public GetLCUConnectionStatusUseCase(LCUService lcuService) {
        this.lcuService = lcuService;
    }

    @Override
    public Boolean execute() {
        return lcuService.testConnection();
    }
}

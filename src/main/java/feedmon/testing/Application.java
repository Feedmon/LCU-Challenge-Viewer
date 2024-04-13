package feedmon.testing;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.event.EventListener;

import java.lang.invoke.MethodHandles;


@PropertySource(value = "classpath:META-INF/build-info.properties", ignoreResourceNotFound = true)
@SpringBootApplication
public class Application {
private static final Logger logger = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
@Value("${server.url}")
private String baseUrl;
@Value("${server.port}")
private String serverPort;

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void doSomethingAfterStartup() {
        logger.info(String.format("Challenge Viewer App is ready on %s (Port: %s)",baseUrl, serverPort));
    }
}

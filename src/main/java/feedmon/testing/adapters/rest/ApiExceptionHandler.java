package feedmon.testing.adapters.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.lang.invoke.MethodHandles;

@ControllerAdvice(basePackages = {"feedmon.testing.adapters.rest"})
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {
    protected static final Logger logger = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    @ExceptionHandler
    public ResponseEntity<ApiErrorDto> exception(Exception e) {
        logger.error("Error occurred", e);
        return createErrorResponse(e.getClass().getName() + ": " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler
    public ResponseEntity<ApiErrorDto> runtimeException(RuntimeException e) {
        return createErrorResponse(e.getClass().getName() + ": " + e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    protected ResponseEntity<ApiErrorDto> createErrorResponse(String message, HttpStatus status) {
        return ResponseEntity.status(status)
                .contentType(MediaType.APPLICATION_JSON)
                .body(new ApiErrorDto(message, status.value()));
    }


    static class ApiErrorDto {
        private final String message;
        private final int errorCode;

        private ApiErrorDto(String message, int errorCode) {
            this.message = message;
            this.errorCode = errorCode;
        }

        public String getMessage() {
            return message;
        }

        public int getErrorCode() {
            return errorCode;
        }
    }
}

package com.gesintel.complience.msarchetype.application;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

import java.io.Serializable;

@Getter
@Setter
public class ApplicationException extends RuntimeException implements Serializable {

    private static final long serialVersionUID = -1919052535263926943L;

    private final HttpStatus httpStatus;
    private final String codigoError;


    public ApplicationException(String errorMessage) {
        super(errorMessage);
        this.codigoError = errorMessage;
        this.httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    }


    public ApplicationException(String errorMessage, String codigoError, HttpStatus httpStatus) {
        super(errorMessage);
        this.codigoError = codigoError;
        this.httpStatus = httpStatus;
    }
}

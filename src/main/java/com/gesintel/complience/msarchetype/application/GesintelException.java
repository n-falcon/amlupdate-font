package com.gesintel.complience.msarchetype.application;

import org.springframework.http.HttpStatus;

import java.io.Serializable;

/**
 * @author German Herrera
 *
 */
public class GesintelException extends RuntimeException  implements Serializable {

	private static final long serialVersionUID = 1235726500880740591L;

	private final HttpStatus httpStatus;
	private final String codigoError;


	public GesintelException(String message, HttpStatus httpStatus, String codigoError) {
		super(message);
		this.httpStatus = httpStatus;
		this.codigoError = codigoError;
	}

}

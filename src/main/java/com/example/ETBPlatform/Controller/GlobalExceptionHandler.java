package com.example.ETBPlatform.Controller;

import com.example.ETBPlatform.domain.dtos.ErrorDto;
import com.example.ETBPlatform.exceptions.UserNotFoundException;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice //tells spring ,this class handles exception for all rest controller
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorDto> handleuserNotFoundException(
            UserNotFoundException ex){
        log.error("Caught error" ,ex);

        ErrorDto errorDto = new ErrorDto();
        errorDto.setError("User not found");
        return new ResponseEntity<>(errorDto , HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorDto> handleConstraintViolation(
            MethodArgumentNotValidException ex
    ){
        log.error("Caught MethodArgumentNotValidException" ,ex);
        ErrorDto errorDto = new ErrorDto();

        BindingResult bindingResult = ex.getBindingResult();
        List<FieldError> fieldErrors = bindingResult.getFieldErrors();
        String errorMessage = fieldErrors.stream()
                        .findFirst()
                                .map(fieldError ->
                                        fieldError.getField() + ":" + fieldError.getDefaultMessage())
                                        .orElse("Validation error occured");
        errorDto.setError(errorMessage);
        return new ResponseEntity<>(errorDto , HttpStatus.BAD_REQUEST);
    }


    //handling exception thrown at server side validation
    //we use constraint validation for that
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorDto> handleConstraintViolation(
            ConstraintViolationException ex
    ){
        log.error("Caught error" ,ex);
        ErrorDto errorDto = new ErrorDto();

        String errorMessage = ex.getConstraintViolations()
                        .stream()
                                .findFirst()
                                        .map(violation ->
                                                violation.getPropertyPath() + ":" + violation.getMessage())
                                                .orElse("Constraint violation occured");
        errorDto.setError(errorMessage);
        return new ResponseEntity<>(errorDto , HttpStatus.BAD_REQUEST);
    }



    //"Whenever an Exception occurs that this handler is responsible for, call this method."
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDto> handleException(Exception ex){
        log.error("Caught error" ,ex);
        ErrorDto errorDto = new ErrorDto();
        errorDto.setError("An unknown error occurred");
        return new ResponseEntity<>(errorDto , HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

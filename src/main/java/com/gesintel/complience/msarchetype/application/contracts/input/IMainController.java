package com.gesintel.complience.msarchetype.application.contracts.input;

import com.gesintel.complience.msarchetype.application.dto.out.CustomerResume;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;


public interface IMainController {
    ResponseEntity<CustomerResume> getCustomerById(@PathVariable ("id") long id);
    ResponseEntity<CustomerResume> saveCustomer(@RequestBody CustomerResume customerResume);

}


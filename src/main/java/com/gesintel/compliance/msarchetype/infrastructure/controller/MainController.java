package com.gesintel.compliance.msarchetype.infrastructure.controller;

import com.gesintel.compliance.msarchetype.application.dto.out.CustomerResume;
import com.gesintel.compliance.msarchetype.application.contracts.input.IMainController;
import com.gesintel.compliance.msarchetype.application.contracts.interaction.ICustomerService;
import com.gesintel.compliance.msarchetype.infrastructureborder.GlobalSetting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/customer")
public class MainController implements IMainController {
    /***
     * NOTES: Controllers must not include bussiness logic
     */

    @Autowired
    private ICustomerService customerService;

    @Autowired
    private GlobalSetting setting;

    //@ApiOperation from swagger
    @GetMapping("/v1/get/{id}")
    public ResponseEntity<CustomerResume> getCustomerById(@PathVariable ("id") long id){
        System.out.println("Settings shows from GlobalSettings configuration atributes" );
        System.out.println("server port: " + setting.getSystemPort());

        CustomerResume customer = customerService.get(id);
        return ResponseEntity.ok(customer);
    }

    @PostMapping("/v1/save")
    public ResponseEntity<CustomerResume> saveCustomer(@RequestBody CustomerResume customerResume){

        customerService.saveOrUpdate(customerResume);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

}

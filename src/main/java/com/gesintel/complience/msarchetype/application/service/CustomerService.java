package com.gesintel.complience.msarchetype.application.service;

import com.gesintel.complience.msarchetype.application.ApplicationException;
import com.gesintel.complience.msarchetype.application.contracts.interaction.ICustomerService;
import com.gesintel.complience.msarchetype.application.contracts.output.repository.db.ICustomerRepository;
import com.gesintel.complience.msarchetype.application.dto.out.CustomerResume;
import com.gesintel.complience.msarchetype.domain.entity.Customer;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomerService implements ICustomerService {

    @Autowired
    private ICustomerRepository customerRepository;

    @Override
    public CustomerResume get(long id) {
        Optional<Customer> customer = customerRepository.findById(id);

        if(!customer.isPresent()){
            throw new ApplicationException("Error!. Customer not found", "CUSTOMER-01", HttpStatus.NOT_FOUND);
        }
        CustomerResume customerResume = new CustomerResume();
        BeanUtils.copyProperties(customer, customerResume);
        return customerResume;
    }

    public void saveOrUpdate(CustomerResume customerResume){
        Customer customer = new Customer();
        BeanUtils.copyProperties(customerResume, customer);
        customerRepository.save(customer);
    }
}
package com.gesintel.complience.msarchetype.application.contracts.output.repository.db;

import com.gesintel.complience.msarchetype.domain.entity.Customer;
import org.springframework.data.repository.CrudRepository;

public interface ICustomerRepository extends CrudRepository<Customer, Long> {
}

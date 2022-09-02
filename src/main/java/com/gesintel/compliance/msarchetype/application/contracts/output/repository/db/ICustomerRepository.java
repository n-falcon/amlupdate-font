package com.gesintel.compliance.msarchetype.application.contracts.output.repository.db;

import com.gesintel.compliance.msarchetype.domain.entity.Customer;
import org.springframework.data.repository.CrudRepository;

public interface ICustomerRepository extends CrudRepository<Customer, Long> {
}

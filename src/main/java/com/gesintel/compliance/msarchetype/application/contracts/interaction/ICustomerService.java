package com.gesintel.compliance.msarchetype.application.contracts.interaction;

import com.gesintel.compliance.msarchetype.application.dto.out.CustomerResume;

public interface ICustomerService {
    CustomerResume get(long id);
    void saveOrUpdate(CustomerResume customerResume);

    }

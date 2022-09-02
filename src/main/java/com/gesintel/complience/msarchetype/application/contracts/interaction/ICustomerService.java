package com.gesintel.complience.msarchetype.application.contracts.interaction;

import com.gesintel.complience.msarchetype.application.dto.out.CustomerResume;

public interface ICustomerService {
    CustomerResume get(long id);
    void saveOrUpdate(CustomerResume customerResume);

    }

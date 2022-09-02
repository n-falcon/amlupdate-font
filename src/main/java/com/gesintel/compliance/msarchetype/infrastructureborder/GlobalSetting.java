package com.gesintel.compliance.msarchetype.infrastructureborder;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class GlobalSetting {

    @Value("${server.port}")
    private int systemPort;
}

package com.gesintel.complience.msarchetype.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name ="customer")
public class Customer {

    @Id
    @Column
    private long id;
    @Column
    private String name;
    @Column
    private String LastName;
    @Column
    private String address;
    @Column
    private String email;
    @Column
    private LocalDate birthDate;
}

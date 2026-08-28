package com.example.ETBPlatform.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing
//JPA Auditing saves you from manually writing createdAt, updatedAt, createdBy, and lastModifiedBy
// logic every time you create or update an entity.

//META-INF/orm.xml is used to define JPA entity mappings/configuration externally using XML instead of annotations.
//For normal Spring Boot JPA Auditing with @EnableJpaAuditing, you usually don't need it.
public class JpaConfiguration {

}

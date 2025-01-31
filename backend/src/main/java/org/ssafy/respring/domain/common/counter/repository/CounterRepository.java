package org.ssafy.respring.domain.common.counter.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.respring.domain.common.counter.vo.Counter;

@Repository
public interface CounterRepository extends MongoRepository<Counter, String> {
}

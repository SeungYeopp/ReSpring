package org.ssafy.respring.domain.common.counter.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.ssafy.respring.domain.common.counter.vo.Counter;

@Service
@RequiredArgsConstructor
public class CounterService {
	private final MongoOperations mongoOperations;

	public Long getNextSequence(String collectionName) {
		Query query = new Query(Criteria.where("_id").is(collectionName));
		Update update = new Update().inc("seq", 1);
		FindAndModifyOptions options = FindAndModifyOptions.options().returnNew(true).upsert(true);

		Counter counter = mongoOperations.findAndModify(query, update, options, Counter.class);
		return counter != null ? counter.getSeq() : 1;
	}
}

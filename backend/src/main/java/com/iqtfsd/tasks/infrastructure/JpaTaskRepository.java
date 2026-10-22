package com.iqtfsd.tasks.infrastructure;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

interface JpaTaskRepository extends JpaRepository<TaskEntity, Long> {
    List<TaskEntity> findAllByOrderByCreatedAtDescIdDesc();

    @Modifying
    @Query("delete from TaskEntity task where task.id = :id")
    int deleteExisting(@Param("id") long id);
}


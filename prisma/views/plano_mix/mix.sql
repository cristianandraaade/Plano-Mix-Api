SELECT
  `c`.`id` AS `classification_id`,
  `c`.`name` AS `classification`,
  `s`.`id` AS `segment_id`,
  `s`.`name` AS `segment`,
  `a`.`id` AS `activity_id`,
  `a`.`name` AS `activity`
FROM
  (
    (
      `plano_mix`.`classification` `c`
      JOIN `plano_mix`.`segment` `s` ON((`s`.`classification_id` = `c`.`id`))
    )
    LEFT JOIN `plano_mix`.`activity` `a` ON((`a`.`segment_id` = `s`.`id`))
  )
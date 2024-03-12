WITH cte_update AS (
	SELECT id
		  ,SPLIT_PART(coordinates, ', ', 1)::NUMERIC AS latitude
		  ,SPLIT_PART(coordinates, ', ', 2)::NUMERIC AS longitude
		  ,coordinates
	  FROM ( 
		SELECT a.id
			  ,a.coordinates
	  	  FROM public.airports a
	) AS sub
)
UPDATE public.airports a
   SET longitude = upd.longitude
   	  ,latitude = upd.latitude
  FROM cte_update upd
 WHERE a.id = upd.id;

--
WITH cte_update AS (
	SELECT id
		  ,SPLIT_PART(coordinates, ', ', 1)::NUMERIC AS latitude
		  ,SPLIT_PART(coordinates, ', ', 2)::NUMERIC AS longitude
		  ,coordinates
	  FROM ( 
		SELECT a.id
			  ,a.coordinates
	  	  FROM public.hospitals a
	) AS sub
)
UPDATE public.hospitals a
   SET longitude = upd.longitude
   	  ,latitude = upd.latitude
  FROM cte_update upd
 WHERE a.id = upd.id;

--
WITH cte_update AS (
	SELECT id
		  ,SPLIT_PART(coordinates, ', ', 1)::NUMERIC AS latitude
		  ,SPLIT_PART(coordinates, ', ', 2)::NUMERIC AS longitude
		  ,coordinates
	  FROM ( 
		SELECT a.id
			  ,a.coordinates
	  	  FROM public.sar_bases a
	) AS sub
)
UPDATE public.sar_bases a
   SET longitude = upd.longitude
   	  ,latitude = upd.latitude
  FROM cte_update upd
 WHERE a.id = upd.id;

ALTER TABLE public.airports DROP COLUMN coordinates;
ALTER TABLE public.hospitals DROP COLUMN coordinates;
ALTER TABLE public.sar_bases DROP COLUMN coordinates;

SELECT *
  FROM public.airports;

SELECT *
  FROM public.hospitals h;
  
SELECT *
  FROM public.sar_bases sb;
 

------------
WITH cte_update AS ( 
	SELECT 
		 id
	  	,SPLIT_PART(coordinates, ' ', 1)::NUMERIC AS latitude
	  	,SPLIT_PART(coordinates, ' ', 2)::NUMERIC AS longitude
	  	,coordinates
	FROM (
		SELECT id
			  ,REPLACE(REPLACE(c.coordinates , 'POINT(', ''), ')', '') AS coordinates
		  FROM public.emergency_ports c
	) AS subquery
)
UPDATE public.emergency_ports tab
   SET longitude = upd.longitude
      ,latitude = upd.latitude
  FROM cte_update upd
 WHERE tab.id = upd.id;

ALTER TABLE public.emergency_ports DROP COLUMN coordinates;

SELECT *
  FROM public.emergency_ports ep;
  
--
WITH cte_update AS ( 
	SELECT 
		 id
	  	,SPLIT_PART(coordinates, ' ', 1)::NUMERIC AS latitude
	  	,SPLIT_PART(coordinates, ' ', 2)::NUMERIC AS longitude
	  	,coordinates
	FROM (
		SELECT id
			  ,REPLACE(REPLACE(c.coordinates , 'POINT(', ''), ')', '') AS coordinates
		  FROM public.emergency_depots c
	) AS subquery
)
UPDATE public.emergency_depots tab
   SET longitude = upd.longitude
      ,latitude = upd.latitude
  FROM cte_update upd
 WHERE tab.id = upd.id;

ALTER TABLE public.emergency_depots DROP COLUMN coordinates;

SELECT *
  FROM public.emergency_depots ep;
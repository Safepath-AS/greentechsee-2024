CREATE TABLE public.airports (
	 id SERIAL PRIMARY KEY
	,"name" 		TEXT
	,commune		TEXT
	,longitude		NUMERIC
	,latitude		NUMERIC
);

CREATE INDEX idx_airports_name
	ON public.airports ("name");

CREATE INDEX idx_airports_commune
	ON public.airports (commune);

CREATE INDEX idx_airports_longitude
	ON public.airports (longitude);
	
CREATE INDEX idx_airports_latitude
	ON public.airports (latitude);


--
CREATE TABLE public.hospitals (
	 id SERIAL PRIMARY KEY
	,"name"			TEXT
	,commune		TEXT
	,longitude		NUMERIC
	,latitude		NUMERIC
);	

CREATE INDEX idx_hospitals_name
	ON public.hospitals ("name");

CREATE INDEX idx_hospitals_commune
	ON public.hospitals (commune);
	
CREATE INDEX idx_hospitals_longitude
	ON public.hospitals (longitude);
	
CREATE INDEX idx_hospitals_latitude
	ON public.hospitals (latitude);

--
CREATE TABLE public.sar_bases (
	 id SERIAL PRIMARY KEY
	,"name"			TEXT
	,commune		TEXT
	,longitude		NUMERIC
	,latitude		NUMERIC
);	


CREATE INDEX idx_sar_bases_name
	ON public.sar_bases ("name");

CREATE INDEX idx_sar_bases_commune
	ON public.sar_bases (commune);
	
CREATE INDEX idx_sar_bases_longitude
	ON public.sar_bases (longitude);
	
CREATE INDEX idx_sar_bases_latitude
	ON public.sar_bases (latitude);
	

--
CREATE TABLE public.emergency_ports (
	 id SERIAL PRIMARY KEY
	,"name"			TEXT
	,commune		TEXT
	,longitude	NUMERIC
	,latitude		NUMERIC
);

CREATE INDEX idx_emergency_ports_name
	ON public.emergency_ports ("name");

CREATE INDEX idx_emergency_ports_commune
	ON public.emergency_ports (commune);
	
CREATE INDEX idx_emergency_ports_longitude
	ON public.emergency_ports (longitude);
	
CREATE INDEX idx_emergency_ports_latitude
	ON public.emergency_ports (latitude);
	
--
CREATE TABLE public.emergency_depots (
	 id SERIAL PRIMARY KEY
	,"name"			TEXT
	,commune		TEXT
	,longitude		NUMERIC
	,latitude		NUMERIC
);

CREATE INDEX idx_emergency_depots_name
	ON public.emergency_depots ("name");

CREATE INDEX idx_emergency_depots_commune
	ON public.emergency_depots (commune);
	
CREATE INDEX idx_emergency_depots_longitude
	ON public.emergency_depots (longitude);
	
CREATE INDEX idx_emergency_depots_latitude
	ON public.emergency_depots (latitude);

--
CREATE TABLE public.attributes (
    id SERIAL PRIMARY KEY,
    entity_type 		VARCHAR(50),
    entity_id 			INTEGER,
    attribute_name 	VARCHAR(100),
    attribute_value VARCHAR(100)
);

CREATE INDEX idx_entity_type 
	ON public.attributes (entity_type);

CREATE INDEX idx_entity_id 
	ON public.attributes (entity_id);

CREATE INDEX idx_attribute_name 
	ON public.attributes (attribute_name);

-- Add a check constraint to the entity_type column
ALTER TABLE public.attributes
ADD CONSTRAINT check_entity_type
CHECK (entity_type IN ('airport', 'hospital', 'sar_base', 'emergency_port', 'emergency_depot'));

/*
-- Sample insert
INSERT INTO public.attributes (entity_type, entity_id, attribute_name, attribute_value)
VALUES 
    ('airport', 1, 'terminals', '6'),
    ('airport', 1, 'year_opened', '1948'),
    ('airport', 2, 'terminals', '4'),
    ('airport', 2, 'year_opened', '1946'),
    ('hospital', 1, 'beds', '1172'),
    ('hospital', 1, 'rating', '4.5'),
    ('hospital', 2, 'beds', '980'),
    ('hospital', 2, 'rating', '4.2');

-- Sample select with join
WITH cte_attributes AS (
	SELECT att.entity_id 
		  ,att.attribute_name 
		  ,att.attribute_value 
	  FROM public."attributes" att
	 WHERE att.entity_type = 'airport' -- FILTER attributes 'airport', 'hospital', 'sar_base', 'emergency_port', 'emergency_depot'
)
SELECT *
  FROM public.airports a 
  LEFT JOIN cte_attributes ca
    ON a.id = ca.entity_id;
*/

CREATE TABLE public.ship_locations (
    id SERIAL PRIMARY KEY
   ,mmsi		INT4
   ,"type"		VARCHAR(50)
   ,"timestamp"	timestamp
   ,longitude	NUMERIC
   ,latitude	NUMERIC
   ,"index"		INT4
);

CREATE INDEX idx_ship_locations_mmsi
	ON public.ship_locations (mmsi);

CREATE INDEX idx_ship_locations_longitude
	ON public.ship_locations (longitude);

CREATE INDEX idx_ship_locations_latitude
	ON public.ship_locations (latitude);

CREATE INDEX idx_ship_locations_index
	ON public.ship_locations ("index");

CREATE INDEX idx_ship_locations_type
	ON public.ship_locations ("type");

SELECT *
  FROM public.ship_locations sl;


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
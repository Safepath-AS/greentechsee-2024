import pandas as pd 

ports = pd.read_csv('sourcedata/N_dhavner.csv', sep = '\t')
ports.head()
ports[['Coordinates E','Coordinates N']] = ports['geom_wkt'].str.split(',', expand = True)
ports = ports.drop('Coordinates', axis = 1)
ports

depots = pd.read_csv('sourcedata/Sykehus.csv', sep = ';')
depots[['Coordinates N','Coordinates E']] = depots['Coordinates'].str.split(',', expand = True)
depots = depots.drop('Coordinates', axis = 1)
depots
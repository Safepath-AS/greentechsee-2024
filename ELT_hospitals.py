import pandas as pd 

hospitals = pd.read_csv('sourcedata/Sykehus.csv', sep = ';')
hospitals[['Coordinates N','Coordinates E']] = hospitals['Coordinates'].str.split(',', expand = True)
hospitals = hospitals.drop('Coordinates', axis = 1)
hospitals
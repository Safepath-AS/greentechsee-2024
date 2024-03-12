
from pyais.stream import TCPConnection
import pandas as pd
from time import strftime, localtime

host = '153.44.253.27'
port = 5631

ships_oilspill = [258674000, 257005300, 258828000, 257261500, 257111020, 257056880]
ships_tow = [258082000, 257446000, 258383000, 258184000, 259123000]
ships_coastguard = [982570672, 257007200, 258002380, 257079200, 259317000, 257736000, 257492000, 257984000, 257985000,257987000]

shiplocations = pd.DataFrame(columns = ['mmsi', 'type', 'ts', 'longitude', 'latitude'])
shiplocations.dtypes
n=0
for msg in TCPConnection(host, port=port):
    decoded_message = msg.decode()
    ais_content = decoded_message
        
    if msg.tag_block:
        # decode & print the tag block if it is available
        msg.tag_block.init()
        message = msg.tag_block.asdict()
        if ais_content.mmsi in ships_oilspill and ais_content.msg_type != 5:
            print(message, ais_content)
            shiplocations = pd.concat([shiplocations, pd.DataFrame({'index' : n,'type' : 'oilspill', 'mmsi' : int(ais_content.mmsi), 
                                                                   'longitude' : float(ais_content.lon), 'latitude' : float(ais_content.lat), 
                                                                   'ts' : strftime('%Y-%m-%d %H:%M:%S', localtime(int(message['receiver_timestamp'])))}, index=[0])], ignore_index = True)
            n+=1
        elif ais_content.mmsi in ships_tow and ais_content.msg_type != 5:
            print(message, ais_content)
            shiplocations = pd.concat([shiplocations, pd.DataFrame({'index' : n,'type' : 'tug', 'mmsi' : int(ais_content.mmsi), 
                                                                    'longitude' : float(ais_content.lon), 'latitude' : float(ais_content.lat), 
                                                                    'ts' : strftime('%Y-%m-%d %H:%M:%S', localtime(int(message['receiver_timestamp'])))}, index=[0])], ignore_index = True)
            n+=1
        elif ais_content.mmsi in ships_coastguard  and ais_content.msg_type != 5:
            print(message, ais_content)
            shiplocations = pd.concat([shiplocations, pd.DataFrame({'index' : n,'type' : 'coastguard', 'mmsi' : int(ais_content.mmsi), 
                                                                    'longitude' : float(ais_content.lon), 'latitude' : float(ais_content.lat), 
                                                                    'ts' : strftime('%Y-%m-%d %H:%M:%S', localtime(int(message['receiver_timestamp'])))}, index=[0])], ignore_index = True)
            n+=1

    shiplocations.to_csv('sourcedata\shiplocations.csv')






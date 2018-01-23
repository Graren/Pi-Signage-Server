import json
from srv.testWS.wsGroups import GroupWsHolder

instance = GroupWsHolder()

def send_ws_message_to_pi_groups(groups, msg):
    pi = instance.getGroup("pi")
    if pi is not None:
        for group in groups:
            msg['request'] = {
                'deviceGroupId': group.id
            }
            pi.send({
                'text': json.dumps(msg)
            })

def send_ws_message_to_pi_device(device, msg):
    pi = instance.getGroup("pi")
    if pi is not None:
        msg['request'] = {
            'deviceId': device.id
        }
        pi.send({
            'text': json.dumps(msg)
        })
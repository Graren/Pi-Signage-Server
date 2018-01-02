import json
from channels import Group
from channels.sessions import channel_session
from urllib.parse import parse_qs
from channels.auth import channel_session_user_from_http, channel_session_user
from srv.testWS.wsGroups import GroupWsHolder
import json

groups = []
instance = GroupWsHolder()

REQUEST_CONTENT = 'REQUEST_CONTENT'
ADDED_GROUP = 'ADDED_GROUP'
REQUEST_GROUP = 'REQUEST_GROUP'
# Connected to websocket.connect

def ws_add(message):
    # Accept the incoming connection
    message.reply_channel.send({"accept": True})
    # Add them to the chat group
    Group("pi").add(message.reply_channel)
    pi = instance.getGroup("pi")
    if pi is None:
        instance.addElement("pi", Group("pi"))

# Connected to websocket.disconnect
def ws_disconnect(message):
    Group("pi").discard(message.reply_channel)

def ws_message(message):
    js = json.loads(message.content['text'])
    if js['type'] and js['type'] == REQUEST_CONTENT:
        if 'id' in js:
            msg = {
                'deviceId': js['id'],
                'playlist': {
                    'sex': {
                        "beach": 1
                    }
                }
            }
            instance.getGroup(str(js['id'])).send(msg)
    if js['type'] and js['type'] == REQUEST_GROUP:
        if 'id' in js:
            pi = instance.getGroup(str(js['id']))
            if pi is None:
                Group(str(js['id'])).add(message.reply_channel)
                instance.addElement(str(js['id']), Group(str(js['id'])))
            msg = {
                'request': REQUEST_GROUP,
                'response': {
                    'deviceId': js['id'],
                    'success': True
                }
            }
            instance.getGroup(str(js['id'])).send({
                'text': json.dumps(msg)
            })
    elif js['type'] and js['type'] == ADDED_GROUP:
        if 'deviceGroupId' in js:
            for j in js['deviceGroupId']:
                Group(str(j)).add(message.reply_channel)
                group = instance.getGroup(str(j))
                if (group is None):
                    instance.addElement(str(j), Group(str(j)))
                instance.getGroup(str(j)).send({
                    "text": 'Group added succesfully'
                })
        else:
            instance.getGroup('pi').send({
                "text": "listen"
            })
    else:
        instance.getGroup('pi').send({
            "text": "listen"
        })


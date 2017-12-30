import json
from channels import Group
from channels.sessions import channel_session
from urllib.parse import parse_qs
from srv.testWS.wsGroups import GroupWsHolder
import json

groups = []
instance = GroupWsHolder()

# Connected to websocket.connect
def ws_add(message):
    # Accept the incoming connection
    message.reply_channel.send({"accept": True})
    # Add them to the chat group
    Group("pi").add(message.reply_channel)
    instance.addElement("pi", Group("pi"))


# Connected to websocket.disconnect
def ws_disconnect(message):
    Group("pi").discard(message.reply_channel)

def ws_message(message):
    print(message.content['text'])
    js = json.loads(message.content['text'])
    print(js)
    if 'deviceGroupId' in js:
        for j in js['deviceGroupId']:
            Group(str(j)).add(message.reply_channel)
            group = instance.getGroup(str(j))
            if (group is None):
                instance.addElement(str(j), Group(str(j)))
            print("EVERYDAY IS GREAT AT YOUR JUNES")
            instance.getGroup(str(j)).send({
                "text": json.dumps(js)
            })
    else:
        instance.getGroup('pi').send({
            "text": "listen"
        })


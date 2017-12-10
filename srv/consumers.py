import json
from channels import Group
from channels.sessions import channel_session
from urllib.parse import parse_qs
from srv.testWS.wsGroups import GroupWsHolder

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
    instance.getGroup("pi").send({
        "text": "PORNO"
    })


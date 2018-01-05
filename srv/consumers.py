import json
from channels import Group
from channels.sessions import channel_session
from urllib.parse import parse_qs
from channels.auth import channel_session_user_from_http, channel_session_user
from srv.testWS.wsGroups import GroupWsHolder
import json
from srv.models import Usuario, Dispositivo, GrupoDispositivos, Lista, Archivo

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
    print(js)
    if js['type'] and js['type'] == REQUEST_CONTENT:
        if 'id' in js:
            # Get whatever playlist is up for this guy
            id = int(js['id'])
            device = Dispositivo.objects.get(id=id)
            files = device.grupo.lista.archivo_set.all()
            playlist = []
            for file in files:
                playlist.append({
                    'name': file.id,
                    'id': file.id,
                    'format': file.tipo,
                    'url': file.url,
                    'time': None if file.tipo == 'mp4' else file.tiempo
                })
            print(playlist)
            msg = {
                'request': {
                    'type': REQUEST_CONTENT,
                    'deviceId': id,
                },
                'response': {
                    'playlist': playlist
                }
            }
            instance.getGroup("pi").send({
                'text' : json.dumps(msg)
            })
    elif js['type'] and js['type'] == REQUEST_GROUP:
        if 'id' in js:
            pi = instance.getGroup("pi")
            msg = {
                'request': {
                    'type': REQUEST_GROUP,
                    'deviceId': js['id']
                },
                'response': {
                    'success': True
                }
            }
            pi.send({
                'text': json.dumps(msg)
            })
    else:
        instance.getGroup('pi').send({
            "text": "listen"
        })


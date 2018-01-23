class Actions():
    ADD = 'ADD'
    DELETE = 'DELETE'
    UPDATE = 'UPDATE'
    CHANGE_PLAYLIST = 'CHANGE_PLAYLIST'
    DELETE_PLAYLIST = 'DELETE_PLAYLIST'

    @staticmethod
    def add_file(file):
        msg = {
            'action': Actions.ADD,
            'payload': {
                'id': file.id,
                'format': file.tipo,
                'url': file.url,
                'time': None if file.tipo == 'mp4' else file.tiempo,
                'adjustment': file.ajuste
            }
        }
        return msg

    @staticmethod
    def update_file(file):
        msg = {
            'action': Actions.UPDATE,
            'payload': {
                'id': file.id,
                'format': file.tipo,
                'url': file.url,
                'time': None if file.tipo == 'mp4' else file.tiempo,
                'adjustment': file.ajuste
            }
        }
        return msg

    @staticmethod
    def delete_file(file_id):
        msg = {
            'action': Actions.DELETE,
            'payload': {
                'id': file_id,
            }
        }
        return msg

    @staticmethod
    def change_playlist(playlist_files):
        files = []
        for file in playlist_files:
            files.append({
                'id': file.id,
                'format': file.tipo,
                'url': file.url,
                'time': None if file.tipo == 'mp4' else file.tiempo,
                'adjustment': file.ajuste
            })

        msg = {
            'action': Actions.CHANGE_PLAYLIST,
            'payload': {
                'playlist': files,
            }
        }
        return msg

    @staticmethod
    def change_device_group(new_group_id, playlist_files):
        files = []
        for file in playlist_files:
            files.append({
                'id': file.id,
                'format': file.tipo,
                'url': file.url,
                'time': None if file.tipo == 'mp4' else file.tiempo,
                'adjustment': file.ajuste
            })

        msg = {
            'action': Actions.CHANGE_PLAYLIST,
            'payload': {
                'playlist': files,
            },
            'newGroupId': new_group_id
        }
        return msg

    @staticmethod
    def delete_playlist():
        msg = {
            'action': Actions.DELETE_PLAYLIST
        }
        return msg
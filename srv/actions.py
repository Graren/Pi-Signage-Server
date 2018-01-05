class Actions():
    ADD = 'ADD'
    DELETE = 'DELETE'
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
                'time': None if file.tipo == 'mp4' else file.tiempo
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
                'time': None if file.tipo == 'mp4' else file.tiempo
            })

        msg = {
            'action': Actions.CHANGE_PLAYLIST,
            'payload': {
                'playlist': files,
            }
        }
        return msg

    @staticmethod
    def delete_playlist():
        msg = {
            'action': Actions.DELETE_PLAYLIST
        }
        return msg
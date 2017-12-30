class Singleton(type):
    _instances = {}
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]

#Python3
class GroupWsHolder(metaclass=Singleton):

    group = {}
    def __init__(self):
        self.group['started'] = True

    def addElement(self, index, element):
        self.group[index] = element
        return True

    def getGroups(self):
        return self.group

    def getGroup(self, index):
        if self.group.keys().__contains__(index):
            return self.group[index]
        else:
            return None
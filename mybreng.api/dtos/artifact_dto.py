class ArtifactDto:
    def __init__(self, content: bytes, filename: str, mime: str):
        self.__content = content
        self.__filename = filename
        self.__mime = mime

    def content(self):
        return self.__content

    def filename(self):
        return self.__filename

    def mime(self):
        return self.__mime

import subprocess
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.webdriver import WebDriver


class Firefox(WebDriver):
    def __init__(self):
        self.__service = Service(log_output=subprocess.DEVNULL)
        self.driver = super().__init__(service=self.__service)

    def close(self) -> None:
        super().close()
        self.__service.stop()

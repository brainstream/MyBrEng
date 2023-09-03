from selenium.webdriver.remote.webdriver import WebDriver


class WebControl:
    def __init__(self, driver: WebDriver):
        self.__driver = driver

    @property
    def driver(self):
        return self.__driver

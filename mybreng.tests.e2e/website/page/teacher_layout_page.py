from selenium.webdriver.remote.webdriver import WebDriver
from website.page.web_control import WebControl


class TeacherLayoutPage(WebControl):
    def __init__(self, driver: WebDriver):
        super().__init__(driver)

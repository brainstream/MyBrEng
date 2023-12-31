from selenium.webdriver import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement
from website.page.web_control import WebControl


class QuizEditor(WebControl):
    def __init__(self, driver: WebDriver):
        super().__init__(driver)

    def type_title(self, title: str):
        editor = self.__form.find_element(By.CSS_SELECTOR, 'input[formcontrolname="title"]')
        editor.send_keys(title)

    def type_description(self, description: str):
        editor = self.__form.find_element(By.CSS_SELECTOR, 'textarea[formcontrolname="description"]')
        editor.send_keys(description)

    def submit(self):
        self.__form.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()

    def cancel(self):
        self.__form.send_keys(Keys.ESCAPE)

    @property
    def __form(self) -> WebElement:
        return self.driver.find_element(By.TAG_NAME, 'app-quiz-edit-form')

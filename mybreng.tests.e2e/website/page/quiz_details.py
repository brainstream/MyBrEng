from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement
from website.page.teacher_layout_page import TeacherLayoutPage


class QuizDetails(TeacherLayoutPage):
    def __init__(self, driver: WebDriver):
        super().__init__(driver)

    @property
    def title(self) -> WebElement:
        return self.__details.find_element(By.CSS_SELECTOR, '.title')

    @property
    def description(self) -> WebElement:
        return self.__details.find_element(By.CSS_SELECTOR, '.description')

    @property
    def __details(self) -> WebElement:
        return self.driver.find_element(By.CSS_SELECTOR, '.details')

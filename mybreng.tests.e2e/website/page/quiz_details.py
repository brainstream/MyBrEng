from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement


class QuizDetails:
    def __init__(self, driver: WebDriver):
        self.__driver = driver

    @property
    def title(self) -> WebElement:
        return self.__details.find_element(By.CSS_SELECTOR, '.title')

    @property
    def description(self) -> WebElement:
        return self.__details.find_element(By.CSS_SELECTOR, '.description')

    @property
    def __details(self) -> WebElement:
        return self.__driver.find_element(By.CSS_SELECTOR, '.details')

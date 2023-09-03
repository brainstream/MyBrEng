from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement

from website.page.teacher_layout_page import TeacherLayoutPage
from dataclasses import dataclass


@dataclass
class QuizListItem:
    title: str
    description: str | None


class QuizList(TeacherLayoutPage):
    def __init__(self, driver: WebDriver):
        super().__init__(driver)

    def click_menu_create_quiz(self):
        menu = self.driver.find_element(By.CLASS_NAME, 'layout-full-toolbar-nav-menu')
        ActionChains(self.driver).move_to_element(menu).click(menu).perform()
        menu_item = self.driver.find_element(By.XPATH, '//button[./*[contains(text(), "Добавить тест")]]')
        ActionChains(self.driver).move_to_element(menu_item).click(menu_item).perform()

    def type_search_string(self, search_string):
        search_bar = self.driver.find_element(By.TAG_NAME, 'app-search')
        search_input = search_bar.find_element(By.CLASS_NAME, 'search')
        search_input.click()
        search_input.send_keys(search_string)

    def get_items(self) -> list[QuizListItem]:
        items = self.driver.find_elements(By.TAG_NAME, 'app-quiz-list-item')
        return [QuizList.__map_item(i) for i in items]

    @staticmethod
    def __map_item(element: WebElement) -> QuizListItem:
        title_element = element.find_element(By.CLASS_NAME, 'mdc-list-item__primary-text')
        description_element = element.find_element(By.CLASS_NAME, 'mdc-list-item__secondary-text')
        return QuizListItem(
            title_element.text,
            None if description_element is None else description_element.text
        )

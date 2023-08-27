from selenium.webdriver import Keys, ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver

__MODAL_TAG_NAME = 'app-login'


def login(driver: WebDriver, email: str = 'user@test.test'):
    modal = driver.find_element(By.TAG_NAME, __MODAL_TAG_NAME)
    email_field = modal.find_element(By.NAME, 'email')
    password_field = modal.find_element(By.NAME, 'password')
    email_field.send_keys(email)
    password_field.send_keys('123456')
    password_field.send_keys(Keys.RETURN)


def click_menu_create_quiz(driver: WebDriver):
    menu = driver.find_element(By.CLASS_NAME, 'layout-full-toolbar-nav-menu')
    ActionChains(driver).move_to_element(menu).click(menu).perform()
    menu_item = driver.find_element(By.XPATH, '//button[./*[contains(text(), "Добавить тест")]]')
    ActionChains(driver).move_to_element(menu_item).click(menu_item).perform()

from selenium.webdriver import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver
from website.page.web_control import WebControl


class Login(WebControl):
    def __init__(self, driver: WebDriver):
        super().__init__(driver)

    def login(self, email: str = 'user@test.test'):
        modal = self.driver.find_element(By.TAG_NAME, 'app-login')
        email_field = modal.find_element(By.NAME, 'email')
        password_field = modal.find_element(By.NAME, 'password')
        email_field.send_keys(email)
        password_field.send_keys('123456')
        password_field.send_keys(Keys.RETURN)

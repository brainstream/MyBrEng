import unittest
import website
from website.page import QuizDetails, QuizEditor
from selenium import webdriver


class QuizTests(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()

    def tearDown(self):
        self.driver.close()

    def test_add_quiz(self):
        driver = self.driver
        driver.get(website.BASE_URL)
        website.page.login(driver)
        website.page.click_menu_create_quiz(driver)
        quiz_editor = QuizEditor(driver)
        quiz_editor.type_title('New Quiz')
        quiz_editor.type_description('The new quiz from test')
        quiz_editor.submit()
        quiz_details = QuizDetails(driver)
        self.assertEqual('New Quiz', quiz_details.title.text)
        self.assertEqual('The new quiz from test', quiz_details.description.text)

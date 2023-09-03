import website
from tests.test_base import TestBase
from website.page import QuizDetails, QuizEditor, QuizList


class QuizListTests(TestBase):
    def test_add_quiz(self):
        quiz_list = QuizList(self.driver)
        quiz_editor = QuizEditor(self.driver)
        quiz_details = QuizDetails(self.driver)

        self.driver.get(website.BASE_URL)
        self.login()
        quiz_list.click_menu_create_quiz()
        quiz_editor.type_title('New Quiz')
        quiz_editor.type_description('The new quiz from test')
        quiz_editor.submit()
        self.assertEqual('New Quiz', quiz_details.title.text)
        self.assertEqual('The new quiz from test', quiz_details.description.text)

    def test_search(self):
        quiz_list = QuizList(self.driver)

        self.driver.get(website.BASE_URL)
        self.login()
        items = quiz_list.get_items()
        self.assertIsNotNone(next(filter(lambda i: 'Fun with the Alphabet' in i.title, items), None))
        quiz_list.type_search_string('quiz')
        items = quiz_list.get_items()
        self.assertIsNone(next(filter(lambda i: 'Fun with the Alphabet' in i.title, items), None))
